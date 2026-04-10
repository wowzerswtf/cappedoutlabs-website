"use client";

import { useState } from "react";
import Link from "next/link";
import { LegalModal, PrivacyContent, TermsContent } from "@/components/LegalModal";

export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      {/* Minimal header — logo only, no nav links */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border/50">
        <div className="mx-auto max-w-5xl px-6 flex h-14 items-center justify-center">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-navy"
          >
            Capped Out Labs
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-14">{children}</main>

      {/* Minimal footer — legal links only */}
      <footer className="border-t border-border/50 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-secondary/50">
            &copy; {new Date().getFullYear()} Capped Out Labs, LLC
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-xs text-text-secondary/50 hover:text-text-secondary transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTermsOpen(true)}
              className="text-xs text-text-secondary/50 hover:text-text-secondary transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      <LegalModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyContent />
      </LegalModal>

      <LegalModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms of Service"
      >
        <TermsContent />
      </LegalModal>
    </>
  );
}
