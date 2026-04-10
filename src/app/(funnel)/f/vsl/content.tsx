"use client";

import { useState } from "react";
import { VSLSurvey } from "@/components/VSLSurvey";

export function VSLFunnelContent() {
  const [surveyOpen, setSurveyOpen] = useState(false);

  return (
    <>
      {/* ═══ HERO — VSL + Headline + Single CTA ═══ */}
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center bg-white px-4 sm:px-6">
        <div className="w-full max-w-[800px] mx-auto py-8 sm:py-12">
          {/* Headline — above the video
              Split test variants (swap into h1 to test):
              A: "AI consultants sell decks. We deploy machines that print revenue."  ← ACTIVE
              B: "One operator. 45 days. 1,866% revenue growth. Here's how."
              C: "We'll deploy AI into your business that pays for itself in 45 days."
              D: "Your competitors are using AI to cut acquisition costs 90%. You're not."
              E: "How one brand cut customer acquisition costs 90% without firing anyone."
              F: "Stop hiring. Start automating. Watch what happens."
              G: "You don't have a sales problem. You have a systems problem."
              H: "We build the AI sales machine. You collect the revenue."
              I: "From 26% show rate to 78% — the AI system behind it."
              J: "Still hiring to scale? There's a faster way."
              K: "What if your sales team never missed a follow-up again?"
          */}
          <h1 className="text-center text-2xl sm:text-3xl md:text-[2.5rem] md:leading-[1.15] font-bold text-navy mb-6 sm:mb-8">
            AI consultants sell decks.
            <br />
            We deploy machines that print revenue.
          </h1>
          <p className="text-center text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            We&apos;ll install AI revenue infrastructure into your business that
            closes deals, cuts acquisition costs, and builds enterprise value
            — so you can scale or exit on your terms.
          </p>

          {/* VSL Video — centered, prominent */}
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-8 sm:mb-10">
            {/*
              Replace this div with actual video embed once VSL is ready.
              Vimeo: <iframe src="https://player.vimeo.com/video/VIDEO_ID?autoplay=1&muted=1" .../>
              Or self-hosted <video> tag.
            */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy to-navy/90">
              <div className="text-center text-white/80 space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 ml-1"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-sm font-medium tracking-wide uppercase">
                  VSL Video Placeholder
                </p>
              </div>
            </div>
          </div>

          {/* Single CTA — the only action on the page */}
          <div className="text-center">
            <button
              onClick={() => setSurveyOpen(true)}
              className="inline-flex items-center justify-center px-10 py-4 sm:py-5 text-base sm:text-lg font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Schedule Call Here
            </button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER — Copyright + Legal ═══ */}
      <footer className="bg-white border-t border-gray-100 py-6 px-4">
        <div className="max-w-[800px] mx-auto text-center space-y-3">
          <p className="text-xs text-gray-400">
            Copyright {new Date().getFullYear()}, Capped Out Labs, LLC. All
            rights reserved. This site is not a part of the Facebook&trade;
            website or Facebook&trade; Inc. Additionally, this site is NOT
            endorsed by Facebook&trade; in any way. FACEBOOK&trade; is a
            trademark of FACEBOOK&trade;, Inc.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById("terms-modal");
                if (el) el.classList.remove("hidden");
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("disclaimer-modal");
                if (el) el.classList.remove("hidden");
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Disclaimer
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("privacy-modal");
                if (el) el.classList.remove("hidden");
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>

      {/* ═══ Legal Modals ═══ */}
      <LegalModal id="terms-modal" title="Terms of Service">
        <p>
          By accessing this website or applying for services, you agree to be
          bound by these Terms of Service. Capped Out Labs, LLC provides AI
          transformation consulting services. Results described in case studies
          and marketing materials are specific to those clients and are not
          guaranteed. All engagements are governed by individual service
          agreements executed between parties.
        </p>
      </LegalModal>

      <LegalModal id="disclaimer-modal" title="Disclaimer">
        <p>
          This site is not a part of the Facebook&trade; website or
          Facebook&trade; Inc. Additionally, this site is NOT endorsed by
          Facebook&trade; in any way. FACEBOOK&trade; is a trademark of
          FACEBOOK&trade;, Inc.
        </p>
        <p className="mt-3">
          Results vary. The figures stated on this page and in our case studies
          are our personal results and the results of specific clients. We are
          not implying that you will duplicate them. Your results will vary and
          depend on many factors including but not limited to your background,
          experience, and work ethic. All business entails risk as well as
          sustained effort and action.
        </p>
      </LegalModal>

      <LegalModal id="privacy-modal" title="Privacy Policy">
        <p>
          Capped Out Labs, LLC respects your privacy. Information collected
          through this application is used solely for the purpose of evaluating
          your business for a potential engagement. We do not sell, rent, or
          share your personal information with third parties. Data is stored
          securely and retained only as long as necessary to fulfill the stated
          purpose.
        </p>
      </LegalModal>

      {/* ═══ Survey Modal ═══ */}
      <VSLSurvey open={surveyOpen} onClose={() => setSurveyOpen(false)} />
    </>
  );
}

// ── Simple Legal Modal ────────────────────────────────────────────
function LegalModal({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.classList.add("hidden");
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-navy">{title}</h3>
          <button
            onClick={(e) => {
              const modal = (e.currentTarget as HTMLElement).closest(`#${id}`);
              if (modal) modal.classList.add("hidden");
            }}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="text-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
