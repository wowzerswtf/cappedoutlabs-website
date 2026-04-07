import type { Metadata } from "next";
import { ServiceDetailContent } from "./content";

export const metadata: Metadata = {
  title: "Full AI Transformation — $200K–$500K+, 3–6 Months",
  description:
    "Full infrastructure rebuild with AI agents across all departments. Governance framework, executive dashboards, and complete documentation for due diligence.",
  alternates: { canonical: "/services/full-ai-transformation" },
  openGraph: {
    title: "Full AI Transformation — $200K–$500K+, 3–6 Months | Capped Out Labs",
    description:
      "Full infrastructure rebuild with AI agents across all departments. Governance framework, executive dashboards, and documentation for due diligence.",
  },
};

export default function FullAITransformationPage() {
  return <ServiceDetailContent />;
}
