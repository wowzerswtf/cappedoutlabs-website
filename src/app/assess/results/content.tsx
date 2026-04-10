"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WebPageSchema } from "@/components/SchemaMarkup";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { CheckCircle2, ArrowRight, Mail, Calendar } from "lucide-react";

const TIER_CONFIG: Record<string, {
  colorClass: string;
  bgClass: string;
  borderClass: string;
  action: "calendar" | "nurture";
}> = {
  "ai-ready": {
    colorClass: "text-success",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    action: "calendar",
  },
  "ai-primed": {
    colorClass: "text-electric",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    action: "calendar",
  },
  "ai-curious": {
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    action: "nurture",
  },
  "ai-aware": {
    colorClass: "text-text-secondary",
    bgClass: "bg-gray-50",
    borderClass: "border-gray-200",
    action: "nurture",
  },
};

function ResultsInner() {
  const searchParams = useSearchParams();
  const tierId = searchParams.get("tier") || "ai-primed";
  const score = searchParams.get("score") || "0";
  const label = searchParams.get("label") || "AI Primed";
  const name = searchParams.get("name") || "";

  const config = TIER_CONFIG[tierId] || TIER_CONFIG["ai-primed"];
  const scoreNum = parseInt(score, 10);
  const scorePercent = Math.round((scoreNum / 25) * 100);

  return (
    <>
      <WebPageSchema name="Your AI Readiness Results" path="/assess/results" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-3xl px-6 lg:px-8 pt-36 pb-16 lg:pt-44 lg:pb-20 text-center"
        >
          {/* Tier badge */}
          <motion.div variants={fadeUp}>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ${config.bgClass} ${config.borderClass} border ${config.colorClass}`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {label}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl md:text-5xl font-bold text-navy leading-tight"
          >
            {name ? `${name}, you` : "You"} scored {score}/25
          </motion.h1>

          {/* Score bar */}
          <motion.div variants={fadeUp} className="mt-8 max-w-sm mx-auto">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-electric rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${scorePercent}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-secondary">
              <span>0</span>
              <span>25</span>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary max-w-xl mx-auto"
          >
            {config.action === "calendar"
              ? "Your business is positioned to transform with AI infrastructure. Your full assessment has been sent to your email."
              : "Your AI journey is underway. Your full assessment has been sent to your email with specific recommendations."}
          </motion.p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Email notice */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-electric/20 bg-electric/5 p-6 flex items-start gap-4"
            >
              <Mail className="h-5 w-5 text-electric mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-navy">
                  Check your inbox
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Your full AI Readiness Assessment has been sent to your email.
                  It includes your dimension breakdown, biggest opportunity,
                  cost-of-waiting analysis, and a 90-day roadmap.
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            {config.action === "calendar" ? (
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-border bg-surface/50 p-8 text-center space-y-4"
              >
                <Calendar className="h-8 w-8 text-electric mx-auto" />
                <h2 className="text-2xl font-bold text-navy">
                  Ready to move?
                </h2>
                <p className="text-text-secondary max-w-lg mx-auto">
                  Book a free 30-minute AI Infrastructure Discovery Call.
                  We&apos;ll map your specific bottleneck to a 90-day build plan
                  — no pitch deck, no filler.
                </p>
                <div className="pt-2">
                  <Button asChild className="bg-electric hover:bg-electric-dark text-white rounded-lg h-12 px-8 text-base font-semibold">
                    <a href="https://calendly.com/cappedoutmedia/ai-assessment-meeting" target="_blank" rel="noopener noreferrer">
                      Book Your Discovery Call
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-text-secondary italic">
                  We take on 3 new build clients per month to maintain quality.
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-border bg-surface/50 p-8 text-center space-y-4"
              >
                <h2 className="text-2xl font-bold text-navy">
                  Keep building your AI readiness
                </h2>
                <p className="text-text-secondary max-w-lg mx-auto">
                  You&apos;re not quite ready for a full build — but you&apos;re
                  closer than you think. Explore our resources to see what AI
                  infrastructure looks like in production.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button asChild className="bg-navy hover:bg-navy-light text-white rounded-lg h-12 px-8 text-base font-semibold">
                    <Link href="/resources">
                      Explore Resources
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-lg h-12 px-8 text-base font-semibold">
                    <Link href="/case-studies">
                      View Case Studies
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* What others scored */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-border bg-white p-6 space-y-4"
            >
              <h3 className="text-lg font-bold text-navy">
                How businesses like yours score
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "AI Ready", pct: "18%", desc: "Score 20-25" },
                  { label: "AI Primed", pct: "34%", desc: "Score 14-19" },
                  { label: "AI Curious", pct: "35%", desc: "Score 9-13" },
                  { label: "AI Aware", pct: "13%", desc: "Score 5-8" },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className={`text-center p-3 rounded-xl ${
                      tier.label === label
                        ? "bg-electric/5 border-2 border-electric"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <p className="text-2xl font-bold text-navy font-mono">{tier.pct}</p>
                    <p className="text-xs font-semibold text-text-primary mt-1">{tier.label}</p>
                    <p className="text-xs text-text-secondary">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export function ResultsContent() {
  return (
    <Suspense fallback={null}>
      <ResultsInner />
    </Suspense>
  );
}
