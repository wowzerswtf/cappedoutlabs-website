"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "+62%", label: "Monthly revenue" },
  { value: "3.8%", label: "No-show rate" },
  { value: "78%", label: "Rebooking rate" },
  { value: "$3,100", label: "Revenue per consult" },
];

const beforeAfter = [
  { metric: "No-show rate", before: "25%", after: "3.8%" },
  { metric: "Rebooking rate", before: "31%", after: "78%" },
  { metric: "Revenue per consultation", before: "$1,400", after: "$3,100" },
];

const systems = [
  {
    name: "AI Booking Concierge",
    description:
      "An intelligent scheduling system that handles booking across multiple locations via text, web, and phone. The concierge understands treatment types, provider availability, and patient preferences — converting inquiries into confirmed appointments without front-desk involvement.",
  },
  {
    name: "Predictive No-show Prevention",
    description:
      "The system analyzes booking patterns, engagement history, and behavioral signals to predict which appointments are at risk. High-risk bookings trigger personalized confirmation sequences and proactive rescheduling offers before the appointment window.",
  },
  {
    name: "Smart Reminder System with Personalized Offers",
    description:
      "Reminder sequences go beyond generic texts. Each message is tailored to the patient's treatment history and includes relevant add-on offers based on their profile — driving higher revenue per visit while reducing no-shows.",
  },
  {
    name: "Post-treatment Nurture Sequences",
    description:
      "After every treatment, automated nurture sequences maintain engagement — follow-up care instructions, satisfaction check-ins, rebooking prompts, and personalized offers for complementary treatments. Rebooking rate jumped from 31% to 78%.",
  },
];

function ArticleSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Autonomous Patient Journey Platform — Multi-location Med Spa Case Study",
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
      "Monthly revenue up 62% while no-show rate dropped from 25% to 3.8%. Rebooking rate jumped from 31% to 78%.",
    url: "https://cappedoutlabs.com/case-studies/med-spa-patient-journey",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function MedSpaContent() {
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
              Patient Journey Platform
            </span>
            <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
              Tier 2 · Healthcare and Aesthetics
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
          >
            Autonomous Patient Journey Platform — Multi-location Med Spa
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed"
          >
            Monthly revenue up 62% while no-show rate dropped from 25% to 3.8%. Revenue per consultation more than doubled.
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
              A multi-location med spa was bleeding revenue from no-shows and one-time visitors. One in four booked appointments went unfilled. Patients who did show up rarely came back — the rebooking rate was 31%, and front desk staff were too overwhelmed with scheduling to follow up.
            </p>
            <p>
              Revenue per consultation sat at $1,400 because there was no systematic way to recommend add-on treatments or create personalized care plans. The business was growing locations but not revenue per patient.
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
              The med spa&apos;s real problem wasn&apos;t marketing — it was the gap between booking and showing up, and the gap between first visit and return visit. The AI closed both gaps simultaneously: predictive no-show prevention kept the schedule full, and automated post-treatment nurture turned one-time patients into recurring revenue.
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
