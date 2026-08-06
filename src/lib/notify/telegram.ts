// Telegram delivery for GHL notifications. Sends HTML-formatted messages to
// every chat in TELEGRAM_CHAT_ID (comma-separated: DMs and/or group chats).
// Reuses the pm-bot token (@compmsbot) for sending only — no polling or
// webhook is registered on the bot, so it cannot conflict with pm-bot's own
// update loop.

const TELEGRAM_API = "https://api.telegram.org";

// Telegram's API drops connections under load (ETIMEDOUT / "other side
// closed"). Without a retry a single blip silently costs a lead alert, which
// breaks the zero-silent-lead guarantee. 4 pings were lost this way between
// 2026-08-04 and 2026-08-06. Retry transient faults only.
const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 500;
// Backoff is bounded so a retry storm can never push the caller past Vercel's
// 60s function timeout (the poll route already runs close to it).
const MAX_BACKOFF_MS = 4000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// One sendMessage call with retries. Resolves to null on success, or a
// human-readable reason once the attempts are exhausted.
async function sendToChat(
  token: string,
  chatId: string,
  html: string
): Promise<string | null> {
  let lastError = "unknown error";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let retryAfterMs: number | null = null;

    try {
      const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: html,
          parse_mode: "HTML",
          link_preview_options: { is_disabled: true },
        }),
      });

      if (res.ok) return null;

      const body = await res.text();
      lastError = `${res.status} ${body}`;

      // 4xx other than 429 is a real rejection (bad token, bad chat id,
      // malformed HTML). Retrying just burns function time.
      if (res.status !== 429 && res.status < 500) return lastError;

      if (res.status === 429) {
        // Honour Telegram's own backoff hint when it gives one. A non-JSON
        // body here must not mask the 429 as a parse error.
        let seconds = NaN;
        try {
          seconds = Number(JSON.parse(body)?.parameters?.retry_after);
        } catch {
          // no hint available; fall back to exponential backoff
        }
        if (Number.isFinite(seconds) && seconds > 0) {
          retryAfterMs = Math.min(seconds * 1000, MAX_BACKOFF_MS);
        }
      }
    } catch (err) {
      // fetch itself rejected: DNS, TLS, socket reset, timeout.
      lastError = String(err);
    }

    if (attempt < MAX_ATTEMPTS) {
      await sleep(
        retryAfterMs ??
          Math.min(BASE_BACKOFF_MS * 2 ** (attempt - 1), MAX_BACKOFF_MS)
      );
    }
  }

  return `${lastError} (after ${MAX_ATTEMPTS} attempts)`;
}

export async function sendTelegram(html: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!token || chatIds.length === 0) {
    throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required");
  }

  // Chats are sent concurrently so retry backoff on one chat does not stack
  // onto the others' latency.
  const results = await Promise.all(
    chatIds.map(async (chatId) => ({
      chatId,
      error: await sendToChat(token, chatId, html),
    }))
  );

  // One dead chat must not block delivery to the others; throw only after
  // attempting every chat so the caller logs the failure.
  const failures = results
    .filter((r) => r.error !== null)
    .map((r) => `chat ${r.chatId}: ${r.error}`);

  if (failures.length > 0) {
    throw new Error(`Telegram sendMessage failed: ${failures.join("; ")}`);
  }
}
