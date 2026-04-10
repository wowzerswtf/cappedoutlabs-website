import type { Metadata } from "next";
import { AboutContent } from "./content";

export const metadata: Metadata = {
  title: "About Capped Out Labs | AI Revenue Infrastructure for Operators",
  description:
    "Founded by the operators behind Capped Out Media. We build production AI systems tied to revenue metrics and exit valuations. $2B+ revenue scaled.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Capped Out Labs | AI Revenue Infrastructure for Operators",
    description:
      "Founded by the operators behind Capped Out Media. We build production AI systems tied to revenue metrics and exit valuations.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
