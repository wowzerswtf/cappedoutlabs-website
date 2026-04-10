import type { Metadata } from "next";
import { DigitalAgencyContent } from "./content";

export const metadata: Metadata = {
  title: "End-to-End Operations AI Suite — Digital Creative Agency Case Study",
  description:
    "Margins went from 18% to 41% while reporting hours dropped from 25 to 3 per month. Discovery call to proposal sent: 9 days to under 24 hours.",
  alternates: { canonical: "/case-studies/digital-agency-ai-suite" },
  openGraph: {
    title: "End-to-End Operations AI Suite — Agency Case Study | Capped Out Labs",
    description:
      "Margins: 18% → 41%. Reporting hours: 25 → 3/month. Proposal turnaround: 9 days → under 24 hrs.",
  },
};

export default function DigitalAgencyPage() {
  return <DigitalAgencyContent />;
}
