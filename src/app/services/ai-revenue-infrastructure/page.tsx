import type { Metadata } from "next";
import { ServiceDetailContent } from "./content";

export const metadata: Metadata = {
  title: "AI Revenue Infrastructure — $50K–$150K, 6–10 Weeks",
  description:
    "3–5 core workflows rebuilt with AI across departments. Staff training, recorded SOPs, and 90-day managed handoff. $50K–$150K.",
  alternates: { canonical: "/services/ai-revenue-infrastructure" },
  openGraph: {
    title: "AI Revenue Infrastructure — $50K–$150K, 6–10 Weeks | Capped Out Labs",
    description:
      "3–5 core workflows rebuilt with AI across departments. Staff training, recorded SOPs, and 90-day managed handoff.",
  },
};

export default function AIRevenueInfrastructurePage() {
  return <ServiceDetailContent />;
}
