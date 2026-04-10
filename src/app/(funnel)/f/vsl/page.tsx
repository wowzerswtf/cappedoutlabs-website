import type { Metadata } from "next";
import { VSLFunnelContent } from "./content";

export const metadata: Metadata = {
  title: "Watch: How Operators Are Using AI to 10x Revenue Without Hiring",
  description:
    "See how one operator grew revenue 1,866% in 45 days using AI sales infrastructure. Watch the free training and apply if you qualify.",
  robots: { index: false, follow: false },
};

export default function VSLFunnelPage() {
  return <VSLFunnelContent />;
}
