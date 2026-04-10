import type { Metadata } from "next";
import { FunnelResultsContent } from "./content";

export const metadata: Metadata = {
  title: "Your AI Readiness Results",
  description:
    "Your personalized AI readiness assessment results from Capped Out Labs.",
  robots: { index: false, follow: false },
};

export default function FunnelResultsPage() {
  return <FunnelResultsContent />;
}
