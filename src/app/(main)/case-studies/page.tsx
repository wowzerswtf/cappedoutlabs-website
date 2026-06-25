import type { Metadata } from "next";
import { CaseStudiesContent } from "./content";

export const metadata: Metadata = {
  title: "AI Transformation Case Studies — Real Results Across 8 Industries | Capped Out Labs",
  description:
    "Documented before and after numbers from production AI systems Capped Out Labs built for law firms, staffing agencies, real estate teams, and businesses across 8 industries.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "AI Transformation Case Studies — Real Results Across 8 Industries | Capped Out Labs",
    description:
      "Documented before and after numbers from production AI systems Capped Out Labs built for law firms, staffing agencies, real estate teams, and businesses across 8 industries.",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesContent />;
}
