"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { ApplicationForm } from "@/components/ApplicationForm";
import { WebPageSchema } from "@/components/SchemaMarkup";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { CheckCircle2 } from "lucide-react";

const steps = [
  "We review your application (within 24 hours)",
  "If it's a fit, we book a 30-minute discovery call",
  "No pitch decks on the call — just a real conversation",
  "You'll know within 48 hours of the call whether we're moving forward",
];

const trustSignals = [
  "From the team behind Capped Out Media",
  "Limited spots per quarter — we're embedded partners, not a volume shop",
  "Discovery call is free. No obligation.",
];

export function ApplyContent() {
  return (
    <>
      <WebPageSchema name="Apply for a Discovery Call" path="/apply" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-4xl px-6 lg:px-8 pt-36 pb-16 lg:pt-44 lg:pb-20 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold text-navy leading-tight"
          >
            Apply for a discovery call
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-text-secondary"
          >
            If you&apos;re a fit, we respond within 24 hours.
          </motion.p>
        </motion.div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-white p-6 lg:p-8">
                <Suspense fallback={null}>
                  <ApplicationForm />
                </Suspense>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="sticky top-28 space-y-8"
              >
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <h3 className="text-lg font-bold text-navy mb-4">
                    What happens next
                  </h3>
                  <ol className="space-y-3">
                    {steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-electric/10 text-electric text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <ul className="space-y-3">
                    {trustSignals.map((signal, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        {signal}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
