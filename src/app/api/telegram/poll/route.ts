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
import { sendTelegram } from "@/lib/notify/telegram";
import {
  fetchCalendarEvents,
  fetchCalendars,
  fetchContact,
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

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LEAD_OVERLAP_MS = 15 * 60 * 1000; // re-scan window behind lastLeadTs
const APPT_PAST_MS = 30 * 24 * 60 * 60 * 1000; // look 30d back
const APPT_FUTURE_MS = 180 * 24 * 60 * 60 * 1000; // look 180d ahead
const SEEN_LEAD_CAP = 200;

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
    };
    await saveState(baseline, stateId);
    await sendTelegram(
      "🟢 <b>GHL watcher armed</b>\nYou'll get a DM here for every new lead, booking, cancellation, and reschedule. Checks run every 5 minutes."
    );
    return NextResponse.json({ ok: true, mode: "baseline", appointments: events.length });
  }

  const summary = { newLeads: 0, newBookings: 0, changes: 0, errors: [] as string[] };

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
          await sendTelegram(formatBooking(a, await bookingContext(a, cache)));
          summary.newBookings++;
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

  const next: NotifyState = {
    lastLeadTs: new Date(newestNotifiedMs).toISOString(),
    seenLeadIds: [...seenLeadIds].slice(-SEEN_LEAD_CAP),
    appts: nextAppts,
  };
  await saveState(next, stateId);

  return NextResponse.json({ ok: true, ...summary });
}
