# Telegram GHL Notifier — build plan (2026-07-28)

Goal: Telegram DM to Waynard (chat 124726061) for every new GHL lead, booking,
cancellation, and reschedule. Zero login required. Polls every 5 min via Vercel
cron; optional instant webhook endpoint for GHL workflows.

- [ ] `src/lib/notify/telegram.ts` — sendTelegram (HTML parse mode, escaping)
- [ ] `src/lib/notify/ghl.ts` — GHL client: contacts search, calendars list,
      events, contact fetch, custom field map, state get/save (custom value
      `tg_notify_state`, id RdHj2V1eVcruguNXPyKS)
- [ ] `src/lib/notify/format.ts` — pure message builders (lead card, booking
      card, status-change card), America/Denver times
- [ ] `src/app/api/telegram/poll/route.ts` — cron handler: diff state, notify,
      save. First run arms silently + sends confirmation. `?test=1` sends
      sample cards end-to-end.
- [ ] `src/app/api/telegram/ghl-webhook/route.ts` — instant notifications from
      GHL workflow webhook (secret-gated), marks contact seen to avoid dupes
- [ ] `vercel.json` — cron `*/5 * * * *` on /api/telegram/poll
- [ ] Env vars (local + Vercel prod/preview/dev): TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID, CRON_SECRET
- [ ] Docs in AGENTS.md (how it works, swap to dedicated bot, instant webhook)
- [ ] Build, commit, deploy via `vercel --prod`
- [ ] Live verify: hit poll with secret (arms + Telegram confirm), `?test=1`
      sample cards, confirm cron registered
