"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VSLSurvey } from "@/components/VSLSurvey";
import { ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react";

// Rebuild of the ad landing page the media team ran on cappedoutlab.com,
// brought onto our own domain and stack. Same sections and copy; the inline
// 3-step form (which never posted anywhere) is replaced by the proven vsl-b
// intake: VSLSurvey qualifies the lead, posts to /api/apply, and pops the
// GHL calendar for qualified applicants.

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const STATS = [
  { stat: "$2B+", label: "Revenue scaled" },
  { stat: "200+", label: "Systems launched" },
  { stat: "30+", label: "Verticals" },
  { stat: "47 days", label: "Average first system" },
];

const SERVICES = [
  {
    number: "01",
    title: "Revenue workflow automation",
    body: "Lead handling, follow-up, qualification, sales support, and reporting built around one measurable outcome.",
  },
  {
    number: "02",
    title: "Internal AI systems",
    body: "Secure tools that give your team faster access to company knowledge, decisions, and repeatable execution.",
  },
  {
    number: "03",
    title: "Managed implementation",
    body: "Production deployment, staff training, documentation, and a handoff that does not depend on us forever.",
  },
];

export function ApplyNowContent() {
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setStickyVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSurvey = () => setSurveyOpen(true);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative mesh-gradient bg-white px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 dot-pattern" aria-hidden="true" />
        <div className="relative w-full max-w-[840px] mx-auto pt-16 sm:pt-24 pb-14 sm:pb-20 text-center">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-xs sm:text-sm font-semibold text-electric uppercase tracking-widest mb-4"
          >
            From the team behind Capped Out Media
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-[3.25rem] md:leading-[1.1] font-bold text-navy mb-5"
          >
            We build AI into how your company runs.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Practical revenue systems that remove repetitive work, sharpen
            decisions, and keep getting more valuable as your company grows.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={openSurvey}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-wide text-white bg-navy hover:bg-[#142d49] border-2 border-electric rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Apply for a discovery call
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#approach"
              className="text-sm font-semibold text-navy hover:text-electric transition-colors"
            >
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </motion.div>

          <div className="flex items-center justify-center gap-5 text-xs text-text-secondary/70 mt-5">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> No obligation
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 2-min application
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Free discovery call
            </span>
          </div>
        </div>
      </section>

      {/* ═══ PROOF BAND ═══ */}
      <section
        className="bg-surface border-y border-border/50 py-8 px-4"
        aria-label="Company results"
      >
        <div className="max-w-[840px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((item) => (
            <div key={item.label}>
              <p className="text-2xl sm:text-3xl font-bold text-navy font-mono">
                {item.stat}
              </p>
              <p className="text-xs text-text-secondary mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ THE OPERATING GAP ═══ */}
      <section id="approach" className="bg-white py-14 sm:py-20 px-4 scroll-mt-14">
        <div className="max-w-[840px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div>
            <p className="text-xs font-semibold text-electric uppercase tracking-widest mb-3">
              The operating gap
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
              AI should change the work, not add another tool.
            </h2>
          </div>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Most AI projects stop at a deck, a prototype, or a login nobody
              remembers. We start with the revenue constraint and build the
              working system around it.
            </p>
            <p>
              The result is infrastructure your team can actually operate:
              documented, measured, and integrated into the way the business
              already moves.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ WHAT GETS BUILT ═══ */}
      <section className="bg-surface py-14 sm:py-20 px-4 border-y border-border/50">
        <div className="max-w-[840px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-electric uppercase tracking-widest mb-3">
              What gets built
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              Revenue infrastructure, not experiments.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <article
                key={s.number}
                className="rounded-xl border border-border bg-white p-6"
              >
                <span className="text-xs font-bold text-electric font-mono">
                  {s.number}
                </span>
                <h3 className="text-base font-bold text-navy mt-2 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APPLY ═══ */}
      <section className="bg-navy py-14 sm:py-20 px-4">
        <div className="max-w-[640px] mx-auto text-center">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest mb-3">
            Discovery call
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Tell us where the business is capped out.
          </h2>
          <p className="text-blue-200 mb-6 leading-relaxed">
            We review every application. If there is a strong fit, you can book
            a 30-minute discovery call the moment you finish.
          </p>

          <ul className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-blue-200 mb-8">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" /> No pitch deck
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" /> No obligation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" /> Limited
              engagements per quarter
            </li>
          </ul>

          <button
            onClick={openSurvey}
            className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-base sm:text-lg font-bold uppercase tracking-wide text-navy bg-white hover:bg-gray-50 border-2 border-amber-300 rounded-lg shadow-2xl transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Start your application
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ═══ AD COMPLIANCE DISCLAIMER ═══ */}
      <section className="bg-white py-6 px-4">
        <div className="max-w-[840px] mx-auto text-center space-y-3">
          <p className="text-xs text-gray-400">
            This site is not a part of the Facebook&trade; website or
            Facebook&trade; Inc. Additionally, this site is NOT endorsed by
            Facebook&trade; in any way. FACEBOOK&trade; is a trademark of
            FACEBOOK&trade;, Inc.
          </p>
          <p className="text-xs text-gray-400">
            Results vary. The figures stated on this page are specific client
            results and are not guaranteed. Your results will depend on many
            factors including your business, experience, and effort.
          </p>
        </div>
      </section>

      {/* ═══ STICKY MOBILE CTA ═══ */}
      <AnimatePresence>
        {stickyVisible && !surveyOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border shadow-2xl p-3 sm:p-4"
          >
            <div className="max-w-[600px] mx-auto flex items-center gap-3">
              <div className="hidden sm:block flex-1">
                <p className="text-sm font-bold text-navy">
                  Apply for a discovery call
                </p>
                <p className="text-xs text-text-secondary">
                  Free 30-minute call. No obligation.
                </p>
              </div>
              <button
                onClick={openSurvey}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white bg-navy hover:bg-[#142d49] border-2 border-electric rounded-lg shadow-lg transition-all"
              >
                Apply now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Survey Modal — vsl-b intake + calendar ═══ */}
      <VSLSurvey
        open={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        source="apply-now"
        referralSource="Apply Now Page"
      />
    </>
  );
}
