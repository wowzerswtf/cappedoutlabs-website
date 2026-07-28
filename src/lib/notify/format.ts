// Pure message builders for the Telegram notifier. All output is Telegram
// HTML (bold via <b>, links via <a>); every dynamic value must pass through
// escapeHtml before interpolation.

import { escapeHtml } from "./telegram";
import type { GhlAppointment, GhlContact } from "./ghl";

const TZ = "America/Denver";

function ghlContactUrl(contactId: string): string {
  return `https://app.gohighlevel.com/v2/location/${process.env.GHL_LOCATION_ID}/contacts/detail/${contactId}`;
}

export function formatWhen(input: string | number | undefined): string {
  if (input === undefined) return "unknown time";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "unknown time";
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
  return `${date}, ${time} MT`;
}

function contactDisplayName(c: GhlContact): string {
  const name = [c.firstName, c.lastName].filter(Boolean).join(" ") || c.contactName;
  return name || c.email || c.phone || "Unknown contact";
}

function prettyFieldName(raw: string): string {
  const cleaned = raw.replace(/^labs[_ ]/i, "").replaceAll("_", " ").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function formatLead(c: GhlContact, fieldNames: Map<string, string>): string {
  const lines: string[] = [];
  lines.push(`🔥 <b>New lead — ${escapeHtml(contactDisplayName(c))}</b>`);
  if (c.email) lines.push(`✉️ ${escapeHtml(c.email)}`);
  if (c.phone) lines.push(`📞 ${escapeHtml(c.phone)}`);
  if (c.source) lines.push(`Source: ${escapeHtml(c.source)}`);

  for (const f of c.customFields ?? []) {
    const name = fieldNames.get(f.id);
    const value = f.value == null ? "" : String(f.value);
    if (!name || !value) continue;
    lines.push(`${escapeHtml(prettyFieldName(name))}: ${escapeHtml(value)}`);
  }

  if (c.tags?.length) lines.push(`Tags: ${escapeHtml(c.tags.join(", "))}`);
  if (c.dateAdded) lines.push(`🕐 ${formatWhen(c.dateAdded)}`);
  lines.push(`<a href="${ghlContactUrl(c.id)}">Open in GHL</a>`);
  return lines.join("\n");
}

export interface BookingContext {
  calendarName?: string | null;
  contact?: GhlContact | null;
  assignedName?: string | null;
}

export function formatBooking(appt: GhlAppointment, ctx: BookingContext): string {
  const who = ctx.contact ? contactDisplayName(ctx.contact) : appt.title || "Unknown";
  const lines: string[] = [];
  lines.push(`📅 <b>New booking — ${escapeHtml(who)}</b>`);
  if (ctx.calendarName) lines.push(`Calendar: ${escapeHtml(ctx.calendarName)}`);
  lines.push(`🕐 ${formatWhen(appt.startTime)}`);
  if (ctx.assignedName) lines.push(`Assigned: ${escapeHtml(ctx.assignedName)}`);
  if (ctx.contact?.email) lines.push(`✉️ ${escapeHtml(ctx.contact.email)}`);
  if (ctx.contact?.phone) lines.push(`📞 ${escapeHtml(ctx.contact.phone)}`);
  if (appt.contactId) lines.push(`<a href="${ghlContactUrl(appt.contactId)}">Open in GHL</a>`);
  return lines.join("\n");
}

export function formatBookingChange(
  appt: GhlAppointment,
  ctx: BookingContext,
  change: { kind: "cancelled" | "rescheduled" | "status"; fromStatus?: string; fromStartMs?: number }
): string {
  const who = ctx.contact ? contactDisplayName(ctx.contact) : appt.title || "Unknown";
  const lines: string[] = [];

  if (change.kind === "cancelled") {
    lines.push(`❌ <b>Booking cancelled — ${escapeHtml(who)}</b>`);
    lines.push(`Was: ${formatWhen(appt.startTime)}`);
  } else if (change.kind === "rescheduled") {
    lines.push(`🔁 <b>Booking rescheduled — ${escapeHtml(who)}</b>`);
    if (change.fromStartMs) lines.push(`From: ${formatWhen(change.fromStartMs)}`);
    lines.push(`To: ${formatWhen(appt.startTime)}`);
  } else {
    const status = appt.appointmentStatus || appt.status || "unknown";
    lines.push(`ℹ️ <b>Booking update — ${escapeHtml(who)}</b>`);
    lines.push(`Status: ${escapeHtml(change.fromStatus || "?")} → ${escapeHtml(status)}`);
    lines.push(`🕐 ${formatWhen(appt.startTime)}`);
  }

  if (ctx.calendarName) lines.push(`Calendar: ${escapeHtml(ctx.calendarName)}`);
  if (appt.contactId) lines.push(`<a href="${ghlContactUrl(appt.contactId)}">Open in GHL</a>`);
  return lines.join("\n");
}
