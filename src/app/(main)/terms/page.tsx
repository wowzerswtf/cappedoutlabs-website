import type { Metadata } from "next";
import { TermsContent } from "@/components/LegalModal";

export const metadata: Metadata = {
  title: "Terms of Service | Capped Out Labs",
  description:
    "Terms of Service for cappedoutlabs.com and Capped Out Media LLC (dba Capped Out Labs).",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy mb-8">Terms of Service</h1>
      <div className="text-sm text-text-primary leading-relaxed space-y-4">
        <TermsContent />
      </div>
    </section>
  );
}
