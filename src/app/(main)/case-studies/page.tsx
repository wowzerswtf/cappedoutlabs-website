import type { Metadata } from "next";
import { CaseStudiesContent } from "./content";

export const metadata: Metadata = {
  title: "AI Transformation Case Studies — Real Results Across 8 Industries | Capped Out Labs",
  description:
    "From law firms to staffing agencies to real estate teams — documented before and after results from production AI systems built by Capped Out Labs.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "AI Transformation Case Studies — Real Results Across 8 Industries | Capped Out Labs",
    description:
      "From law firms to staffing agencies to real estate teams — documented before and after results from production AI systems built by Capped Out Labs.",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesContent />;
}
