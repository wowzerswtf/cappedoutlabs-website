import type { Metadata } from "next";
import { ApplyNowContent } from "./content";

export const metadata: Metadata = {
  title: "We Build AI Into How Your Company Runs",
  description:
    "Practical revenue systems that remove repetitive work, sharpen decisions, and keep getting more valuable as your company grows. Apply for a discovery call.",
  robots: { index: false, follow: false },
};

export default function ApplyNowPage() {
  return <ApplyNowContent />;
}
