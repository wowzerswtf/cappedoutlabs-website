// Telegram delivery for GHL notifications. Sends HTML-formatted messages to
// every chat in TELEGRAM_CHAT_ID (comma-separated: DMs and/or group chats).
// Reuses the pm-bot token (@compmsbot) for sending only — no polling or
// webhook is registered on the bot, so it cannot conflict with pm-bot's own
// update loop.

const TELEGRAM_API = "https://api.telegram.org";

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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

  const failures: string[] = [];
  for (const chatId of chatIds) {
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

    if (!res.ok) {
      const body = await res.text();
      failures.push(`chat ${chatId}: ${res.status} ${body}`);
    }
  }

  // One dead chat must not block delivery to the others; throw only after
  // attempting every chat so the poll route logs the failure.
  if (failures.length > 0) {
    throw new Error(`Telegram sendMessage failed: ${failures.join("; ")}`);
  }
}
