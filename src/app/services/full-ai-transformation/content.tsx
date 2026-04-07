"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/SchemaMarkup";
import { fadeUp, staggerContainer } from "@/lib/animations";

const faqs = [
  { question: "What does 'full transformation' actually mean?", answer: "Every department \u2014 sales, ops, fulfillment, CS, finance, reporting \u2014 gets rebuilt with AI agents handling repetitive workflows. You end up with a business that runs on documented, optimized AI systems instead of manual processes. This is infrastructure-level change, not bolt-on tools." },
  { question: "How does this affect exit multiples?", answer: "Acquirers pay premiums for businesses with documented, scalable infrastructure. AI-native operations reduce key-person risk, demonstrate operational maturity, and show clear paths to margin expansion. The governance framework and due-diligence documentation we build are specifically designed for this." },
  { question: "What is the typical timeline for a full transformation?", answer: "3\u20136 months depending on company size and complexity. Month 1 covers audit and architecture. Months 2\u20134 are build and deployment across departments. The remaining time is optimization, documentation, and handoff. Larger organizations with more departments trend toward 6 months." },
  { question: "What acquirer documentation do you produce?", answer: "A complete AI infrastructure package: system architecture diagrams, workflow documentation, governance protocols, performance benchmarks, staff competency records, optimization histories, and executive dashboards. Everything an acquirer\u2019s technical due-diligence team needs to see." },
  { question: "Who qualifies for a Tier 3 engagement?", answer: "Businesses doing $3M+ annually with at least 10 employees across multiple departments. You need enough operational surface area to justify a full transformation. If you\u2019re not sure, apply and we\u2019ll tell you whether Tier 2 or Tier 3 is the right fit." },
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
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-electric mb-3">Tier 3 &mdash; Exit prep</motion.p>
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight">Full AI Transformation</motion.h1>
          <motion.div variants={fadeUp} className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono text-text-primary">$200K&ndash;$500K+</span>
            <span className="text-text-secondary">3&ndash;6 months</span>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            A complete infrastructure rebuild with AI agents across every department. Governance frameworks, executive dashboards, and full documentation built for acquirer due diligence.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20">
              <Link href="/apply?tier=Full+Transformation+%24200K%2B">Apply for This Tier <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* DELIVERABLES */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-navy mb-8">What you get</motion.h2>
          <div className="space-y-4">
            {["Full infrastructure rebuild with AI agents across all departments", "Governance framework and optimization protocols", "Executive dashboards and reporting systems", "Complete documentation for acquirer due diligence", "Staff training and competency certification across every system"].map((item, i) => (
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
              <Link href="/apply?tier=Full+Transformation+%24200K%2B">Apply for a Discovery Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
