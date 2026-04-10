import type { Metadata } from "next";
import { FunnelAssessContent } from "./content";

export const metadata: Metadata = {
  title: "Free AI Readiness Assessment — Score Your Business in 2 Minutes",
  description:
    "Take our free 5-question AI readiness assessment. Get your personalized score, biggest AI opportunity, and 90-day roadmap delivered instantly. Built for operators doing $500K-$50M+.",
  robots: { index: false, follow: false }, // Don't index funnel — FB traffic only
};

export default function FunnelAssessPage() {
  return <FunnelAssessContent />;
}
