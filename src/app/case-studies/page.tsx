import type { Metadata } from "next";
import { CaseStudiesContent } from "./content";

export const metadata: Metadata = {
  title: "AI Consulting Case Studies | +1,866% Revenue Growth",
  description:
    "+1,866% revenue. 23.4x ROAS. −90% CAC. Real numbers from production AI systems inside real businesses. Not pilots. Not prototypes.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "AI Consulting Case Studies | +1,866% Revenue Growth | Capped Out Labs",
    description:
      "+1,866% revenue. 23.4x ROAS. −90% CAC in 45 days. Production AI systems inside real businesses.",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesContent />;
}
