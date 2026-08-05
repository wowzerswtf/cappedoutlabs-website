// Environment gate for Meta tracking.
//
// Why this exists: the pixel and the Conversions API both report into dataset
// 3578788369100460, which is SHARED with Capped Out Media. On 2026-08-05 an
// audit of that dataset (aggregated by host) found `127.0.0.1` sitting in the
// event stream next to cappedoutlabs.com - local `npm run dev` sessions were
// writing fake conversions into the live dataset that the ad campaigns
// optimize on. Vercel preview deploys could do the same.
//
// Both entry points gate on this module now:
//   - browser pixel: src/components/MetaPixel.tsx (runtime hostname check,
//     because one build serves preview and production)
//   - server CAPI:   src/lib/meta/capi.ts (VERCEL_ENV / NODE_ENV check)

/** Hosts allowed to report events into the production dataset. */
export const PRODUCTION_HOSTS = [
  "cappedoutlabs.com",
  "www.cappedoutlabs.com",
] as const;

/** True only for the real production hostnames. Localhost, 127.0.0.1, and
 *  every *.vercel.app preview URL fall through to false. */
export function isProductionHost(hostname: string | null | undefined): boolean {
  if (!hostname) return false;
  return (PRODUCTION_HOSTS as readonly string[]).includes(hostname.toLowerCase());
}

/** Why server-side tracking is suppressed, or null when it should run.
 *
 *  Fail-open by design: it blocks only when it can positively identify a
 *  non-production environment. If VERCEL_ENV is somehow absent in production,
 *  NODE_ENV still lets real events through - losing live conversions would be
 *  worse than the pollution this guards against. */
export function serverTrackingBlockedReason(): string | null {
  // Test events carry test_event_code, which routes them to Events Manager >
  // Test Events. They never reach production reporting, so they always pass.
  if (process.env.META_TEST_EVENT_CODE) return null;

  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") return `VERCEL_ENV=${vercelEnv}`;
  if (process.env.NODE_ENV !== "production") return `NODE_ENV=${process.env.NODE_ENV}`;
  return null;
}
