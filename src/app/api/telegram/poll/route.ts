// GHL -> Telegram watcher, run by Vercel cron every 5 minutes.
//
// Detects and DMs Waynard about: new leads (contacts), new bookings,
// cancellations (including deleted appointments), reschedules, and other
// appointment status changes — across every calendar in the location.
//
// State (last-notified lead timestamp, seen lead ids, appointment snapshot)
// is stored in the GHL location custom value `tg_notify_state`, so the whole
// thing runs with zero extra infrastructure.
//
// Auth: Vercel cron sends `Authorization: Bearer ${CRON_SECRET}`. Manual runs
// can use `?secret=...`. `?test=1` sends sample cards end-to-end.

import { NextResponse } from "next/server";
import { sendTelegram, escapeHtml } from "@/lib/notify/telegram";
import {
  fetchCalendarEvents,
  fetchCalendars,
  fetchContact,
  fetchConversations,
  fetchCustomFieldMap,
  fetchNewestContacts,
  fetchUserName,
  loadState,
  saveState,
  type GhlAppointment,
  type GhlContact,
  type NotifyState,
} from "@/lib/notify/ghl";
import { formatBooking, formatBookingChange, formatLead } from "@/lib/notify/format";
import { sendMetaEvent } from "@/lib/meta/capi";
import { closerName, formatWhen, sendSms, smsTemplates, timezoneForContact } from "@/lib/notify/sms";
import { ghlBookingUrl } from "@/lib/calendar";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LEAD_OVERLAP_MS = 15 * 60 * 1000; // re-scan window behind lastLeadTs
const APPT_PAST_MS = 30 * 24 * 60 * 60 * 1000; // look 30d back
const APPT_FUTURE_MS = 180 * 24 * 60 * 60 * 1000; // look 180d ahead
const SEEN_LEAD_CAP = 200;

// SMS automation windows. Windows are ranges (not instants) so a send blocked
// by quiet hours or a transient failure retries on later cycles until the
// window closes; the state key prevents doubles once one send succeeds.
const HOUR = 60 * 60 * 1000;
const REM24_WINDOW: [number, number] = [20 * HOUR, 24 * HOUR]; // time until start
const REM1_WINDOW: [number, number] = [15 * 60 * 1000, 1 * HOUR];
const NOSHOW_WINDOW: [number, number] = [30 * 60 * 1000, 48 * HOUR]; // time since start
const PARTIAL_WINDOW: [number, number] = [15 * 60 * 1000, 24 * HOUR]; // since capture
const SMS_KEY_TTL_MS = 60 * 24 * HOUR;
const APPLY_URL = "https://www.cappedoutlabs.com/apply-now";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

function apptStatus(a: GhlAppointment): string {
  return (a.appointmentStatus || a.status || "unknown").toLowerCase();
}

function apptStartMs(a: GhlAppointment): number {
  const t = new Date(a.startTime ?? 0).getTime();
  return Number.isNaN(t) ? 0 : t;
}

async function fetchAllAppointments(): Promise<{
  events: GhlAppointment[];
  calendarNames: Map<string, string>;
}> {
  const calendars = await fetchCalendars();
  const calendarNames = new Map(calendars.map((c) => [c.id, c.name]));
  const now = Date.now();
  const results = await Promise.all(
    calendars.map((c) => fetchCalendarEvents(c.id, now - APPT_PAST_MS, now + APPT_FUTURE_MS))
  );
  return { events: results.flat(), calendarNames };
}

interface BookingCtxCache {
  calendarNames: Map<string, string>;
  users: Map<string, string | null>;
  contacts: Map<string, GhlContact | null>;
}

async function bookingContext(a: GhlAppointment, cache: BookingCtxCache) {
  let contact: GhlContact | null = null;
  if (a.contactId) {
    if (!cache.contacts.has(a.contactId)) {
      cache.contacts.set(a.contactId, await fetchContact(a.contactId));
    }
    contact = cache.contacts.get(a.contactId) ?? null;
  }
  let assignedName: string | null = null;
  if (a.assignedUserId) {
    if (!cache.users.has(a.assignedUserId)) {
      cache.users.set(a.assignedUserId, await fetchUserName(a.assignedUserId));
    }
    assignedName = cache.users.get(a.assignedUserId) ?? null;
  }
  return {
    calendarName: a.calendarId ? cache.calendarNames.get(a.calendarId) : null,
    contact,
    assignedName,
  };
}

// Resolve the closer who signs a text: appointment assignee, then the lead's
// owner in GHL, then the default closer.
async function resolveCloser(
  assignedName: string | null,
  contact: GhlContact | null,
  cache: BookingCtxCache
): Promise<string> {
  if (assignedName) return closerName(assignedName);
  if (contact?.assignedTo) {
    if (!cache.users.has(contact.assignedTo)) {
      cache.users.set(contact.assignedTo, await fetchUserName(contact.assignedTo));
    }
    return closerName(cache.users.get(contact.assignedTo) ?? null);
  }
  return closerName(null);
}

// Send one SMS at most once per state key. Marks the key only on success so
// quiet-hours skips and no-phone-number failures retry while their window is
// still open.
async function trySms(
  key: string,
  smsSent: Record<string, number>,
  contact: GhlContact | null,
  message: string,
  opts: { respectQuietHours?: boolean } = {}
): Promise<boolean> {
  if (smsSent[key]) return false;
  const res = await sendSms(contact, message, opts);
  if (res.ok) smsSent[key] = Date.now();
  return res.ok;
}

async function sendTestCards(): Promise<void> {
  const sampleContact: GhlContact = {
    id: "test-contact",
    firstName: "Test",
    lastName: "Lead",
    email: "test@example.com",
    phone: "+18015551234",
    source: "vsl-funnel",
    tags: ["labs-applicant", "tcpa-consent"],
    dateAdded: new Date().toISOString(),
    customFields: [],
  };
  const sampleAppt: GhlAppointment = {
    id: "test-appt",
    contactId: "test-contact",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    appointmentStatus: "confirmed",
  };
  await sendTelegram(
    "[TEST]\n" + formatLead(sampleContact, new Map())
  );
  await sendTelegram(
    "[TEST]\n" +
      formatBooking(sampleAppt, {
        calendarName: "Discovery Call",
        contact: sampleContact,
        assignedName: "Santos Gonzalez",
      })
  );
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("test") === "1") {
    await sendTestCards();
    return NextResponse.json({ ok: true, mode: "test" });
  }

  const { state, stateId } = await loadState();
  const contacts = await fetchNewestContacts(50);
  const { events, calendarNames } = await fetchAllAppointments();

  // First run: record the current world without notifying about it.
  if (!state) {
    const baseline: NotifyState = {
      lastLeadTs: contacts[0]?.dateAdded ?? new Date(0).toISOString(),
      seenLeadIds: contacts.map((c) => c.id).slice(0, SEEN_LEAD_CAP),
      appts: Object.fromEntries(events.map((a) => [a.id, [apptStatus(a), apptStartMs(a)]])),
      sms: {},
      lastInboundMs: Date.now(),
    };
    await saveState(baseline, stateId);
    await sendTelegram(
      "🟢 <b>GHL watcher armed</b>\nYou'll get a DM here for every new lead, booking, cancellation, and reschedule. Checks run every 5 minutes."
    );
    return NextResponse.json({ ok: true, mode: "baseline", appointments: events.length });
  }

  const summary = {
    newLeads: 0,
    newBookings: 0,
    changes: 0,
    sms: 0,
    replies: 0,
    errors: [] as string[],
  };
  // Copy of the SMS dedupe map; mutated by trySms and saved with the state.
  const smsSent: Record<string, number> = { ...(state.sms ?? {}) };

  // --- New leads ---
  const lastLeadMs = new Date(state.lastLeadTs ?? 0).getTime();
  const seenLeadIds = new Set(state.seenLeadIds ?? []);

  const newLeads = contacts
    .filter((c) => {
      const added = new Date(c.dateAdded ?? 0).getTime();
      return added > lastLeadMs - LEAD_OVERLAP_MS && !seenLeadIds.has(c.id);
    })
    .sort((a, b) => new Date(a.dateAdded ?? 0).getTime() - new Date(b.dateAdded ?? 0).getTime());

  let newestNotifiedMs = lastLeadMs;
  if (newLeads.length) {
    const fieldMap = await fetchCustomFieldMap().catch(() => new Map<string, string>());
    for (const lead of newLeads) {
      try {
        await sendTelegram(formatLead(lead, fieldMap));
        seenLeadIds.add(lead.id);
        newestNotifiedMs = Math.max(newestNotifiedMs, new Date(lead.dateAdded ?? 0).getTime());
        summary.newLeads++;
      } catch (err) {
        summary.errors.push(`lead ${lead.id}: ${String(err)}`);
      }
    }
  }

  // --- Bookings: new / rescheduled / status changes / deletions ---
  const prevAppts = state.appts ?? {};
  const nextAppts: NotifyState["appts"] = {};
  const cache: BookingCtxCache = { calendarNames, users: new Map(), contacts: new Map() };
  const currentIds = new Set(events.map((a) => a.id));

  for (const a of events) {
    const status = apptStatus(a);
    const startMs = apptStartMs(a);
    const prev = prevAppts[a.id];
    nextAppts[a.id] = [status, startMs];

    try {
      if (!prev) {
        if (status !== "cancelled") {
          const ctx = await bookingContext(a, cache);
          await sendTelegram(formatBooking(a, ctx));
          summary.newBookings++;
          // Meta conversion: booking = Schedule. Deterministic event_id keyed
          // on the GHL appointment id dedupes poll retries and the instant
          // webhook. sendMetaEvent never throws, so a Meta outage can't roll
          // back the Telegram state above.
          await sendMetaEvent({
            eventName: "Schedule",
            eventId: `ghl-appt-${a.id}`,
            actionSource: "system_generated",
            userData: {
              email: ctx.contact?.email,
              phone: ctx.contact?.phone,
              firstName: ctx.contact?.firstName,
              lastName: ctx.contact?.lastName,
            },
            customData: ctx.calendarName
              ? { calendar: ctx.calendarName }
              : undefined,
          });
          // Booking confirmation text. Transactional (they just booked), so
          // quiet hours don't apply.
          if (ctx.contact?.firstName && startMs > Date.now()) {
            const sent = await trySms(
              `confirm-${a.id}`,
              smsSent,
              ctx.contact,
              smsTemplates.bookingConfirm(
                ctx.contact.firstName,
                formatWhen(startMs, timezoneForContact(ctx.contact)),
                ctx.assignedName ?? (await resolveCloser(null, ctx.contact, cache))
              )
            );
            if (sent) summary.sms++;
          }
        }
      } else {
        const [prevStatus, prevStart] = prev;
        if (status !== prevStatus && status === "cancelled") {
          await sendTelegram(
            formatBookingChange(a, await bookingContext(a, cache), { kind: "cancelled" })
          );
          summary.changes++;
        } else if (startMs !== prevStart && startMs > 0 && prevStart > 0) {
          await sendTelegram(
            formatBookingChange(a, await bookingContext(a, cache), {
              kind: "rescheduled",
              fromStartMs: prevStart,
            })
          );
          summary.changes++;
        } else if (status !== prevStatus) {
          await sendTelegram(
            formatBookingChange(a, await bookingContext(a, cache), {
              kind: "status",
              fromStatus: prevStatus,
            })
          );
          summary.changes++;
        }
      }
    } catch (err) {
      // Roll back so the next run retries this appointment's notification.
      if (prev) nextAppts[a.id] = prev;
      else delete nextAppts[a.id];
      summary.errors.push(`appt ${a.id}: ${String(err)}`);
    }
  }

  // Appointments that vanished from the feed before their start time were
  // deleted outright — treat as cancellations.
  const now = Date.now();
  for (const [id, [prevStatus, prevStart]] of Object.entries(prevAppts)) {
    if (currentIds.has(id)) continue;
    const upcoming = prevStart > now - 24 * 60 * 60 * 1000;
    if (upcoming && prevStatus !== "cancelled") {
      try {
        await sendTelegram(
          formatBookingChange({ id, startTime: prevStart }, { calendarName: null, contact: null }, {
            kind: "cancelled",
          })
        );
        summary.changes++;
      } catch (err) {
        nextAppts[id] = [prevStatus, prevStart]; // retry next run
        summary.errors.push(`appt ${id}: ${String(err)}`);
      }
    }
  }

  // --- SMS: appointment reminders + no-show recovery ---
  for (const a of events) {
    const status = apptStatus(a);
    if (status === "cancelled") continue;
    const startMs = apptStartMs(a);
    if (!startMs) continue;
    const untilStart = startMs - now;
    const sinceStart = now - startMs;

    const wantsRem24 =
      status === "confirmed" && untilStart > REM24_WINDOW[0] && untilStart <= REM24_WINDOW[1];
    const wantsRem1 =
      status === "confirmed" && untilStart > REM1_WINDOW[0] && untilStart <= REM1_WINDOW[1];
    // Explicit no-shows get recovery right away; appointments still sitting
    // at "confirmed" after their start time were never dispositioned, so the
    // softer "if we missed each other" text covers both cases safely.
    const wantsRecovery =
      (status === "noshow" && sinceStart > 0 && sinceStart <= NOSHOW_WINDOW[1]) ||
      (status === "confirmed" &&
        sinceStart > NOSHOW_WINDOW[0] &&
        sinceStart <= NOSHOW_WINDOW[1]);

    if (!wantsRem24 && !wantsRem1 && !wantsRecovery) continue;

    const ctx = await bookingContext(a, cache);
    const first = ctx.contact?.firstName;
    if (!first) continue;
    const closer = await resolveCloser(ctx.assignedName, ctx.contact, cache);

    let sent = false;
    if (wantsRem24) {
      sent = await trySms(
        `rem24-${a.id}`,
        smsSent,
        ctx.contact,
        smsTemplates.reminder24h(first, closer, formatWhen(startMs, ctx.contact ? timezoneForContact(ctx.contact) : null)),
        { respectQuietHours: true }
      );
    } else if (wantsRem1) {
      sent = await trySms(
        `rem1-${a.id}`,
        smsSent,
        ctx.contact,
        smsTemplates.reminder1h(first, closer, formatWhen(startMs, ctx.contact ? timezoneForContact(ctx.contact) : null))
      );
    } else if (wantsRecovery) {
      sent = await trySms(
        `noshow-${a.id}`,
        smsSent,
        ctx.contact,
        smsTemplates.noShowRecovery(
          first,
          closer,
          ghlBookingUrl({
            firstName: ctx.contact?.firstName ?? undefined,
            lastName: ctx.contact?.lastName ?? undefined,
            email: ctx.contact?.email ?? undefined,
            phone: ctx.contact?.phone ?? undefined,
          })
        ),
        { respectQuietHours: true }
      );
    }
    if (sent) summary.sms++;
  }

  // --- SMS: abandoned partial applications ---
  // Contact captured at survey step 1 but never finished; nudge once between
  // 15 minutes and 24 hours after capture.
  for (const c of contacts) {
    const tags = c.tags ?? [];
    if (!tags.includes("partial-applicant")) continue;
    if (tags.includes("labs-applicant") || tags.includes("labs-nurture")) continue;
    const age = now - new Date(c.dateAdded ?? 0).getTime();
    if (age < PARTIAL_WINDOW[0] || age > PARTIAL_WINDOW[1]) continue;
    if (!c.firstName) continue;
    const sent = await trySms(
      `partial-${c.id}`,
      smsSent,
      c,
      smsTemplates.partialAbandon(c.firstName, await resolveCloser(null, c, cache), APPLY_URL),
      { respectQuietHours: true }
    );
    if (sent) summary.sms++;
  }

  // --- Inbound replies -> Telegram ---
  // The whole point of texting is getting answers; make sure a reply is
  // impossible to miss.
  let lastInboundMs = state.lastInboundMs ?? Date.now();
  try {
    const conversations = await fetchConversations(50);
    const inbound = conversations
      .filter((c) => (c.lastMessageDirection ?? "").toLowerCase() === "inbound")
      .map((c) => ({ c, ts: new Date(c.lastMessageDate ?? 0).getTime() }))
      .filter(({ ts }) => ts > lastInboundMs)
      .sort((a, b) => a.ts - b.ts);
    for (const { c, ts } of inbound) {
      const kind = (c.lastMessageType ?? "").includes("EMAIL") ? "email" : "text";
      await sendTelegram(
        [
          `💬 <b>Lead replied (${kind})</b>`,
          `👤 ${escapeHtml(c.contactName || c.fullName || "Unknown")}`,
          c.lastMessageBody ? `«${escapeHtml(c.lastMessageBody.slice(0, 400))}»` : "",
          "Open the GHL conversations inbox to respond.",
        ]
          .filter(Boolean)
          .join("\n")
      );
      lastInboundMs = Math.max(lastInboundMs, ts);
      summary.replies++;
    }
  } catch (err) {
    summary.errors.push(`inbound: ${String(err)}`);
  }

  // Drop dedupe keys older than the TTL so state stays small.
  for (const [key, ts] of Object.entries(smsSent)) {
    if (now - ts > SMS_KEY_TTL_MS) delete smsSent[key];
  }

  const next: NotifyState = {
    lastLeadTs: new Date(newestNotifiedMs).toISOString(),
    seenLeadIds: [...seenLeadIds].slice(-SEEN_LEAD_CAP),
    appts: nextAppts,
    sms: smsSent,
    lastInboundMs,
  };
  await saveState(next, stateId);

  return NextResponse.json({ ok: true, ...summary });
}
