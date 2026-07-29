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
- **Libs:** `src/lib/notify/{telegram,ghl,format}.ts`.
- **Env:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CRON_SECRET` (all three
  Vercel envs + `.env.local`), plus the existing `GHL_API_KEY` /
  `GHL_LOCATION_ID`.
- **Manual test:** `GET /api/telegram/poll?secret=<CRON_SECRET>&test=1` sends
  sample cards; without `test=1` it runs a real poll cycle.
- **Swap to a dedicated bot later:** create one with @BotFather, message it
  once, then update `TELEGRAM_BOT_TOKEN` in Vercel. Nothing else changes.

## Meta (Facebook) conversion tracking

Browser pixel + server Conversions API, reporting to the dedicated Capped Out
Labs pixel (NOT the Capped Out Media pixels - the two businesses run separate
ad accounts). Ships dark: with the env vars unset, every tracking call is a
silent no-op.

- **Pixel loader:** `src/components/MetaPixel.tsx`, rendered from the root
  layout. Fires PageView on load + App Router navigations, ViewContent on
  funnel landers (`/f/*`).
- **Server CAPI client:** `src/lib/meta/capi.ts` (SHA-256 hashed user_data,
  fbp/fbc cookie forwarding, never throws). Browser helper: `src/lib/meta/client.ts`.
- **Events:**
  - `Lead` - qualified application (`/api/apply`). Fired browser-side AND
    server-side with a shared `metaEventId` so Meta dedupes to one conversion.
  - `LeadDisqualified` (custom) - failed-qualifier VSL applications, CAPI only.
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
- **Verify:** `GET /api/meta/test?secret=<CRON_SECRET>&code=<TEST_EVENT_CODE>`
  fires a test Lead through CAPI; watch it arrive in Events Manager > Test
  Events. Browser side: Meta Pixel Helper extension on the live site.
- **Ad set optimization:** point lead campaigns at `Lead`, booking campaigns
  at `Schedule`. `LeadDisqualified`/`PartialLead` exist for audience building
  and diagnostics, not optimization.
