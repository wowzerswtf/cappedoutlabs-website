import { NextResponse } from "next/server";
import { ghlBookingUrl } from "@/lib/calendar";

// Branded, shareable booking link. Used in emails, PDFs, and anywhere a clean
// URL beats the raw GHL widget URL. Redirects straight to the GHL calendar.
export function GET() {
  return NextResponse.redirect(ghlBookingUrl(), 307);
}
