import type { Metadata } from "next";
import { ServiceDetailContent } from "./content";

export const metadata: Metadata = {
  title: "AI Revenue Sprint — $15K, 2 Weeks",
  description:
    "AI readiness audit + single highest-leverage workflow built live in 2 weeks. $15,000 flat. 30-day support included. The fastest way to see what AI can do for your business.",
  alternates: { canonical: "/services/ai-revenue-sprint" },
  openGraph: {
    title: "AI Revenue Sprint — $15K, 2 Weeks | Capped Out Labs",
    description:
      "AI readiness audit + highest-leverage workflow built live. $15,000 flat. 30-day support included.",
  },
};

export default function AIRevenueSprintPage() {
  return <ServiceDetailContent />;
}
