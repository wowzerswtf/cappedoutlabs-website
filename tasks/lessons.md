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
