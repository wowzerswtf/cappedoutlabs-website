// GoHighLevel booking calendar. Bookings made through this widget land on the
// contact in GHL and move them down the pipeline.
export const GHL_CALENDAR_ID = "MfpsThFeOSmRS3T1qQhR";

const GHL_BOOKING_BASE = "https://api.leadconnectorhq.com/widget/booking";

// Build the booking URL, prefilling the visitor's details when we have them so
// they can book in a couple of clicks. GHL accepts first_name/last_name/email/phone.
export function ghlBookingUrl(opts: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
} = {}): string {
  const params = new URLSearchParams();
  if (opts.firstName) params.set("first_name", opts.firstName);
  if (opts.lastName) params.set("last_name", opts.lastName);
  if (opts.email) params.set("email", opts.email);
  if (opts.phone) params.set("phone", opts.phone);
  const qs = params.toString();
  return `${GHL_BOOKING_BASE}/${GHL_CALENDAR_ID}${qs ? `?${qs}` : ""}`;
}
