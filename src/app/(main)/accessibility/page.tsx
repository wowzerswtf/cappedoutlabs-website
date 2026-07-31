import type { Metadata } from "next";
import { AccessibilityContent } from "@/components/LegalModal";

export const metadata: Metadata = {
  title: "Accessibility Statement | Capped Out Labs",
  description:
    "How cappedoutlabs.com supports WCAG 2.1 AA accessibility, what we test for, known limitations, and how to report a barrier.",
  alternates: { canonical: "/accessibility" },
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy mb-8">
        Accessibility Statement
      </h1>
      <div className="text-sm text-text-primary leading-relaxed space-y-4">
        <AccessibilityContent />
      </div>
    </section>
  );
}
