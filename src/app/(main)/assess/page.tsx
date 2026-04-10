import type { Metadata } from "next";
import { AssessContent } from "./content";

export const metadata: Metadata = {
  title: "Free AI Readiness Assessment — Score Your Business in 2 Minutes",
  description:
    "Take our free 5-question AI readiness assessment and get a personalized report with your readiness score, biggest AI opportunity, cost-of-waiting analysis, and 90-day implementation roadmap. Built for operators doing $500K–$50M+.",
  alternates: { canonical: "/assess" },
  keywords: [
    "AI readiness assessment",
    "AI readiness quiz",
    "AI consulting assessment",
    "business AI score",
    "AI maturity assessment",
    "free AI assessment",
    "AI readiness test",
    "AI transformation readiness",
    "AI consulting for businesses",
    "AI infrastructure assessment",
  ],
  openGraph: {
    title: "Free AI Readiness Assessment | Capped Out Labs",
    description:
      "5 questions. 2 minutes. Get your personalized AI readiness score, biggest opportunity, and 90-day roadmap — free.",
    url: "https://cappedoutlabs.com/assess",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Readiness Assessment | Capped Out Labs",
    description:
      "Score your business across 5 AI dimensions. Get a personalized report with your tier, biggest opportunity, and 90-day roadmap.",
  },
};

export default function AssessPage() {
  return <AssessContent />;
}
