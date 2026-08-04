// GHL SMS sender + message templates for the lead follow-up engine.
//
// Texts go out through the GHL conversations API so replies land in the GHL
// inbox where the sales team works. Ships dark: until the Labs sub-account
// has an LC Phone number with approved A2P registration, every send fails
// with a logged error and nothing else happens. The moment the number is
// live, the whole engine starts sending with zero code changes.
//
// Compliance guards, enforced here so no caller can skip them:
// - only contacts tagged `tcpa-consent` with a phone number get texts
// - contacts with DND enabled are skipped (GHL also enforces server-side)
// - poll-driven texts respect TCPA quiet hours (8am-9pm recipient-local);
//   instant application replies are exempt because the lead is mid-funnel
//   on their phone at that moment
// - `SMS_PAUSED=1` in the environment is a global kill switch

import type { GhlContact } from "@/lib/notify/ghl";

const GHL_BASE = "https://services.leadconnectorhq.com";

export interface SmsResult {
  ok: boolean;
  skipped?: string;
  error?: string;
  messageId?: string;
}

// --- Guards ---

export function canText(contact: GhlContact | null): { ok: boolean; reason?: string } {
  if (process.env.SMS_PAUSED === "1") return { ok: false, reason: "SMS_PAUSED" };
  if (!contact) return { ok: false, reason: "no contact" };
  if (!contact.phone) return { ok: false, reason: "no phone" };
  if (contact.dnd) return { ok: false, reason: "dnd" };
  if (!(contact.tags ?? []).includes("tcpa-consent")) {
    return { ok: false, reason: "no tcpa consent" };
  }
  return { ok: true };
}

// TCPA quiet hours: no marketing texts before 8am or after 9pm in the
// recipient's timezone. Falls back to the business timezone when the
// contact record has none.
export function withinQuietHours(timezone?: string | null): boolean {
  const tz = timezone || "America/Denver";
  let hour: number;
  try {
    hour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: tz,
      }).format(new Date())
    );
  } catch {
    hour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: "America/Denver",
      }).format(new Date())
    );
  }
  return hour < 8 || hour >= 21;
}

// --- Phone number gate ---
// The conversations API happily QUEUES messages even when the location has no
// phone number (verified 2026-08-04: returns a messageId, message sits
// "pending" forever). Without this gate the engine would mark texts as sent
// while nothing delivers. Checked live and cached briefly per instance so the
// engine turns itself on the moment the LC Phone number exists.

let numberCheck: { ok: boolean; at: number } | null = null;
const NUMBER_CHECK_TTL_MS = 5 * 60 * 1000;

export async function hasSmsNumber(): Promise<boolean> {
  if (numberCheck && Date.now() - numberCheck.at < NUMBER_CHECK_TTL_MS) {
    return numberCheck.ok;
  }
  const key = process.env.GHL_API_KEY;
  const loc = process.env.GHL_LOCATION_ID;
  if (!key || !loc) return false;
  try {
    const res = await fetch(`${GHL_BASE}/phone-system/numbers/location/${loc}`, {
      headers: { Authorization: `Bearer ${key}`, Version: "2021-07-28" },
      cache: "no-store",
    });
    // No phone system at all -> 404 "No Twilio account found". Once one
    // exists this returns 200; when a numbers array is present require it to
    // be non-empty, otherwise trust the 200.
    const data = (await res.json().catch(() => null)) as
      | { numbers?: unknown[] }
      | unknown[]
      | null;
    const numbers = Array.isArray(data)
      ? data
      : data && Array.isArray((data as { numbers?: unknown[] }).numbers)
        ? (data as { numbers: unknown[] }).numbers
        : null;
    const ok = res.ok && (numbers === null || numbers.length > 0);
    numberCheck = { ok, at: Date.now() };
    return ok;
  } catch {
    // Transient failure: don't cache, don't send.
    return false;
  }
}

// --- Send ---

export async function sendSms(
  contact: GhlContact | null,
  message: string,
  opts: { respectQuietHours?: boolean } = {}
): Promise<SmsResult> {
  const guard = canText(contact);
  if (!guard.ok) return { ok: false, skipped: guard.reason };
  if (opts.respectQuietHours && withinQuietHours(contact!.timezone)) {
    return { ok: false, skipped: "quiet hours" };
  }
  if (!(await hasSmsNumber())) {
    return { ok: false, skipped: "no SMS number provisioned yet" };
  }

  const key = process.env.GHL_API_KEY;
  if (!key) return { ok: false, error: "GHL_API_KEY missing" };

  try {
    const res = await fetch(`${GHL_BASE}/conversations/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Version: "2021-04-15",
      },
      body: JSON.stringify({
        type: "SMS",
        contactId: contact!.id,
        message,
      }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => null)) as {
      messageId?: string;
      message?: string;
    } | null;
    if (!res.ok) {
      // Expected until the location has a phone number provisioned.
      console.error(`SMS send failed (${res.status}) contact=${contact!.id}:`, data);
      return { ok: false, error: `${res.status}: ${data?.message ?? "unknown"}` };
    }
    console.log(`SMS sent contact=${contact!.id} message=${data?.messageId}`);
    return { ok: true, messageId: data?.messageId };
  } catch (err) {
    console.error(`SMS send threw contact=${contact!.id}:`, err);
    return { ok: false, error: String(err) };
  }
}

// --- Formatting helpers ---

export function formatWhen(startMs: number, timezone?: string | null): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone || "America/Denver",
    timeZoneName: "short",
  }).format(new Date(startMs));
}

// --- Templates ---
// First-touch texts carry the brand name and STOP language (carrier rules for
// A2P traffic). Mid-thread texts skip the boilerplate and read like a person.

export const smsTemplates = {
  appliedQualified: (first: string, bookingUrl: string) =>
    `Hey ${first}, Capped Out Labs here. Your application is in and you qualify. ` +
    `Next step is a 30 minute discovery call. Book a time: ${bookingUrl}\n` +
    `Prefer to text? Just reply here. Reply STOP to opt out.`,

  appliedNurture: (first: string) =>
    `Hey ${first}, Capped Out Labs here. We got your application. ` +
    `Sounds like budget timing is not there yet, and that is fine. ` +
    `Reply with what you are working on and we will point you the right way. ` +
    `Reply STOP to opt out.`,

  partialAbandon: (first: string, applyUrl: string) =>
    `Hey ${first}, Capped Out Labs. Your application is saved but not finished. ` +
    `It takes about two minutes to wrap up: ${applyUrl}\n` +
    `Reply STOP to opt out.`,

  bookingConfirm: (first: string, when: string, rep?: string | null) =>
    `You're booked, ${first}. ${when}${rep ? ` with ${rep}` : ""} at Capped Out Labs. ` +
    `The meeting link is in your email. Need a different time? Just reply here.`,

  reminder24h: (first: string, when: string) =>
    `${first}, quick reminder from Capped Out Labs: your discovery call is ${when}. ` +
    `The meeting link is in your email. Need to move it? Reply here.`,

  reminder1h: (first: string, when: string) =>
    `${first}, your Capped Out Labs call starts soon: ${when}. ` +
    `The meeting link is in your email. See you there.`,

  noShowRecovery: (first: string, bookingUrl: string) =>
    `Hey ${first}, following up on your Capped Out Labs call. If we missed each ` +
    `other, grab a new time here: ${bookingUrl}\nOr just reply and we will sort it out.`,

  backlogOutreach: (first: string, bookingUrl: string) =>
    `Hey ${first}, Capped Out Labs. You applied for a discovery call and we have not ` +
    `been able to reach you by phone. Texting might be easier. Book a time here: ${bookingUrl}\n` +
    `Or reply with any questions. Reply STOP to opt out.`,
};
