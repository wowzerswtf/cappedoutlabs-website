// Meta CAPI verification endpoint.
//
// Fires a test Lead through the Conversions API so setup can be verified in
// Events Manager without submitting a real application:
//
//   GET /api/meta/test?secret=<CRON_SECRET>            -> production event
//   GET /api/meta/test?secret=<CRON_SECRET>&code=TESTX -> routed to the
//        Test Events tab (get the code from Events Manager > Test Events)
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
      : "Sent as a production event. Pass &code=<TESTCODE> to use Test Events.",
  });
}
