import type { Metadata } from "next";
import { VSLBContent } from "./content";

export const metadata: Metadata = {
  title: "Watch: The AI System That Replaced 3 Closers With 1 (8x Output)",
  description:
    "See exactly how operators are deploying AI revenue infrastructure that closes deals, cuts costs 90%, and builds exit value. Limited spots — apply now.",
  robots: { index: false, follow: false },
};

export default function VSLBPage() {
  return <VSLBContent />;
}
