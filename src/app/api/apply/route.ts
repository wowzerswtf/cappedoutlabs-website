import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ApplicationConfirmation } from "@/emails/ApplicationConfirmation";
import { ghlBookingUrl } from "@/lib/calendar";
import { sendMetaEvent, userDataFromRequest } from "@/lib/meta/capi";
import { sendTelegram, escapeHtml } from "@/lib/notify/telegram";
import { closerName, sendSms, smsTemplates } from "@/lib/notify/sms";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_BASE = "https://services.leadconnectorhq.com";

// Pipeline + stage IDs from reports/pipeline_ids.json
const PIPELINE_ID = "NcGz2w8XlXwViPSyESVn";
const APPLIED_STAGE_ID = "45557fe3-e118-4a9f-82a8-32a6ea1c5a72";

// Custom field IDs from reports/custom_field_ids.json
const CUSTOM_FIELDS: Record<string, string> = {
  businessName: "zENHzP2Jah4adoHKrttI",    // labs_business_name
  website: "V825WkSn4mdhQuOXth4o",          // labs_website
  annualRevenue: "0hZmwU9mLAZPifTTnyCx",   // labs_annual_revenue
  teamSize: "WJTnn76Mn0dOZdChj7vB",         // labs_team_size
  bottleneck: "DSIXjbUN235GZC3ARX9i",       // labs_bottleneck
  aiHistory: "KbKKiUUzzhaGMBUIYmJ7",        // labs_ai_history
  tierInterest: "EGg0nDB2BzRasCRCm282",     // labs_tier_interest
  referralSource: "F2qNIvitpzmLFslWXNQ7",   // labs_referral_source
};

interface ApplicationPayload {
  firstName: string;
  lastName: string;
  businessName: string;
  website: string;
  email: string;
  phone: string;
  annualRevenue: string;
  teamSize: string;
  bottleneck: string;
  aiHistory: string;
  tierInterest: string;
  referralSource: string;
  submittedAt: string;
  source: string;
  // Lead failed a funnel qualifier (revenue/budget). Still captured for
  // nurture, but kept out of the sales pipeline and not tagged as an applicant.
  disqualified?: boolean;
  // TCPA / communications consent record
  consent?: boolean;
  consentLanguage?: string;
  consentVersion?: string;
  consentTimestamp?: string;
  // Extra fields sent by the VSL funnel survey
  companyName?: string;
  revenue?: string;
  message?: string;
  // Meta event ID minted client-side; the browser fbq Lead call carries the
  // same ID so Meta dedupes the pixel + CAPI pair into one conversion.
  metaEventId?: string;
  // Page the form was submitted from (event_source_url for CAPI)
  pageUrl?: string;
}

// ── Resend confirmation email ────────────────────────────────────
async function sendConfirmationEmail(payload: ApplicationPayload) {
  const fromName = process.env.RESEND_FROM_NAME || "Capped Out Labs";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  return getResend().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: payload.email,
    subject: payload.disqualified
      ? `We got your application, ${payload.firstName}`
      : `You're a fit, ${payload.firstName}. Book your call.`,
    react: ApplicationConfirmation({
      firstName: payload.firstName,
      lastName: payload.lastName,
      businessName: payload.businessName,
      tierInterest: payload.tierInterest,
      annualRevenue: payload.annualRevenue,
      disqualified: payload.disqualified,
      bookingUrl: ghlBookingUrl({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
      }),
    }),
  });
}

// ── Telegram: instant ping for EVERY application ─────────────────
// Fires directly from the submit path so no lead is ever silent — the
// 5-minute poll only announces brand-new contacts, which missed repeat
// emails and made disqualified leads invisible.
async function sendApplicationTelegram(payload: ApplicationPayload) {
  const status = payload.disqualified
    ? "🟡 <b>New application — NO BUDGET YET (nurture)</b>"
    : "🟢 <b>New application — QUALIFIED</b>";
  const lines = [
    status,
    `👤 ${escapeHtml(`${payload.firstName} ${payload.lastName}`.trim())}${payload.businessName ? ` — ${escapeHtml(payload.businessName)}` : ""}`,
    payload.annualRevenue ? `💰 Revenue: ${escapeHtml(payload.annualRevenue)}` : "",
    payload.bottleneck ? `🧱 Bottleneck: ${escapeHtml(payload.bottleneck)}` : "",
    `📧 ${escapeHtml(payload.email)}`,
    payload.phone ? `📱 ${escapeHtml(payload.phone)}` : "",
    `🔗 Source: ${escapeHtml(payload.source || "cappedoutlabs.com")}`,
  ].filter(Boolean);
  await sendTelegram(lines.join("\n"));
}

// ── GHL API helper ───────────────────────────────────────────────
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

// ── GHL: write an immutable consent record as a contact note ─────
// TCPA requires keeping proof of what the person agreed to, when, and from where.
async function addConsentNote(
  contactId: string,
  payload: ApplicationPayload,
  ip: string,
  userAgent: string
) {
  if (!payload.consent) return;
  const body = [
    "TCPA / COMMUNICATIONS CONSENT CAPTURED",
    `Consent: granted`,
    `Version: ${payload.consentVersion || "unversioned"}`,
    `Timestamp: ${payload.consentTimestamp || payload.submittedAt}`,
    `IP: ${ip}`,
    `User-Agent: ${userAgent}`,
    `Source: ${payload.source || "cappedoutlabs.com"}`,
    `Phone: ${payload.phone}`,
    "",
    "Language shown and agreed to:",
    payload.consentLanguage || "(language not recorded)",
  ].join("\n");

  const res = await ghlRequest("POST", `/contacts/${contactId}/notes`, { body });
  if (!res.ok) {
    console.error("GHL consent note failed:", res.status, res.data);
  }
}

// ── GHL: write the application Q&A as a contact note ─────────────
// Custom fields only cover a few answers; this keeps the full survey on record.
async function addApplicationNote(contactId: string, payload: ApplicationPayload) {
  if (!payload.message) return;
  const header = payload.disqualified
    ? "VSL APPLICATION (NURTURE — did not meet qualifier)"
    : "VSL APPLICATION";
  const body = [header, "", payload.message].join("\n");

  const res = await ghlRequest("POST", `/contacts/${contactId}/notes`, { body });
  if (!res.ok) {
    console.error("GHL application note failed:", res.status, res.data);
  }
}

// ── GHL: find existing contact by email ──────────────────────────
async function findContactByEmail(email: string): Promise<string | null> {
  const res = await ghlRequest("POST", "/contacts/search", {
    locationId: GHL_LOCATION_ID,
    query: email,
    pageLimit: 1,
  });
  const contacts = res.data?.contacts || [];
  const match = contacts.find(
    (c: { email?: string }) => c.email?.toLowerCase() === email.toLowerCase()
  );
  return match?.id || null;
}

// ── GHL: create or update contact + add to pipeline ─────────────
async function createGhlContact(
  payload: ApplicationPayload,
  ip: string,
  userAgent: string
) {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    throw new Error("GHL_API_KEY and GHL_LOCATION_ID are required");
  }

  const customFields = Object.entries(CUSTOM_FIELDS)
    .filter(([key]) => payload[key as keyof ApplicationPayload])
    .map(([key, id]) => ({
      id,
      field_value: payload[key as keyof ApplicationPayload],
    }));

  // Qualified leads are applicants; disqualified leads are nurture-only and
  // must NOT carry the applicant tag (keeps the CRM's "qualified" view clean).
  const baseTags = payload.disqualified
    ? ["labs-nurture", "labs-disqualified"]
    : ["labs-applicant"];
  const tags = payload.consent ? [...baseTags, "tcpa-consent"] : baseTags;

  // Check if contact already exists (from partial lead capture). GHL's
  // contact search index lags a few seconds behind writes, so a contact
  // created by /api/apply/partial moments earlier can be invisible here;
  // the duplicate-400 fallback below covers that race.
  let contactId: string | null = await findContactByEmail(payload.email);
  let created = false;

  if (!contactId) {
    // Create new contact
    const contactRes = await ghlRequest("POST", "/contacts/", {
      locationId: GHL_LOCATION_ID,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      tags,
      source: payload.source || "cappedoutlabs.com",
      customFields,
    });

    if (contactRes.ok) {
      contactId = contactRes.data?.contact?.id;
      if (!contactId) {
        console.error("GHL contact response missing ID:", contactRes.data);
        throw new Error("GHL contact created but no ID returned");
      }
      created = true;
      console.log("GHL contact created:", contactId);
    } else {
      // "This location does not allow duplicated contacts" includes the
      // existing contact's id in meta - fall through to the update path.
      const duplicateId =
        contactRes.status === 400 || contactRes.status === 422
          ? contactRes.data?.meta?.contactId
          : undefined;
      if (!duplicateId) {
        console.error("GHL contact creation failed:", contactRes.status, contactRes.data);
        throw new Error(`GHL contact creation failed (${contactRes.status})`);
      }
      contactId = duplicateId as string;
      console.log("GHL duplicate detected, updating existing contact:", contactId);
    }
  }

  if (!created) {
    // Update existing contact with full application data
    const updateRes = await ghlRequest("PUT", `/contacts/${contactId}`, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      tags,
      source: payload.source || "cappedoutlabs.com",
      customFields,
    });

    if (!updateRes.ok) {
      console.error("GHL contact update failed:", updateRes.status, updateRes.data);
      throw new Error(`GHL contact update failed (${updateRes.status})`);
    }

    console.log("GHL contact updated:", contactId);
  }

  // Record consent proof + the full survey Q&A (best-effort, non-fatal)
  await addConsentNote(contactId, payload, ip, userAgent);
  await addApplicationNote(contactId, payload);

  // Step 2: Create opportunity in pipeline at "Applied" stage. EVERY
  // application gets one (Waynard 2026-08-02: every lead must be visible in
  // GHL); disqualified ones are labeled so sales can triage at a glance.
  const oppName = payload.disqualified
    ? `${payload.firstName} ${payload.lastName} — ${payload.businessName} [NURTURE: no budget yet]`
    : `${payload.firstName} ${payload.lastName} — ${payload.businessName}`;
  const oppRes = await ghlRequest("POST", "/opportunities/", {
    pipelineId: PIPELINE_ID,
    pipelineStageId: APPLIED_STAGE_ID,
    contactId,
    locationId: GHL_LOCATION_ID,
    name: oppName,
    status: "open",
    monetaryValue: 0,
  });

  if (!oppRes.ok) {
    // Repeat applicant: GHL forbids a second opportunity per contact in the
    // same pipeline. Refresh the existing one's name so status stays current.
    const existingId = oppRes.data?.meta?.existingId;
    if (oppRes.data?.code === "OPPORTUNITY_NO_DUPLICATE" && existingId) {
      const updRes = await ghlRequest("PUT", `/opportunities/${existingId}`, {
        name: oppName,
      });
      console.log(
        updRes.ok
          ? `GHL opportunity refreshed (repeat applicant): ${existingId}`
          : `GHL opportunity refresh failed: ${updRes.status}`
      );
      return { contactId, opportunityId: existingId as string };
    }
    console.error("GHL opportunity creation failed:", oppRes.status, oppRes.data);
    // Contact was created — don't throw, just log the opportunity failure
  } else {
    console.log("GHL opportunity created:", oppRes.data?.opportunity?.id);
  }

  return { contactId, opportunityId: oppRes.data?.opportunity?.id };
}

// ── POST handler ─────────────────────────────────────────────────
export async function POST(request: Request) {
  let payload: ApplicationPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!payload.email || !payload.firstName) {
    return NextResponse.json(
      { error: "Email and first name are required" },
      { status: 400 }
    );
  }

  // Capture request metadata for the consent record
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Meta conversion: every completed application fires Lead — the survey no
  // longer gates the win (Waynard 2026-08-02: count all applicants).
  // Disqualified ones ALSO fire LeadDisqualified so the nurture audience
  // stays buildable. Best-effort - never blocks the lead.
  const userData = {
    ...userDataFromRequest(request),
    email: payload.email,
    phone: payload.phone,
    firstName: payload.firstName,
    lastName: payload.lastName,
  };
  const metaEvent = sendMetaEvent({
    eventName: "Lead",
    eventId: payload.metaEventId,
    eventSourceUrl: payload.pageUrl,
    userData,
    customData: { source: payload.source || "cappedoutlabs.com" },
  });
  const metaDqEvent = payload.disqualified
    ? sendMetaEvent({
        eventName: "LeadDisqualified",
        eventId: payload.metaEventId ? `${payload.metaEventId}-dq` : undefined,
        eventSourceUrl: payload.pageUrl,
        userData,
        customData: { source: payload.source || "cappedoutlabs.com" },
      })
    : Promise.resolve(null);

  // Fire everything simultaneously
  const [resendResult, ghlResult, , , telegramResult] = await Promise.allSettled([
    sendConfirmationEmail(payload),
    createGhlContact(payload, ip, userAgent),
    metaEvent,
    metaDqEvent,
    sendApplicationTelegram(payload),
  ]);
  console.log(
    "Telegram:",
    telegramResult.status,
    telegramResult.status === "rejected" ? telegramResult.reason : "sent"
  );

  // Instant SMS the moment the application lands. The lead is mid-funnel on
  // their phone right now, so speed-to-lead beats quiet hours here. Consent
  // was captured in this same request; a repeat contact who opted out earlier
  // is blocked server-side by GHL's DND. Best-effort, never blocks the lead.
  if (ghlResult.status === "fulfilled" && payload.consent && payload.phone) {
    const smsResult = await sendSms(
      {
        id: ghlResult.value.contactId,
        firstName: payload.firstName,
        phone: payload.phone,
        tags: ["tcpa-consent"],
      },
      payload.disqualified
        ? smsTemplates.appliedNurture(payload.firstName, closerName(null))
        : smsTemplates.appliedQualified(
            payload.firstName,
            closerName(null),
            ghlBookingUrl({
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              phone: payload.phone,
            })
          )
    ).catch((err) => ({ ok: false, error: String(err) }));
    console.log("Apply SMS:", JSON.stringify(smsResult));
  }

  // Log results
  console.log(
    "Resend:",
    resendResult.status,
    resendResult.status === "fulfilled"
      ? resendResult.value?.data?.id
      : resendResult.reason
  );
  console.log(
    "GHL:",
    ghlResult.status,
    ghlResult.status === "fulfilled"
      ? `contact=${ghlResult.value.contactId}`
      : ghlResult.reason
  );

  // Handle failure cases
  if (
    resendResult.status === "rejected" &&
    ghlResult.status === "rejected"
  ) {
    console.error("Both Resend and GHL failed:", {
      resend: resendResult.reason,
      ghl: ghlResult.reason,
    });
    return NextResponse.json(
      {
        error:
          "Something went wrong submitting your application. Please email us directly at hello@cappedoutlabs.com",
      },
      { status: 500 }
    );
  }

  if (ghlResult.status === "rejected") {
    console.error("GHL API failed:", ghlResult.reason);
    console.error("FAILED_GHL_PAYLOAD:", JSON.stringify(payload));
  }

  if (resendResult.status === "rejected") {
    console.error("Resend email failed:", resendResult.reason);
  }

  return NextResponse.json({
    success: true,
    resend: resendResult.status,
    ghl: ghlResult.status,
  });
}
