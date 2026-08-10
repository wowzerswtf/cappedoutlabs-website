# Lessons

## 2026-07-27 — Vercel CLI deploys died on the git hooks prepare script

**What happened:** `npx vercel deploy --prod` failed with `Command "npm install" exited with 128`. The `prepare` script ran `git config core.hooksPath .githooks`, but CLI deploys upload files without `.git`, so git exited 128 and killed the install. Webhook (git-integration) builds have a clone, so they never hit this.

**Fix:** `prepare` now wraps the git config call in a node try/catch, so git-less installs pass while local installs still wire the pre-commit hooks.

**Also learned:** pushing to master did not trigger an auto-deploy (waited 3+ min, no build). The GitHub -> Vercel integration may be disconnected; CLI deploy was the fallback. If pushes keep failing to auto-deploy, re-link the git integration in Vercel project settings.

## 2026-07-27 — Application email contradicted the self-serve booking flow

**What happened:** Since the inline GHL calendar shipped, qualified leads book their own call right after submitting, but the confirmation email still said "if it's a fit, we reach out to book a call". Disqualified leads got the same email despite the page telling them there's no call.

**Fix:** `ApplicationConfirmation` now has two variants keyed off `payload.disqualified`: qualified leads get a booking-first email with a prefilled GHL booking CTA; nurture leads get a no-call email pointing at /resources.

**Rule going forward:** any change to the post-submit UX (booking, qualification, routing) must be checked against the transactional emails in `src/emails/` in the same commit.

## 2026-07-29 — The Jul 27 email fix missed a second copy of the email living in GHL

**What happened:** A test applicant booked a call and still got "if it's a fit, we reach out to book a call." The site's Resend email was fine — the stale copy came from the GHL workflow "Labs — New Application" (id 760afbfe-34d1-47fb-b82f-4f3ad24cf35f), which fires ~12 minutes after every new application and contains a word-for-word paste of the pre-Jul-27 application email. Confirmed via the contact's GHL conversation: the message's `source` is `workflow`, and neither Resend nor the calendar confirmation matched the copy.

**Why it was missed:** the Jul 27 fix (fee449d) only covered `src/emails/`. The same copy had been duplicated into a GHL workflow email, which no repo-side check can see.

**Fix:** remove the contact-facing email action from "Labs — New Application" (keep the internal notification step). The Resend transactional email + the calendar's "Confirmed: your discovery call" notification already cover every path. GHL workflow actions have no public write API, so this is a GHL UI change.

**Rule going forward:** transactional copy must have exactly one owner per audience. Contact-facing application emails live in `src/emails/` only; GHL workflows are for internal notifications and long-tail nurture. When email copy changes, grep the repo AND audit the GHL workflow list (`GET /workflows/`).

## 2026-08-04 — GHL conversations API queues SMS even with no phone number
Sent a test SMS via POST /conversations/messages on a location with NO phone
system: the API returned 200 with a messageId and the message sits "pending"
forever (to Tommy Ferrell's thread, body "test" — check it after the number
goes live; there is no delete-message endpoint). Lesson: "did the API accept
it" is not "will it send". The SMS engine gates every send on
GET /phone-system/numbers/location/{id} (404 "No Twilio account found" = no
number) via hasSmsNumber() in src/lib/notify/sms.ts.

## 2026-08-04 — probing cappedoutlabs.com from this machine needs curl -k
All three local TLS stacks (Git Bash curl, curl.exe/schannel, PS 5.1) fail
cert verification against www.cappedoutlabs.com (exit 60 / "could not
establish trust relationship"), while leadconnectorhq.com verifies fine.
Something local is intercepting or the chain trips these stacks; browsers are
fine. For deploy verification probes use `curl -skL` and note www 307s to the
apex domain.

## 2026-08-09 - A partial lead went untexted because the nudge delay pushed it past quiet hours

**What happened:** Phillip Newberry submitted step 1 of the application at
8:48:34pm Central (area code 870, Arkansas) and got no text. Nothing was
broken: partial applicants only ever got the abandoned-application nudge from
the 5-minute poll, and that nudge is gated to fire 15 minutes after capture.
15 minutes put him at 9:03pm, three minutes past the 9pm TCPA quiet-hours
cutoff, so the send was correctly suppressed and would have waited until 8am
the next morning.

**Why it looked like a failure:** every other partial in the location had a
`partial-*` key in `tg_notify_state.sms`, the location phone number was live,
and the poll had picked him up (`lastLeadTs` matched his capture to the
millisecond). The engine was working exactly as written. The defect was the
15-minute delay, not the plumbing.

**Fix:** `/api/apply/partial` now sends the nudge instantly at intake, inside
`after()` so the form does not wait on GHL, and quiet-hours exempt for the same
reason `/api/apply` is - the lead typed the number in seconds ago. The poll
loop stays as the quiet-hours-respecting backstop. Both dedupe on the contact
tag `sms-partial-nudged`, written only after a send succeeds.

**Rules going forward:**
- A delay before an automated send is not free. Any gap between capture and
  send can straddle a quiet-hours boundary, and the leads it silently costs are
  the ones who filled the form out at night.
- Put one-shot dedupe markers on the GHL contact, not in the shared
  `tg_notify_state` blob, whenever two independent writers can send the same
  message. The blob is a read-modify-write that the 5-minute cron can clobber.
- Only mark a message as sent after the send actually succeeds, so a blocked
  or failed attempt retries while its window is still open.
- Leads type their full name into the first-name box. `leadFirstName()` trims
  to the first token so a text never opens "Hey Phillip Newberry,".
