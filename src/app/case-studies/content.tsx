"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTABanner } from "@/components/CTABanner";
import { fadeUp, staggerContainer } from "@/lib/animations";

const caseStudies = [
  {
    title: "AI Sales Infrastructure — Supplement Brand",
    system: "Closer OS",
    tag: "Tier 2 — Revenue Infrastructure",
    challenge:
      "A 7-figure supplement brand with a team of closers was bleeding revenue. Reps were going into calls blind — no lead research, no buyer signals, no follow-up system. Close rate was stuck at 22% and deals were dragging out to 14+ days. The founder knew AI could help but had already wasted $40K on a consultant who delivered a slide deck.",
    built: [
      "Pre-call intelligence engine — Clay + Apollo enrichment piped into buyer-type classification, so closers know exactly who they're talking to before the call starts",
      "Live call coaching — real-time signal detection via Deepgram that flags objections, buying signals, and competitor mentions during the conversation",
      "Post-call automation — AI-generated follow-up sequences, HeyGen video scripts personalized to each prospect, and automated deal room generation",
      "Pipeline dashboard — real-time visibility into deal velocity, close rates by rep, and bottleneck detection",
    ],
    stack: "GHL + Google Meet + Deepgram + Claude API + HeyGen",
    metrics: [
      { before: "22%", after: "34%", label: "Close rate", highlight: true },
      { before: "14 days", after: "6 days", label: "Deal cycle" },
      { before: "$0", after: "$420K", label: "Recovered pipeline (90 days)" },
      { before: "0", after: "100%", label: "Calls with pre-call intel" },
    ],
    timeline: "6 weeks to production",
    quote: "We went from hoping our closers would figure it out to knowing exactly what's happening on every single call. This isn't AI hype — it's infrastructure.",
    quoteAuthor: "Founder, DTC Supplement Brand",
  },
  {
    title: "Full Ops Platform — Contracting Business",
    system: "ContractorOS",
    tag: "Tier 2 — Revenue Infrastructure",
    challenge:
      "A residential contracting company doing $1.2M/year was running on paper estimates, manual invoices, and a QuickBooks workflow that ate 25+ hours per week. The owner was the bottleneck for every quote, every invoice, and every payment follow-up. Growth had flatlined because operations couldn't scale.",
    built: [
      "Voice-commanded estimate builder — owner speaks the job details, AI structures the estimate with line items, materials, and labor costs. Sent to client in under 60 seconds",
      "Client-facing approval portal — customers review, approve, and sign estimates online. No more back-and-forth emails or lost paperwork",
      "Automated invoicing + payment tracking — invoices generated on job completion, Stripe payments processed, aging tracked automatically",
      "QuickBooks sync — zero manual data entry, CSV exports replaced with direct sync",
      "Full auth + storage layer — Supabase for secure document management and role-based access",
    ],
    stack: "Next.js, TypeScript, Prisma/PostgreSQL, Supabase, Stripe, Resend",
    metrics: [
      { before: "25+ hrs", after: "< 7 hrs", label: "Weekly admin time", highlight: true },
      { before: "21 days", after: "4 days", label: "Payment collection" },
      { before: "Manual", after: "Zero-touch", label: "QuickBooks entry" },
      { before: "~15 min", after: "< 60 sec", label: "Time to send estimate" },
    ],
    timeline: "8 weeks to production",
    quote: "I got my weekends back. I got my evenings back. The system handles what used to take me half the week. I'm actually running a business now instead of running paperwork.",
    quoteAuthor: "Owner, Residential Contracting Co.",
  },
];

export function CaseStudiesContent() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-navy grid-pattern overflow-hidden">
        <div className="noise-overlay" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-16 lg:pt-40 lg:pb-20"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-electric mb-4"
          >
            Production results
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-tight"
          >
            Systems in production.<br />Results in numbers.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-white/50 leading-relaxed max-w-2xl"
          >
            Not pilots. Not prototypes. Not strategy decks collecting dust.
            These are live AI systems running inside real businesses, generating
            real revenue, right now.
          </motion.p>
        </motion.div>

        {/* Aggregate proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "6", unit: "wks", label: "Avg. time to production" },
              { value: "100%", unit: "", label: "Client retention rate" },
              { value: "0", unit: "", label: "Systems that went unused" },
              { value: "3.2x", unit: "", label: "Avg. ROI within 90 days" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="text-center py-5 px-3 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <p className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight">
                  {stat.value}<span className="text-electric text-lg">{stat.unit}</span>
                </p>
                <p className="mt-1 text-xs text-white/40 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CASE STUDIES */}
      {caseStudies.map((cs, i) => (
        <section key={i} className="bg-white border-b border-border">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32"
          >
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-16">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-electric bg-electric/10 border border-electric/20 px-3 py-1.5 rounded-full">
                  {cs.system}
                </span>
                <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1.5 rounded-full border border-border">
                  {cs.tag}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary bg-surface px-3 py-1.5 rounded-full border border-border">
                  <Clock className="h-3 w-3" />
                  {cs.timeline}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight">
                {cs.title}
              </h2>
            </motion.div>

            {/* Metrics grid — the showstopper */}
            <motion.div variants={fadeUp} className="mb-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cs.metrics.map((m, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.08 }}
                    className={`relative rounded-2xl p-6 lg:p-8 overflow-hidden ${
                      m.highlight
                        ? "bg-navy text-white"
                        : "bg-surface border border-border"
                    }`}
                  >
                    {m.highlight && <div className="absolute inset-0 grid-pattern" />}
                    <div className="relative">
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                        m.highlight ? "text-white/40" : "text-text-secondary/60"
                      }`}>
                        {m.label}
                      </p>
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className={`text-sm font-mono line-through decoration-2 ${
                          m.highlight ? "text-white/30 decoration-white/20" : "text-text-secondary/40 decoration-text-secondary/30"
                        }`}>
                          {m.before}
                        </p>
                        <ArrowRight className={`h-3 w-3 ${m.highlight ? "text-electric" : "text-electric/60"}`} />
                      </div>
                      <p className={`text-3xl md:text-4xl font-bold font-mono tracking-tight ${
                        m.highlight ? "text-white" : "text-navy"
                      }`}>
                        {m.after}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Left — Challenge + What we built (3 cols) */}
              <div className="lg:col-span-3 space-y-10">
                <motion.div variants={fadeUp}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-red-50 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                    </span>
                    The problem
                  </h3>
                  <p className="text-text-primary leading-relaxed text-lg">
                    {cs.challenge}
                  </p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-electric/10 flex items-center justify-center">
                      <Zap className="h-3 w-3 text-electric" />
                    </span>
                    What we built
                  </h3>
                  <ul className="space-y-4">
                    {cs.built.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-text-primary leading-relaxed"
                      >
                        <CheckCircle2 className="h-5 w-5 text-electric shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">
                    Tech stack
                  </h3>
                  <p className="text-sm font-mono text-text-primary bg-navy/5 rounded-xl p-5 border border-border">
                    {cs.stack}
                  </p>
                </motion.div>
              </div>

              {/* Right — Quote (2 cols) */}
              <motion.div variants={fadeUp} className="lg:col-span-2">
                <div className="sticky top-32 rounded-2xl bg-navy p-8 lg:p-10 grid-pattern overflow-hidden">
                  <div className="relative">
                    <div className="text-6xl font-bold text-electric/20 leading-none mb-4">&ldquo;</div>
                    <blockquote className="text-white text-lg leading-relaxed font-medium -mt-6">
                      {cs.quote}
                    </blockquote>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-sm text-white/40">{cs.quoteAuthor}</p>
                    </div>
                    <div className="mt-8">
                      <div className="flex items-center gap-2 text-xs text-white/30 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-electric" />
                        Verified client — system still in production
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      ))}

      {/* SOCIAL PROOF + CTA BRIDGE */}
      <section className="bg-surface">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-4">
              More coming
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy">
              These are the first two documented.
            </h2>
            <p className="mt-4 text-text-secondary leading-relaxed max-w-2xl mx-auto text-lg">
              We have 200+ systems in production across 30+ verticals.
              We&apos;re publishing more breakdowns quarterly. Want yours to be
              one of them?
            </p>
            <div className="mt-8">
              <Button
                asChild
                className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20"
              >
                <Link href="/apply">
                  Apply for a Discovery Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
