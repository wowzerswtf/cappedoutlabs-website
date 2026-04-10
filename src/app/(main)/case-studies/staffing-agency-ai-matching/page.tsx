import type { Metadata } from "next";
import { StaffingAgencyContent } from "./content";

export const metadata: Metadata = {
  title: "AI Smart Matching & Outreach Engine — Regional Staffing Agency Case Study",
  description:
    "How an AI matching engine took revenue per recruiter from $180K to $520K annually. Placements per recruiter jumped from 5 to 14 per month.",
  alternates: { canonical: "/case-studies/staffing-agency-ai-matching" },
  openGraph: {
    title: "AI Smart Matching Engine — Staffing Agency Case Study | Capped Out Labs",
    description:
      "Revenue per recruiter: $180K → $520K. Placements per month: 5 → 14. Intake to submission: 4 days → 18 hours.",
  },
};

export default function StaffingAgencyPage() {
  return <StaffingAgencyContent />;
}
