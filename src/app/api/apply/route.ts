import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ApplicationConfirmation } from "@/emails/ApplicationConfirmation";
import { ghlBookingUrl } from "@/lib/calendar";
import { sendMetaEvent, userDataFromRequest } from "@/lib/meta/capi";
import { sendTelegram, escapeHtml } from "@/lib/notify/telegram";
import { closerName, sendSms, smsTemplates } from "@/lib/notify/sms";
import { closerByUserId, intakeCloser } from "@/lib/notify/closers";
import { correctEmailDomain } from "@/lib/email-typo";

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

// Ad attribution fields, parsed server-side from the submitted pageUrl. GHL's
// own attributionSource never populates for API-created contacts, so per-ad
// attribution (utm_content = ad key, e.g. "ms-c") has to travel this way.
const UTM_FIELDS: Record<string, string> = {
  utm_source: "rrfa6NuojbQBkTXxK40Y",     // labs_utm_source
  utm_campaign: "SYY8Ew0GIRtnNFKKjLH2",   // labs_utm_campaign
  utm_content: "mjQXMtI4YE78LWJlo2E3",    // labs_utm_content
};

function utmCustomFields(pageUrl?: string) {
  if (!pageUrl) return [];
  try {
    const params = new URL(pageUrl).searchParams;
    return Object.entries(UTM_FIELDS)
      .map(([param, id]) => ({ id, field_value: params.get(param) ?? "" }))
      .filter((f) => f.field_value);
  } catch {
    return []; // malformed pageUrl — attribution is best-effort, never fatal
  }
}

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
    subject: `You're a fit, ${payload.firstName}. Book your call.`,
    react: ApplicationConfirmation({
      firstName: payload.firstName,
      lastName: payload.lastName,
      businessName: payload.businessName,
      tierInterest: payload.tierInterest,
      annualRevenue: payload.annualRevenue,
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
// 5-minute poll only announces brand-new contacts, which missed repeat emails.
// Revenue and bottleneck ride along so the closer can triage from the ping.
async function sendApplicationTelegram(payload: ApplicationPayload) {
  const lines = [
    "🟢 <b>New application — booking now</b>",
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
  const body = ["VSL APPLICATION", "", payload.message].join("\n");

  const res = await ghlRequest("POST", `/contacts/${contactId}/notes`, { body });
  if (!res.ok) {
    console.error("GHL application note failed:", res.status, res.data);
  }
}

// ── GHL: find existing contact by email ──────────────────────────
async function findContactByEmail(
  email: string
): Promise<{ id: string; assignedTo: string | null } | null> {
  const res = await ghlRequest("POST", "/contacts/search", {
    locationId: GHL_LOCATION_ID,
    query: email,
    pageLimit: 1,
  });
  const contacts = res.data?.contacts || [];
  const match = contacts.find(
    (c: { email?: string }) => c.email?.toLowerCase() === email.toLowerCase()
  );
  return match?.id ? { id: match.id, assignedTo: match.assignedTo ?? null } : null;
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

  const customFields = [
    ...Object.entries(CUSTOM_FIELDS)
      .filter(([key]) => payload[key as keyof ApplicationPayload])
      .map(([key, id]) => ({
        id,
        field_value: payload[key as keyof ApplicationPayload],
      })),
    ...utmCustomFields(payload.pageUrl),
  ];

  // Every completed application is an applicant. Nothing in this funnel
  // disqualifies anymore, so no lead is routed to a nurture-only tag.
  const baseTags = ["labs-applicant"];
  const tags = payload.consent ? [...baseTags, "tcpa-consent"] : baseTags;

  // Intake lead owner: assigned at creation, and patched onto existing
  // contacts that have no owner yet. Never overwrites a manual assignment.
  const closer = intakeCloser();

  // Check if contact already exists (from partial lead capture). GHL's
  // contact search index lags a few seconds behind writes, so a contact
  // created by /api/apply/partial moments earlier can be invisible here;
  // the duplicate-400 fallback below covers that race.
  const existing = await findContactByEmail(payload.email);
  let contactId: string | null = existing?.id ?? null;
  const needsOwner = existing ? !existing.assignedTo : true;
  // Who ends up owning this contact — the manual owner on a repeat applicant,
  // otherwise the intake closer. The follow-up text is signed with this, so a
  // reassigned lead never gets a text from someone who isn't working it.
  const ownerUserId = needsOwner ? closer.userId : (existing?.assignedTo as string);
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
      assignedTo: closer.userId,
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
    // Update existing contact with full application data. Owner only set
    // when the contact has none — a rep's manual reassignment sticks.
    const updateRes = await ghlRequest("PUT", `/contacts/${contactId}`, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      tags,
      source: payload.source || "cappedoutlabs.com",
      customFields,
      ...(needsOwner ? { assignedTo: closer.userId } : {}),
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
  // GHL) and every one carries the same plain name — no status suffix.
  const oppName = `${payload.firstName} ${payload.lastName} — ${payload.businessName}`;
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
      return { contactId, opportunityId: existingId as string, ownerUserId };
    }
    console.error("GHL opportunity creation failed:", oppRes.status, oppRes.data);
    // Contact was created — don't throw, just log the opportunity failure
  } else {
    console.log("GHL opportunity created:", oppRes.data?.opportunity?.id);
  }

  return { contactId, opportunityId: oppRes.data?.opportunity?.id, ownerUserId };
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

  // Catch a fat-fingered free-mail domain at the door. Correcting here means
  // the confirmation email, the GHL contact, and every downstream nurture all
  // use the fixed address. Waiting for the dialer sync to repair it would
  // still bounce the one email that carries the booking link.
  const emailFix = correctEmailDomain(payload.email);
  if (emailFix) {
    console.log(`Corrected applicant email: ${emailFix.original} -> ${emailFix.corrected}`);
    payload.email = emailFix.corrected;
  }

  // Capture request metadata for the consent record
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Meta conversion: every completed application fires Lead — the survey no
  // longer gates the win (Waynard 2026-08-02: count all applicants).
  // Best-effort - never blocks the lead.
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

  // Fire everything simultaneously
  const [resendResult, ghlResult, , telegramResult] = await Promise.allSettled([
    sendConfirmationEmail(payload),
    createGhlContact(payload, ip, userAgent),
    metaEvent,
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
    const owner =
      closerByUserId(ghlResult.value.ownerUserId) ?? intakeCloser();
    const signer = closerName(owner.name);
    const smsResult = await sendSms(
      {
        id: ghlResult.value.contactId,
        firstName: payload.firstName,
        phone: payload.phone,
        tags: ["tcpa-consent"],
      },
      smsTemplates.appliedQualified(
        payload.firstName,
        signer,
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
