# "Stop renting your software" funnel at /f/own (2026-10-20)

Context: the "AI consultants sell decks" ads stopped converting. New pitch:
Labs uses AI to build the client's own version of the software they rent, in
weeks, for a fraction of old custom pricing. Own your software, own your
business. Needs a VSL, a lander with the math, and GHL intake.

- [x] VSL script (~750 words, beat-by-beat with on-screen cues) in
      `src/lib/funnels/own.ts`; rendered as a written letter on the page until
      `OWN_VSL_VIMEO_ID` is set
- [x] Rent calculator: pure math in `src/lib/rent-math.ts` (12% Vertice hike
      rate, 20% upkeep, Clutch $132K/13mo for scale), UI in
      `src/components/RentCalculator.tsx`, summary echoed in the final CTA,
      sticky bar, exit popup, and the GHL contact note
- [x] Lander `/f/own`: hero, calculator, rent vs old custom vs Labs table,
      what we build, proof, how it goes, fit / wrong call, FAQ, final CTA,
      FB disclaimer footer, sticky CTA, exit intent
- [x] `VSLSurvey` takes slides/title/attribution/funnel props; checkbox slides;
      defaults reproduce the legacy application byte for byte (pinned by test)
- [x] `/api/apply`: whitelisted `funnel` slug -> GHL tag `funnel-own`, Telegram
      Funnel line, Meta custom_data.funnel, email variant
- [x] Tests: `tests/rent-math.test.mts`, `tests/survey.test.mts` (worked
      example pinned so the spoken script can't drift from the math)
- [x] Docs: `docs/own-your-software-funnel.md`, AGENTS.md Funnels section
- [x] Copy through the humanizer skill + `npm run lint:slop` clean
- [x] Render the VSL from the script (`tools/vsl-render`, 53 cards, 5:10)
- [x] Voice: presets (Brooks, Jake, Benji, Leo, Dylan, Evan, Miles, Callan, Cody) all
      rejected as fake; now a Seed Audio clone of the `VSL 7 Young.mp4` narrator, one take
      per paragraph, split at sentence pauses
- [ ] Waynard: approve the cloned voice, or record the first two paragraphs for a clone of
      his own voice (paragraph 3 says "I'm Waynard")
- [ ] Upload `tools/vsl-render/out/own/vsl.mp4` to Vimeo, set `OWN_VSL_VIMEO_ID`
- [ ] Production smoke test: submit, confirm `funnel-own` tag + calculator
      block in the GHL note + Telegram Funnel line
- [ ] Point ads at `/f/own?utm_source=fb&utm_campaign=own&utm_content=<key>`

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
- [x] site 5874a28 live, dialer bd9aab5 deployed; outcome page 200 + 375px clean
      (48px buttons), forged sig 403, POST showed saved, poll cycle ok, 0 errors

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
