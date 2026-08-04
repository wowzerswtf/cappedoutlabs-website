# GHL SMS engine — 2026-08-04

Context: zero texts have ever been sent to leads (Labs GHL location has no phone
number provisioned — "No Twilio account found"). Reps only cold-call from
personal cells; 0% answer rate. Every lead already grants TCPA/SMS consent at
the funnel. Build the full SMS layer in code (GHL workflows are UI-only, no
API), shipping dark until the LC Phone number exists.

## Build

- [ ] `src/lib/notify/sms.ts` — GHL conversations SMS sender (ships dark when
      no number), consent + DND + quiet-hours guards, all message templates
- [ ] `src/lib/notify/ghl.ts` — extend NotifyState (sms sent-keys, inbound
      watermark), add conversations fetch + contact search by tag
- [ ] `/api/apply` — instant SMS on every completed application (qualified →
      booking link; no-budget → nurture text)
- [ ] `/api/telegram/poll` — SMS automations on the existing 5-min cron:
      - [ ] booking confirmation text (new appointment)
      - [ ] 24-hour reminder
      - [ ] 1-hour reminder
      - [ ] no-show / never-dispositioned recovery text (+ rebook link)
      - [ ] abandoned partial-application text (15 min – 24 h after capture)
      - [ ] inbound SMS reply → Telegram ping (lead replied!)
- [ ] `/api/sms/outreach` — one-time backlog blast to existing consented,
      unbooked leads (dry-run by default, `?send=1` to fire)
- [ ] Docs: AGENTS.md section
- [ ] `npm run build` + lint pass
- [ ] Commit, push, verify deploy, verify poll still green in prod

## Manual step for Waynard (UI-only, cannot be done via API)

- [ ] Buy an LC Phone number in the Labs sub-account + submit A2P 10DLC
      registration (Settings → Phone Numbers). Everything above goes live
      automatically the moment the number is approved.
