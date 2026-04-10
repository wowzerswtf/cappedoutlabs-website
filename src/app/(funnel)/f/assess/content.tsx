"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { FunnelQuiz } from "@/components/FunnelQuiz";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  CheckCircle2,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";

// ── Social proof data ─────────────────────────────────────────────
const proofPoints = [
  {
    stat: "+1,866%",
    label: "Revenue growth",
    detail: "for one client in 45 days",
  },
  {
    stat: "77.9%",
    label: "Show rate",
    detail: "up from 26.3%",
  },
  {
    stat: "90%",
    label: "CAC reduction",
    detail: "acquisition cost drop",
  },
];

const credibilityLogos = [
  "From the team that has pushed over a billion in sales",
  "AI systems live in production businesses today",
  "Limited to 3 new clients per month",
];

const whatYouGet = [
  {
    icon: BarChart3,
    title: "AI Readiness Score",
    desc: "Scored across 5 dimensions — see exactly where you stand",
  },
  {
    icon: TrendingUp,
    title: "Biggest AI Opportunity",
    desc: "Matched to a real case study from your industry",
  },
  {
    icon: Zap,
    title: "Cost-of-Waiting Analysis",
    desc: "See what each month without AI costs your business",
  },
  {
    icon: Users,
    title: "90-Day Roadmap",
    desc: "Personalized implementation plan based on your score",
  },
];

// ── Sticky Mobile CTA ─────────────────────────────────────────────
function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-lg border-t border-border/50 px-4 py-3 safe-area-bottom">
      <a
        href="#quiz"
        className="flex items-center justify-center gap-2 w-full bg-electric hover:bg-electric-dark text-white rounded-xl h-12 text-sm font-semibold shadow-lg shadow-electric/20 transition-colors"
      >
        Start Free Assessment
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

// ── Main Funnel Content ───────────────────────────────────────────
export function FunnelAssessContent() {
  return (
    <>
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-4xl px-6 lg:px-8 pt-12 pb-8 lg:pt-16 lg:pb-12 text-center"
        >
          {/* Urgency badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-sm font-semibold text-amber-700 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            3 spots left this month
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight"
          >
            Is your business ready
            <br className="hidden sm:block" />
            <span className="gradient-text">to transform with AI?</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto"
          >
            5 questions. 30 seconds. Get your personalized AI readiness score,
            biggest opportunity, and a 90-day implementation roadmap — free.
          </motion.p>

          {/* Proof strip — social proof above the fold */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap justify-center gap-6 lg:gap-10"
          >
            {proofPoints.map((p) => (
              <div key={p.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-navy font-mono">
                  {p.stat}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {p.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ QUIZ + SIDEBAR SECTION ═══ */}
      <section id="quiz" className="bg-surface scroll-mt-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Quiz — takes 3/5 on desktop */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-white p-6 lg:p-8 shadow-sm">
                <Suspense fallback={null}>
                  <FunnelQuiz />
                </Suspense>
              </div>
            </div>

            {/* Sidebar — takes 2/5 on desktop */}
            <div className="lg:col-span-2 hidden lg:block">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="sticky top-24 space-y-6"
              >
                {/* What you get */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-white p-6"
                >
                  <h3 className="text-base font-bold text-navy mb-4">
                    Your report includes
                  </h3>
                  <ul className="space-y-4">
                    {whatYouGet.map((item) => (
                      <li
                        key={item.title}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-electric" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy">
                            {item.title}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Credibility */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-white p-6"
                >
                  <ul className="space-y-3">
                    {credibilityLogos.map((text) => (
                      <li
                        key={text}
                        className="flex items-start gap-2.5 text-sm text-text-secondary"
                      >
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Testimonial — social proof at friction point */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-electric/20 bg-electric/5 p-6"
                >
                  <p className="text-sm text-navy italic leading-relaxed">
                    &ldquo;We went from 3 closers to 1 AI-augmented rep and our
                    close rate jumped from 18% to 34%. The assessment nailed
                    exactly where to start.&rdquo;
                  </p>
                  <p className="text-xs text-text-secondary mt-3 font-semibold">
                    — Supplement brand operator, $3M ARR
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Mobile-only: proof below quiz */}
          <div className="lg:hidden mt-8 space-y-4">
            <div className="rounded-2xl border border-border bg-white p-5">
              <ul className="space-y-3">
                {credibilityLogos.map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-2.5 text-sm text-text-secondary"
                  >
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-electric/20 bg-electric/5 p-5">
              <p className="text-sm text-navy italic leading-relaxed">
                &ldquo;We went from 3 closers to 1 AI-augmented rep and our
                close rate jumped from 18% to 34%.&rdquo;
              </p>
              <p className="text-xs text-text-secondary mt-2 font-semibold">
                — Supplement brand, $3M ARR
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — reduces uncertainty ═══ */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12 lg:py-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-navy text-center mb-10"
          >
            How it works
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                title: "Answer 5 questions",
                desc: "Multiple choice. No typing. 30 seconds.",
              },
              {
                num: "2",
                title: "Get your score instantly",
                desc: "AI readiness tier + dimension breakdown on screen.",
              },
              {
                num: "3",
                title: "Receive your full report",
                desc: "Personalized PDF with roadmap delivered to your inbox.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-border bg-surface/50"
              >
                <div className="w-10 h-10 rounded-full bg-electric text-white flex items-center justify-center font-bold text-lg mx-auto">
                  {step.num}
                </div>
                <h3 className="mt-4 font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON — you vs. waiting (conversion bible: comparison charts) ═══ */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-12 lg:py-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-navy text-center mb-8"
          >
            The cost of waiting
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-white overflow-hidden"
          >
            <div className="grid grid-cols-2">
              <div className="p-6 border-r border-border">
                <p className="text-xs font-semibold text-success uppercase tracking-wide mb-4">
                  With AI infrastructure
                </p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Sales team does 2x with same headcount",
                    "Operations run without you",
                    "Data-driven decisions in real time",
                    "Business valued higher at exit",
                    "Compounding efficiency gains",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span className="text-text-primary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-red-50/50">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-4">
                  Without it
                </p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Hiring more reps to grow revenue",
                    "You are the bottleneck",
                    "Gut decisions, missed opportunities",
                    "Competitor advantage widens daily",
                    "$12K-$250K/mo left on the table",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="h-4 w-4 text-red-400 mt-0.5 shrink-0 text-center font-bold">
                        &times;
                      </span>
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* CTA after comparison */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <a
              href="#quiz"
              className="inline-flex items-center gap-2 bg-electric hover:bg-electric-dark text-white rounded-xl h-12 px-8 text-base font-semibold shadow-lg shadow-electric/20 transition-colors"
            >
              Find Out Where You Stand
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <StickyMobileCTA />

      {/* Bottom padding on mobile for sticky CTA */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
