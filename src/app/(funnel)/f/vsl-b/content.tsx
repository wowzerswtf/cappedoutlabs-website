"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VSLSurvey } from "@/components/VSLSurvey";
import {
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  X,
  ChevronDown,
} from "lucide-react";

// ── Conversion Bible Tactics Applied ─────────────────────────────
// 1.  Tunnel checkout — (funnel) route group strips nav/footer
// 2.  Decrease form fields — 2 fields in gate, survey is clickable cards
// 3.  Exit-intent popup — fires on mouse leave + scroll abandon
// 4.  Sticky CTA on mobile — fixed bottom bar always visible
// 5.  Self-qualification quiz — survey modal with disqualification
// 6.  Upfront progress — progress bar starts at 20%
// 7.  Social proof at friction — testimonials next to CTA
// 8.  Don't make forms look like forms — large clickable card options
// 9.  Comparison charts — "With AI vs Without AI" side by side
// 10. Before & after — case study metrics with context
// 11. Urgency elements — countdown timer + "3 spots left"
// 12. Trust seals — badges below every CTA
// 13. FAQ section — objection busting
// 14. 'As Seen In' credibility — social proof strip
// 15. Founder credibility — operator backstory
// 16. Progress bar — in survey modal
// 17. Benefit bar — above the fold benefits strip
// 18. Video — VSL centered, prominent
// 19. Reciprocity — free assessment before ask
// 20. Guarantee — risk reversal statement
// 21. Upsell on thank you — calendar CTA in survey completion
// 22. Word picture copy — vivid, specific language
// 23. Appeal to ego — "operators who think in exits"
// 24. Testimonials — multiple, specific with metrics
// 25. Single-column layout — clean, no distractions
// 26. Prominent contact info — builds trust
// 27. Decoy effect — tier comparison showing middle tier value
// 28. Scarcity — "3 clients/month" capacity constraint

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ── Countdown Timer Hook ─────────────────────────────────────────
function useCountdown() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set deadline to end of current day
    function getTimeLeft() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }
    setTime(getTimeLeft());
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

// ── Exit Intent Hook ─────────────────────────────────────────────
function useExitIntent(enabled: boolean) {
  const [show, setShow] = useState(false);
  const [fired, setFired] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 0 && !fired && enabled) {
        setShow(true);
        setFired(true);
      }
    },
    [fired, enabled]
  );

  useEffect(() => {
    document.addEventListener("mouseout", handleMouseLeave);
    return () => document.removeEventListener("mouseout", handleMouseLeave);
  }, [handleMouseLeave]);

  return { show, close: () => setShow(false) };
}

// ── Main Component ───────────────────────────────────────────────
export function VSLBContent() {
  const [surveyOpen, setSurveyOpen] = useState(false);
  const countdown = useCountdown();
  const exitIntent = useExitIntent(!surveyOpen);
  const [stickyVisible, setStickyVisible] = useState(false);

  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    function handleScroll() {
      setStickyVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSurvey = () => setSurveyOpen(true);

  return (
    <>
      {/* ═══ TACTIC 17: BENEFIT BAR — above everything ═══ */}
      <div className="bg-navy text-white text-center py-2.5 px-4">
        <p className="text-xs sm:text-sm font-medium tracking-wide">
          <span className="text-amber-300 font-bold">LIMITED:</span> We deploy
          AI into 3 businesses per month.{" "}
          <span className="hidden sm:inline">
            Applications close in{" "}
            <span className="font-mono font-bold">
              {String(countdown.hours).padStart(2, "0")}:
              {String(countdown.minutes).padStart(2, "0")}:
              {String(countdown.seconds).padStart(2, "0")}
            </span>
          </span>
        </p>
      </div>

      {/* ═══ HERO SECTION — VSL + Headline + CTA ═══ */}
      <section className="bg-white px-4 sm:px-6">
        <div className="w-full max-w-[800px] mx-auto pt-8 sm:pt-12 pb-6">
          {/* TACTIC 23: Appeal to ego */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center text-xs sm:text-sm font-semibold text-electric uppercase tracking-widest mb-4"
          >
            For operators who think in exits
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center text-2xl sm:text-3xl md:text-[2.75rem] md:leading-[1.12] font-bold text-navy mb-4 sm:mb-6"
          >
            AI consultants sell decks.
            <br />
            We deploy machines that print revenue.
          </motion.h1>

          {/* TACTIC 22: Word picture copy — vivid subheadline */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            Watch how one portfolio brand went from bleeding $14K/mo on closers
            to a single AI-augmented rep doing 8x the output — in 45 days.
          </motion.p>

          {/* TACTIC 11: Urgency badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-sm font-semibold text-amber-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              3 spots left this month
            </span>
          </motion.div>

          {/* VSL Video — TACTIC 18 */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
            {/* Replace with Vimeo embed: <iframe src="https://player.vimeo.com/video/VIDEO_ID" .../> */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy to-navy/90">
              <div className="text-center text-white/80 space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center cursor-pointer hover:border-white/60 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-sm font-medium tracking-wide uppercase">
                  Watch the Free Training
                </p>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="text-center">
            <button
              onClick={openSurvey}
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-base sm:text-lg font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Apply Now — Limited Spots
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* TACTIC 12: Trust seals below CTA */}
          <div className="flex items-center justify-center gap-5 text-xs text-text-secondary/70 mt-4">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> No obligation
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 2-min application
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Free discovery call
            </span>
          </div>
        </div>
      </section>

      {/* ═══ TACTIC 14: CREDIBILITY STRIP — "As Seen In" / Social Proof ═══ */}
      <section className="bg-surface border-y border-border/50 py-6 px-4">
        <div className="max-w-[800px] mx-auto">
          <p className="text-center text-xs font-semibold text-text-secondary/50 uppercase tracking-widest mb-4">
            From the team that has pushed over a billion in sales
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { stat: "$1B+", label: "Revenue pushed" },
              { stat: "1,866%", label: "Client revenue growth" },
              { stat: "90%", label: "CAC reduction" },
              { stat: "8x", label: "Output per closer" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xl sm:text-2xl font-bold text-navy font-mono">
                  {item.stat}
                </p>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TACTIC 10: BEFORE & AFTER ═══ */}
      <section className="bg-white py-12 sm:py-16 px-4">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-10">
            What changes when AI runs your revenue engine
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Without AI */}
            <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
              <p className="text-sm font-bold text-red-700 uppercase tracking-wide mb-4">
                Without AI Infrastructure
              </p>
              <ul className="space-y-3">
                {[
                  "3 closers burning $14K/mo in payroll",
                  "26% show rate — 3 out of 4 no-show",
                  "$847 cost to acquire one customer",
                  "Tribal knowledge — nothing documented",
                  "Revenue flatlines when you step away",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                    <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* With AI */}
            <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-6">
              <p className="text-sm font-bold text-green-700 uppercase tracking-wide mb-4">
                With Capped Out Labs
              </p>
              <ul className="space-y-3">
                {[
                  "1 AI-augmented rep — 8x the output",
                  "77.9% show rate — automated follow-up",
                  "$84 CAC — 90% reduction",
                  "Every playbook, script, and process in AI",
                  "Revenue compounds whether you're there or not",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-green-800">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA repeat */}
          <div className="text-center mt-10">
            <button
              onClick={openSurvey}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              See If You Qualify
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ TACTIC 24: TESTIMONIALS — specific, metric-driven ═══ */}
      <section className="bg-surface py-12 sm:py-16 px-4 border-y border-border/50">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-10">
            Operators who deployed AI with us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                quote:
                  "The AI-assisted closing platform gave us so much intelligence and streamlined activity that we went from 3 closers to 1 — with 8x the output.",
                name: "Portfolio brand operator",
                detail: "$3M ARR",
                metric: "+1,866% revenue in 45 days",
              },
              {
                quote:
                  "Show rate went from 26% to 78% in the first month. The AI follow-up system catches every lead that used to fall through the cracks.",
                name: "Service business owner",
                detail: "$1.2M ARR",
                metric: "77.9% show rate",
              },
              {
                quote:
                  "We cut customer acquisition cost by 90%. The AI qualification system only sends us buyers, not tire-kickers.",
                name: "DTC brand founder",
                detail: "$5M ARR",
                metric: "90% CAC reduction",
              },
              {
                quote:
                  "I was skeptical about 'AI consultants' but these guys actually deploy production systems. It paid for itself in week 2.",
                name: "Multi-location operator",
                detail: "$8M ARR",
                metric: "ROI in 14 days",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border bg-white p-6 space-y-3"
              >
                <p className="text-xs font-bold text-electric">{t.metric}</p>
                <p className="text-sm text-navy italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-xs text-text-secondary font-semibold">
                  — {t.name}, {t.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TACTIC 15: FOUNDER CREDIBILITY ═══ */}
      <section className="bg-white py-12 sm:py-16 px-4">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-6">
            Built by operators. Not consultants.
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Capped Out Labs was built inside a supplement incubator that has
            pushed over a billion in sales. We didn&apos;t learn
            about business from a textbook — we learned it from scaling brands,
            managing closers, and acquiring companies.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            When we saw what AI could do inside our own operations — cutting
            closer teams, automating follow-up, slashing acquisition costs — we
            built a firm to deploy these exact systems into other
            operators&apos; businesses.
          </p>
          <p className="text-navy font-semibold">
            Every system we install is anchored to revenue metrics, not theory.
            If it doesn&apos;t move money, we don&apos;t build it.
          </p>
        </div>
      </section>

      {/* ═══ TACTIC 27: DECOY EFFECT — Tier Comparison ═══ */}
      <section className="bg-surface py-12 sm:py-16 px-4 border-y border-border/50">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-3">
            Three ways we deploy
          </h2>
          <p className="text-center text-text-secondary mb-10">
            Every engagement is done-for-you. We build it. We install it. You
            collect the revenue.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                tier: "Sprint",
                price: "$15K–$25K",
                desc: "One AI system deployed in 30 days",
                features: [
                  "Single revenue bottleneck",
                  "Full deployment + training",
                  "30-day support",
                ],
                highlight: false,
              },
              {
                tier: "Infrastructure",
                price: "$50K–$100K",
                desc: "Full AI revenue stack in 90 days",
                features: [
                  "Multi-system deployment",
                  "Sales + ops + follow-up AI",
                  "90-day embedded support",
                  "Monthly optimization calls",
                ],
                highlight: true,
              },
              {
                tier: "Equity / Rev-Share",
                price: "Custom",
                desc: "We invest our systems for equity",
                features: [
                  "Full transformation",
                  "Skin-in-the-game alignment",
                  "Exit-prep framing",
                  "Reserved for $5M+ operators",
                ],
                highlight: false,
              },
            ].map((t) => (
              <div
                key={t.tier}
                className={`rounded-xl border-2 p-6 ${
                  t.highlight
                    ? "border-electric bg-white shadow-lg relative"
                    : "border-border bg-white"
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-electric text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <p className="text-sm font-bold text-electric uppercase tracking-wide">
                  {t.tier}
                </p>
                <p className="text-2xl font-bold text-navy mt-2">{t.price}</p>
                <p className="text-xs text-text-secondary mt-1 mb-4">
                  {t.desc}
                </p>
                <ul className="space-y-2">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <button
              onClick={openSurvey}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Apply Now — See Which Tier Fits
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ TACTIC 20: GUARANTEE — Risk Reversal ═══ */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-3">
            The &ldquo;It Pays For Itself&rdquo; Guarantee
          </h2>
          <p className="text-text-secondary leading-relaxed">
            If the AI systems we deploy don&apos;t generate measurable ROI
            within the first 90 days, we keep working — at no additional cost —
            until they do. We&apos;ve never had to invoke this because we
            don&apos;t take clients we can&apos;t help. The qualification
            process exists to protect both of us.
          </p>
        </div>
      </section>

      {/* ═══ TACTIC 13: FAQ — Objection Busting ═══ */}
      <section className="bg-surface py-12 sm:py-16 px-4 border-y border-border/50">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-10">
            Common questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "How is this different from every other AI consulting firm?",
                a: "We don't consult. We deploy. You get production systems installed in your business — not a strategy deck and a handshake. Every system is built by operators who've scaled real businesses, not technologists who learned about business from a course.",
              },
              {
                q: "What kind of businesses do you work with?",
                a: "Operators doing $500K–$50M+ in annual revenue who have a sales or operations bottleneck that AI can solve. We're not a fit for pre-revenue startups or businesses looking for chatbots.",
              },
              {
                q: "How fast do you see results?",
                a: "Most clients see measurable impact within 30–45 days. Our fastest result was 1,866% revenue growth in 45 days. Typical results include 50-90% reduction in CAC, 2-3x show rate improvement, and significant headcount reduction.",
              },
              {
                q: "Why do you only take 3 clients per month?",
                a: "Because we embed with you. We're not shipping templates — we're building custom AI infrastructure for your specific business. That takes focused attention. More clients = worse results. We'd rather have 36 case studies a year than 360 mediocre deployments.",
              },
              {
                q: "What if AI doesn't work for my industry?",
                a: "If you have a sales team, a follow-up process, or customer acquisition costs, AI works. We've deployed across supplements, services, contracting, real estate, med spas, and more. The discovery call will tell us both if it's a fit.",
              },
              {
                q: "What does the discovery call look like?",
                a: "30 minutes. We ask about your business, your bottlenecks, and your goals. If we can help, we'll tell you exactly how and what it costs. If we can't, we'll tell you that too. No pressure, no pitch deck, no follow-up spam.",
              },
            ].map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA SECTION ═══ */}
      <section className="bg-navy py-14 sm:py-20 px-4">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Your competitors are deploying AI right now.
            <br />
            <span className="text-amber-300">How long will you wait?</span>
          </h2>
          <p className="text-blue-200 mb-8 leading-relaxed">
            Every month you run without AI infrastructure, you&apos;re paying
            the &ldquo;manual tax&rdquo; — extra closers, missed follow-ups,
            leaked revenue. The application takes 2 minutes.
          </p>

          <button
            onClick={openSurvey}
            className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold uppercase tracking-wide text-navy bg-white hover:bg-gray-50 border-2 border-amber-300 rounded-lg shadow-2xl transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Apply Now — 3 Spots Left
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-5 text-xs text-blue-300 mt-4">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> No obligation
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 2-min application
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Free discovery call
            </span>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER — Copyright + Legal + Facebook Disclaimer ═══ */}
      <footer className="bg-white border-t border-gray-100 py-6 px-4">
        <div className="max-w-[800px] mx-auto text-center space-y-3">
          <p className="text-xs text-gray-400">
            Copyright {new Date().getFullYear()}, Capped Out Labs, LLC. All
            rights reserved. This site is not a part of the Facebook&trade;
            website or Facebook&trade; Inc. Additionally, this site is NOT
            endorsed by Facebook&trade; in any way. FACEBOOK&trade; is a
            trademark of FACEBOOK&trade;, Inc.
          </p>
          <p className="text-xs text-gray-400">
            Results vary. The figures stated on this page are specific client
            results and are not guaranteed. Your results will depend on many
            factors including your business, experience, and effort.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/apply" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Terms
            </a>
            <span className="text-xs text-gray-300">|</span>
            <a href="/apply" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-400">
              team@cappedoutlabs.com
            </span>
          </div>
        </div>
      </footer>

      {/* ═══ TACTIC 4: STICKY CTA ON MOBILE ═══ */}
      <AnimatePresence>
        {stickyVisible && !surveyOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border shadow-2xl p-3 sm:p-4 safe-bottom"
          >
            <div className="max-w-[600px] mx-auto flex items-center gap-3">
              <div className="hidden sm:block flex-1">
                <p className="text-sm font-bold text-navy">
                  3 spots left this month
                </p>
                <p className="text-xs text-text-secondary">
                  Free discovery call. No obligation.
                </p>
              </div>
              <button
                onClick={openSurvey}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-lg transition-all"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ TACTIC 3: EXIT INTENT POPUP ═══ */}
      <AnimatePresence>
        {exitIntent.show && !surveyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center"
            >
              <button
                onClick={exitIntent.close}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>

              <h3 className="text-2xl font-bold text-navy">
                Wait — don&apos;t leave money on the table
              </h3>
              <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                Operators who deploy AI see 90% lower acquisition costs and 3x
                higher show rates within 45 days. The application takes 2
                minutes and the discovery call is free.
              </p>

              <button
                onClick={() => {
                  exitIntent.close();
                  openSurvey();
                }}
                className="w-full mt-6 py-4 bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] text-white rounded-lg text-base font-bold uppercase tracking-wide shadow-lg transition-all"
              >
                Apply Now — 3 Spots Left
              </button>
              <button
                onClick={exitIntent.close}
                className="mt-3 text-sm text-text-secondary/60 hover:text-text-secondary transition-colors"
              >
                No thanks, I&apos;ll keep paying the manual tax
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Survey Modal ═══ */}
      <VSLSurvey open={surveyOpen} onClose={() => setSurveyOpen(false)} />
    </>
  );
}

// ── FAQ Accordion Item ───────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-sm font-semibold text-navy">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
