// Optional instant-notification endpoint for GHL workflow webhooks.
//
// The 5-minute cron poll (/api/telegram/poll) already covers everything; this
// endpoint exists for instant delivery if a GHL workflow is pointed at it:
//   Workflow trigger (e.g. Contact Created / Appointment Booked)
//   -> Webhook action -> POST https://cappedoutlabs.com/api/telegram/ghl-webhook?secret=<CRON_SECRET>
//
// Contacts notified here are marked seen in the poll state so the cron doesn't
// double-send them.

import { NextResponse } from "next/server";
import { sendTelegram, escapeHtml } from "@/lib/notify/telegram";
import { loadState, saveState } from "@/lib/notify/ghl";
import { formatWhen } from "@/lib/notify/format";
import { sendMetaEvent } from "@/lib/meta/capi";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type WebhookPayload = Record<string, unknown>;

function str(p: WebhookPayload, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = p[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET;
  if (!secret || url.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = (await request.json()) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const name =
    [str(payload, "first_name", "firstName"), str(payload, "last_name", "lastName")]
      .filter(Boolean)
      .join(" ") ||
    str(payload, "full_name", "contact_name", "email", "phone") ||
    "Unknown contact";

  const calendar = payload["calendar"] as WebhookPayload | undefined;
  const isBooking = calendar && typeof calendar === "object";

  const lines: string[] = [];
  if (isBooking) {
    lines.push(`⚡📅 <b>Booking (instant) — ${escapeHtml(name)}</b>`);
    const start = str(calendar, "startTime", "start_time", "appointment_time");
    if (start) lines.push(`🕐 ${formatWhen(start)}`);
    const calName = str(calendar, "calendarName", "calendar_name", "title");
    if (calName) lines.push(`Calendar: ${escapeHtml(calName)}`);
  } else {
    lines.push(`⚡🔥 <b>New lead (instant) — ${escapeHtml(name)}</b>`);
  }
  const email = str(payload, "email");
  const phone = str(payload, "phone");
  const source = str(payload, "contact_source", "source");
  if (email) lines.push(`✉️ ${escapeHtml(email)}`);
  if (phone) lines.push(`📞 ${escapeHtml(phone)}`);
  if (source) lines.push(`Source: ${escapeHtml(source)}`);

  const contactId = str(payload, "contact_id", "contactId", "id");
  if (contactId) {
    lines.push(
      `<a href="https://app.gohighlevel.com/v2/location/${process.env.GHL_LOCATION_ID}/contacts/detail/${contactId}">Open in GHL</a>`
    );
  }

  await sendTelegram(lines.join("\n"));

  // Meta conversion: instant Schedule for bookings. Uses the same
  // `ghl-appt-{id}` event_id scheme as the cron poll, so whichever path
  // reports first wins and the other is deduped by Meta. If the payload
  // has no appointment id, skip - the poll will report it with one.
  if (isBooking) {
    const apptId = str(calendar, "id", "appointmentId", "appointment_id");
    if (apptId) {
      await sendMetaEvent({
        eventName: "Schedule",
        eventId: `ghl-appt-${apptId}`,
        actionSource: "system_generated",
        userData: {
          email,
          phone,
          firstName: str(payload, "first_name", "firstName"),
          lastName: str(payload, "last_name", "lastName"),
        },
      });
    }
  }

  // Suppress the duplicate from the next cron poll.
  if (contactId && !isBooking) {
    try {
      const { state, stateId } = await loadState();
      if (state) {
        const seen = new Set(state.seenLeadIds ?? []);
        seen.add(contactId);
        await saveState({ ...state, seenLeadIds: [...seen].slice(-200) }, stateId);
      }
    } catch {
      // Duplicate suppression is best-effort; a rare double DM beats a 500.
    }
  }

  return NextResponse.json({ ok: true });
}
