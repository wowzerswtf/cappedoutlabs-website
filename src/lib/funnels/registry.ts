// Known funnels, keyed by the `funnel` slug a form sends to /api/apply.
//
// The slug becomes a GHL contact tag so the closer and any GHL workflow can
// tell which pitch a lead came in on. It is a whitelist on purpose: the form
// is public, and we never want a request body to mint arbitrary tags.

export interface FunnelDef {
  /** Tag written to the GHL contact. */
  tag: string;
  /** Human-readable name used in Telegram pings and emails. */
  label: string;
  /** Where the lead watched the pitch. Used in the confirmation email. */
  path: string;
}

export const FUNNELS: Record<string, FunnelDef> = {
  own: {
    tag: "funnel-own",
    label: "Own Your Software",
    path: "/f/own",
  },
};

export function funnelDef(slug?: string | null): FunnelDef | null {
  if (!slug) return null;
  return FUNNELS[slug.trim().toLowerCase()] ?? null;
}

export function funnelTag(slug?: string | null): string | null {
  return funnelDef(slug)?.tag ?? null;
}
