"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "+41%", label: "Revenue from reorders" },
  { value: "7 min", label: "Order processing" },
  { value: "51%", label: "Reorder rate" },
  { value: "1", label: "CS staff needed" },
];

const beforeAfter = [
  { metric: "Order processing time", before: "52 min", after: "7 min" },
  { metric: "Reorder rate", before: "22%", after: "51%" },
  { metric: "CS headcount required", before: "4 staff", after: "1" },
];

const systems = [
  {
    name: "Automated Order Processing",
    description:
      "Incoming orders from email, phone, and portal are parsed and processed by AI — extracting SKUs, quantities, pricing tiers, and delivery preferences. Orders that took 52 minutes of manual handling now complete in 7 minutes with automatic validation and confirmation.",
  },
  {
    name: "Predictive Reorder Engine",
    description:
      "The system tracks purchase history, consumption patterns, and seasonal trends to predict when each customer will need to reorder — with 94% accuracy. Proactive reorder prompts go out before the customer runs low, capturing revenue that previously slipped to competitors.",
  },
  {
    name: "Conversational Customer Service",
    description:
      "AI handles customer inquiries in natural conversation across phone, email, and chat. Order status, delivery tracking, product questions, and account changes are resolved without human intervention. The support team went from 4 staff to 1 managing escalations only.",
  },
  {
    name: "Proactive Upsell Messaging",
    description:
      "Based on order history and product affinity analysis, the system sends personalized upsell recommendations at optimal timing. Complementary products, volume discounts, and new SKU introductions are surfaced to the right customers at the right moment.",
  },
];

function ArticleSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Intelligent Order & Relationship Manager — Wholesale Distributor Case Study",
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
      "Revenue climbed 41% from reorders alone while customer service headcount went from 4 to 1.",
    url: "https://cappedoutlabs.com/case-studies/wholesale-distributor-ai-ops",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WholesaleContent() {
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
              AI Order Manager
            </span>
            <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
              Tier 2 · Wholesale and Distribution
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
          >
            Intelligent Order and Relationship Manager — Wholesale Distributor
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed"
          >
            Revenue climbed 41% from reorders alone while customer service headcount went from 4 to 1. Order processing collapsed from 52 minutes to 7.
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
              A wholesale distributor was running on manual order processing and reactive customer service. Every order required 52 minutes of handling — verifying SKUs, checking inventory, confirming pricing, and sending acknowledgments. Four full-time customer service staff managed the volume.
            </p>
            <p>
              Reorder rates sat at 22%. Customers weren&apos;t coming back because nobody was tracking when they&apos;d need to restock. The business was leaving significant recurring revenue on the table simply because follow-up was manual and inconsistent.
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
              The 41% revenue increase came entirely from reorders — not new customers. The predictive reorder engine with 94% accuracy turned a one-and-done purchase pattern into a recurring revenue model. Meanwhile, reducing CS headcount from 4 to 1 wasn&apos;t about cutting costs — it was about letting the AI handle routine inquiries so the remaining team member could focus on high-value relationship management.
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
