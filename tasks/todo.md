# GHL SMS engine — 2026-08-04

Context: zero texts have ever been sent to leads (Labs GHL location has no phone
number provisioned — "No Twilio account found"). Reps only cold-call from
personal cells; 0% answer rate. Every lead already grants TCPA/SMS consent at
the funnel. Build the full SMS layer in code (GHL workflows are UI-only, no
API), shipping dark until the LC Phone number exists.

## Build

- [x] `src/lib/notify/sms.ts` — GHL conversations SMS sender, consent + DND +
      quiet-hours guards, all message templates. IMPORTANT discovery: the
      conversations API queues sends even with NO number on the location
      (message sits "pending" forever), so `hasSmsNumber()` gates every send
      on `/phone-system/numbers/location/{id}` until the number exists
- [x] `src/lib/notify/ghl.ts` — NotifyState.sms dedupe keys + lastInboundMs
      watermark, fetchConversations, GhlContact.dnd
- [x] `/api/apply` — instant SMS on every completed application (qualified →
      booking link; no-budget → nurture text)
- [x] `/api/telegram/poll` — SMS automations on the existing 5-min cron:
      - [x] booking confirmation text (new appointment)
      - [x] 24-hour reminder (20-24h window, quiet-hours aware)
      - [x] 1-hour reminder (15-60min window)
      - [x] no-show / never-dispositioned recovery text (+ rebook link)
      - [x] abandoned partial-application text (15 min – 24 h after capture)
      - [x] inbound SMS reply → Telegram ping (lead replied!)
- [x] `/api/sms/outreach` — one-time backlog blast to existing consented,
      unbooked leads (dry-run by default, `?send=1` to fire)
- [x] Docs: AGENTS.md section
- [x] `npm run build` + tsc + slop lint pass
- [x] Commit 29298d3, push, verify deploy live (route probe + poll green)

## Manual step for Waynard (UI-only, cannot be done via API)

- [ ] Buy an LC Phone number in the Labs sub-account + submit A2P 10DLC
      registration (Settings → Phone Numbers). Everything above goes live
      automatically the moment the number is approved.
