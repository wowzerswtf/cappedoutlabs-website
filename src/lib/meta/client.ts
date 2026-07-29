// Browser-side Meta Pixel helpers.
//
// The pixel base code is injected by src/components/MetaPixel.tsx; these
// helpers give form components a typed, crash-proof way to fire events and
// mint event IDs shared with the server's Conversions API call for dedup.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Event ID shared between the browser fbq call and the server CAPI call so
 *  Meta counts the conversion once. */
export function newMetaEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Fire a pixel event. Safe no-op when the pixel isn't loaded (no pixel ID
 *  configured, ad blocker, SSR). */
export function metaTrack(
  eventName: string,
  params?: Record<string, string | number>,
  eventId?: string
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    window.fbq(
      "track",
      eventName,
      params ?? {},
      eventId ? { eventID: eventId } : undefined
    );
  } catch {
    // Tracking must never break the UI.
  }
}
