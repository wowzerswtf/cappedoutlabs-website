import type { Metadata } from "next";
import { ApplyContent } from "./content";

export const metadata: Metadata = {
  title: "Apply for a Discovery Call",
  description:
    "Apply for a discovery call with Capped Out Labs. It takes 4 minutes, the questions are real, and we respond within 24 hours.",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "Apply for a Discovery Call | Capped Out Labs",
    description:
      "It takes 4 minutes, the questions are real, and we respond within 24 hours.",
  },
};

export default function ApplyPage() {
  return <ApplyContent />;
}
