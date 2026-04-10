"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { AssessmentQuiz } from "@/components/AssessmentQuiz";
import { WebPageSchema } from "@/components/SchemaMarkup";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { CheckCircle2, Clock, Zap, Shield } from "lucide-react";

const trustSignals = [
  {
    icon: Clock,
    text: "Takes under 2 minutes",
  },
  {
    icon: Zap,
    text: "Instant personalized results",
  },
  {
    icon: Shield,
    text: "No obligation. No pitch deck.",
  },
];

const socialProof = [
  "From the team behind $6M+/yr Capped Out Media",
  "AI systems deployed in production businesses",
  "+1,866% revenue growth for one client in 45 days",
];

export function AssessContent() {
  return (
    <>
      <WebPageSchema name="Free AI Readiness Assessment" path="/assess" />

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
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-electric/10 px-4 py-1.5 text-sm font-semibold text-electric mb-6"
          >
            <Zap className="h-3.5 w-3.5" />
            Free AI Assessment
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold text-navy leading-tight"
          >
            Find out where your business
            <br className="hidden sm:block" />
            stands on AI
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto"
          >
            5 questions. Personalized assessment. Delivered to your inbox in
            seconds — with your readiness score, biggest opportunity, and a
            90-day roadmap.
          </motion.p>
        </motion.div>
      </section>

      {/* QUIZ + SIDEBAR */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Quiz */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-white p-6 lg:p-8 shadow-sm">
                <Suspense fallback={null}>
                  <AssessmentQuiz />
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
                {/* Quick info */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <h3 className="text-lg font-bold text-navy mb-4">
                    What you&apos;ll get
                  </h3>
                  <ul className="space-y-4">
                    {trustSignals.map((signal, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                        <signal.icon className="h-4 w-4 text-electric mt-0.5 shrink-0" />
                        {signal.text}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Social proof */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <ul className="space-y-3">
                    {socialProof.map((proof, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        {proof}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* What the assessment covers */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <h3 className="text-lg font-bold text-navy mb-4">
                    Your assessment includes
                  </h3>
                  <ul className="space-y-2.5 text-sm text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-electric font-bold mt-px">1.</span>
                      AI readiness score across 5 dimensions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-electric font-bold mt-px">2.</span>
                      Your #1 AI opportunity with real case study data
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-electric font-bold mt-px">3.</span>
                      Cost-of-waiting analysis based on your revenue
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-electric font-bold mt-px">4.</span>
                      Personalized 90-day AI implementation roadmap
                    </li>
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
