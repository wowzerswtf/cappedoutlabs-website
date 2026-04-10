"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  CheckCircle2,
  ArrowRight,
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Shield,
} from "lucide-react";

const TIER_CONFIG: Record<
  string,
  {
    colorClass: string;
    bgClass: string;
    borderClass: string;
    action: "calendar" | "nurture";
    urgencyMessage: string;
    ctaText: string;
  }
> = {
  "ai-ready": {
    colorClass: "text-success",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    action: "calendar",
    urgencyMessage:
      "Your business is in the top 18% for AI readiness. Every week without infrastructure is revenue left on the table.",
    ctaText: "Claim Your Discovery Call",
  },
  "ai-primed": {
    colorClass: "text-electric",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    action: "calendar",
    urgencyMessage:
      "You're primed for a breakout. Businesses at your stage see the fastest ROI from AI infrastructure builds.",
    ctaText: "Book Your Free Discovery Call",
  },
  "ai-curious": {
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    action: "nurture",
    urgencyMessage:
      "You're closer to ready than most. A 30-minute call can reveal 3-5 opportunities you're not seeing.",
    ctaText: "Talk to Us About Your Options",
  },
  "ai-aware": {
    colorClass: "text-text-secondary",
    bgClass: "bg-gray-50",
    borderClass: "border-gray-200",
    action: "nurture",
    urgencyMessage:
      "You're early — and that's an advantage. You can skip the mistakes 80% of businesses make with AI.",
    ctaText: "Get a Free Strategy Overview",
  },
};

function FunnelResultsInner() {
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
      {/* ═══ HERO — Score reveal with animation ═══ */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-3xl px-6 lg:px-8 pt-12 pb-8 lg:pt-16 lg:pb-12 text-center"
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
            className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight"
          >
            {name ? `${name}, you` : "You"} scored{" "}
            <span className="gradient-text">{score}/25</span>
          </motion.h1>

          {/* Animated score bar */}
          <motion.div variants={fadeUp} className="mt-8 max-w-sm mx-auto">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-electric to-blue-400"
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
            className="mt-6 text-base text-text-secondary max-w-xl mx-auto"
          >
            {config.urgencyMessage}
          </motion.p>
        </motion.div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Email notification */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-electric/20 bg-electric/5 p-5 flex items-start gap-4"
            >
              <Mail className="h-5 w-5 text-electric mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-navy">
                  Your full report is in your inbox
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Includes your dimension breakdown, biggest opportunity,
                  cost-of-waiting analysis, and 90-day roadmap as a branded PDF.
                </p>
              </div>
            </motion.div>

            {/* ═══ PRIMARY CTA — urgency-driven calendar booking ═══ */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border-2 border-electric bg-white p-8 text-center space-y-5"
            >
              {/* Scarcity badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-sm font-semibold text-amber-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                3 spots left this month
              </div>

              <Calendar className="h-10 w-10 text-electric mx-auto" />

              <h2 className="text-2xl font-bold text-navy">
                {config.action === "calendar"
                  ? "Your next step: a free discovery call"
                  : "Want to know what's possible?"}
              </h2>

              <p className="text-text-secondary max-w-md mx-auto">
                {config.action === "calendar"
                  ? "30 minutes. No pitch deck. We'll map your #1 bottleneck to a 90-day build plan with projected ROI."
                  : "Even at your stage, a quick conversation can uncover 3-5 opportunities you're not seeing. Free, no obligation."}
              </p>

              {/* Trust signals next to CTA — social proof at friction point */}
              <div className="flex flex-wrap justify-center gap-4 text-xs text-text-secondary">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 30 min
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> No pitch deck
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> 3 spots/month
                </span>
              </div>

              <div className="pt-1">
                <Button
                  asChild
                  className="bg-electric hover:bg-electric-dark text-white rounded-xl h-14 px-10 text-base font-semibold shadow-lg shadow-electric/20"
                >
                  <a
                    href="https://calendly.com/cappedoutmedia/ai-assessment-meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {config.ctaText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>

              <p className="text-xs text-text-secondary/60 italic">
                We take on 3 new build clients per month to maintain quality.
                {config.action === "calendar" &&
                  " Your score qualifies you for priority scheduling."}
              </p>
            </motion.div>

            {/* ═══ WHAT HAPPENS NEXT — reduces uncertainty ═══ */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-border bg-white p-6 space-y-4"
            >
              <h3 className="text-lg font-bold text-navy">
                What happens on the call
              </h3>
              <div className="space-y-3">
                {[
                  {
                    num: "1",
                    title: "We review your assessment together",
                    desc: "Walk through your score, dimensions, and what they mean for your business.",
                  },
                  {
                    num: "2",
                    title: "Map your #1 bottleneck",
                    desc: "Identify the single biggest lever where AI moves the needle fastest.",
                  },
                  {
                    num: "3",
                    title: "Get a 90-day build plan",
                    desc: "Walk away with a concrete plan — whether you work with us or not.",
                  },
                ].map((item) => (
                  <div key={item.num} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-electric/10 flex items-center justify-center text-xs font-bold text-electric">
                      {item.num}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {item.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ═══ HOW OTHERS SCORE — social proof comparison ═══ */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-border bg-white p-6 space-y-4"
            >
              <h3 className="text-lg font-bold text-navy">
                How businesses like yours score
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "AI Ready", pct: "18%", desc: "20-25", color: "emerald" },
                  { label: "AI Primed", pct: "34%", desc: "14-19", color: "blue" },
                  { label: "AI Curious", pct: "35%", desc: "9-13", color: "amber" },
                  { label: "AI Aware", pct: "13%", desc: "5-8", color: "gray" },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className={`text-center p-3 rounded-xl ${
                      tier.label === label
                        ? "bg-electric/5 border-2 border-electric"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <p className="text-2xl font-bold text-navy font-mono">
                      {tier.pct}
                    </p>
                    <p className="text-xs font-semibold text-text-primary mt-1">
                      {tier.label}
                    </p>
                    <p className="text-xs text-text-secondary">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ═══ CASE STUDY PROOF — before/after ═══ */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-border bg-white p-6 space-y-4"
            >
              <h3 className="text-lg font-bold text-navy">
                What AI infrastructure looks like in production
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: TrendingUp,
                    metric: "+1,866%",
                    label: "Revenue growth",
                    context: "Supplement brand, 45 days",
                  },
                  {
                    icon: Users,
                    metric: "77.9%",
                    label: "Show rate",
                    context: "Up from 26.3%",
                  },
                  {
                    icon: Shield,
                    metric: "90%",
                    label: "CAC reduction",
                    context: "Same spend, more customers",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-4 rounded-xl bg-surface border border-border"
                  >
                    <item.icon className="h-5 w-5 text-electric mx-auto" />
                    <p className="text-2xl font-bold text-navy font-mono mt-2">
                      {item.metric}
                    </p>
                    <p className="text-xs font-semibold text-text-primary mt-1">
                      {item.label}
                    </p>
                    <p className="text-xs text-text-secondary">{item.context}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ═══ FINAL CTA — repeat at bottom ═══ */}
            <motion.div variants={fadeUp} className="text-center pt-4">
              <Button
                asChild
                className="bg-navy hover:bg-navy-light text-white rounded-xl h-14 px-10 text-base font-semibold"
              >
                <a
                  href="https://calendly.com/cappedoutmedia/ai-assessment-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Your Free Discovery Call
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <p className="text-xs text-text-secondary/60 mt-3">
                30 minutes. No obligation. You keep the roadmap either way.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export function FunnelResultsContent() {
  return (
    <Suspense fallback={null}>
      <FunnelResultsInner />
    </Suspense>
  );
}
