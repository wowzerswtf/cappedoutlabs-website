# Telegram GHL Notifier — build plan (2026-07-28) — SHIPPED ✅

Goal: Telegram DM to Waynard (chat 124726061) for every new GHL lead, booking,
cancellation, and reschedule. Zero login required. Polls every 5 min via Vercel
cron; optional instant webhook endpoint for GHL workflows.

- [x] `src/lib/notify/telegram.ts` — sendTelegram (HTML parse mode, escaping)
- [x] `src/lib/notify/ghl.ts` — GHL client + state in custom value
      `tg_notify_state` (id RdHj2V1eVcruguNXPyKS)
- [x] `src/lib/notify/format.ts` — lead/booking/change cards, Denver times
- [x] `src/app/api/telegram/poll/route.ts` — cron handler + `?test=1`
- [x] `src/app/api/telegram/ghl-webhook/route.ts` — instant webhook endpoint
- [x] `vercel.json` — cron `*/5 * * * *` (verified registered in Vercel)
- [x] Env vars in Vercel prod/preview/dev + `.env.local`
- [x] Docs in AGENTS.md
- [x] Build clean, committed, deployed via `vercel --prod` (Ready)
- [x] Live verified: baseline armed + confirmation DM, test cards DM'd,
      401 without secret, E2E real lead created in GHL → detected → DM'd →
      deduped on next poll → test contact deleted

Note: GHL contacts/search has ~20s Elasticsearch indexing lag on new
contacts — harmless at a 5-minute poll cadence with the 15-min overlap window.
