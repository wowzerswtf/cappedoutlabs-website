"use client";

// /f/own: the "stop renting your software" funnel.
//
// One page, one ask. Pitch at the top (video when OWN_VSL_VIMEO_ID is set,
// the written letter until then), the rent calculator as the hook, then the
// comparison, what we build, proof, how it works, FAQ, and the same ask again.
// Every CTA opens the shared VSLSurvey with this funnel's slides; the survey
// posts to /api/apply, which creates the GHL contact + opportunity, tags it
// funnel-own, and shows the GHL calendar. The calculator summary rides along
// in the contact note so the builder sees the lead's own numbers.

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Shield,
  Users,
  X,
} from "lucide-react";
import { VSLSurvey } from "@/components/VSLSurvey";
import { RentCalculator } from "@/components/RentCalculator";
import {
  OWN_FUNNEL,
  OWN_SURVEY_SLIDES,
  OWN_VSL_SCRIPT,
  OWN_VSL_VIMEO_ID,
} from "@/lib/funnels/own";
import {
  OLD_CUSTOM_BUILD_COST,
  OLD_CUSTOM_BUILD_MONTHS,
  describeSummary,
  formatMoney,
  type RentSummary,
} from "@/lib/rent-math";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ctaClass =
  "group inline-flex items-center justify-center gap-2 px-10 py-5 text-base sm:text-lg font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto";

const COMPARE_COLUMNS = [
  {
    title: "Keep renting",
    head: "text-red-700 bg-red-50",
    cell: "text-red-900 bg-red-50/60 border-red-100",
    card: "border-red-200 bg-red-50/40",
  },
  {
    title: "Old-style custom",
    head: "text-text-secondary bg-gray-50",
    cell: "text-text-secondary bg-gray-50/60 border-gray-100",
    card: "border-border bg-gray-50/40",
  },
  {
    title: "Built with Labs",
    head: "text-green-800 bg-green-50",
    cell: "text-green-900 bg-green-50/60 border-green-100 font-medium",
    card: "border-green-200 bg-green-50/40",
  },
] as const;

const COMPARE_ROWS: { label: string; cells: [string, string, string] }[] = [
  {
    label: "Up front",
    cells: ["$0", `About ${formatMoney(OLD_CUSTOM_BUILD_COST)} on average (Clutch, 2026)`, "A fraction of that. Scoped on the call"],
  },
  { label: "Time to working software", cells: ["Today", `About ${OLD_CUSTOM_BUILD_MONTHS} months`, "Weeks"] },
  {
    label: "After that",
    cells: ["Rent forever, up about 12% a year", "Hosting and maintenance", "Hosting and upkeep, billed to you directly"],
  },
  { label: "Fits how you work", cells: ["You adapt to it", "Yes", "Yes"] },
  { label: "Your data", cells: ["In their database", "Yours", "Yours"] },
  { label: "When you stop paying", cells: ["Everything is gone", "You keep it", "You keep it"] },
  { label: "Who owns it", cells: ["Them", "You", "You"] },
];

const ctaSmallClass =
  "inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5";

// ── Exit intent (desktop mouse-out at the top edge) ──────────────
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

export function OwnFunnelContent() {
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [summary, setSummary] = useState<RentSummary | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const exitIntent = useExitIntent(!surveyOpen);

  useEffect(() => {
    function handleScroll() {
      setStickyVisible(window.scrollY > 700);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSurvey = () => setSurveyOpen(true);
  const scrollToMath = () => {
    document.getElementById("math")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onSummary = useCallback((s: RentSummary) => setSummary(s), []);

  return (
    <>
      {/* ═══ Top line ═══ */}
      <div className="bg-navy text-white text-center py-2.5 px-4">
        <p className="text-xs sm:text-sm font-medium tracking-wide">
          Own your software. Own your business.
        </p>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="bg-white px-4 sm:px-6">
        <div className="w-full max-w-[820px] mx-auto pt-8 sm:pt-12 pb-6">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center text-xs sm:text-sm font-semibold text-electric uppercase tracking-widest mb-4"
          >
            For owners paying $1,000+ a month in subscriptions
          </motion.p>

          {/* Headline
              Split test variants (swap into h1 to test):
              A: "Stop renting your software."  <- ACTIVE
              B: "You've paid for your CRM five times over. You still don't own it."
              C: "Every tool you rent, we can build you a version you own."
              D: "Software rent went up 12% last year. Yours will too."
              E: "Own your software. Own your business."
          */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center text-3xl sm:text-4xl md:text-[3rem] md:leading-[1.1] font-bold text-navy mb-4 sm:mb-6"
          >
            Stop renting your software.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            We use AI to build your own version of the tools you pay for every month, in weeks,
            for a fraction of what custom software used to cost. The code, the data and the
            hosting end up in your name.
          </motion.p>

          {/* VSL: video when it exists, the written letter until then */}
          {OWN_VSL_VIMEO_ID ? (
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
              <iframe
                src={`https://player.vimeo.com/video/${OWN_VSL_VIMEO_ID}?autoplay=1&muted=1&title=0&byline=0&portrait=0&dnt=1`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                title="Stop renting your software: Capped Out Labs"
              />
            </div>
          ) : (
            <Letter />
          )}

          <div className="text-center">
            <button onClick={openSurvey} className={ctaClass}>
              Get my build estimate
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-secondary/70 mt-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 2 minute form
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> 30 minutes with a builder
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> You leave with a scope and a number
            </span>
          </div>
        </div>
      </section>

      {/* ═══ THE MATH ═══ */}
      <section id="math" className="bg-surface border-y border-border/50 py-12 sm:py-16 px-4 scroll-mt-14">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-3">
            Do the math on your rent
          </h2>
          <p className="text-center text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Put in what you pay now. You get what the next few years cost, how much of it is
            price increases, and what owning the same software instead would look like.
          </p>
          <RentCalculator onChange={onSummary} onCta={openSurvey} />
        </div>
      </section>

      {/* ═══ THREE WAYS TO PAY ═══ */}
      <section className="bg-white py-12 sm:py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-3">
            Three ways to pay for software
          </h2>
          <p className="text-center text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Renting was the only sane choice for years, because the alternative was an agency
            and a year of meetings. AI changed what the alternative costs.
          </p>

          {/* Wide screens: one table. Phones: a card per column. */}
          <div className="hidden sm:block">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-text-secondary"></th>
                  {COMPARE_COLUMNS.map((c) => (
                    <th key={c.title} className={`text-left p-3 text-xs font-semibold uppercase tracking-wider rounded-t-xl ${c.head}`}>
                      {c.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.label}>
                    <td className="p-3 font-semibold text-navy border-b border-border/60">{row.label}</td>
                    {COMPARE_COLUMNS.map((c, col) => (
                      <td
                        key={c.title}
                        className={`p-3 border-b ${c.cell} ${i === COMPARE_ROWS.length - 1 ? "rounded-b-xl" : ""}`}
                      >
                        {row.cells[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden space-y-4">
            {COMPARE_COLUMNS.map((c, col) => (
              <div key={c.title} className={`rounded-xl border p-4 ${c.card}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${c.head}`}>{c.title}</p>
                <dl className="space-y-2.5">
                  {COMPARE_ROWS.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 text-sm">
                      <dt className="text-text-secondary shrink-0">{row.label}</dt>
                      <dd className="text-right font-medium text-navy">{row.cells[col]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT WE BUILD ═══ */}
      <section className="bg-surface border-y border-border/50 py-12 sm:py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-3">
            What we build you a version of
          </h2>
          <p className="text-center text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Whatever you&apos;re renting, built around how your company already runs. Start with
            the tool that costs the most or annoys you the most. Replace the rest when you&apos;re ready.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "CRM and pipeline",
                body: "Your stages, your fields, your follow-up rules. Every lead and every note, in a database you own.",
              },
              {
                title: "Scheduling and dispatch",
                body: "Crews, routes, reminders and confirmations, the way you already run the day.",
              },
              {
                title: "Quoting and invoicing",
                body: "Estimates that turn into invoices and post to your books without anyone retyping them.",
              },
              {
                title: "Customer portal",
                body: "Your customers log in to your app, with your name on it, to see status, approve work and pay.",
              },
              {
                title: "Reporting",
                body: "The numbers you actually run the business on, in one place, pulled from your own data.",
              },
              {
                title: "The AI layer",
                body: "Intake, follow-up, drafting, matching and routing, running inside software you own.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-white p-5">
                <p className="font-semibold text-navy">{item.title}</p>
                <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={openSurvey} className={ctaSmallClass}>
              Tell us what you&apos;re renting
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ PROOF ═══ */}
      <section className="bg-white py-12 sm:py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-10">
            Owners who stopped renting
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                metric: "Paid in 4 days instead of 21",
                quote:
                  "I was spending 18 hours a week on admin: estimates, invoices, QuickBooks. Now the AI handles it. Payment collection went from 21 days to 4.",
                who: "Contracting business owner, $2M revenue",
              },
              {
                metric: "$420K added in 90 days",
                quote:
                  "We added $420K in billable revenue in 90 days. The AI intake system routes every inquiry instantly. Response time went from 48 hours to minutes.",
                who: "Law firm principal",
              },
              {
                metric: "5 placements a month to 14",
                quote:
                  "Revenue per recruiter nearly tripled. The AI matches candidates and writes outreach automatically, so placements went from 5 to 14 per month.",
                who: "Staffing agency owner",
              },
            ].map((t) => (
              <div key={t.who} className="rounded-xl border border-border bg-white p-6 space-y-3 shadow-sm">
                <p className="text-xs font-bold text-electric">{t.metric}</p>
                <p className="text-sm text-navy italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-xs text-text-secondary font-semibold">{t.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-surface border-y border-border/50 py-12 sm:py-16 px-4">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-10">
            How it goes
          </h2>
          <ol className="space-y-5">
            {[
              {
                title: "Scoping call, 30 minutes",
                body: "You tell a builder what you rent and what you'd want to own. We map your tools, pick what to build first, and give you a number before you hang up.",
              },
              {
                title: "Build, in weeks",
                body: "AI writes and tests the application. An engineer directs it, checks every piece, and shows you working software each week, so there are no surprises at the end.",
              },
              {
                title: "Handoff",
                body: "Code in a repository under your account. Data in a database you control. Hosting in your company's name. Your team trained on it.",
              },
              {
                title: "After",
                body: "Keep us on for upkeep and the next build, or don't. It's yours either way, and any competent developer can pick it up.",
              },
            ].map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-xl border border-border bg-white p-5">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-electric text-white font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-navy">{step.title}</p>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <section className="bg-white py-12 sm:py-16 px-4">
        <div className="max-w-[800px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-6">
            <p className="text-sm font-bold text-green-700 uppercase tracking-wide mb-4">A fit</p>
            <ul className="space-y-3">
              {[
                "Doing $500K a year or more",
                "Paying $1,000+ a month across your tools",
                "Tired of bending your process to fit someone else's software",
                "Want the code, the data and the hosting in your name",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-green-900">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
            <p className="text-sm font-bold text-red-700 uppercase tracking-wide mb-4">Wrong call</p>
            <ul className="space-y-3">
              {[
                "Pre-revenue, or still deciding what the business is",
                "Looking for a chatbot on the website",
                "Happy with the tools and just curious about AI",
                "Need it free",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-red-900">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="bg-surface border-y border-border/50 py-12 sm:py-16 px-4">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-10">
            Questions owners ask
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Do I really own it?",
                a: "Yes. The repository is under your account, the database is yours, and the hosting account is in your company's name and bills you directly. We keep nothing you would need to run it.",
              },
              {
                q: "Who maintains it after you hand it over?",
                a: "Your choice. Keep us on for upkeep, hire anyone, or run it as is. It's standard code with documentation and tests, so a developer who has never met us can work on it.",
              },
              {
                q: "How can it cost so much less than custom software used to?",
                a: "AI does most of the writing and testing. The engineer's time goes to directing it and checking the work, which is a small fraction of the hours a build used to take. The price follows the hours.",
              },
              {
                q: "What if it breaks?",
                a: "It gets fixed, like any software. If it's our mistake, we fix it. An upkeep plan covers the rest, and it still costs less than most of the subscriptions it replaced.",
              },
              {
                q: "What about security and my data?",
                a: "Your data sits in your own database with access controls, backups and encryption set up as part of the build. You can have your own IT person or auditor look at all of it, because all of it is yours.",
              },
              {
                q: "What do you need from me?",
                a: "The scoping call, a walkthrough of how your team uses the tools today, and a short check-in each week until handoff. We do the rest.",
              },
              {
                q: "What happens on the call?",
                a: "30 minutes with a builder. We map your tools, tell you what we'd build first, and give you a number. If it isn't a fit, we say so and you keep the math.",
              },
            ].map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="bg-navy py-14 sm:py-20 px-4">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            You&apos;re paying rent on software you could own.
          </h2>
          {summary ? (
            <p className="text-blue-200 mb-8 leading-relaxed">
              Your next {summary.yearsAhead} years of rent come to{" "}
              <span className="font-mono font-bold text-white">{formatMoney(summary.rentAhead)}</span>.
              Owning it instead keeps about{" "}
              <span className="font-mono font-bold text-white">{formatMoney(summary.kept)}</span> of
              that. Tell us what you&apos;re renting and a builder will show you what we&apos;d build first.
            </p>
          ) : (
            <p className="text-blue-200 mb-8 leading-relaxed">
              Tell us what you&apos;re renting. A builder will show you what we&apos;d build first,
              and what it costs, on a 30 minute call.
            </p>
          )}
          <button
            onClick={openSurvey}
            className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold uppercase tracking-wide text-navy bg-white hover:bg-gray-50 border-2 border-amber-300 rounded-lg shadow-2xl transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Talk to our team
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-sm text-blue-300">Own your software. Own your business.</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-white border-t border-gray-100 py-6 px-4">
        <div className="max-w-[800px] mx-auto text-center space-y-3">
          <p className="text-xs text-gray-400">
            Copyright {new Date().getFullYear()}, Capped Out Media LLC (dba Capped Out Labs).
            All rights reserved. This site is not a part of the Facebook&trade; website or
            Facebook&trade; Inc. Additionally, this site is NOT endorsed by Facebook&trade; in
            any way. FACEBOOK&trade; is a trademark of FACEBOOK&trade;, Inc.
          </p>
          <p className="text-xs text-gray-400">
            Results vary. The figures on this page are specific client results, or your own
            inputs run through stated assumptions, and are not a guarantee. Your results depend
            on your business, your tools and the scope we agree on.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms</a>
            <span className="text-xs text-gray-300">|</span>
            <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
            <span className="text-xs text-gray-300">|</span>
            <a href="/accessibility" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Accessibility</a>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-400">team@cappedoutlabs.com</span>
          </div>
        </div>
      </footer>

      {/* ═══ STICKY CTA ═══ */}
      <AnimatePresence>
        {stickyVisible && !surveyOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border shadow-2xl p-3 sm:p-4"
          >
            <div className="max-w-[640px] mx-auto flex items-center gap-3">
              <div className="hidden sm:block flex-1">
                <p className="text-sm font-bold text-navy">
                  {summary ? `${formatMoney(summary.rentAhead)} in rent over ${summary.yearsAhead} years` : "Stop renting your software"}
                </p>
                <p className="text-xs text-text-secondary">30 minutes with a builder. You leave with a number.</p>
              </div>
              <button
                onClick={openSurvey}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-lg transition-all"
              >
                Get my build estimate
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ EXIT INTENT ═══ */}
      <AnimatePresence>
        {exitIntent.show && !surveyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) exitIntent.close();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center"
            >
              <button
                onClick={exitIntent.close}
                aria-label="Close"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-2xl font-bold text-navy">Before you go, run your number</h3>
              <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                {summary
                  ? `At ${formatMoney(summary.monthly)} a month, the next ${summary.yearsAhead} years of rent come to ${formatMoney(summary.rentAhead)}. A 30 minute call tells you what owning it would cost.`
                  : "It takes ten seconds. Most owners have never added up what their software actually costs them, and the number is usually uncomfortable."}
              </p>
              <button
                onClick={() => {
                  exitIntent.close();
                  if (summary) openSurvey();
                  else scrollToMath();
                }}
                className="w-full mt-6 py-4 bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] text-white rounded-lg text-base font-bold uppercase tracking-wide shadow-lg transition-all"
              >
                {summary ? "Talk to a builder" : "Show me the math"}
              </button>
              <button
                onClick={exitIntent.close}
                className="mt-3 text-sm text-text-secondary/60 hover:text-text-secondary transition-colors"
              >
                No thanks, I&apos;ll keep renting
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Survey Modal ═══ */}
      <VSLSurvey
        open={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        source={OWN_FUNNEL.source}
        referralSource={OWN_FUNNEL.referralSource}
        funnel={OWN_FUNNEL.slug}
        tierInterest={OWN_FUNNEL.tierInterest}
        slides={OWN_SURVEY_SLIDES}
        title="Own your software: build estimate"
        intro="Seven quick questions so a builder can show up with a scope and a number."
        startLabel="Start my estimate"
        doneTitle="Good. Pick a time with a builder."
        doneBody="30 minutes. We map what you're renting, tell you what we'd build first, and give you a number."
        noteExtra={summary ? describeSummary(summary) : undefined}
        calendarId="own"
      />
    </>
  );
}

// ── The written VSL, shown until the video exists ────────────────
function Letter() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? OWN_VSL_SCRIPT : OWN_VSL_SCRIPT.slice(0, 2);

  return (
    <div className="relative mb-8 rounded-2xl border border-border bg-white shadow-xl">
      <div className="px-6 sm:px-10 py-8 sm:py-10 space-y-5 text-[15px] sm:text-base leading-relaxed text-text-primary">
        {visible.map((section, i) =>
          section.paragraphs.map((p, j) => (
            <p key={`${i}-${j}`} className={i === 0 && j === 0 ? "text-lg sm:text-xl font-semibold text-navy" : ""}>
              {p}
            </p>
          ))
        )}
        {expanded && (
          <p className="pt-2 font-semibold text-navy">
            Waynard
            <br />
            <span className="font-normal text-text-secondary">Capped Out Labs</span>
          </p>
        )}
      </div>
      {!expanded && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-2xl bg-gradient-to-t from-white to-transparent" />
          <div className="relative px-6 pb-6 text-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:text-electric-dark"
            >
              Keep reading
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
      {expanded && (
        <div className="px-6 pb-6 flex items-center justify-center gap-2 text-xs text-text-secondary">
          <Check className="w-3.5 h-3.5 text-success" />
          That&apos;s the whole pitch. The form is below.
        </div>
      )}
    </div>
  );
}

// ── FAQ Accordion Item ───────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
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
            <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
