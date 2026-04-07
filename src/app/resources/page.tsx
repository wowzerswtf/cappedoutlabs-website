import type { Metadata } from "next";
import { ResourcesIndexContent } from "./index-content";

export const metadata: Metadata = {
  title: "AI Automation Guides & Insights",
  description:
    "Guides and case study breakdowns on AI sales infrastructure, reducing CAC, improving show rates, and systematizing sales teams. Real data from production deployments.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "AI Automation Guides & Insights | Capped Out Labs",
    description:
      "Guides and case study breakdowns on AI sales infrastructure, reducing CAC, improving show rates, and more.",
  },
};

export default function ResourcesPage() {
  return <ResourcesIndexContent />;
}
