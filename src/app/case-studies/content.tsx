"use client";

import { motion } from "framer-motion";
import { CTABanner } from "@/components/CTABanner";
import { fadeUp, staggerContainer } from "@/lib/animations";

const caseStudies = [
  {
    title: "AI Sales Infrastructure — Supplement Brand",
    system: "Closer OS",
    tag: "Tier 2",
    challenge: "Manual lead research, inconsistent follow-up, closers flying blind on every call.",
    built: [
      "Pre-call intelligence: Clay/Apollo enrichment, buyer type classification",
      "Live call assistance: Real-time signal detection via Deepgram",
      "Post-call automation: HeyGen scripts, partner emails, deal room generation",
    ],
    stack: "GHL + Google Meet + Deepgram + Claude API",
    result: "34% close rate lift within 60 days of deployment. Average deal cycle compressed from 14 days to 6.",
    timeline: "6 weeks",
    metric: "34%",
    metricLabel: "close rate lift",
  },
  {
    title: "Full Ops Platform — Contracting Business",
    system: "ContractorOS",
    tag: "Tier 2",
    challenge: "Manual estimates, paper invoices, no client visibility, QuickBooks done by hand.",
    built: [
      "Voice-commanded estimate creation (Web Speech API + Claude)",
      "Client-facing approval portal",
      "Automated invoicing and payment tracking",
      "QuickBooks CSV export",
      "Supabase auth + storage",
    ],
    stack: "Next.js 14, TypeScript, Tailwind, Prisma/PostgreSQL, Supabase, Stripe, Resend",
    result: "18+ hours saved weekly on admin. Payment collection cycle cut from 21 days to 4. Zero manual QuickBooks entry.",
    timeline: "8 weeks",
    metric: "18+",
    metricLabel: "hours saved/week",
  },
];

export function CaseStudiesContent() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-4xl px-6 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-28 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight"
          >
            Systems in production. Results in numbers.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
          >
            Not pilots. Not prototypes. Working AI infrastructure inside real businesses.
          </motion.p>
        </motion.div>
      </section>

      {/* CASE STUDIES */}
      {caseStudies.map((cs, i) => (
        <section key={i} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto max-w-6xl px-6 lg:px-8 py-24 lg:py-32"
          >
            {/* Top — metric + header */}
            <motion.div variants={fadeUp} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold text-electric bg-electric/10 px-3 py-1 rounded-full">
                  {cs.system}
                </span>
                <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
                  {cs.tag}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
                <div>
                  <p className="text-6xl md:text-7xl font-bold font-mono text-navy">{cs.metric}</p>
                  <p className="text-sm text-text-secondary mt-1">{cs.metricLabel}</p>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy">{cs.title}</h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Left */}
              <div className="space-y-8">
                <motion.div variants={fadeUp}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    The challenge
                  </h3>
                  <p className="text-text-primary leading-relaxed">{cs.challenge}</p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    What we built
                  </h3>
                  <ul className="space-y-3">
                    {cs.built.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-text-primary">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Right */}
              <div className="space-y-6">
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Stack
                  </h3>
                  <p className="text-sm font-mono text-text-primary">{cs.stack}</p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Result
                  </h3>
                  <p className="text-text-primary leading-relaxed font-semibold">{cs.result}</p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Timeline
                  </h3>
                  <p className="text-2xl font-bold font-mono text-navy">{cs.timeline}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      ))}

      {/* HONEST NOTE */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-secondary leading-relaxed"
          >
            These are the first two. More being documented now.
          </motion.p>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
