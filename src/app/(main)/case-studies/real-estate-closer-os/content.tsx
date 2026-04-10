"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "+157%", label: "Revenue per agent" },
  { value: "53%", label: "Contact to appt rate" },
  { value: "64%", label: "Appt to offer rate" },
  { value: "9 mo", label: "Measurement period" },
];

const beforeAfter = [
  { metric: "Contact to appointment rate", before: "14%", after: "53%" },
  { metric: "Appointment to offer rate", before: "28%", after: "64%" },
  { metric: "Revenue per agent", before: "Baseline", after: "+157%" },
];

const systems = [
  {
    name: "Pre-call Lead Intelligence Dashboard",
    description:
      "Before every buyer consultation, agents get a one-page intelligence brief — property search history, financial signals, timeline indicators, and neighborhood preferences. Agents walk into calls with context that builds immediate trust and shortens the qualification cycle.",
  },
  {
    name: "Live AI Call Assist",
    description:
      "During buyer consultations, the system monitors the conversation in real time — surfacing comparable listings, flagging objection patterns, and prompting with relevant market data. Agents stay present in the conversation while the AI handles the research they used to do manually between calls.",
  },
  {
    name: "Automated Post-showing Nurture Sequences",
    description:
      "After every showing, personalized follow-up sequences trigger automatically — recap emails with property details, comparable market data, financing scenarios, and next-step prompts. Leads that used to go cold between showings now stay engaged through to offer.",
  },
];

function ArticleSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Closer OS Real Estate Edition — Real Estate Team Case Study",
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
      "Revenue per agent up 157% in 9 months. Contact-to-appointment rate jumped from 14% to 53%.",
    url: "https://cappedoutlabs.com/case-studies/real-estate-closer-os",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function RealEstateContent() {
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
              Closer OS — Real Estate
            </span>
            <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
              Tier 2 · Real Estate
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
          >
            Closer OS — Real Estate Edition
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed"
          >
            Revenue per agent up 157% in 9 months. Contact-to-appointment rate jumped from 14% to 53%. Appointment-to-offer rate more than doubled.
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
              A real estate team was generating leads but losing them in the gap between first contact and appointment. Only 14% of contacts converted to appointments, and of those, just 28% progressed to an offer. Agents were spending hours on manual research before calls and losing momentum with prospects between showings.
            </p>
            <p>
              The team had the lead volume. What they didn&apos;t have was a system to convert attention into action at every stage of the buyer journey — from first call to final offer.
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
              Closer OS adapted for real estate proved that the same pre-call intelligence, live assist, and post-interaction automation framework works across industries. The 157% revenue increase per agent came from converting existing leads at dramatically higher rates — not from generating more leads. Every stage of the funnel improved because agents had the right context at the right moment.
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
