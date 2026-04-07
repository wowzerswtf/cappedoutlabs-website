import type { Metadata } from "next";
import { ServiceDetailContent } from "./content";

export const metadata: Metadata = {
  title: "Equity & Rev-Share — No Upfront Cost",
  description:
    "Same AI infrastructure deliverables with no upfront cost. 3–10% equity or 10–20% revenue share. We evaluate the business before engaging.",
  alternates: { canonical: "/services/equity-rev-share" },
  openGraph: {
    title: "Equity & Rev-Share — No Upfront Cost | Capped Out Labs",
    description:
      "Same AI infrastructure deliverables with no upfront cost. 3–10% equity or 10–20% revenue share.",
  },
};

export default function EquityRevSharePage() {
  return <ServiceDetailContent />;
}
