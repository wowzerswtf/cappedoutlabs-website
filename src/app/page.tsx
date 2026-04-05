"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Box, TrendingUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VSLEmbed } from "@/components/VSLEmbed";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CTABanner } from "@/components/CTABanner";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "$2B+", label: "Revenue scaled" },
  { value: "200+", label: "AI systems live" },
  { value: "30+", label: "Verticals" },
  { value: "47", label: "Days to first system" },
];

const tiers = [
  {
    name: "AI Revenue Sprint",
    price: "$15K",
    timeline: "2 weeks",
    tag: "Entry point",
    bullets: ["AI readiness audit", "Highest-leverage workflow built live", "30-day support", "Ascension path to Tier 2"],
    applyValue: "AI Revenue Sprint $15K",
  },
  {
    name: "AI Revenue Infrastructure",
    price: "$50K–$150K",
    timeline: "6–10 weeks",
    tag: "Most popular",
    featured: true,
    bullets: ["3–5 core workflows rebuilt", "Cross-department coverage", "Staff training + SOPs", "90-day managed handoff"],
    applyValue: "AI Revenue Infrastructure $50K-$150K",
  },
  {
    name: "Full AI Transformation",
    price: "$200K–$500K+",
    timeline: "3–6 months",
    tag: "Exit prep",
    bullets: ["Full infrastructure rebuild", "AI agents across all depts", "Governance + optimization", "Premium exit positioning"],
    applyValue: "Full Transformation $200K+",
  },
  {
    name: "Equity / Rev-Share",
    price: "No upfront",
    timeline: "Flexible",
    tag: "Selective",
    bullets: ["3–10% equity OR 10–20% rev-share", "Same deliverables as Tier 1/2", "For operators with real upside", "We evaluate the business"],
    applyValue: "Equity / Rev-Share",
  },
];

const solutions = [
  {
    icon: Zap,
    title: "Revenue-first framing",
    body: "Every system anchored to a revenue metric. Close rate. LTV. Cash collection speed.",
  },
  {
    icon: Box,
    title: "Production, not prototypes",
    body: "Running systems with documentation, trained staff, and a 90-day handoff.",
  },
  {
    icon: TrendingUp,
    title: "Exit-prep architecture",
    body: "AI-systematized businesses command higher multiples. Built for that outcome.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO — centered, clean, mesh gradient */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative text-center max-w-4xl mx-auto px-6 pt-24 pb-16"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/5 px-4 py-1.5 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            <span className="text-xs font-medium text-electric">From the team behind Capped Out Media</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.05] tracking-tight"
          >
            We don&apos;t deliver decks.
            <br />
            <span className="gradient-text">We build systems</span> that close deals.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto"
          >
            AI revenue infrastructure for operators who are serious about
            growth — and serious about exit.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20"
            >
              <Link href="/apply">Apply for a Discovery Call</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border text-text-primary hover:bg-surface rounded-xl px-8 h-12 text-base font-semibold"
            >
              <a href="#vsl">
                See how it works
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* BENTO STATS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-8 text-center"
          >
            Trusted by operators building toward exit
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-2xl border border-border bg-surface/50 p-6 text-center glow-border"
              >
                <p className="text-3xl md:text-4xl font-bold font-mono text-navy tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VSL */}
      <section id="vsl" className="bg-surface">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-8 text-center"
          >
            Watch before you apply
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <VSLEmbed />
          </motion.div>
          <p className="mt-4 text-sm text-text-secondary text-center">
            10 minutes. No pitch deck. Just proof.
          </p>
        </div>
      </section>

      {/* PROBLEM — split layout */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-4">
                The gap
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-navy leading-tight">
                60% of AI projects never make it to production.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-text-secondary leading-relaxed text-lg">
                You&apos;ve been pitched by consultants who deliver 80-slide decks
                and disappear. You&apos;ve bought tools nobody uses. You&apos;ve
                tried to hire for AI and watched it go nowhere.
              </p>
              <p className="text-text-secondary leading-relaxed text-lg">
                The problem isn&apos;t AI. The problem is that everyone selling AI
                transformation has never actually built and operated a
                revenue-generating business.
              </p>
              <blockquote className="text-xl font-bold text-navy border-l-4 border-electric pl-6">
                &ldquo;They don&apos;t think in close rates, churn, and exit
                multiples. We do.&rdquo;
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOLUTION — icon cards */}
      <section className="bg-surface dot-pattern">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Built by operators. Deployed in production.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-border p-8 glow-border"
              >
                <div className="w-11 h-11 rounded-xl bg-electric/10 flex items-center justify-center mb-5">
                  <item.icon className="h-5 w-5 text-electric" />
                </div>
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS — horizontal stacked cards */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Four ways to work with us
            </h2>
          </motion.div>

          <div className="space-y-4">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border p-6 lg:p-8 transition-all glow-border ${
                  tier.featured
                    ? "border-electric bg-electric/[0.02] shadow-sm"
                    : "border-border bg-white hover:bg-surface/30"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Left: name + price */}
                  <div className="lg:w-64 shrink-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          tier.featured
                            ? "bg-electric text-white"
                            : "bg-surface text-text-secondary border border-border"
                        }`}
                      >
                        {tier.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-navy">{tier.name}</h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-text-primary">{tier.price}</span>
                      <span className="text-sm text-text-secondary">{tier.timeline}</span>
                    </div>
                  </div>

                  {/* Center: bullets */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tier.bullets.map((bullet, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-text-primary">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
                        {bullet}
                      </div>
                    ))}
                  </div>

                  {/* Right: CTA */}
                  <div className="lg:w-32 shrink-0">
                    <Button
                      asChild
                      className={`w-full rounded-xl h-10 text-sm font-semibold ${
                        tier.featured
                          ? "bg-electric hover:bg-electric-dark text-white"
                          : "bg-navy hover:bg-navy-light text-white"
                      }`}
                    >
                      <Link href={`/apply?tier=${encodeURIComponent(tier.applyValue)}`}>
                        Apply
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="relative bg-navy grid-pattern overflow-hidden">
        <div className="noise-overlay" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-4">
              Production results
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              We don&apos;t show mockups.<br />We show receipts.
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
              Every number below is from a live system running inside a real business right now.
            </p>
          </motion.div>

          {/* Aggregate stats banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 mb-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: "6", unit: "wks", label: "Avg. time to production" },
              { value: "100%", unit: "", label: "Client retention rate" },
              { value: "0", unit: "", label: "Systems that went unused" },
              { value: "3.2x", unit: "", label: "Avg. ROI within 90 days" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center py-5 px-3 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <p className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight">
                  {stat.value}<span className="text-electric text-lg">{stat.unit}</span>
                </p>
                <p className="mt-1 text-xs text-white/40 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Case study cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <CaseStudyCard
              title="Supplement Brand — AI Sales Infrastructure"
              result="Closers went from winging calls to having AI-generated intel packets, real-time coaching, and automated follow-up sequences. Pipeline velocity doubled."
              tag="Closer OS"
              href="/case-studies"
              variant="dark"
              beforeMetric="14"
              afterMetric="6"
              metricUnit=" day deal cycle"
            />
            <CaseStudyCard
              title="Contractor Business — Full Ops Platform"
              result="Voice-commanded estimates, automated invoicing, client portal. Owner went from 25+ hrs/week on admin to under 7. Payment collection runs itself."
              tag="ContractorOS"
              href="/case-studies"
              variant="dark"
              beforeMetric="21"
              afterMetric="4"
              metricUnit=" day payment cycle"
            />
          </div>

          {/* Bottom proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm"
          >
            <p className="text-white/30">
              Deployed across <span className="text-white font-semibold">30+ verticals</span>
            </p>
            <span className="hidden sm:block text-white/10">|</span>
            <p className="text-white/30">
              <span className="text-white font-semibold">200+</span> AI systems in production
            </p>
            <span className="hidden sm:block text-white/10">|</span>
            <Link
              href="/case-studies"
              className="font-bold text-electric hover:text-white transition-colors flex items-center gap-1.5"
            >
              See all case studies
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner />
    </>
  );
}
