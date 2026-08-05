// Meta CAPI verification endpoint.
//
// Fires a test Lead through the Conversions API so setup can be verified in
// Events Manager without submitting a real application:
//
//   GET /api/meta/test?secret=<CRON_SECRET>&code=TESTX -> routed to the
//        Test Events tab (get the code from Events Manager > Test Events)
//   GET /api/meta/test?secret=<CRON_SECRET>&force=1    -> real production
//        event, deliberately opted into
//
// `code` is required by default. This route used to fire a REAL Lead into
// the production dataset when called bare, which is exactly the kind of
// pollution src/lib/meta/env.ts exists to prevent - and the dataset is
// shared with Capped Out Media, so a stray test Lead skews live campaign
// numbers. Opting into a production event now has to be explicit.
//
// Reuses CRON_SECRET for auth, same as the Telegram routes.

import { NextResponse } from "next/server";
import { metaConfigured, sendMetaEvent, userDataFromRequest } from "@/lib/meta/capi";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET;
  if (!secret || url.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!metaConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Meta env vars missing. Set NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_ACCESS_TOKEN.",
      },
      { status: 503 }
    );
  }

  const code = url.searchParams.get("code");
  const force = url.searchParams.get("force") === "1";
  if (!code && !force) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Refusing to write a test Lead into the production dataset. Pass &code=<TESTCODE> from Events Manager > Test Events, or &force=1 to send a real production event on purpose.",
      },
      { status: 400 }
    );
  }
  if (code) process.env.META_TEST_EVENT_CODE = code;

  const sent = await sendMetaEvent({
    eventName: "Lead",
    eventId: `capi-test-${Date.now()}`,
    eventSourceUrl: "https://cappedoutlabs.com/api/meta/test",
    userData: {
      ...userDataFromRequest(request),
      email: "test@cappedoutlabs.com",
      firstName: "Test",
      lastName: "Lead",
    },
    customData: { source: "capi-test-endpoint" },
  });

  return NextResponse.json({
    ok: sent,
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    testEventCode: code || process.env.META_TEST_EVENT_CODE || null,
    hint: code
      ? "Check Events Manager > your dataset > Test Events."
      : "Sent as a REAL production event (force=1). It will show in live reporting.",
  });
}
