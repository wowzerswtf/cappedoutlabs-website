"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/SchemaMarkup";
import { fadeUp, staggerContainer } from "@/lib/animations";

const faqs = [
  { question: "How do you decide which businesses qualify?", answer: "We evaluate revenue trajectory, operational complexity, market position, and leadership quality. We\u2019re looking for businesses where AI infrastructure will create measurable, attributable lift \u2014 not speculative upside. If we can\u2019t model the return, we don\u2019t engage." },
  { question: "How do you choose between equity and revenue share?", answer: "It depends on the business stage and our engagement scope. Revenue share (10\u201320% on incremental lift) works best for businesses with clear, measurable workflows where we can isolate AI-driven revenue. Equity (3\u201310%) suits businesses where the transformation is broader and the value accrues over time, especially pre-exit." },
  { question: "What does the business evaluation process look like?", answer: "We review financials, operations, team structure, and growth trajectory. This typically takes 1\u20132 weeks and includes calls with leadership. We\u2019re assessing whether AI infrastructure will generate enough lift to justify our investment of time and resources. Most applicants hear back within 10 business days." },
  { question: "What happens if the engagement doesn't produce results?", answer: "Revenue share is calculated on incremental lift \u2014 if there\u2019s no lift, there\u2019s no payment. For equity deals, we negotiate clawback or vesting structures that protect both sides. We don\u2019t take equity in businesses where we aren\u2019t confident we can move the numbers." },
  { question: "What does a typical deal structure look like?", answer: "Revenue share: 10\u201320% on attributable incremental revenue over a 12\u201324 month window, with clear measurement methodology agreed upfront. Equity: 3\u201310% vesting over 12\u201324 months tied to milestone delivery. Both include the same deliverables as Tier 1 or Tier 2 engagements." },
];

export function ServiceDetailContent() {
  return (
    <>
      <FAQSchema items={faqs} />

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
            <Link href="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-electric hover:text-electric-dark transition-colors">
              <ArrowLeft className="h-3 w-3" /> All Services
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-electric mb-3">Tier 4 &mdash; Selective</motion.p>
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight">Equity & Rev-Share</motion.h1>
          <motion.div variants={fadeUp} className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono text-text-primary">No upfront cost</span>
            <span className="text-text-secondary">Flexible timeline</span>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            The same AI infrastructure deliverables with zero upfront investment. We take 3-10% equity or 10-20% revenue share on incremental lift. We evaluate every business before engaging.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20">
              <Link href="/apply?tier=Equity+%2F+Rev-Share">Apply for This Tier <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* DELIVERABLES */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-navy mb-8">What you get</motion.h2>
          <div className="space-y-4">
            {["3\u201310% equity OR 10\u201320% revenue share on incremental lift", "Same deliverables as Tier 1 or Tier 2 engagements", "12\u201324 month revenue share window with clear measurement", "Business evaluation before engagement begins"].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 text-text-primary">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
                <span className="text-lg leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-navy mb-10">Frequently asked questions</motion.h2>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="relative mx-auto max-w-4xl px-6 lg:px-8 py-24 text-center">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-navy">Ready to start?</motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-text-secondary text-lg">Limited spots each quarter. Apply now.</motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20">
              <Link href="/apply?tier=Equity+%2F+Rev-Share">Apply for a Discovery Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
