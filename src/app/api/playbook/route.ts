import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PlaybookDelivery } from "@/emails/PlaybookDelivery";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_BASE = "https://services.leadconnectorhq.com";

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

// ── GHL: create or update contact with playbook-lead tag ─────────
async function upsertGhlContact(email: string) {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    throw new Error("GHL_API_KEY and GHL_LOCATION_ID are required");
  }

  const existingId = await findContactByEmail(email);

  if (existingId) {
    // Add playbook-lead tag to existing contact
    const updateRes = await ghlRequest("PUT", `/contacts/${existingId}`, {
      tags: ["playbook-lead"],
      source: "cappedoutlabs.com/playbook",
    });

    if (!updateRes.ok) {
      console.error("GHL contact update failed:", updateRes.status, updateRes.data);
      throw new Error(`GHL contact update failed (${updateRes.status})`);
    }

    console.log("GHL contact updated with playbook-lead tag:", existingId);
    return existingId;
  }

  // Create new contact
  const contactRes = await ghlRequest("POST", "/contacts/", {
    locationId: GHL_LOCATION_ID,
    email,
    tags: ["playbook-lead"],
    source: "cappedoutlabs.com/playbook",
  });

  if (!contactRes.ok) {
    console.error("GHL contact creation failed:", contactRes.status, contactRes.data);
    throw new Error(`GHL contact creation failed (${contactRes.status})`);
  }

  const contactId = contactRes.data?.contact?.id;
  console.log("GHL contact created with playbook-lead tag:", contactId);
  return contactId;
}

// ── Resend playbook email ────────────────────────────────────────
async function sendPlaybookEmail(email: string) {
  const fromName = process.env.RESEND_FROM_NAME || "Capped Out Labs";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  return getResend().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: "Your AI Revenue Infrastructure Playbook",
    react: PlaybookDelivery({ email }),
  });
}

// ── POST handler ─────────────────────────────────────────────────
export async function POST(request: Request) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // Fire both simultaneously
  const [resendResult, ghlResult] = await Promise.allSettled([
    sendPlaybookEmail(email),
    upsertGhlContact(email),
  ]);

  console.log(
    "Playbook Resend:",
    resendResult.status,
    resendResult.status === "fulfilled"
      ? resendResult.value?.data?.id
      : resendResult.reason
  );
  console.log(
    "Playbook GHL:",
    ghlResult.status,
    ghlResult.status === "fulfilled"
      ? ghlResult.value
      : ghlResult.reason
  );

  if (
    resendResult.status === "rejected" &&
    ghlResult.status === "rejected"
  ) {
    console.error("Both Resend and GHL failed for playbook:", {
      resend: resendResult.reason,
      ghl: ghlResult.reason,
    });
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  if (resendResult.status === "rejected") {
    console.error("Playbook Resend failed:", resendResult.reason);
  }
  if (ghlResult.status === "rejected") {
    console.error("Playbook GHL failed:", ghlResult.reason);
  }

  return NextResponse.json({ success: true });
}
