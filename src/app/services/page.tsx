import type { Metadata } from "next";
import { ServicesContent } from "./content";

export const metadata: Metadata = {
  title: "AI Consulting Services & Pricing",
  description:
    "Four AI consulting tiers from $15K sprints to $500K+ full transformations. Transparent pricing. Production systems, not strategy decks. Apply for a discovery call.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "AI Consulting Services & Pricing | Capped Out Labs",
    description:
      "Four AI consulting tiers from $15K sprints to $500K+ full transformations. Transparent pricing. Production systems, not strategy decks.",
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
