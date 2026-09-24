// Signed one-tap links the Telegram "did they show?" ping carries. The link
// only names an appointment; the page it opens asks Showed or No-show and
// POSTs the answer, so a link unfurler or prefetch can never mark anything.

import { createHmac, timingSafeEqual } from "node:crypto";

export const SITE_ORIGIN = "https://cappedoutlabs.com";

function sign(appointmentId: string): string {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is required");
  return createHmac("sha256", secret)
    .update(`appt-disposition:${appointmentId}`)
    .digest("base64url")
    .slice(0, 22);
}

export function dispositionUrl(appointmentId: string): string {
  const params = new URLSearchParams({ id: appointmentId, sig: sign(appointmentId) });
  return `${SITE_ORIGIN}/api/appt/disposition?${params}`;
}

export function verifyDisposition(appointmentId: string, sig: string): boolean {
  if (!appointmentId || !sig) return false;
  const expected = Buffer.from(sign(appointmentId));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
