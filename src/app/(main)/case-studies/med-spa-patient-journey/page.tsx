import type { Metadata } from "next";
import { MedSpaContent } from "./content";

export const metadata: Metadata = {
  title: "Autonomous Patient Journey Platform — Multi-location Med Spa Case Study",
  description:
    "Monthly revenue up 62% while no-show rate dropped from 25% to 3.8%. Rebooking rate jumped from 31% to 78%.",
  alternates: { canonical: "/case-studies/med-spa-patient-journey" },
  openGraph: {
    title: "Autonomous Patient Journey Platform — Med Spa Case Study | Capped Out Labs",
    description:
      "Revenue up 62%. No-show rate: 25% → 3.8%. Rebooking rate: 31% → 78%. Revenue per consultation: $1,400 → $3,100.",
  },
};

export default function MedSpaPage() {
  return <MedSpaContent />;
}
