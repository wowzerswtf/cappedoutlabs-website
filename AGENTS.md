# Capped Out Labs — website agent notes

## Copy quality guard (no AI slop)

All user-facing copy must read like a human operator wrote it, not an LLM. A
pre-commit hook enforces this so slop can't ship by accident.

- **Linter:** `scripts/check-ai-slop.mjs` — flags AI-writing tells (buzzwords like
  "seamless"/"cutting-edge", "it's not just X, it's Y" parallelisms, filler like
  "in today's landscape", chatbot artifacts, "leverage" as a verb). Patterns
  mirror the `humanizer` skill.
- **Pre-commit hook:** `.githooks/pre-commit` runs the linter on the lines you're
  adding in staged content files (`src/**/*.{ts,tsx}`, `public/**/*.{txt,json,html,md}`).
  Blocking tells reject the commit; em dashes and curly quotes warn only.
- **Activate on a fresh clone:** `npm install` sets it up automatically (the
  `prepare` script runs `git config core.hooksPath .githooks`). To set it manually:
  `git config core.hooksPath .githooks`.
- **Audit the whole site:** `npm run lint:slop`.
- **Escapes:** add `slop-ok` to a line to whitelist it intentionally, or
  `git commit --no-verify` to bypass the hook entirely (use sparingly).

When copy does trip the guard, fix the wording — run the `humanizer` skill if you
want a full rewrite rather than a one-line fix.

## Telegram lead/booking notifier

Waynard gets a Telegram DM (chat `124726061`, via the shared pm-bot token
`@compmsbot`) for every new GHL lead, new booking, cancellation, reschedule,
and appointment status change — no GHL login needed.

- **Poll engine:** `src/app/api/telegram/poll/route.ts`, run by Vercel cron
  every 5 minutes (see `vercel.json`). Diffs GHL contacts + all calendars'
  events against saved state.
- **State:** stored in the GHL location custom value `tg_notify_state` — no
  database. Delete that custom value in GHL to force a silent re-baseline.
- **Instant path (optional):** point a GHL workflow webhook action at
  `POST /api/telegram/ghl-webhook?secret=<CRON_SECRET>` for zero-delay
  notifications; the poll dedupes against it automatically.
- **Instant application pings (2026-08-02):** `/api/apply` sends a Telegram
  card for EVERY completed application (qualified 🟢 or no-budget 🟡), and
  `/api/apply/partial` pings 📝 when a new partial contact is captured. These
  fire directly from the submit path, so repeat-email submissions and
  disqualified leads are never silent (the poll only announces brand-new
  contacts). A brand-new applicant may therefore ping twice: instantly from
  the API, and again from the next poll cycle — intentional redundancy.
- **Delivery retry (2026-08-06):** `sendTelegram` fired once with no retry, so
  a transient Telegram fault silently cost a lead alert. 4 pings were lost that
  way between 08-04 and 08-06 (contacts landed in GHL, notification never
  arrived). It now retries 3 times with exponential backoff capped at 4s, so a
  retry storm cannot push a caller past Vercel's 60s function timeout. Only
  transient faults retry: fetch rejections, 5xx, and 429 (honouring Telegram's
  `retry_after` hint). Any other 4xx returns immediately, since a bad token or
  chat id will never succeed. Chats send concurrently so backoff on one does
  not delay the others. **If lead alerts ever go quiet again, check the GHL
  contact list first** - the contact landing in GHL with no ping means the
  notifier failed, not the funnel.
- **Libs:** `src/lib/notify/{telegram,ghl,format}.ts`.
- **Env:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CRON_SECRET` (all three
  Vercel envs + `.env.local`), plus the existing `GHL_API_KEY` /
  `GHL_LOCATION_ID`.
- **Manual test:** `GET /api/telegram/poll?secret=<CRON_SECRET>&test=1` sends
  sample cards; without `test=1` it runs a real poll cycle.
- **Swap to a dedicated bot later:** create one with @BotFather, message it
  once, then update `TELEGRAM_BOT_TOKEN` in Vercel. Nothing else changes.

## SMS lead follow-up engine (GHL)

Every consented lead gets texted automatically through the GHL conversations
API, so replies land in the GHL inbox where the sales team works. Built in
code because GHL workflows cannot be created via API.

- **Sender + templates:** `src/lib/notify/sms.ts`. Hard guards no caller can
  skip: `tcpa-consent` tag + phone required, DND respected, TCPA quiet hours
  (8am-9pm recipient-local) on poll-driven sends, `SMS_PAUSED=1` kill switch.
- **Ships dark until a number exists:** the conversations API queues messages
  even with NO phone number on the location (verified 2026-08-04 — returns a
  messageId, message sits "pending" forever). `hasSmsNumber()` probes
  `/phone-system/numbers/location/{id}` (cached 5 min) and blocks all sends
  until the LC Phone number + A2P registration are live. No code change
  needed at go-live.
- **Instant texts:** `/api/apply` sends the qualified booking-link text or the
  no-budget nurture text the moment an application lands (quiet-hours exempt:
  the lead is mid-funnel on their phone).
- **Poll-driven texts** (piggyback on the 5-min Telegram poll cron, dedupe
  keys in `tg_notify_state.sms`): booking confirmation, 24h reminder, 1h
  reminder, no-show / never-dispositioned recovery (fires when an appointment
  is marked `noshow` OR still `confirmed` 30min-48h past start), and an
  abandoned-partial nudge 15min-24h after step-1 capture.
- **Inbound replies -> Telegram:** the poll watches the conversations feed and
  DMs Waynard the moment any lead replies (SMS or email), with the message
  body quoted.
- **Backlog outreach:** `GET /api/sms/outreach?secret=<CRON_SECRET>` dry-runs
  a one-time "texting might be easier" blast to consented, unbooked leads
  (auto-excludes test contacts, booked contacts, already-texted). Add
  `&send=1` to fire. Each contact can only ever receive it once.
- Templates carry brand name + STOP language on first-touch messages (A2P
  carrier rules). No em dashes, no slop — the linter covers these files.
- **Lead ownership + signed texts:** every contact created by `/api/apply` or
  `/api/apply/partial` gets a round-robin owner (`assignedTo`) from the roster
  in `src/lib/notify/closers.ts` (deterministic email hash — same lead, same
  closer). Every text opens with the closer's first name, resolved
  appointment-assignee > lead owner > `DEFAULT_CLOSER_NAME` env > Santos.
  Manual reassignment in GHL sticks; intake never overwrites an existing
  owner. Team changes = edit the CLOSERS list.

## Meta (Facebook) conversion tracking

Browser pixel + server Conversions API. Ships dark: with the env vars unset,
every tracking call is a silent no-op.

**Labs does NOT have its own pixel or ad account.** An earlier version of this
doc claimed it did; that was never true in production. Verified 2026-08-05:
Labs reports into dataset `3578788369100460` ("COM"), owned by business
`379600927945081`, and the Labs campaigns run inside ad account
`1079590823153736` alongside the SCIO client campaigns. Consequences to keep
in mind:
- Events Manager blends both businesses. Separate them by aggregating on
  `url` / `host` (Labs is cappedoutlabs.com, SCIO is invite.cappedoutmedia.com).
- Never build a lookalike off this dataset's Lead events without a URL rule -
  the seed would blend two unrelated ICPs.
- Campaign-level reporting is NOT affected; each campaign is credited with the
  conversions it drove.

- **Pixel loader:** `src/components/MetaPixel.tsx`, rendered from the root
  layout. Fires PageView on load + App Router navigations, ViewContent on
  funnel landers (`/f/*`).
- **Server CAPI client:** `src/lib/meta/capi.ts` (SHA-256 hashed user_data,
  fbp/fbc cookie forwarding, never throws). Browser helper: `src/lib/meta/client.ts`.
- **Events:**
  - `Lead` - EVERY completed application (`/api/apply`), qualified or not
    (Waynard 2026-08-02: every applicant counts as a win). Fired browser-side
    AND server-side with a shared `metaEventId` so Meta dedupes to one
    conversion.
  - `LeadDisqualified` (custom) - fired IN ADDITION to `Lead` for
    failed-qualifier applications (event_id `{metaEventId}-dq`), CAPI only —
    exists for nurture-audience building.
  - `PartialLead` (custom) - step-1 contact capture (`/api/apply/partial`), CAPI only.
  - `CompleteRegistration` - assessment quiz completion (`/api/assess`),
    browser + CAPI dedup.
  - `Schedule` - GHL booking, CAPI only, fired from the Telegram poll route
    and the instant webhook with event_id `ghl-appt-{id}` (dedupes poll
    retries and poll-vs-webhook double reporting).
- **Env:** `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, optional
  `META_TEST_EVENT_CODE` (routes CAPI events to Events Manager > Test Events).
  Set in Vercel (all three environments) + `.env.local`. The pixel ID is
  baked into the client bundle at build time - redeploy after changing it.
- **Environment gate (`src/lib/meta/env.ts`)** - added 2026-08-05 after a
  dataset audit found `127.0.0.1` in the live event stream: local dev was
  writing conversions into the production dataset, which is SHARED with
  Capped Out Media. Two guards:
  - Browser: the inline pixel snippet checks `window.location.hostname`
    against `PRODUCTION_HOSTS` before `fbq('init')`. Runtime, not build time,
    because one build serves preview and production. Blocked host means fbq
    is never defined and the nav effect no-ops by itself.
  - Server: `sendMetaEvent` suppresses when `VERCEL` is unset (workstation -
    catches `next start`, which sets NODE_ENV=production), when
    `VERCEL_ENV` is preview/development, or when NODE_ENV is not production.
    Fails open if none is conclusive, so a missing system var can never drop
    real conversions. Test-coded events always pass.
  - **Adding a production domain means adding it to `PRODUCTION_HOSTS`**, or
    the pixel silently stops firing there.
- **Verify:** `GET /api/meta/test?secret=<CRON_SECRET>&code=<TEST_EVENT_CODE>`
  fires a test Lead through CAPI; watch it arrive in Events Manager > Test
  Events. `code` is REQUIRED - the route refuses to write into production
  reporting unless you pass `&force=1` on purpose. Browser side: Meta Pixel
  Helper extension on the live site, or the headless check described below.
- **Headless verification** (proves both directions): load a page with
  Playwright and assert `typeof window.fbq`. On cappedoutlabs.com it must be
  `"function"` with requests to `connect.facebook.net`; on `127.0.0.1` or
  `localhost` it must be `"undefined"` with zero facebook requests.
- **Ad set optimization:** point lead campaigns at `Lead`, booking campaigns
  at `Schedule`. `LeadDisqualified`/`PartialLead` exist for audience building
  and diagnostics, not optimization.
