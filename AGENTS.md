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
