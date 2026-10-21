import type { Metadata } from "next";
import { OwnFunnelContent } from "./content";

export const metadata: Metadata = {
  title: "Stop Renting Your Software. Own It.",
  description:
    "We use AI to build your own version of the tools you pay for every month, in weeks, for a fraction of what custom software used to cost. Run the numbers, then talk to a builder.",
  robots: { index: false, follow: false },
};

export default function OwnFunnelPage() {
  return <OwnFunnelContent />;
}
