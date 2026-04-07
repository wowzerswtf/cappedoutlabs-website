"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "+1,866%", label: "Revenue growth" },
  { value: "23.4x", label: "ROAS" },
  { value: "-90%", label: "CAC reduction" },
  { value: "77.9%", label: "Show rate" },
  { value: "138", label: "Deals closed" },
  { value: "$3.42M", label: "Net profit" },
];

const layers = [
  {
    name: "Layer 1 — Pre-Call Intelligence",
    description:
      "Clay and Apollo enrichment pipelines pull company data, revenue signals, and LinkedIn activity for every booked lead. Claude API classifies each prospect into one of four buyer types — Visionary, Analyst, Connector, Skeptic — and generates a one-page brief with recommended talking points, likely objections, and the value proposition most likely to resonate.",
    result: "Show rate: 26.3% → 77.9%",
  },
  {
    name: "Layer 2 — Live Call Assistance",
    description:
      "Real-time signal detection via Deepgram through Recall.ai on Google Meet. The system identifies objections, buying indicators, and competitor mentions during calls, delivering contextual prompts to the closer without disrupting conversation flow.",
    result: "Close rate: 19.5% → 26.0%",
  },
  {
    name: "Layer 3 — Post-Call Automation",
    description:
      "After every call, the system generates personalized follow-up emails, HeyGen video scripts, partner communications, and tracked deal room updates — all in seconds. What used to take closers 30-60 minutes per call became automatic and consistent.",
    result: "30-60 min manual work → seconds",
  },
];

function CaseStudyArticleSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Closer OS — AI Sales Infrastructure Case Study",
    author: {
      "@type": "Person",
      name: "Waynard",
      worksFor: { "@type": "Organization", name: "Capped Out Labs" },
    },
    publisher: {
      "@type": "Organization",
      name: "Capped Out Labs",
      url: "https://cappedoutlabs.com",
    },
    datePublished: "2026-04-07",
    dateModified: "2026-04-07",
    description:
      "AI sales infrastructure deployed into a digital incubator portfolio brand. Revenue grew from $200K to $3.9M (+1,866%), CAC dropped 90%, and ROAS reached 23.4x — all within 45 days.",
    url: "https://cappedoutlabs.com/case-studies/portfolio-brand-ai-sales-infrastructure",
    about: [
      { "@type": "Claim", name: "Revenue growth", description: "$200K to $3,933,000 (+1,866%) in 45 days" },
      { "@type": "Claim", name: "ROAS improvement", description: "2.1x to 23.4x" },
      { "@type": "Claim", name: "CAC reduction", description: "$11,765 to $1,217 (-90%)" },
      { "@type": "Claim", name: "Show rate improvement", description: "26.3% to 77.9%" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CloserOSContent() {
  return (
    <>
      <CaseStudyArticleSchema />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-4xl px-6 lg:px-8 pt-36 pb-16 lg:pt-44 lg:pb-20"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-electric hover:text-electric-dark transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              All Case Studies
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold text-electric bg-electric/10 px-3 py-1 rounded-full">
              Closer OS
            </span>
            <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
              Tier 2 · 45 days of live data
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
          >
            AI Sales Infrastructure — Portfolio Brand
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed"
          >
            Revenue grew from $200K to $3.9M in 45 days. CAC dropped 90%. ROAS hit 23.4x. Here&apos;s exactly how we built it.
          </motion.p>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-surface/50 p-4 text-center"
              >
                <p className="text-2xl font-bold font-mono text-electric">{stat.value}</p>
                <p className="text-xs text-text-secondary mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE CHALLENGE */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-navy mb-8"
          >
            The challenge
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-secondary leading-relaxed text-lg"
          >
            A portfolio brand running $94K in monthly ad spend was generating leads the sales process couldn&apos;t convert. Closers spent 20-30 minutes on manual pre-call research. Follow-up took 30-60 minutes per call. Show rate was 26.3% — nearly 3 out of 4 booked calls were no-shows. Every rep was running their own system, which meant no system at all.
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 border-l-4 border-electric pl-5 py-2"
          >
            <p className="text-text-primary leading-relaxed italic">
              &ldquo;We were spending serious money on ads and watching leads disappear. The closer didn&apos;t have the right information before the call, follow-up was an afterthought, and every rep was running their own system — which meant no system at all.&rdquo;
            </p>
            <footer className="mt-2 text-sm text-text-secondary">
              &mdash; Portfolio Operator, Digital Incubator
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* WHAT WE BUILT */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-navy mb-12"
          >
            What we built
          </motion.h2>
          <div className="space-y-8">
            {layers.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-surface/50 p-6 lg:p-8"
              >
                <h3 className="text-lg font-bold text-navy mb-3">{layer.name}</h3>
                <p className="text-text-secondary leading-relaxed">{layer.description}</p>
                <p className="mt-4 text-sm font-semibold text-electric">{layer.result}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl border border-border bg-surface/50 p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Stack
            </h3>
            <p className="text-sm font-mono text-text-primary">
              GHL · Google Meet · Deepgram · Claude API (claude-sonnet-4-6) · Recall.ai · HeyGen
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE RESULT */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-navy mb-8"
          >
            The result
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-primary leading-relaxed text-lg font-semibold"
          >
            Revenue: $200K → $3.9M (+1,866%). CAC: $11,765 → $1,217 (−90%). ROAS: 2.1x → 23.4x. Show rate: 26.3% → 77.9%. Net profit: $3,420,000 in 45 days. 138 deals closed. Build timeline: 6 weeks.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mx-auto max-w-4xl px-6 lg:px-8 py-24 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-navy"
          >
            Ready to build this in your business?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-text-secondary text-lg"
          >
            We take on a limited number of clients each quarter.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button
              asChild
              className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20"
            >
              <Link href="/apply">
                Apply for a Discovery Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
