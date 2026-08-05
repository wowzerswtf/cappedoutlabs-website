// Meta Conversions API (server-side) client.
//
// Sends conversion events straight to Meta's Graph API so ad attribution
// survives ad blockers, Safari ITP, and cross-domain hops (GHL booking
// widget). Browser pixel events that carry the same event_id are deduped
// by Meta automatically.
//
// Ships dark: if NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN is
// unset, every call is a silent no-op - safe to deploy before the Labs
// pixel exists. Never throws; conversion tracking must not break lead flow.
//
// Env:
//   NEXT_PUBLIC_META_PIXEL_ID - the Labs dataset/pixel ID (shared with the
//     browser pixel in src/components/MetaPixel.tsx)
//   META_CAPI_ACCESS_TOKEN   - Conversions API token from Events Manager >
//     the dataset's Settings tab
//   META_TEST_EVENT_CODE     - optional; routes events to Events Manager's
//     Test Events tab instead of production reporting

import { createHash } from "crypto";
import { serverTrackingBlockedReason } from "./env";

const GRAPH_VERSION = "v23.0";

export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "CompleteRegistration"
  | "Schedule"
  // Custom events - visible in Events Manager, excluded from standard
  // optimization unless mapped to a custom conversion.
  | "LeadDisqualified"
  | "PartialLead";

export interface MetaUserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
}

export interface MetaEventInput {
  eventName: MetaEventName;
  /** Shared with the browser fbq call for dedup. Deterministic IDs (e.g.
   *  `ghl-appt-{id}`) also dedupe server-side retries. */
  eventId?: string;
  eventSourceUrl?: string;
  /** "website" for events tied to a site visit, "system_generated" for
   *  CRM-detected events like GHL bookings. */
  actionSource?: "website" | "system_generated";
  userData: MetaUserData;
  customData?: Record<string, string | number>;
  /** Unix seconds; defaults to now. */
  eventTime?: number;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Meta wants digits only with country code. US-first: a bare 10-digit
// number gets a leading 1.
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `1${digits}`;
  return digits;
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function hashedUserData(u: MetaUserData): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (u.email?.trim()) data.em = [sha256(normalizeEmail(u.email))];
  if (u.phone?.trim()) {
    const digits = normalizePhone(u.phone);
    if (digits.length >= 11) data.ph = [sha256(digits)];
  }
  if (u.firstName?.trim()) data.fn = [sha256(normalizeName(u.firstName))];
  if (u.lastName?.trim()) data.ln = [sha256(normalizeName(u.lastName))];
  // Not hashed, per Meta spec
  if (u.clientIp && u.clientIp !== "unknown") data.client_ip_address = u.clientIp;
  if (u.userAgent && u.userAgent !== "unknown") data.client_user_agent = u.userAgent;
  if (u.fbp) data.fbp = u.fbp;
  if (u.fbc) data.fbc = u.fbc;
  return data;
}

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/** Pull browser identifiers (fbp/fbc cookies set by the pixel, client IP,
 *  user agent) off an incoming same-origin API request. */
export function userDataFromRequest(request: Request): Partial<MetaUserData> {
  const cookies = request.headers.get("cookie");
  return {
    clientIp:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null,
    userAgent: request.headers.get("user-agent"),
    fbp: readCookie(cookies, "_fbp"),
    fbc: readCookie(cookies, "_fbc"),
  };
}

export function metaConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN
  );
}

/** Send one event to the Conversions API. Best-effort: logs and swallows
 *  every failure. Returns true if Meta accepted the event. */
export async function sendMetaEvent(input: MetaEventInput): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return false;

  // Never write dev or preview events into the shared production dataset.
  const blocked = serverTrackingBlockedReason();
  if (blocked) {
    console.log(`Meta CAPI: ${input.eventName} suppressed (${blocked})`);
    return false;
  }

  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
    action_source: input.actionSource ?? "website",
    user_data: hashedUserData(input.userData),
  };
  if (input.eventId) event.event_id = input.eventId;
  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl;
  if (input.customData) event.custom_data = input.customData;

  const body: Record<string, unknown> = { data: [event] };
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("Meta CAPI rejected event:", input.eventName, res.status, data);
      return false;
    }
    console.log(
      `Meta CAPI: ${input.eventName} sent`,
      input.eventId ? `event_id=${input.eventId}` : "",
      `received=${data?.events_received ?? "?"}`
    );
    return true;
  } catch (err) {
    console.error("Meta CAPI request failed:", input.eventName, err);
    return false;
  }
}
