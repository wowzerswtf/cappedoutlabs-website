import type { Metadata } from "next";
import { PrivacyContent } from "@/components/LegalModal";

export const metadata: Metadata = {
  title: "Privacy Policy | Capped Out Labs",
  description:
    "Privacy Policy for cappedoutlabs.com and Capped Out Media LLC (dba Capped Out Labs): what we collect, how we use it, and your rights.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy mb-8">Privacy Policy</h1>
      <div className="text-sm text-text-primary leading-relaxed space-y-4">
        <PrivacyContent />
      </div>
    </section>
  );
}
