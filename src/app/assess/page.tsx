import type { Metadata } from "next";
import { AssessContent } from "./content";

export const metadata: Metadata = {
  title: "Free AI Readiness Assessment",
  description:
    "Find out where your business stands on AI in under 2 minutes. Get a personalized assessment with your readiness score, biggest opportunity, and 90-day roadmap.",
  alternates: { canonical: "/assess" },
  openGraph: {
    title: "Free AI Readiness Assessment | Capped Out Labs",
    description:
      "5 questions. 2 minutes. Personalized AI assessment for your business.",
  },
};

export default function AssessPage() {
  return <AssessContent />;
}
