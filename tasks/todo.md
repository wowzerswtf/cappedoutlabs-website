# Stop "we missed you" texts after calls that happened (2026-09-24)

Context: Patrick Hall (Elan Flowers) got "If we missed each other, grab a new
time" 30 min after his 9/23 call with Beau. Root cause: the poll cron treated
any appointment still `confirmed` past its start as a probable no-show, and no
one ever marks appointments (17/17 past Discovery Calls still `confirmed`).

- [x] Patrick cleanup in GHL: appt 9ehVlJ3rOcZ8eRtUPfVO -> showed, opportunity
      -> Discovery Held, contact tagged `automation-off`
- [x] post-call.ts: pure decision fn; rebook text only on explicit `noshow`
- [x] poll route: confirmed-past-start pings Telegram with a one-tap outcome link
- [x] /api/appt/disposition: signed link, GET asks, POST writes status + stage
- [x] `automation-off` tag guard in canText() + dialer welcome text query
- [x] first-name trim on booking/reminder texts ("Patrick ," bug)
- [x] tests (node --test, 7 pass), tsc clean, eslint clean, slop lint clean
- [ ] commit + push site, deploy dialer, verify live (page renders, POST works)

# Widget-booking consent tags + Meet links in reminder texts (2026-08-24)

Context: no-show audit found (1) leads who book directly on the calendar widget
(contact source "Discovery Call", never through /api/apply) have no tags, so the
SMS engine's tcpa-consent guard skips every text for them, even though the
widget's required consent checkbox collects the same written consent; and
(2) every appointment text says "the meeting link is in your email" instead of
carrying the Google Meet link GHL stamps on the appointment (`address`).

- [x] ghl.ts: add `address` + `createdBy` to GhlAppointment type
- [x] sms.ts: `meetingLink()` helper; bookingConfirm / reminder24h / reminder1h
      accept optional meet link, fall back to the email phrasing when absent
- [x] poll route: stamp tcpa-consent + labs-applicant on widget-created
      bookings (gated on appointment createdBy.source === "booking_widget");
      update cached contact tags so the same cycle can text
- [x] poll route: pass the appointment's Meet link into all three templates
- [x] typecheck + slop lint pass (tsc clean; slop linter green, only
      pre-existing em-dash warnings in quiz-scoring.ts)
- [x] commit 9d7ec08, pushed, Vercel production Ready (dpl_A3w2j6kbWWyrPEiwjiZEWGbhfzhW),
      live domain 200, no runtime errors in logs
- [x] live verify #1: Eddie Jimenez (widget-direct, was untagged/untexted) got
      tagged tcpa-consent + labs-applicant AND received the no-show recovery
      text at 13:14 MDT on the first post-deploy poll — his first SMS ever
- [x] live verify #2: Kapoustin (14:30 MDT) tagged tcpa-consent + labs-applicant
      and 1h reminder sent WITH the Meet link inline ("Join here:
      https://meet.google.com/gch-gcsd-neb"), verified 13:39 MDT
