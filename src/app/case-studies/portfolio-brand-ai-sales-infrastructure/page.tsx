import type { Metadata } from "next";
import { CloserOSContent } from "./content";

export const metadata: Metadata = {
  title: "Closer OS — AI Sales Infrastructure Case Study | +1,866% Revenue",
  description:
    "How AI sales infrastructure grew a portfolio brand from $200K to $3.9M in 45 days. CAC dropped 90%. ROAS hit 23.4x. Full breakdown with methodology.",
  alternates: { canonical: "/case-studies/portfolio-brand-ai-sales-infrastructure" },
  openGraph: {
    title: "Closer OS — AI Sales Infrastructure Case Study | Capped Out Labs",
    description:
      "Revenue: $200K → $3.9M (+1,866%). CAC: -90%. ROAS: 23.4x. 45 days of live data from a production deployment.",
  },
};

export default function CloserOSPage() {
  return <CloserOSContent />;
}
