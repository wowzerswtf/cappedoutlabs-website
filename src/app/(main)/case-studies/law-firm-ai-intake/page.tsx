import type { Metadata } from "next";
import { LawFirmContent } from "./content";

export const metadata: Metadata = {
  title: "AI Intake & Client Lifecycle System — Mid-size Law Firm Case Study",
  description:
    "How an AI intake system generated $420,000 in additional billable revenue in the first 90 days. Lead response time dropped from 36-48 hours to under 90 minutes.",
  alternates: { canonical: "/case-studies/law-firm-ai-intake" },
  openGraph: {
    title: "AI Intake & Client Lifecycle System — Law Firm Case Study | Capped Out Labs",
    description:
      "$420K in additional billable revenue in 90 days. Lead response time: 36-48 hrs → under 90 min. Proposal close rate: 19% → 67%.",
  },
};

export default function LawFirmPage() {
  return <LawFirmContent />;
}
