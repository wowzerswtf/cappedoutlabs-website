import type { Metadata } from "next";
import { RealEstateContent } from "./content";

export const metadata: Metadata = {
  title: "Closer OS Real Estate Edition — Real Estate Team Case Study",
  description:
    "Revenue per agent up 157% in 9 months. Contact-to-appointment rate jumped from 14% to 53%. Appointment-to-offer rate: 28% to 64%.",
  alternates: { canonical: "/case-studies/real-estate-closer-os" },
  openGraph: {
    title: "Closer OS Real Estate Edition — Case Study | Capped Out Labs",
    description:
      "Revenue per agent: +157%. Contact to appointment: 14% → 53%. Appointment to offer: 28% → 64%.",
  },
};

export default function RealEstatePage() {
  return <RealEstateContent />;
}
