# Widget-booking consent tags + Meet links in reminder texts (2026-08-24)

Context: no-show audit found (1) leads who book directly on the calendar widget
(contact source "Discovery Call", never through /api/apply) have no tags, so the
SMS engine's tcpa-consent guard skips every text for them, even though the
widget's required consent checkbox collects the same written consent; and
(2) every appointment text says "the meeting link is in your email" instead of
carrying the Google Meet link GHL stamps on the appointment (`address`).

- [ ] ghl.ts: add `address` + `createdBy` to GhlAppointment type
- [ ] sms.ts: `meetingLink()` helper; bookingConfirm / reminder24h / reminder1h
      accept optional meet link, fall back to the email phrasing when absent
- [ ] poll route: stamp tcpa-consent + labs-applicant on widget-created
      bookings (gated on appointment createdBy.source === "booking_widget");
      update cached contact tags so the same cycle can text
- [ ] poll route: pass the appointment's Meet link into all three templates
- [ ] typecheck + slop lint pass
- [ ] commit, push, verify production deploy
- [ ] live verify: run poll, confirm Kapoustin (14:30 MDT today, untagged) gets
      tagged + 1h reminder WITH link; confirm no double-sends elsewhere
