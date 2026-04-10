import type { Metadata } from "next";
import { ThankYouContent } from "./content";

export const metadata: Metadata = {
  title: "Application Received",
  description:
    "Your application has been received. We'll review it within 24 hours.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
