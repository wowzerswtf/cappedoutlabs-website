import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ApplicationConfirmation } from "@/emails/ApplicationConfirmation";

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
}

// ── Resend confirmation email ────────────────────────────────────
async function sendConfirmationEmail(payload: ApplicationPayload) {
  const fromName = process.env.RESEND_FROM_NAME || "Capped Out Labs";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  return getResend().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: payload.email,
    subject: `We got your application, ${payload.firstName}`,
    react: ApplicationConfirmation({
      firstName: payload.firstName,
      lastName: payload.lastName,
      businessName: payload.businessName,
      tierInterest: payload.tierInterest,
      annualRevenue: payload.annualRevenue,
    }),
  });
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
async function createGhlContact(payload: ApplicationPayload) {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    throw new Error("GHL_API_KEY and GHL_LOCATION_ID are required");
  }

  const customFields = Object.entries(CUSTOM_FIELDS)
    .filter(([key]) => payload[key as keyof ApplicationPayload])
    .map(([key, id]) => ({
      id,
      field_value: payload[key as keyof ApplicationPayload],
    }));

  // Check if contact already exists (from partial lead capture)
  const existingId = await findContactByEmail(payload.email);

  let contactId: string;

  if (existingId) {
    // Update existing contact with full application data
    const updateRes = await ghlRequest("PUT", `/contacts/${existingId}`, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      tags: ["labs-applicant"],
      source: payload.source || "cappedoutlabs.com",
      customFields,
    });

    if (!updateRes.ok) {
      console.error("GHL contact update failed:", updateRes.status, updateRes.data);
      throw new Error(`GHL contact update failed (${updateRes.status})`);
    }

    contactId = existingId;
    console.log("GHL contact updated:", contactId);
  } else {
    // Create new contact
    const contactRes = await ghlRequest("POST", "/contacts/", {
      locationId: GHL_LOCATION_ID,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      tags: ["labs-applicant"],
      source: payload.source || "cappedoutlabs.com",
      customFields,
    });

    if (!contactRes.ok) {
      console.error("GHL contact creation failed:", contactRes.status, contactRes.data);
      throw new Error(`GHL contact creation failed (${contactRes.status})`);
    }

    contactId = contactRes.data?.contact?.id;
    if (!contactId) {
      console.error("GHL contact response missing ID:", contactRes.data);
      throw new Error("GHL contact created but no ID returned");
    }

    console.log("GHL contact created:", contactId);
  }

  // Step 2: Create opportunity in pipeline at "Applied" stage
  const oppRes = await ghlRequest("POST", "/opportunities/", {
    pipelineId: PIPELINE_ID,
    pipelineStageId: APPLIED_STAGE_ID,
    contactId,
    locationId: GHL_LOCATION_ID,
    name: `${payload.firstName} ${payload.lastName} — ${payload.businessName}`,
    status: "open",
    monetaryValue: 0,
  });

  if (!oppRes.ok) {
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

  // Fire both simultaneously
  const [resendResult, ghlResult] = await Promise.allSettled([
    sendConfirmationEmail(payload),
    createGhlContact(payload),
  ]);

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
