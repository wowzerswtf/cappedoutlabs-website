import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ApplicationConfirmation } from "@/emails/ApplicationConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

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

async function sendConfirmationEmail(payload: ApplicationPayload) {
  const fromName = process.env.RESEND_FROM_NAME || "Capped Out Labs";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  return resend.emails.send({
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

  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;

  // Fire both simultaneously
  const [resendResult, ghlResult] = await Promise.allSettled([
    // 1. Resend — instant confirmation
    sendConfirmationEmail(payload),

    // 2. GHL webhook — pipeline entry
    ghlWebhookUrl
      ? fetch(ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : Promise.resolve({ status: 200, ok: true }),
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
      ? (ghlResult.value as Response)?.status
      : ghlResult.reason
  );

  // Handle failure cases
  if (
    resendResult.status === "rejected" &&
    ghlResult.status === "rejected"
  ) {
    // Both failed — return error
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
    // GHL failed, Resend succeeded — log full payload for manual recovery
    console.error("GHL webhook failed:", ghlResult.reason);
    console.error("FAILED_GHL_PAYLOAD:", JSON.stringify(payload));
  }

  if (resendResult.status === "rejected") {
    // Resend failed, GHL succeeded — log but don't fail
    console.error("Resend email failed:", resendResult.reason);
  }

  return NextResponse.json({
    success: true,
    resend: resendResult.status,
    ghl: ghlResult.status,
  });
}
