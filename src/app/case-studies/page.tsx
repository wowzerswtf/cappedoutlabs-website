import type { Metadata } from "next";
import { CaseStudiesContent } from "./content";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "+1,866% revenue. 23.4x ROAS. −90% CAC. Real numbers from production AI systems inside real businesses. Not pilots. Not prototypes.",
  openGraph: {
    title: "Case Studies | Capped Out Labs",
    description:
      "+1,866% revenue. 23.4x ROAS. −90% CAC in 45 days. Production AI systems inside real businesses.",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesContent />;
}
