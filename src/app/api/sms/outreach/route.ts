// One-time SMS outreach to the existing lead backlog: consented leads with a
// phone number who never booked (or already no-showed) get one "texting might
// be easier" message with a booking link.
//
// Safety model:
// - DRY RUN by default: shows exactly who would get what. Add `&send=1` to fire.
// - Each contact is texted at most once ever (state key `outreach-<id>`), no
//   matter how many times this endpoint is called.
// - Obvious test contacts (name/email containing "test"/"asdf") are excluded
//   automatically; `&skip=<id>,<id>` excludes anyone else.
// - Quiet hours (8am-9pm recipient-local) are respected on real sends.
//
// Usage:
//   GET /api/sms/outreach?secret=<CRON_SECRET>           -> dry run
//   GET /api/sms/outreach?secret=<CRON_SECRET>&send=1    -> send for real

import { NextResponse } from "next/server";
import {
  fetchCalendarEvents,
  fetchCalendars,
  fetchNewestContacts,
  loadState,
  saveState,
  type GhlContact,
  type NotifyState,
} from "@/lib/notify/ghl";
import { sendSms, smsTemplates, canText, withinQuietHours } from "@/lib/notify/sms";
import { ghlBookingUrl } from "@/lib/calendar";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LEAD_TAGS = ["labs-applicant", "labs-nurture", "partial-applicant"];
const TEST_PATTERN = /test|asdf/i;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

async function contactsWithUpcomingAppts(): Promise<Set<string>> {
  const calendars = await fetchCalendars();
  const now = Date.now();
  const results = await Promise.all(
    calendars.map((c) => fetchCalendarEvents(c.id, now, now + 180 * 24 * 60 * 60 * 1000))
  );
  const ids = new Set<string>();
  for (const a of results.flat()) {
    const status = (a.appointmentStatus || a.status || "").toLowerCase();
    if (a.contactId && status !== "cancelled") ids.add(a.contactId);
  }
  return ids;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const send = url.searchParams.get("send") === "1";
  const skip = new Set(
    (url.searchParams.get("skip") ?? "").split(",").map((s) => s.trim()).filter(Boolean)
  );

  const [contacts, booked, { state, stateId }] = await Promise.all([
    fetchNewestContacts(100),
    contactsWithUpcomingAppts(),
    loadState(),
  ]);
  const smsSent: Record<string, number> = { ...(state?.sms ?? {}) };

  const candidates: { contact: GhlContact; message: string }[] = [];
  const excluded: { id: string; name: string; reason: string }[] = [];

  for (const c of contacts) {
    const name = [c.firstName, c.lastName].filter(Boolean).join(" ") || c.contactName || c.id;
    const tags = c.tags ?? [];
    if (!tags.some((t) => LEAD_TAGS.includes(t))) continue; // not a funnel lead
    const guard = canText(c);
    const reason = !guard.ok
      ? guard.reason!
      : TEST_PATTERN.test(`${name} ${c.email ?? ""}`)
        ? "looks like a test contact"
        : skip.has(c.id)
          ? "skipped by request"
          : booked.has(c.id)
            ? "has upcoming appointment"
            : smsSent[`outreach-${c.id}`]
              ? "already texted"
              : null;
    if (reason) {
      excluded.push({ id: c.id, name, reason });
      continue;
    }
    candidates.push({
      contact: c,
      message: smsTemplates.backlogOutreach(
        c.firstName || "there",
        ghlBookingUrl({
          firstName: c.firstName ?? undefined,
          lastName: c.lastName ?? undefined,
          email: c.email ?? undefined,
          phone: c.phone ?? undefined,
        })
      ),
    });
  }

  if (!send) {
    return NextResponse.json({
      ok: true,
      mode: "dry-run",
      wouldSend: candidates.map(({ contact, message }) => ({
        id: contact.id,
        name: [contact.firstName, contact.lastName].filter(Boolean).join(" "),
        phone: contact.phone,
        message,
      })),
      excluded,
      hint: "Add &send=1 to send for real.",
    });
  }

  const results: { id: string; name: string; ok: boolean; detail?: string }[] = [];
  for (const { contact, message } of candidates) {
    if (withinQuietHours(contact.timezone)) {
      results.push({ id: contact.id, name: contact.firstName ?? "", ok: false, detail: "quiet hours, retry later" });
      continue;
    }
    const res = await sendSms(contact, message);
    if (res.ok) smsSent[`outreach-${contact.id}`] = Date.now();
    results.push({
      id: contact.id,
      name: contact.firstName ?? "",
      ok: res.ok,
      detail: res.error ?? res.skipped,
    });
  }

  // Persist dedupe keys on the shared notifier state.
  const next: NotifyState = { ...(state ?? {}), sms: smsSent };
  await saveState(next, stateId);

  return NextResponse.json({ ok: true, mode: "send", results, excluded });
}
