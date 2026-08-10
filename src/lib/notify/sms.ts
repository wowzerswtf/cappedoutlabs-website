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
//   instant intake replies are exempt because the lead is mid-funnel on
//   their phone at that moment
// - `SMS_PAUSED=1` in the environment is a global kill switch

import type { GhlContact } from "@/lib/notify/ghl";

const GHL_BASE = "https://services.leadconnectorhq.com";

// Where an unfinished application resumes. Shared by the instant intake nudge
// and the poll backstop so the two paths can never drift to different links.
// Apex, not www: this URL goes out in SMS, so it should land in one hop with
// no redirect and no chance of a hostname the certificate doesn't cover.
export const APPLY_URL = "https://cappedoutlabs.com/apply-now";

// Written to the contact once the abandoned-application nudge has actually
// gone out. Both senders check it, so a lead gets this text at most once.
export const PARTIAL_NUDGE_TAG = "sms-partial-nudged";

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

// US/CA area code -> IANA timezone. GHL's contact.timezone is IP-guessed and
// frequently garbage (a Florida lead tagged US/Alaska, a Philadelphia lead
// tagged Etc/GMT+12 — in-app browser proxies), so for quiet hours we trust
// the phone number's own locale, which is also the TCPA-relevant one.
// Codes spanning two zones use the more-populous side.
const TZ = {
  ET: "America/New_York",
  CT: "America/Chicago",
  MT: "America/Denver",
  MST: "America/Phoenix",
  PT: "America/Los_Angeles",
  AK: "America/Anchorage",
  HI: "Pacific/Honolulu",
  AT: "America/Halifax",
  NT: "America/St_Johns",
} as const;
const AREA_TZ: Record<string, string> = {};
const zone = (tz: string, codes: string) =>
  codes.split(" ").forEach((c) => (AREA_TZ[c] = tz));
zone(TZ.ET, "201 202 203 207 212 215 216 220 223 227 229 234 239 240 248 267 269 272 276 301 302 304 305 313 315 317 321 326 330 332 336 339 341 347 351 352 363 380 386 401 404 407 410 412 413 419 434 440 443 445 448 470 475 478 484 502 508 513 516 517 518 561 567 570 571 585 586 606 607 609 610 614 616 617 631 646 656 667 678 680 689 703 704 706 716 717 718 724 727 732 734 740 743 754 757 762 770 771 772 786 803 804 810 813 814 828 835 838 839 843 845 848 850 854 856 857 859 860 862 863 864 878 904 906 908 910 912 914 917 919 929 930 934 937 938 941 947 954 959 973 978 980 984 986");
zone(TZ.CT, "205 210 214 217 218 219 224 225 228 231 251 254 256 260 262 270 281 305 308 309 312 314 316 318 319 320 331 334 337 361 364 402 405 409 414 417 430 432 469 479 501 504 507 512 515 531 534 539 563 573 574 580 601 605 608 612 615 618 620 629 630 636 641 651 660 662 682 708 712 713 715 726 731 737 763 769 773 779 785 806 815 816 817 830 832 847 870 872 901 903 913 915 918 920 925 931 936 940 945 952 956 972 979 985");
zone(TZ.MT, "303 307 385 406 435 505 575 719 720 801 970 983");
zone(TZ.MST, "480 520 602 623 928");
zone(TZ.PT, "206 209 213 253 279 310 323 341 350 360 408 415 424 425 442 458 503 509 510 530 541 559 562 564 619 626 628 650 657 661 669 702 707 714 725 747 760 775 805 818 820 831 858 909 916 949 951 971");
zone(TZ.AK, "907");
zone(TZ.HI, "808");
zone(TZ.AT, "902 782 506 428 709");

export function timezoneForContact(contact: {
  phone?: string | null;
  timezone?: string | null;
}): string {
  const digits = (contact.phone ?? "").replace(/\D/g, "");
  const area =
    digits.length === 11 && digits.startsWith("1")
      ? digits.slice(1, 4)
      : digits.length === 10
        ? digits.slice(0, 3)
        : null;
  if (area && AREA_TZ[area]) return AREA_TZ[area];
  return contact.timezone || "America/Denver";
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
  if (opts.respectQuietHours && withinQuietHours(timezoneForContact(contact!))) {
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

// --- Closer name resolution ---
// Every text is signed by a real person (Waynard 2026-08-06). Callers resolve
// the name in priority order: appointment assignee -> lead owner (GHL
// assignedTo) -> DEFAULT_CLOSER_NAME env -> Santos (the discovery calendar
// owner). closerName() reduces a full name to a first name for the opener.

const DEFAULT_CLOSER = process.env.DEFAULT_CLOSER_NAME || "Santos";

export function closerName(fullName?: string | null): string {
  const first = (fullName ?? "").trim().split(/\s+/)[0];
  return first || DEFAULT_CLOSER;
}

// Leads routinely type their whole name into the first-name box, which makes a
// text open "Hey Phillip Newberry, Santos with Capped Out Labs here". Reduce to
// the first token, same as closerName does for reps. Returns "" when there is
// nothing usable, and callers skip the send rather than text a stranger "Hey ,".
export function leadFirstName(name?: string | null): string {
  return (name ?? "").trim().split(/\s+/)[0] ?? "";
}

// --- Templates ---
// First-touch texts carry the brand name and STOP language (carrier rules for
// A2P traffic). Mid-thread texts skip the boilerplate and read like a person.

export const smsTemplates = {
  appliedQualified: (first: string, closer: string, bookingUrl: string) =>
    `Hey ${first}, ${closer} with Capped Out Labs here. Your application is in ` +
    `and you qualify. Next step is a 30 minute discovery call. Book a time: ${bookingUrl}\n` +
    `Prefer to text? Just reply here. Reply STOP to opt out.`,

  appliedNurture: (first: string, closer: string) =>
    `Hey ${first}, ${closer} with Capped Out Labs here. We got your application. ` +
    `Sounds like budget timing is not there yet, and that is fine. ` +
    `Reply with what you are working on and we will point you the right way. ` +
    `Reply STOP to opt out.`,

  partialAbandon: (first: string, closer: string, applyUrl: string) =>
    `Hey ${first}, ${closer} with Capped Out Labs here. Your application is saved ` +
    `but not finished. It takes about two minutes to wrap up: ${applyUrl}\n` +
    `Reply STOP to opt out.`,

  bookingConfirm: (first: string, when: string, rep: string) =>
    `You're booked, ${first}. ${when} with ${rep} at Capped Out Labs. ` +
    `The meeting link is in your email. Need a different time? Just reply here.`,

  reminder24h: (first: string, closer: string, when: string) =>
    `${first}, ${closer} with Capped Out Labs here. Quick reminder: your ` +
    `discovery call is ${when}. The meeting link is in your email. Need to move it? Reply here.`,

  reminder1h: (first: string, closer: string, when: string) =>
    `${first}, ${closer} here from Capped Out Labs. Your call starts soon: ${when}. ` +
    `The meeting link is in your email. See you there.`,

  noShowRecovery: (first: string, closer: string, bookingUrl: string) =>
    `Hey ${first}, ${closer} with Capped Out Labs here. Following up on your call. ` +
    `If we missed each other, grab a new time here: ${bookingUrl}\n` +
    `Or just reply and we will sort it out.`,

  backlogOutreach: (first: string, closer: string, bookingUrl: string) =>
    `Hey ${first}, ${closer} with Capped Out Labs here. You applied for a discovery ` +
    `call and we have not been able to reach you by phone. Texting might be easier. ` +
    `Book a time here: ${bookingUrl}\n` +
    `Or reply with any questions. Reply STOP to opt out.`,
};
