"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FAQAccordion, type FAQItem } from "@/components/FAQAccordion";
import { ServiceSchema, FAQSchema, WebPageSchema } from "@/components/SchemaMarkup";
import { CTABanner } from "@/components/CTABanner";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { ArrowRight } from "lucide-react";

const tierDetails = [
  {
    name: "AI Revenue Sprint",
    slug: "ai-revenue-sprint",
    price: "$15,000",
    timeline: "2 weeks",
    applyValue: "AI Revenue Sprint $15K",
    proof: "→ A sprint pre-call workflow drove show rate from 26.3% to 77.9%",
    whoFor:
      "Operators who know AI is the next move but want a real deliverable before writing a bigger check.",
    deliverables: [
      "AI readiness audit across sales, ops, fulfillment, and CS",
      "Single highest-leverage workflow identified and built live",
      "30-day support window post-deployment",
      "Clear ascension path to Tier 2 with scoped SOW",
    ],
    outcome:
      "A working AI system in production, a documented audit of your highest-leverage opportunities, and a clear path to scale.",
  },
  {
    name: "AI Revenue Infrastructure",
    slug: "ai-revenue-infrastructure",
    price: "$50K–$150K",
    timeline: "6–10 weeks",
    applyValue: "AI Revenue Infrastructure $50K-$150K",
    proof: "→ See how a Tier 2 engagement delivered 23.4x ROAS in 45 days",
    featured: true,
    whoFor:
      "Established businesses doing $3M+ that are ready to rebuild core workflows around AI.",
    deliverables: [
      "3–5 core workflows rebuilt with AI across departments",
      "Coverage across sales, operations, fulfillment, and customer success",
      "Staff training with recorded SOPs",
      "90-day managed handoff with optimization cycles",
    ],
    outcome:
      "A business running leaner with AI systems your team actually uses. Revenue impact visible within the engagement.",
  },
  {
    name: "Full AI Transformation",
    slug: "full-ai-transformation",
    price: "$200K–$500K+",
    timeline: "3–6 months",
    applyValue: "Full Transformation $200K+",
    proof: "→ 200+ production AI systems deployed across 30+ verticals — from sales automation to full operational infrastructure",
    whoFor:
      "Operators preparing for acquisition who need AI systematization across the entire business.",
    deliverables: [
      "Full infrastructure rebuild with AI agents across all departments",
      "Governance framework and optimization protocols",
      "Executive dashboards and reporting systems",
      "Complete documentation for due diligence",
    ],
    outcome:
      "A business positioned for a premium exit multiple. Systems, not headcount, driving revenue. Acquirer-ready documentation.",
  },
  {
    name: "Equity / Rev-Share",
    slug: "equity-rev-share",
    price: "No upfront cost",
    timeline: "Flexible",
    applyValue: "Equity / Rev-Share",
    proof: "→ Our portfolio brands have scaled from zero to eight figures — we only take equity when we know we can deliver",
    whoFor:
      "Operators with businesses that have real upside — where our incentives align with yours.",
    deliverables: [
      "3–10% equity OR 10–20% revenue share on incremental lift",
      "Same deliverables as Tier 1 or Tier 2 engagements",
      "12–24 month revenue share window",
      "Business evaluation before engagement — we assess the operator and the opportunity",
    ],
    outcome:
      "Aligned incentives. We make money when you make money. Same build quality, different payment structure.",
  },
];

const processSteps = [
  { step: "01", title: "Apply", body: "4-minute application. We review within 24 hours." },
  { step: "02", title: "Discovery", body: "30-minute call. No pitch decks. Real conversation." },
  { step: "03", title: "Build", body: "We design, build, and deploy your system." },
  { step: "04", title: "Handoff", body: "Documentation, training, 30–90 day support." },
];

const faqs: FAQItem[] = [
  {
    question: "We tried AI before and it didn't work.",
    answer: "Almost every time we hear this, what happened is someone installed a tool and hoped the team would use it. Installing tools is not transformation. Building systems is. We've never walked away from a client because their previous attempt failed — we use it as a diagnostic.",
  },
  {
    question: "Our data is a mess. Are we ready?",
    answer: "Data readiness is part of what we audit in week one. Most clients aren't ready — that's normal and expected. It's not a blocker.",
  },
  {
    question: "We already have someone working on AI internally.",
    answer: "Good. We work alongside internal teams on every engagement. The businesses that get the most from us have someone internal who can own what we build after handoff.",
  },
  {
    question: "What does the equity path actually look like?",
    answer: "We take 3–10% equity or a 10–20% revenue share on the incremental lift we create, for 12–24 months. We evaluate the business, the operator, and the upside — not the ability to write a check. Apply and we'll have the conversation.",
  },
  {
    question: "How is this different from hiring an AI consultant?",
    answer: "Consultants deliver advice. We deliver running systems. The difference shows up on day 90 when your system is still operating, not gathering dust in a Notion doc.",
  },
];

export function ServicesContent() {
  return (
    <>
      <ServiceSchema />
      <FAQSchema items={faqs} />
      <WebPageSchema name="AI Consulting Services & Pricing" path="/services" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-4xl px-6 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-28 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-base text-text-secondary leading-relaxed max-w-2xl mx-auto mb-8"
          >
            An AI transformation engagement delivers production systems your team uses daily — not a strategy deck. Depending on the tier, you get an AI readiness audit, 1–5+ rebuilt workflows, staff training with recorded SOPs, and a 30–90 day managed handoff. Every deliverable is anchored to a revenue metric.
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight"
          >
            AI systems built for operators who think in exits
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
          >
            Choose your entry point. Every path leads to the same place — a
            business that runs leaner, closes faster, and exits at a premium.
          </motion.p>
        </motion.div>
      </section>

      {/* TIER DETAILS */}
      {tierDetails.map((tier, i) => (
        <section key={i} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto max-w-6xl px-6 lg:px-8 py-20"
          >
            <div className={`rounded-2xl border p-8 lg:p-10 ${tier.featured ? "border-electric bg-electric/[0.02]" : "border-border bg-white"}`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Left — info */}
                <div className="lg:col-span-2">
                  <motion.div variants={fadeUp}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-3">
                      Tier {i + 1}
                    </p>
                    <h2 className="text-2xl font-bold text-navy">{tier.name}</h2>
                    <div className="mt-3 flex items-baseline gap-3">
                      <span className="text-2xl font-bold font-mono text-text-primary">
                        {tier.price}
                      </span>
                      <span className="text-sm text-text-secondary">{tier.timeline}</span>
                    </div>
                  </motion.div>

                  <motion.p
                    variants={fadeUp}
                    className="mt-5 text-sm text-text-secondary leading-relaxed"
                  >
                    <span className="font-semibold text-text-primary">Who it&apos;s for:</span>{" "}
                    {tier.whoFor}
                  </motion.p>

                  <motion.div variants={fadeUp} className="mt-6">
                    <Button
                      asChild
                      className={`rounded-xl px-6 h-10 text-sm font-semibold ${tier.featured ? "bg-electric hover:bg-electric-dark text-white" : "bg-navy hover:bg-navy-light text-white"}`}
                    >
                      <Link href={`/apply?tier=${encodeURIComponent(tier.applyValue)}`}>
                        Apply for This Tier
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Right — deliverables + outcome */}
                <div className="lg:col-span-3 space-y-8">
                  <motion.div variants={fadeUp}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">
                      What you get
                    </h3>
                    <ul className="space-y-3">
                      {tier.deliverables.map((d, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-text-primary">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                      What it looks like at the end
                    </h3>
                    <p className="text-sm text-text-primary leading-relaxed">{tier.outcome}</p>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <p className="text-sm font-semibold text-electric">{tier.proof}</p>
                    <Link
                      href={`/services/${tier.slug}`}
                      className="text-sm font-semibold text-navy hover:text-electric transition-colors flex items-center gap-1"
                    >
                      Learn more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      ))}

      {/* PROCESS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 lg:py-32">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-navy text-center mb-16"
          >
            The process
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-surface/50 p-6 glow-border"
              >
                <span className="text-3xl font-bold font-mono text-electric/30">{step.step}</span>
                <h3 className="mt-2 text-lg font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-24 lg:py-32">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-navy text-center mb-12"
          >
            Common questions
          </motion.h2>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      <CTABanner />
    </>
  );
}
