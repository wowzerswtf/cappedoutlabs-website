/**
 * Test script: sends a confirmation email via Resend with mock data.
 * Usage: npx tsx scripts/test-email.ts
 *
 * Requires RESEND_API_KEY and RESEND_TEST_EMAIL in .env.local
 */

import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local manually (no dotenv dep)
function loadEnv() {
  const envPath = join(__dirname, "..", ".env.local");
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    console.error("No .env.local found — set RESEND_API_KEY and RESEND_TEST_EMAIL as env vars");
  }
}

loadEnv();

async function main() {
  const { Resend } = await import("resend");
  const { ApplicationConfirmation } = await import(
    "../src/emails/ApplicationConfirmation"
  );

  const apiKey = process.env.RESEND_API_KEY;
  const testEmail = process.env.RESEND_TEST_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME || "Capped Out Labs";

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    process.exit(1);
  }
  if (!testEmail) {
    console.error("RESEND_TEST_EMAIL is not set — add it to .env.local");
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  console.log(`Sending test email to ${testEmail}...`);

  const { data, error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: testEmail,
    subject: "We got your application, Test",
    react: ApplicationConfirmation({
      firstName: "Test",
      lastName: "Applicant",
      businessName: "Acme Corp",
      tierInterest: "AI Revenue Infrastructure $50K-$150K",
      annualRevenue: "$3M–$10M",
    }),
  });

  if (error) {
    console.error("Failed:", error);
    process.exit(1);
  }

  console.log("Sent! Email ID:", data?.id);
}

main();
