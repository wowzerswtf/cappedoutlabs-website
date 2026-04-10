"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CaseStudySchema, WebPageSchema } from "@/components/SchemaMarkup";
import { CTABanner } from "@/components/CTABanner";
import { fadeUp, staggerContainer } from "@/lib/animations";

const caseStudies = [
  {
    title: "AI Sales Infrastructure — Portfolio Brand",
    system: "Closer OS",
    slug: "portfolio-brand-ai-sales-infrastructure",
    tag: "Tier 2 · 45 days of live data",
    industry: "Sales Infrastructure",
    challenge:
      "A portfolio brand running $94K in ad spend was generating leads the sales process couldn't convert. Closers spent 20–30 minutes on manual pre-call research. Follow-up took 30–60 minutes per call. Show rate was 26.3% — nearly 3 out of 4 booked calls were no-shows. Every rep was running their own system, which meant no system at all.",
    built: [
      "Layer 1 — Pre-call intelligence: Clay/Apollo enrichment, buyer type classification (Visionary, Analyst, Connector, Skeptic). Drove show rate from 26.3% to 77.9%.",
      "Layer 2 — Live call assistance: Real-time signal detection via Deepgram through Recall.ai on Google Meet. Close rate improved from 19.5% to 26.0%.",
      "Layer 3 — Post-call automation: HeyGen video scripts, partner emails, and tracked deal rooms generated in seconds — not the 30–60 minutes it used to take.",
    ],
    stack: "GHL · Google Meet · Deepgram · Claude API (claude-sonnet-4-6) · Recall.ai · HeyGen",
    result:
      "Revenue: $200K → $3.9M (+1,866%). CAC: $11,765 → $1,217 (−90%). ROAS: 2.1x → 23.4x. Show rate: 26.3% → 77.9%. Net profit: $3,420,000 in 45 days.",
    timeline: "6 weeks to build",
    metric: "+1,866%",
    metricLabel: "revenue growth in 45 days",
    quote:
      "We were spending serious money on ads and watching leads disappear. The closer didn't have the right information before the call, follow-up was an afterthought, and every rep was running their own system — which meant no system at all.",
    quoteAttribution: "Portfolio Operator, Digital Incubator",
    stats: [
      { value: "23.4x", label: "ROAS" },
      { value: "−90%", label: "CAC" },
      { value: "77.9%", label: "show rate" },
      { value: "138", label: "deals closed" },
    ],
  },
  {
    title: "Full Ops Platform — Contracting Business",
    system: "ContractorOS",
    slug: "contractor-business-automation",
    tag: "Tier 2",
    industry: "Contracting",
    challenge:
      "Manual estimates, paper invoices, no client visibility, QuickBooks done by hand. The owner was spending 18+ hours a week on admin and doing paperwork at night instead of running the business.",
    built: [
      "Voice command engine: Web Speech API + Claude API, 6 intent types, VoiceConfirmCard confirmation pattern",
      "Client-facing estimate approval portal with real-time tracking and auto-follow-up",
      "Automated invoicing and payment tracking via Stripe, with overdue reminders via Resend and Twilio",
      "QuickBooks CSV export — zero manual data entry",
    ],
    stack: "Next.js 14, TypeScript, Tailwind, Prisma/PostgreSQL, Supabase, Stripe, Resend, Twilio",
    result:
      "18+ hours saved weekly on admin. Payment collection cycle cut from 21 days to 4. Zero manual QuickBooks entry.",
    timeline: "8 weeks",
    metric: "18+",
    metricLabel: "hours saved/week",
  },
  {
    title: "AI Intake and Client Lifecycle System — Mid-size Law Firm",
    system: "AI Intake System",
    slug: "law-firm-ai-intake",
    tag: "Tier 2 · Professional Services",
    industry: "Professional Services",
    challenge:
      "Intake was handled manually — phone messages transcribed by hand, web form submissions sitting in a shared inbox. The principal was spending 22 hours a week on admin. Lead response time averaged 36–48 hours and proposal close rate sat at 19%.",
    built: [
      "AI intake digitizer that captures and routes inquiries across phone, web, and email instantly",
      "Precedent intelligence engine pulling relevant case outcomes for preliminary analysis",
      "Personalized follow-up sequences triggered by intake status and engagement signals",
      "Auto-generated engagement letters and proposals with integrated e-signature",
    ],
    result:
      "$420,000 in additional billable revenue in the first 90 days. Admin hours: 22 → 6/week. Proposal close rate: 19% → 67%.",
    timeline: "90-day measurement window",
    metric: "$420K",
    metricLabel: "added revenue in 90 days",
  },
  {
    title: "AI Smart Matching and Outreach Engine — Regional Staffing Agency",
    system: "AI Smart Matching",
    slug: "staffing-agency-ai-matching",
    tag: "Tier 2 · Staffing and Recruiting",
    industry: "Staffing and Recruiting",
    challenge:
      "Recruiters were manually reading every resume, writing individual outreach, and tracking candidates across spreadsheets. Each placement took days of hands-on effort. Average recruiter placed 5 candidates per month generating $180K annually.",
    built: [
      "Real-time resume and job spec scanner with instant matching scores",
      "Personalized multi-channel outreach across email, SMS, and call scripts",
      "Automated follow-up engine adjusting timing and channel based on response patterns",
      "Ranked best-match dashboard updated in real time as new resumes arrive",
    ],
    result:
      "Revenue per recruiter: $180K → $520K. Placements per month: 5 → 14. Intake to submission: 4 days → 18 hours.",
    timeline: "Annual measurement",
    metric: "$520K",
    metricLabel: "revenue per recruiter",
  },
  {
    title: "Autonomous Patient Journey Platform — Multi-location Med Spa",
    system: "Patient Journey Platform",
    slug: "med-spa-patient-journey",
    tag: "Tier 2 · Healthcare and Aesthetics",
    industry: "Healthcare and Aesthetics",
    challenge:
      "One in four booked appointments went unfilled. Rebooking rate was 31%. Revenue per consultation sat at $1,400 because there was no systematic way to recommend add-on treatments. Growing locations but not revenue per patient.",
    built: [
      "AI booking concierge handling scheduling across multiple locations via text, web, and phone",
      "Predictive no-show prevention analyzing booking patterns and behavioral signals",
      "Smart reminder system with personalized treatment-based offers",
      "Post-treatment nurture sequences driving rebooking from 31% to 78%",
    ],
    result:
      "Monthly revenue up 62%. No-show rate: 25% → 3.8%. Rebooking rate: 31% → 78%. Revenue per consultation: $1,400 → $3,100.",
    timeline: "Ongoing measurement",
    metric: "+62%",
    metricLabel: "monthly revenue",
  },
  {
    title: "Intelligent Order and Relationship Manager — Wholesale Distributor",
    system: "AI Order Manager",
    slug: "wholesale-distributor-ai-ops",
    tag: "Tier 2 · Wholesale and Distribution",
    industry: "Wholesale and Distribution",
    challenge:
      "Every order required 52 minutes of manual handling. Four full-time CS staff managed the volume. Reorder rates sat at 22% because nobody was tracking when customers needed to restock.",
    built: [
      "Automated order processing — parsing SKUs, quantities, pricing tiers from email, phone, and portal",
      "Predictive reorder engine with 94% accuracy on timing predictions",
      "Conversational AI for customer inquiries across phone, email, and chat",
      "Proactive upsell messaging based on order history and product affinity",
    ],
    result:
      "Revenue up 41% from reorders. Order processing: 52 min → 7 min. CS headcount: 4 → 1. Reorder rate: 22% → 51%.",
    timeline: "Ongoing measurement",
    metric: "+41%",
    metricLabel: "revenue from reorders",
  },
  {
    title: "Closer OS — Real Estate Edition",
    system: "Closer OS — Real Estate",
    slug: "real-estate-closer-os",
    tag: "Tier 2 · Real Estate",
    industry: "Real Estate",
    challenge:
      "Only 14% of contacts converted to appointments, and just 28% progressed to an offer. Agents spent hours on manual research before calls and lost momentum with prospects between showings.",
    built: [
      "Pre-call lead intelligence dashboard with property history and financial signals",
      "Live AI call assist surfacing comparables, objection flags, and market data during consultations",
      "Automated post-showing nurture sequences with property recaps and financing scenarios",
    ],
    result:
      "Revenue per agent: +157% in 9 months. Contact to appointment: 14% → 53%. Appointment to offer: 28% → 64%.",
    timeline: "9-month measurement",
    metric: "+157%",
    metricLabel: "revenue per agent",
  },
  {
    title: "End-to-End Operations AI Suite — Digital Creative Agency",
    system: "Operations AI Suite",
    slug: "digital-agency-ai-suite",
    tag: "Tier 2 · Marketing and Creative",
    industry: "Marketing and Creative",
    challenge:
      "Running at 18% margins. Proposals took 9 days from discovery call. Onboarding stretched to 18 days. 25 hours monthly compiling reports that were outdated by the time they shipped.",
    built: [
      "Instant proposal generator from discovery call transcript — scope, pricing, and timeline in hours",
      "Automated onboarding workflows: welcome sequences, asset collection, project provisioning",
      "Real-time AI reporting dashboard with narrative summaries updating live for clients",
    ],
    result:
      "Margins: 18% → 41%. Proposal turnaround: 9 days → under 24 hrs. Onboarding: 18 days → 48 hrs. Reporting: 25 hrs → 3 hrs/month.",
    timeline: "Ongoing measurement",
    metric: "41%",
    metricLabel: "profit margin (was 18%)",
  },
];

export function CaseStudiesContent() {
  return (
    <>
      <CaseStudySchema />
      <WebPageSchema name="AI Transformation Case Studies" path="/case-studies" />

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
            From law firms to staffing agencies to real estate teams — documented before and after results from production AI systems across 8 industries.
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight"
          >
            Systems in production. Results in numbers.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
          >
            Not pilots. Not prototypes. Working AI infrastructure inside real businesses.
          </motion.p>
        </motion.div>
      </section>

      {/* CASE STUDIES */}
      {caseStudies.map((cs, i) => (
        <section key={i} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto max-w-6xl px-6 lg:px-8 py-24 lg:py-32"
          >
            {/* Top — metric + header */}
            <motion.div variants={fadeUp} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold text-electric bg-electric/10 px-3 py-1 rounded-full">
                  {cs.system}
                </span>
                <span className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
                  {cs.tag}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
                <div>
                  <p className="text-6xl md:text-7xl font-bold font-mono text-navy">{cs.metric}</p>
                  <p className="text-sm text-text-secondary mt-1">{cs.metricLabel}</p>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy">{cs.title}</h2>
              </div>
            </motion.div>

            {/* Stats row — only for case studies with stats */}
            {"stats" in cs && cs.stats && (
              <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {cs.stats.map((stat, j) => (
                  <div
                    key={j}
                    className="rounded-xl border border-border bg-surface/50 p-4 text-center"
                  >
                    <p className="text-2xl md:text-3xl font-bold font-mono text-electric">
                      {stat.value}
                    </p>
                    <p className="text-xs text-text-secondary mt-1 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Left */}
              <div className="space-y-8">
                <motion.div variants={fadeUp}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    The challenge
                  </h3>
                  <p className="text-text-primary leading-relaxed">{cs.challenge}</p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    What we built
                  </h3>
                  <ul className="space-y-3">
                    {cs.built.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-text-primary">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quote — only for case studies with a quote */}
                {"quote" in cs && cs.quote && (
                  <motion.div variants={fadeUp}>
                    <blockquote className="border-l-4 border-electric pl-5 py-2">
                      <p className="text-text-primary leading-relaxed italic">
                        &ldquo;{cs.quote}&rdquo;
                      </p>
                      <footer className="mt-2 text-sm text-text-secondary">
                        &mdash; {cs.quoteAttribution}
                      </footer>
                    </blockquote>
                  </motion.div>
                )}
              </div>

              {/* Right */}
              <div className="space-y-6">
                {"stack" in cs && cs.stack && (
                  <motion.div
                    variants={fadeUp}
                    className="rounded-2xl border border-border bg-surface/50 p-6"
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                      Stack
                    </h3>
                    <p className="text-sm font-mono text-text-primary">{cs.stack}</p>
                  </motion.div>
                )}

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Result
                  </h3>
                  <p className="text-text-primary leading-relaxed font-semibold">{cs.result}</p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-surface/50 p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Timeline
                  </h3>
                  <p className="text-2xl font-bold font-mono text-navy">{cs.timeline}</p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:text-electric-dark transition-colors mt-4"
                  >
                    View full case study
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      ))}

      <CTABanner />
    </>
  );
}
