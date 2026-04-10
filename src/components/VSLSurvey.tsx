"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, ArrowLeft, X } from "lucide-react";

// ── Survey Configuration ─────────────────────────────────────────
const SURVEY_SLIDES: SurveySlide[] = [
  {
    id: "business-type",
    question: "Which best describes you?",
    type: "radio",
    options: [
      { id: "operator", label: "I own/operate a business doing $500K+/yr" },
      { id: "investor", label: "I'm an investor looking to deploy AI into a portfolio company" },
      { id: "executive", label: "I'm a C-suite executive exploring AI transformation" },
      { id: "other", label: "Other" },
    ],
    showOtherField: "other",
  },
  {
    id: "revenue",
    question: "What's your current annual revenue?",
    type: "radio",
    options: [
      { id: "under-500k", label: "Under $500K", disqualify: true },
      { id: "500k-1m", label: "$500K – $1M" },
      { id: "1m-5m", label: "$1M – $5M" },
      { id: "5m-10m", label: "$5M – $10M" },
      { id: "10m-50m", label: "$10M – $50M" },
      { id: "50m-plus", label: "$50M+" },
    ],
  },
  {
    id: "biggest-bottleneck",
    question: "What's the biggest bottleneck in your business right now?",
    type: "radio",
    options: [
      { id: "sales", label: "Sales — leads aren't converting or show rate is low" },
      { id: "ops", label: "Operations — too many manual processes, can't scale" },
      { id: "hiring", label: "Hiring — can't find or afford the right people" },
      { id: "costs", label: "Customer acquisition costs are too high" },
      { id: "systems", label: "No systems — running on tribal knowledge and hustle" },
    ],
  },
  {
    id: "ai-experience",
    question: "Have you tried implementing AI or automation before?",
    type: "radio",
    options: [
      { id: "yes-failed", label: "Yes — tried it, didn't stick or deliver ROI" },
      { id: "yes-basic", label: "Yes — using basic tools (ChatGPT, Zapier, etc.)" },
      { id: "yes-advanced", label: "Yes — have custom AI/ML systems in production" },
      { id: "no", label: "No — haven't started yet" },
    ],
  },
  {
    id: "budget",
    question: "Do you have $15K–$100K+ allocated for AI infrastructure in the next 90 days?",
    type: "radio",
    options: [
      { id: "yes", label: "Yes — budget is approved and ready" },
      { id: "likely", label: "Likely — need to see the plan first" },
      { id: "no", label: "No — not at this time", disqualify: true },
    ],
  },
  {
    id: "timeline",
    question: "How soon do you want to move?",
    type: "radio",
    options: [
      { id: "asap", label: "Immediately — ready to start this month" },
      { id: "30-days", label: "Within 30 days" },
      { id: "90-days", label: "Within 90 days" },
      { id: "exploring", label: "Just exploring for now" },
    ],
  },
  {
    id: "understand-model",
    question: "Do you understand that we're a done-for-you AI deployment firm — not a consulting shop or agency?",
    type: "radio",
    options: [
      { id: "yes", label: "Yes — I want production systems deployed into my business" },
      { id: "tell-me-more", label: "Tell me more on the call" },
    ],
  },
];

type SurveyOption = {
  id: string;
  label: string;
  disqualify?: boolean;
};

type SurveySlide = {
  id: string;
  question: string;
  type: "radio" | "checkbox";
  options: SurveyOption[];
  showOtherField?: string;
};

const TOTAL_SLIDES = SURVEY_SLIDES.length + 1; // slides + contact form

const slideMotion = {
  enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -50 : 50,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

// ── Main Component ───────────────────────────────────────────────
export function VSLSurvey({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0); // 0..6 = survey slides, 7 = contact form
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherText, setOtherText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [disqualified, setDisqualified] = useState(false);

  // Contact form
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function reset() {
    setStep(0);
    setDirection(1);
    setAnswers({});
    setOtherText("");
    setSelectedOption(null);
    setDisqualified(false);
    setFullName("");
    setCompanyName("");
    setEmail("");
    setPhone("");
    setAgreedTerms(false);
    setLoading(false);
    setError("");
    setSubmitted(false);
  }

  function handleClose() {
    onClose();
    // Reset after animation
    setTimeout(reset, 300);
  }

  function handleOptionSelect(slideId: string, option: SurveyOption) {
    setSelectedOption(option.id);
    setAnswers((prev) => ({ ...prev, [slideId]: option.id }));

    // Check for disqualification
    if (option.disqualify) {
      setTimeout(() => {
        setDisqualified(true);
        setSelectedOption(null);
      }, 350);
      return;
    }

    // Check if "other" field needed
    const slide = SURVEY_SLIDES[step];
    if (slide?.showOtherField === option.id) {
      // Don't auto-advance — let them type
      setSelectedOption(null);
      return;
    }

    // Auto-advance after brief highlight
    setTimeout(() => {
      setSelectedOption(null);
      setDirection(1);
      setStep((s) => s + 1);
    }, 350);
  }

  function advanceFromOther() {
    if (!otherText.trim()) return;
    setAnswers((prev) => ({ ...prev, "business-type-other": otherText.trim() }));
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setError("");
    setDirection(-1);
    setSelectedOption(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agreedTerms) {
      setError("Please agree to the terms to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fullName.split(" ")[0] || fullName.trim(),
          lastName: fullName.split(" ").slice(1).join(" ") || "",
          email: email.trim(),
          phone: phone.trim(),
          companyName: companyName.trim(),
          revenue: answers["revenue"] || "",
          message: `VSL Funnel Application\n\nBusiness Type: ${answers["business-type"] || "N/A"}${answers["business-type-other"] ? ` (${answers["business-type-other"]})` : ""}\nRevenue: ${answers["revenue"] || "N/A"}\nBiggest Bottleneck: ${answers["biggest-bottleneck"] || "N/A"}\nAI Experience: ${answers["ai-experience"] || "N/A"}\nBudget: ${answers["budget"] || "N/A"}\nTimeline: ${answers["timeline"] || "N/A"}\nUnderstands Model: ${answers["understand-model"] || "N/A"}`,
          source: "vsl-funnel",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const progress = (step + 1) / (TOTAL_SLIDES + 1);
  const currentSlide = step < SURVEY_SLIDES.length ? SURVEY_SLIDES[step] : null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl border-[6px] border-gray-200 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          {!submitted && !disqualified && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-navy pr-8">
                Capped Out Labs — Application
              </h2>
              <p className="text-sm text-text-secondary mt-1 mb-6">
                We work with operators doing $500K–$50M+ who want production AI
                systems deployed into their business — not strategy decks.
              </p>
            </>
          )}

          {/* Progress bar */}
          {!submitted && !disqualified && (
            <div className="mb-6">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60a5fa]"
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1.5">
                Step {step + 1} of {TOTAL_SLIDES}
              </p>
            </div>
          )}

          {/* ── Disqualified Screen ── */}
          {disqualified && (
            <div className="text-center py-8 space-y-4">
              <h3 className="text-2xl font-bold text-navy">
                Thanks for your interest
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                Based on your answers, our done-for-you AI deployment model
                may not be the right fit right now. We work best with
                businesses doing $500K+ with budget allocated for
                infrastructure.
              </p>
              <p className="text-text-secondary max-w-md mx-auto">
                Check out our free resources at{" "}
                <a
                  href="/resources"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  cappedoutlabs.com/resources
                </a>{" "}
                for AI strategies you can implement today.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* ── Submitted / Thank You Screen ── */}
          {submitted && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-navy">
                Application received
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                We review every application personally. If you&apos;re a fit,
                you&apos;ll hear from our team within 24 hours to schedule your
                discovery call.
              </p>
              <p className="text-sm text-text-secondary/70 max-w-md mx-auto">
                We take 3 clients per month. Qualified applicants get priority
                scheduling.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* ── Survey Slides ── */}
          {!submitted && !disqualified && (
            <div className="relative overflow-hidden min-h-[320px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideMotion}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* Survey question slides */}
                  {currentSlide && !loading && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-navy">
                        {currentSlide.question}
                      </h3>

                      <div className="space-y-2.5">
                        {currentSlide.options.map((option) => {
                          const isSelected =
                            selectedOption === option.id ||
                            answers[currentSlide.id] === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                handleOptionSelect(currentSlide.id, option)
                              }
                              className={`w-full text-left rounded-lg border-2 p-3.5 transition-all duration-200 ${
                                isSelected
                                  ? "border-[#2563EB] bg-blue-50"
                                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected
                                      ? "border-[#2563EB] bg-[#2563EB]"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-800">
                                  {option.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* "Other" text field */}
                      {currentSlide.showOtherField &&
                        answers[currentSlide.id] === currentSlide.showOtherField && (
                          <div className="mt-3 space-y-3">
                            <input
                              type="text"
                              placeholder="Please describe..."
                              value={otherText}
                              onChange={(e) => setOtherText(e.target.value)}
                              autoFocus
                              className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                            />
                            <button
                              onClick={advanceFromOther}
                              disabled={!otherText.trim()}
                              className="px-6 py-2.5 bg-[#1a3a5c] text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-[#142d49] transition-colors"
                            >
                              Continue
                            </button>
                          </div>
                        )}

                      {/* Back button */}
                      {step > 0 && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={goBack}
                            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-navy transition-colors"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Contact Form (final slide) ── */}
                  {step >= SURVEY_SLIDES.length && !loading && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="text-lg font-bold text-navy">
                        Last step — where should we reach you?
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              setError("");
                            }}
                            placeholder="Jane Smith"
                            autoFocus
                            className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Acme Inc."
                            className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="jane@company.com"
                          className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setError("");
                          }}
                          placeholder="(555) 123-4567"
                          className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                        />
                      </div>

                      <div className="flex items-start gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="vsl-terms"
                          checked={agreedTerms}
                          onChange={(e) => {
                            setAgreedTerms(e.target.checked);
                            setError("");
                          }}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <label
                          htmlFor="vsl-terms"
                          className="text-xs text-gray-500 leading-relaxed"
                        >
                          I agree to receive communications from Capped Out Labs
                          and accept the Terms of Service and Privacy Policy.
                        </label>
                      </div>

                      {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] text-white rounded-lg text-base font-bold uppercase tracking-wide shadow-lg transition-all duration-200 disabled:opacity-60"
                      >
                        Submit Application
                      </button>

                      {/* Back button */}
                      <div>
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-navy transition-colors"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Back
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Loading */}
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                      <Loader2 className="h-8 w-8 text-[#2563EB] animate-spin" />
                      <p className="text-sm font-medium text-navy">
                        Submitting your application...
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
