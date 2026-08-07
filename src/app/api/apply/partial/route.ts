import { NextResponse } from "next/server";
import { sendMetaEvent, userDataFromRequest } from "@/lib/meta/capi";
import { sendTelegram, escapeHtml } from "@/lib/notify/telegram";
import { pickCloser } from "@/lib/notify/closers";
import { correctEmailDomain } from "@/lib/email-typo";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_BASE = "https://services.leadconnectorhq.com";

async function ghlRequest(method: string, path: string, body?: unknown) {
  const res = await fetch(`${GHL_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      email: rawEmail,
      phone,
      consent,
      consentLanguage,
      consentVersion,
      consentTimestamp,
    } = await request.json();

    // Fix the domain before the contact is created, so a typo never reaches
    // GHL in the first place and the dialer has nothing to repair later.
    const partialFix = correctEmailDomain(rawEmail);
    if (partialFix) {
      console.log(`Corrected partial email: ${partialFix.original} -> ${partialFix.corrected}`);
    }
    const email = partialFix ? partialFix.corrected : rawEmail;

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "Email and first name are required" },
        { status: 400 }
      );
    }

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.error("GHL env vars missing for partial lead capture");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Meta: custom PartialLead event - top-of-form contact capture. CAPI
    // only (no browser twin), fire-and-forget so it never delays capture.
    sendMetaEvent({
      eventName: "PartialLead",
      userData: {
        ...userDataFromRequest(request),
        email,
        phone,
        firstName,
        lastName,
      },
    }).catch(() => {});

    const contactRes = await ghlRequest("POST", "/contacts/", {
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName,
      email,
      phone,
      tags: consent
        ? ["partial-applicant", "tcpa-consent"]
        : ["partial-applicant"],
      assignedTo: pickCloser(email).userId,
      source: "cappedoutlabs.com",
    });

    if (!contactRes.ok) {
      // 400/422 likely means contact already exists — that's fine
      if (contactRes.status === 400 || contactRes.status === 422) {
        console.log("Partial lead: contact already exists for", email);
        return NextResponse.json({ success: true, exists: true });
      }
      console.error("Partial lead creation failed:", contactRes.status, contactRes.data);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const contactId = contactRes.data?.contact?.id;
    console.log("Partial lead captured:", contactId, email);

    // Instant ping the moment contact info lands — even if they bail on the
    // survey, this lead is known immediately (poll would lag up to 5 min).
    sendTelegram(
      [
        "📝 <b>Partial lead — survey in progress</b>",
        `👤 ${escapeHtml(`${firstName} ${lastName || ""}`.trim())}`,
        `📧 ${escapeHtml(email)}`,
        phone ? `📱 ${escapeHtml(phone)}` : "",
        "⏳ Contact captured at survey step 1 — full application may follow.",
      ]
        .filter(Boolean)
        .join("\n")
    ).catch((err) => console.error("Partial Telegram failed:", err));

    // Record consent proof (best-effort, non-fatal)
    if (contactId && consent) {
      const body = [
        "TCPA / COMMUNICATIONS CONSENT CAPTURED (partial lead)",
        `Consent: granted`,
        `Version: ${consentVersion || "unversioned"}`,
        `Timestamp: ${consentTimestamp || new Date().toISOString()}`,
        `IP: ${ip}`,
        `User-Agent: ${userAgent}`,
        `Phone: ${phone}`,
        "",
        "Language shown and agreed to:",
        consentLanguage || "(language not recorded)",
      ].join("\n");
      const noteRes = await ghlRequest("POST", `/contacts/${contactId}/notes`, { body });
      if (!noteRes.ok) {
        console.error("Partial consent note failed:", noteRes.status, noteRes.data);
      }
    }

    return NextResponse.json({ success: true, contactId });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
