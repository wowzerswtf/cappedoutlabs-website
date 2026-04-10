import type { Metadata } from "next";
import { ContractorOSContent } from "./content";

export const metadata: Metadata = {
  title: "ContractorOS — Full Ops Platform Case Study",
  description:
    "How AI operations infrastructure saved 18+ hours weekly, cut payment cycles from 21 days to 4, and eliminated manual data entry for a contracting business.",
  alternates: { canonical: "/case-studies/contractor-business-automation" },
  openGraph: {
    title: "ContractorOS — Full Ops Platform Case Study | Capped Out Labs",
    description:
      "18+ hours saved weekly. Payment cycle: 21 days → 4. Zero manual data entry. Full breakdown.",
  },
};

export default function ContractorOSPage() {
  return <ContractorOSContent />;
}
