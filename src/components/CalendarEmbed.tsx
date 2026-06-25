"use client";

import Script from "next/script";
import { GHL_CALENDAR_ID, ghlBookingUrl } from "@/lib/calendar";

/**
 * Inline GoHighLevel booking widget. Prefills the visitor's details when passed
 * so they can book in a couple of clicks. The form_embed.js script auto-resizes
 * the iframe; the iframe id must start with the calendar id for it to work.
 */
export function CalendarEmbed({
  firstName,
  lastName,
  email,
  phone,
  id = "embed",
  className = "",
}: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  id?: string;
  className?: string;
}) {
  const src = ghlBookingUrl({ firstName, lastName, email, phone });

  return (
    <div className={className}>
      <iframe
        src={src}
        title="Book your discovery call"
        scrolling="no"
        id={`${GHL_CALENDAR_ID}_${id}`}
        className="w-full rounded-xl border border-border"
        style={{ minHeight: "720px", border: "none", overflow: "hidden" }}
      />
      <Script
        src="https://api.leadconnectorhq.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
