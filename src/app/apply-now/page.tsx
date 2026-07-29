import type { Metadata } from "next";
import { ApplyNowContent } from "./content";

export const metadata: Metadata = {
  title: { absolute: "Capped Out Labs | AI Revenue Infrastructure" },
  description:
    "Capped Out Labs builds practical AI revenue infrastructure for established operators.",
  robots: { index: false, follow: false },
};

export default function ApplyNowPage() {
  return <ApplyNowContent />;
}
