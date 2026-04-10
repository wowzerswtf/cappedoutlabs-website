"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "$520K", label: "Revenue per recruiter" },
  { value: "14", label: "Placements/month" },
  { value: "18 hrs", label: "Intake to submission" },
  { value: "2.9x", label: "Revenue multiplier" },
];

const beforeAfter = [
  { metric: "Placements per recruiter per month", before: "5", after: "14" },
  { metric: "Time from intake to first submission", before: "4 days", after: "18 hrs" },
  { metric: "Annual revenue per recruiter", before: "$180K", after: "$520K" },
];

const systems = [
  {
    name: "Real-time Resume and Job Spec Scanner",
    description:
      "AI ingests resumes and job specifications as they arrive, extracting skills, experience levels, certifications, and soft-skill indicators. Matching scores are generated instantly — no recruiter has to manually read through stacks of resumes to find candidates.",
  },
  {
    name: "Personalized Multi-channel Outreach",
    description:
      "For every matched candidate, the system writes personalized outreach across email, SMS, and call scripts. Each message references the candidate's specific background and the opportunity's unique selling points — not templated mass blasts.",
  },
  {
    name: "Automated Follow-up Engine",
    description:
      "Multi-channel follow-up sequences run automatically based on candidate engagement signals. The system adjusts timing, channel, and messaging based on response patterns, keeping candidates warm without recruiter intervention.",
  },
  {
    name: "Best-match Surfacing Dashboard",
    description:
      "Recruiters see a ranked dashboard of top candidates for every open role, updated in real time as new resumes come in and existing candidates respond. Time spent searching dropped to near-zero — the system brings the best matches to the surface.",
  },
];

function ArticleSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AI Smart Matching & Outreach Engine — Regional Staffing Agency Case Study",
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
      "Revenue per recruiter went from $180K to $520K annually. Placements per recruiter jumped from 5 to 14 per month.",
    url: "https://cappedoutlabs.com/case-studies/staffing-agency-ai-matching",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function StaffingAgencyContent() {
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
              AI Smart Matching
            </span>
            <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
              Tier 2 · Staffing and Recruiting
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
          >
            AI Smart Matching and Outreach Engine — Regional Staffing Agency
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed"
          >
            Revenue per recruiter went from $180K to $520K annually. Placements nearly tripled. Intake-to-submission time collapsed from 4 days to 18 hours.
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
              A regional staffing agency was struggling to scale without adding headcount. Recruiters were manually reading every resume, writing individual outreach emails, and tracking candidates across spreadsheets. Each placement took days of hands-on effort.
            </p>
            <p>
              The average recruiter was placing 5 candidates per month and generating $180K in annual revenue. The bottleneck wasn&apos;t candidate supply — it was the manual work between intake and submission that burned hours on every single role.
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
              The agency didn&apos;t hire more recruiters. The AI removed the manual bottleneck between intake and submission, which meant each recruiter could work 3x the volume at higher quality. Revenue per recruiter nearly tripled because the system handled the repetitive matching and outreach that consumed most of each day.
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
