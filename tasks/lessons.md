# Lessons

## 2026-07-27 — Vercel CLI deploys died on the git hooks prepare script

**What happened:** `npx vercel deploy --prod` failed with `Command "npm install" exited with 128`. The `prepare` script ran `git config core.hooksPath .githooks`, but CLI deploys upload files without `.git`, so git exited 128 and killed the install. Webhook (git-integration) builds have a clone, so they never hit this.

**Fix:** `prepare` now wraps the git config call in a node try/catch, so git-less installs pass while local installs still wire the pre-commit hooks.

**Also learned:** pushing to master did not trigger an auto-deploy (waited 3+ min, no build). The GitHub -> Vercel integration may be disconnected; CLI deploy was the fallback. If pushes keep failing to auto-deploy, re-link the git integration in Vercel project settings.

## 2026-07-27 — Application email contradicted the self-serve booking flow

**What happened:** Since the inline GHL calendar shipped, qualified leads book their own call right after submitting, but the confirmation email still said "if it's a fit, we reach out to book a call". Disqualified leads got the same email despite the page telling them there's no call.

**Fix:** `ApplicationConfirmation` now has two variants keyed off `payload.disqualified`: qualified leads get a booking-first email with a prefilled GHL booking CTA; nurture leads get a no-call email pointing at /resources.

**Rule going forward:** any change to the post-submit UX (booking, qualification, routing) must be checked against the transactional emails in `src/emails/` in the same commit.
