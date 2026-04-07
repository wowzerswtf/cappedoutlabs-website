"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/SchemaMarkup";
import { fadeUp, staggerContainer } from "@/lib/animations";

const faqs = [
  { question: "What does a Tier 2 engagement actually look like?", answer: "We start with the audit findings from a Tier 1 sprint (or run one if you haven't done a sprint yet). From there we scope 3-5 workflows across sales, ops, fulfillment, and customer success. Each workflow is built, tested, and deployed into your existing tools with staff training and recorded SOPs. The entire engagement runs 6-10 weeks depending on complexity." },
  { question: "Which departments does Tier 2 cover?", answer: "Any combination of sales, operations, fulfillment, and customer success. We prioritize based on revenue impact. Most engagements touch at least three departments, with sales and ops being the most common starting points." },
  { question: "What does the 90-day managed handoff include?", answer: "After the build phase, we run three 30-day optimization cycles. Each cycle includes performance monitoring, system tuning, staff Q&A sessions, and workflow adjustments based on real usage data. By the end, your team operates the systems independently." },
  { question: "How is pricing determined within the $50K-$150K range?", answer: "Scope drives price. A 3-workflow engagement across two departments lands at the lower end. A 5-workflow build across four departments with complex integrations lands at the upper end. We scope everything before you commit, so there are no surprises." },
  { question: "Do I need to do a Tier 1 sprint first?", answer: "It's recommended but not required. The sprint gives us audit data that makes Tier 2 scoping faster and more precise. If you skip the sprint, we build the audit phase into the first two weeks of the Tier 2 engagement." },
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
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-electric mb-3">Tier 2 &mdash; Most popular</motion.p>
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight">AI Revenue Infrastructure</motion.h1>
          <motion.div variants={fadeUp} className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono text-text-primary">$50K&ndash;$150K</span>
            <span className="text-text-secondary">6&ndash;10 weeks</span>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Multiple AI workflows deployed across your entire operation. Staff training, recorded SOPs, and a 90-day managed handoff so your team owns the systems long after we leave.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20">
              <Link href="/apply?tier=AI+Revenue+Infrastructure+%2450K-%24150K">Apply for This Tier <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* DELIVERABLES */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-navy mb-8">What you get</motion.h2>
          <div className="space-y-4">
            {["3\u20135 core workflows rebuilt with AI across departments", "Coverage across sales, ops, fulfillment, and customer success", "Staff training with recorded SOPs for every workflow", "90-day managed handoff with optimization cycles", "Performance dashboards tracking each workflow\u2019s revenue impact"].map((item, i) => (
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
            <p className="text-sm font-semibold text-electric mb-2">Tier 2 result &mdash; Closer OS</p>
            <p className="text-text-primary leading-relaxed">A full Tier 2 engagement grew revenue from $200K to $3.9M, dropped CAC by 90%, and achieved 23.4x ROAS in 45 days.</p>
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
              <Link href="/apply?tier=AI+Revenue+Infrastructure+%2450K-%24150K">Apply for a Discovery Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
