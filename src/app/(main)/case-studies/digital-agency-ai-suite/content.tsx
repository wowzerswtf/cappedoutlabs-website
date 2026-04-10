"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "41%", label: "Profit margin" },
  { value: "<24 hrs", label: "Proposal turnaround" },
  { value: "48 hrs", label: "Client onboarding" },
  { value: "3 hrs", label: "Monthly reporting" },
];

const beforeAfter = [
  { metric: "Discovery call to proposal sent", before: "9 days", after: "Under 24 hrs" },
  { metric: "Client onboarding time", before: "18 days", after: "48 hrs" },
  { metric: "Monthly reporting hours", before: "25 hrs", after: "3 hrs" },
];

const systems = [
  {
    name: "Instant Proposal Generator",
    description:
      "Discovery call transcripts are analyzed by AI to extract scope, deliverables, timelines, and budget signals. A complete proposal — with pricing, timeline, and scope of work — is generated and ready for review within hours of the call. What took 9 days now ships in under 24 hours.",
  },
  {
    name: "Automated Client Onboarding",
    description:
      "Once a proposal is signed, the onboarding system activates automatically — sending welcome sequences, collecting brand assets, scheduling kickoff calls, provisioning project management boards, and setting up reporting dashboards. The 18-day onboarding cycle collapsed to 48 hours.",
  },
  {
    name: "Real-time AI Reporting Dashboard",
    description:
      "Client-facing dashboards update live with campaign performance, deliverable status, and key metrics. The AI generates narrative summaries and actionable insights — no more spending 25 hours a month pulling data into spreadsheets and writing reports.",
  },
];

function ArticleSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "End-to-End Operations AI Suite — Digital Creative Agency Case Study",
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
    datePublished: "2026-04-10",
    dateModified: "2026-04-10",
    description:
      "Margins went from 18% to 41% while reporting hours dropped from 25 to 3 per month.",
    url: "https://cappedoutlabs.com/case-studies/digital-agency-ai-suite",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function DigitalAgencyContent() {
  return (
    <>
      <ArticleSchema />

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
              Operations AI Suite
            </span>
            <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
              Tier 2 · Marketing and Creative
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
          >
            End-to-End Operations AI Suite — Digital Creative Agency
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed"
          >
            Margins went from 18% to 41% while reporting hours dropped from 25 to 3 per month. Discovery call to proposal sent: 9 days to under 24 hours.
          </motion.p>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* THE SITUATION */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-navy mb-8"
          >
            The situation
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 text-text-secondary leading-relaxed text-lg"
          >
            <p>
              A digital creative agency was running at 18% margins — thin enough that a single bad month threatened profitability. The bottleneck wasn&apos;t client acquisition. It was the operational overhead between signing a deal and delivering results.
            </p>
            <p>
              Proposals took 9 days from discovery call to send. Client onboarding stretched to 18 days. And every month, the team burned 25 hours compiling reports that were outdated by the time they shipped. The agency was growing revenue but shrinking margins because every new client added more manual operational load.
            </p>
          </motion.div>
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
          <div className="space-y-6">
            {systems.map((system, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-surface/50 p-6 lg:p-8"
              >
                <h3 className="text-lg font-bold text-navy mb-3">{system.name}</h3>
                <p className="text-text-secondary leading-relaxed">{system.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-navy mb-8"
          >
            Before and after
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-white overflow-hidden"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Metric</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Before</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-electric">After</th>
                </tr>
              </thead>
              <tbody>
                {beforeAfter.map((row, i) => (
                  <tr key={i} className={i < beforeAfter.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-6 py-4 text-sm font-medium text-navy">{row.metric}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{row.before}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-electric">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* KEY INSIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl border-l-4 border-electric bg-electric/5 p-6"
          >
            <p className="text-sm font-semibold text-navy mb-2">Key insight</p>
            <p className="text-text-secondary leading-relaxed">
              The margin jump from 18% to 41% didn&apos;t come from raising prices or cutting creative talent. It came from eliminating the operational overhead that was eating into every engagement. Proposals, onboarding, and reporting — the three biggest time sinks — went from consuming weeks of labor to running autonomously. The agency could take on more clients without adding operational headcount.
            </p>
          </motion.div>
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
