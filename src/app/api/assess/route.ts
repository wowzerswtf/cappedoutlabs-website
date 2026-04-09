import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  scoreQuiz,
  getBottleneckService,
  getCostOfWaiting,
  type QuizAnswer,
  type QuizContact,
} from "@/lib/quiz-scoring";
import { AssessmentResults } from "@/emails/AssessmentResults";
import { generateAssessmentPDF } from "@/lib/assessment-pdf";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_BASE = "https://services.leadconnectorhq.com";

// Reuse existing pipeline
const PIPELINE_ID = "NcGz2w8XlXwViPSyESVn";
const APPLIED_STAGE_ID = "45557fe3-e118-4a9f-82a8-32a6ea1c5a72";

// Custom field IDs — reuse existing where possible, add quiz-specific ones
// Run setup/create-quiz-fields.js to get these IDs, then replace PLACEHOLDERs
const CUSTOM_FIELDS: Record<string, string> = {
  businessName: "zENHzP2Jah4adoHKrttI",
  quizScore: "PLACEHOLDER_RUN_SETUP",           // labs_quiz_score
  quizTier: "PLACEHOLDER_RUN_SETUP",            // labs_quiz_tier
  quizBottleneck: "PLACEHOLDER_RUN_SETUP",      // labs_quiz_bottleneck
  quizAiMaturity: "PLACEHOLDER_RUN_SETUP",      // labs_quiz_ai_maturity
  quizUrgency: "PLACEHOLDER_RUN_SETUP",         // labs_quiz_urgency
  quizStrategicFit: "PLACEHOLDER_RUN_SETUP",    // labs_quiz_strategic_fit
};

interface AssessPayload {
  contact: QuizContact;
  answers: QuizAnswer[];
}

// ── GHL API helper ─────────��─────────────────────────────────────
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

// ── GHL: create or update contact from quiz ────────────���─────────
async function upsertGhlContact(
  contact: QuizContact,
  tierLabel: string,
  totalScore: number,
  answers: Record<string, { text: string; tag?: string }>
) {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    throw new Error("GHL_API_KEY and GHL_LOCATION_ID are required");
  }

  const tierSlug = tierLabel.toLowerCase().replace(/\s+/g, "-");
  const tags = ["quiz-lead", `tier-${tierSlug}`];

  // Build custom fields array with quiz data
  const quizFieldEntries: { id: string; field_value: string }[] = [
    { id: CUSTOM_FIELDS.businessName, field_value: contact.companyName || "" },
    { id: CUSTOM_FIELDS.quizScore, field_value: `${totalScore}/25` },
    { id: CUSTOM_FIELDS.quizTier, field_value: tierLabel },
    { id: CUSTOM_FIELDS.quizBottleneck, field_value: answers["bottleneck"]?.text || "" },
    { id: CUSTOM_FIELDS.quizAiMaturity, field_value: answers["ai-maturity"]?.text || "" },
    { id: CUSTOM_FIELDS.quizUrgency, field_value: answers["urgency"]?.text || "" },
    { id: CUSTOM_FIELDS.quizStrategicFit, field_value: answers["strategic-fit"]?.text || "" },
  ];

  // Filter out empty values and placeholder IDs (not yet configured)
  const customFields = quizFieldEntries.filter(
    (f) => f.field_value && f.id && !f.id.startsWith("PLACEHOLDER")
  );

  // Also keep notes as a fallback summary (useful in GHL UI)
  const quizNotes = [
    `AI Assessment Score: ${totalScore}/25 (${tierLabel})`,
    `Revenue: ${answers["revenue"]?.text || "N/A"}`,
    `Bottleneck: ${answers["bottleneck"]?.text || "N/A"}`,
    `AI Maturity: ${answers["ai-maturity"]?.text || "N/A"}`,
    `Urgency: ${answers["urgency"]?.text || "N/A"}`,
    `Strategic Fit: ${answers["strategic-fit"]?.text || "N/A"}`,
  ].join("\n");

  const existingId = await findContactByEmail(contact.email);

  let contactId: string;

  if (existingId) {
    const updateRes = await ghlRequest("PUT", `/contacts/${existingId}`, {
      firstName: contact.firstName,
      lastName: contact.lastName,
      tags,
      source: "cappedoutlabs.com/assess",
      customFields,
    });

    if (!updateRes.ok) {
      console.error("GHL quiz contact update failed:", updateRes.status, updateRes.data);
      throw new Error(`GHL contact update failed (${updateRes.status})`);
    }

    contactId = existingId;

    // Add note with quiz results
    await ghlRequest("POST", `/contacts/${contactId}/notes`, {
      body: quizNotes,
    }).catch((err) => console.error("GHL note creation failed:", err));

    console.log("GHL quiz contact updated:", contactId);
  } else {
    const contactRes = await ghlRequest("POST", "/contacts/", {
      locationId: GHL_LOCATION_ID,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      tags,
      source: "cappedoutlabs.com/assess",
      customFields,
    });

    if (!contactRes.ok) {
      console.error("GHL quiz contact creation failed:", contactRes.status, contactRes.data);
      throw new Error(`GHL contact creation failed (${contactRes.status})`);
    }

    contactId = contactRes.data?.contact?.id;
    if (!contactId) {
      throw new Error("GHL contact created but no ID returned");
    }

    // Add note with quiz results
    await ghlRequest("POST", `/contacts/${contactId}/notes`, {
      body: quizNotes,
    }).catch((err) => console.error("GHL note creation failed:", err));

    console.log("GHL quiz contact created:", contactId);
  }

  // Create opportunity
  const oppRes = await ghlRequest("POST", "/opportunities/", {
    pipelineId: PIPELINE_ID,
    pipelineStageId: APPLIED_STAGE_ID,
    contactId,
    locationId: GHL_LOCATION_ID,
    name: `${contact.firstName} ${contact.lastName} — Quiz (${tierLabel})`,
    status: "open",
    monetaryValue: 0,
  });

  if (!oppRes.ok) {
    console.error("GHL quiz opportunity creation failed:", oppRes.status, oppRes.data);
  } else {
    console.log("GHL quiz opportunity created:", oppRes.data?.opportunity?.id);
  }

  return { contactId, opportunityId: oppRes.data?.opportunity?.id };
}

// ── Send assessment email ───────────��────────────────────────────
async function sendAssessmentEmail(
  contact: QuizContact,
  result: ReturnType<typeof scoreQuiz>
) {
  const fromName = process.env.RESEND_FROM_NAME || "Capped Out Labs";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const bottleneckService = getBottleneckService(result);
  const costOfWaiting = getCostOfWaiting(result);

  const emailProps = {
    firstName: contact.firstName,
    tierLabel: result.tier.label,
    tierColorHex: result.tier.colorHex,
    totalScore: result.total,
    tierSummary: result.tier.summary,
    dimensions: result.dimensions,
    bottleneckService,
    costOfWaiting,
    showCalendarCTA: result.tier.action === "calendar",
  };

  // Generate branded PDF attachment
  const pdfBuffer = await generateAssessmentPDF(emailProps);

  return getResend().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: contact.email,
    subject: `${contact.firstName}, your AI readiness score is ${result.total}/25`,
    react: AssessmentResults(emailProps),
    attachments: [
      {
        filename: `${contact.firstName}-AI-Readiness-Assessment.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}

// ── POST handler ─────────────────────────────────────���───────────
export async function POST(request: Request) {
  let payload: AssessPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { contact, answers } = payload;

  if (!contact?.email || !contact?.firstName || !answers?.length) {
    return NextResponse.json(
      { error: "Contact info and answers are required" },
      { status: 400 }
    );
  }

  // Score the quiz
  const result = scoreQuiz(answers);

  // Build answer map for GHL notes
  const answerTexts: Record<string, { text: string; tag?: string }> = {};
  for (const [qId, answer] of Object.entries(result.answers)) {
    answerTexts[qId] = { text: answer.text, tag: answer.tag };
  }

  // Fire email + GHL in parallel
  const [resendResult, ghlResult] = await Promise.allSettled([
    sendAssessmentEmail(contact, result),
    upsertGhlContact(contact, result.tier.label, result.total, answerTexts),
  ]);

  console.log(
    "Assessment Resend:",
    resendResult.status,
    resendResult.status === "fulfilled" ? resendResult.value?.data?.id : resendResult.reason
  );
  console.log(
    "Assessment GHL:",
    ghlResult.status,
    ghlResult.status === "fulfilled" ? `contact=${ghlResult.value.contactId}` : ghlResult.reason
  );

  if (resendResult.status === "rejected" && ghlResult.status === "rejected") {
    console.error("Both Resend and GHL failed:", {
      resend: resendResult.reason,
      ghl: ghlResult.reason,
    });
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us at hello@cappedoutlabs.com" },
      { status: 500 }
    );
  }

  if (ghlResult.status === "rejected") {
    console.error("GHL API failed for quiz:", ghlResult.reason);
    console.error("FAILED_QUIZ_PAYLOAD:", JSON.stringify(payload));
  }

  if (resendResult.status === "rejected") {
    console.error("Resend email failed for quiz:", resendResult.reason);
  }

  return NextResponse.json({
    success: true,
    tier: result.tier,
    total: result.total,
    dimensions: result.dimensions,
    resend: resendResult.status,
    ghl: ghlResult.status,
  });
}
