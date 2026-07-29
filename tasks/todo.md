# Meta conversion tracking — build plan (2026-07-29)

Goal: full Facebook/Meta ad conversion tracking on cappedoutlabs.com — browser
pixel + server Conversions API with event dedup, reporting to a dedicated
Capped Out Labs pixel (keeps the Labs/Media ad-account firewall). Ships dark:
everything no-ops until `NEXT_PUBLIC_META_PIXEL_ID` + `META_CAPI_ACCESS_TOKEN`
are set.

Event taxonomy:
- PageView — every page (pixel base code + SPA route changes)
- ViewContent — funnel landers (`/f/*`), content_name = path
- Lead — qualified application (browser fbq + CAPI, shared event_id dedup)
- LeadDisqualified (custom) — failed-qualifier VSL apps, CAPI only
- PartialLead (custom) — step-1 contact capture, CAPI only
- CompleteRegistration — assessment quiz completion (browser + CAPI dedup)
- Schedule — GHL booking detected by poll/webhook, CAPI only,
  event_id `ghl-appt-{id}` so poll/webhook/retries never double-count

Tasks:
- [x] `src/lib/meta/capi.ts` — server CAPI client (SHA-256 user_data hashing,
      fbp/fbc/IP/UA from request, test_event_code support, silent no-op
      without env)
- [x] `src/lib/meta/client.ts` — typed fbq wrapper + event-id generator
- [x] `src/components/MetaPixel.tsx` — base code loader, SPA PageView,
      funnel ViewContent
- [x] Root layout renders `<MetaPixel />`
- [x] `/api/apply` — CAPI Lead / LeadDisqualified with dedup eventId
- [x] `/api/apply/partial` — CAPI PartialLead
- [x] `/api/assess` — CAPI CompleteRegistration with dedup eventId
- [x] `/api/telegram/poll` — CAPI Schedule on new bookings
- [x] `/api/telegram/ghl-webhook` — CAPI Schedule on instant bookings
- [x] `ApplicationForm` + `VSLSurvey` — send eventId, fire fbq Lead on success
- [x] `AssessmentQuiz` + `FunnelQuiz` — send eventId, fire fbq
      CompleteRegistration on success
- [x] `/api/meta/test` — secret-gated CAPI test-fire endpoint for Events
      Manager verification
- [x] Env placeholders in `.env.local` + docs in AGENTS.md
- [x] `npm run build` clean (lint has pre-existing errors in untouched files;
      none in the new Meta code)
- [x] Commit c66be99 pushed (deploys dark; goes live when env vars land in
      Vercel)

Blocked on Waynard (2 min): create "Capped Out Labs" web dataset in Events
Manager under the Labs Business Manager, generate a Conversions API access
token in its Settings, paste Pixel ID + token here.

---

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

---

# /apply-now ad landing page — 2026-07-29

Rebuild of the page the media team deployed on cappedoutlab.com (typo domain,
not our infra, form posted nowhere). Same sections and copy on our own domain,
with the working vsl-b intake behind every CTA.

- [x] `src/app/(funnel)/apply-now/` — page + content (hero, proof band,
      operating gap, services, apply CTA, FB ad disclaimer, sticky mobile CTA)
- [x] Every CTA opens `VSLSurvey` → qualifies → posts `/api/apply` → pops the
      GHL calendar for qualified leads (nurture screen for disqualified)
- [x] `VSLSurvey` gained `source`/`referralSource` props ("apply-now" /
      "Apply Now Page") — vsl-b defaults unchanged
- [x] `MetaPixel` fires ViewContent on `/apply-now` (inline + SPA nav)
- [x] `NEXT_PUBLIC_META_PIXEL_ID=3578788369100460` set in Vercel
      prod/preview/dev + `.env.local` — the pixel the live ads' account uses
      (dataset "COM"; swap to a dedicated Labs pixel = one env var change).
      Browser pixel now LIVE; CAPI still dark until `META_CAPI_ACCESS_TOKEN`.
- [x] Build clean, slop lint clean, deployed, verified live

Next: point the Meta ads' link_url at https://cappedoutlabs.com/apply-now and
retire cappedoutlab.com.
