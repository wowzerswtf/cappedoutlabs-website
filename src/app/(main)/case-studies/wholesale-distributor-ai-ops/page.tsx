import type { Metadata } from "next";
import { WholesaleContent } from "./content";

export const metadata: Metadata = {
  title: "Intelligent Order & Relationship Manager — Wholesale Distributor Case Study",
  description:
    "Revenue climbed 41% from reorders alone while customer service headcount went from 4 to 1. Order processing time dropped from 52 minutes to 7.",
  alternates: { canonical: "/case-studies/wholesale-distributor-ai-ops" },
  openGraph: {
    title: "Intelligent Order & Relationship Manager — Wholesale Case Study | Capped Out Labs",
    description:
      "Revenue up 41% from reorders. Order processing: 52 min → 7 min. CS headcount: 4 → 1. Reorder rate: 22% → 51%.",
  },
};

export default function WholesalePage() {
  return <WholesaleContent />;
}
