"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Box, TrendingUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VSLEmbed } from "@/components/VSLEmbed";
import { CTABanner } from "@/components/CTABanner";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WebSiteSchema, FAQSchema } from "@/components/SchemaMarkup";
import { fadeUp, staggerContainer } from "@/lib/animations";

const homeFaqs = [
  { question: "How much does AI consulting cost?", answer: "Engagements start at $15,000 for a 2-week AI Revenue Sprint. Full infrastructure builds run $50K–$150K over 6–10 weeks. Full transformation for exit preparation is $200K–$500K+. We also offer equity and revenue-share arrangements for qualified operators." },
  { question: "How long does implementation take?", answer: "A single workflow can be built and deployed in 2 weeks. Full cross-department infrastructure takes 6–10 weeks. Complete business transformation runs 3–6 months. Every engagement includes a managed handoff period." },
  { question: "What if we've tried AI before and it didn't work?", answer: "Almost every time we hear this, what happened is someone installed a tool and hoped the team would use it. Installing tools is not transformation. Building systems is. We use your previous attempt as a diagnostic to build something that actually sticks." },
  { question: "Do you work with businesses our size?", answer: "We work with operators doing $1M–$50M in revenue across 30+ verticals. The common thread is a sales-driven business with enough volume for AI to create leverage and enough complexity for the ROI to justify the investment." },
  { question: "What happens on the discovery call?", answer: "30-minute conversation. No pitch deck. We learn about your business, identify where AI would have the highest revenue impact, and tell you honestly whether we can help. If it's a fit, we scope a proposal. If not, we'll tell you why." },
];

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
      <WebSiteSchema />
      <FAQSchema items={homeFaqs} />

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
            <VSLEmbed src="https://player.vimeo.com/video/1180565378?title=0&byline=0&portrait=0" />
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

      {/* PROOF — feature cards on light bg */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              What production AI actually looks like
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Portfolio Brand — AI Sales Infrastructure",
                result: "+1,866% revenue. 23.4x ROAS. CAC down 90% in 45 days.",
                tag: "Closer OS",
                metric: "+1,866%",
                metricLabel: "revenue growth",
              },
              {
                title: "Contracting Business — Full Ops Platform",
                result: "18+ hours saved weekly. Payment cycle cut from 21 days to 4.",
                tag: "ContractorOS",
                metric: "18+",
                metricLabel: "hours saved/week",
              },
            ].map((cs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href="/case-studies"
                  className="block rounded-2xl border border-border bg-white p-8 hover:shadow-lg hover:shadow-electric/5 transition-all group glow-border"
                >
                  <span className="inline-block text-xs font-semibold text-electric bg-electric/10 px-3 py-1 rounded-full mb-6">
                    {cs.tag}
                  </span>
                  <p className="text-5xl font-bold font-mono text-navy mb-1">{cs.metric}</p>
                  <p className="text-sm text-text-secondary mb-4">{cs.metricLabel}</p>
                  <h3 className="text-base font-bold text-navy group-hover:text-electric transition-colors">
                    {cs.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">{cs.result}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-electric">
                    View case study
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-24 lg:py-32">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-navy text-center mb-12"
          >
            Common questions
          </motion.h2>
          <FAQAccordion items={homeFaqs} />
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="bg-surface dot-pattern">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-24 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Not ready to apply? Get the playbook.
            </h2>
            <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
              Free: The AI Revenue Infrastructure Playbook — how we took a brand
              from $200K to $3.9M in 45 days.
            </p>
            {/* TODO: Connect to email service (Resend list or ConvertKit) */}
            <form
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 rounded-xl border border-border bg-white px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric"
              />
              <Button
                type="submit"
                className="bg-electric hover:bg-electric-dark text-white rounded-xl px-6 h-12 text-sm font-semibold whitespace-nowrap"
              >
                Send Me The Playbook
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner />
    </>
  );
}
