"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/SchemaMarkup";
import { fadeUp, staggerContainer } from "@/lib/animations";

const faqs = [
  { question: "What happens in the AI Revenue Sprint?", answer: "Week 1: AI readiness audit across sales, ops, fulfillment, and CS. We identify every workflow where AI can move a revenue metric. Week 2: We build the single highest-leverage workflow live in your environment, test it, and deploy it. You get 30 days of support after deployment." },
  { question: "What kind of results can I expect from a sprint?", answer: "It depends on the workflow we build. In one sprint, a pre-call intelligence system drove show rate from 26.3% to 77.9%. The sprint identifies and builds the workflow with the highest revenue impact in your specific business." },
  { question: "Do I need a technical team for the sprint?", answer: "No. We build, deploy, and support the system. Your team needs to be available for interviews during the audit week and for training during deployment. No technical skills required." },
  { question: "What if I want to do more after the sprint?", answer: "Every sprint includes a scoped SOW for Tier 2 (AI Revenue Infrastructure). You'll know exactly what the next engagement looks like, what it costs, and what it delivers. No pressure — the sprint stands on its own." },
  { question: "Is $15K refundable if I'm not satisfied?", answer: "We scope every sprint against a specific, measurable workflow before starting. If the audit reveals that AI won't meaningfully move your numbers, we'll tell you before you invest in the build phase." },
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
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-electric mb-3">Tier 1</motion.p>
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight">AI Revenue Sprint</motion.h1>
          <motion.div variants={fadeUp} className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono text-text-primary">$15,000</span>
            <span className="text-text-secondary">2 weeks</span>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            The fastest way to see what AI can do for your business. A full readiness audit plus one high-leverage workflow built, deployed, and supported.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20">
              <Link href="/apply?tier=AI+Revenue+Sprint+%2415K">Apply for This Tier <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* DELIVERABLES */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-navy mb-8">What you get</motion.h2>
          <div className="space-y-4">
            {["AI readiness audit across sales, ops, fulfillment, and CS", "Single highest-leverage workflow identified and built live", "Production deployment into your existing tools", "30-day support window post-deployment", "Clear ascension path to Tier 2 with scoped SOW"].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 text-text-primary">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
                <span className="text-lg leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-white p-6 lg:p-8">
            <p className="text-sm font-semibold text-electric mb-2">Sprint result — Closer OS</p>
            <p className="text-text-primary leading-relaxed">A single pre-call intelligence workflow built in a sprint drove show rate from 26.3% to 77.9% and was the foundation for a full engagement that grew revenue from $200K to $3.9M in 45 days.</p>
            <Link href="/case-studies/portfolio-brand-ai-sales-infrastructure" className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric mt-4 hover:text-electric-dark transition-colors">
              View the full case study <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
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
              <Link href="/apply?tier=AI+Revenue+Sprint+%2415K">Apply for a Discovery Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
