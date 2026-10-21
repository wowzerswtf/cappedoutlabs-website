"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, ArrowLeft, X } from "lucide-react";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { CalendarEmbed } from "@/components/CalendarEmbed";
import { CONSENT_TEXT, CONSENT_VERSION } from "@/lib/consent";
import { metaTrack, newMetaEventId } from "@/lib/meta/client";
import {
  DEFAULT_SURVEY_SLIDES,
  MULTI_SEPARATOR,
  applicationFields,
  buildSurveyNote,
  otherKey,
  type SurveyOption,
  type SurveySlide,
} from "@/lib/survey";

// The survey scores nothing. Every completed application reaches the calendar
// (Waynard 2026-08-21). The answers are triage context for the closer, not a
// gate. Nothing here should ever branch on them again.
//
// Slides, headings and attribution are props so each funnel can ask its own
// questions while sharing one intake path: contact step -> partial capture ->
// slides -> /api/apply -> GHL calendar. Defaults reproduce the original VSL
// application exactly, so /f/vsl, /f/vsl-b and /apply-now are unchanged.

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

export interface VSLSurveyProps {
  open: boolean;
  onClose: () => void;
  /** Attribution tag sent to /api/apply and Meta (e.g. "apply-now") */
  source?: string;
  /** Human-readable label written to GHL (e.g. "Apply Now Page") */
  referralSource?: string;
  /** Questions after the contact step. Defaults to the original application. */
  slides?: SurveySlide[];
  /** Modal heading and the line under it. */
  title?: string;
  intro?: string;
  /** Written to the GHL labs_tier_interest field. */
  tierInterest?: string;
  /** Funnel slug from src/lib/funnels/registry.ts; becomes a GHL tag. */
  funnel?: string;
  /** Appended to the contact note (e.g. the rent calculator summary). */
  noteExtra?: string;
  /** Thank-you screen copy above the calendar. */
  doneTitle?: string;
  doneBody?: string;
  /** Label on the contact-step button. */
  startLabel?: string;
  /** Suffix for the calendar iframe id; must be unique per page. */
  calendarId?: string;
}

// ── Main Component ───────────────────────────────────────────────
export function VSLSurvey({
  open,
  onClose,
  source = "vsl-funnel",
  referralSource = "VSL Funnel",
  slides = DEFAULT_SURVEY_SLIDES,
  title = "Capped Out Labs — Application",
  intro = "We work with operators who want production AI systems deployed into their business, not strategy decks.",
  tierInterest,
  funnel,
  noteExtra,
  doneTitle = "You're a fit. Book your call.",
  doneBody = "Pick a time below for your AI Infrastructure Discovery Call. We'll map your bottleneck to a 90-day build plan.",
  startLabel = "Start My Application",
  calendarId = "vsl",
}: VSLSurveyProps) {
  const totalSlides = slides.length + 1; // contact step + slides

  const [step, setStep] = useState(0); // 0 = contact capture, 1..n = survey slides
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherText, setOtherText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>([]);

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
    setMulti([]);
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

  function advance(nextAnswers: Record<string, string>) {
    // Final slide answered: submit the whole application right away
    if (step === slides.length) {
      setTimeout(() => {
        setSelectedOption(null);
        submitApplication(nextAnswers);
      }, 350);
      return;
    }
    // Auto-advance after brief highlight
    setTimeout(() => {
      setSelectedOption(null);
      setMulti([]);
      setOtherText("");
      setDirection(1);
      setStep((s) => s + 1);
    }, 350);
  }

  function handleOptionSelect(slide: SurveySlide, option: SurveyOption) {
    if (slide.type === "checkbox") {
      setMulti((prev) =>
        prev.includes(option.id) ? prev.filter((id) => id !== option.id) : [...prev, option.id]
      );
      return;
    }

    setSelectedOption(option.id);
    const nextAnswers = { ...answers, [slide.id]: option.id };
    setAnswers(nextAnswers);

    // "Other" needs a typed answer before moving on
    if (slide.showOtherField === option.id) {
      setSelectedOption(null);
      return;
    }
    advance(nextAnswers);
  }

  function continueFromCheckbox(slide: SurveySlide) {
    if (multi.length === 0) return;
    const needsOther = slide.showOtherField && multi.includes(slide.showOtherField);
    if (needsOther && !otherText.trim()) return;
    const nextAnswers: Record<string, string> = {
      ...answers,
      [slide.id]: multi.join(MULTI_SEPARATOR),
    };
    if (needsOther) nextAnswers[otherKey(slide.id)] = otherText.trim();
    setAnswers(nextAnswers);
    advance(nextAnswers);
  }

  function advanceFromOther(slide: SurveySlide) {
    if (!otherText.trim()) return;
    const nextAnswers = { ...answers, [otherKey(slide.id)]: otherText.trim() };
    setAnswers(nextAnswers);
    advance(nextAnswers);
  }

  function goBack() {
    setError("");
    setDirection(-1);
    setSelectedOption(null);
    setMulti([]);
    setOtherText("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleContactContinue(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agreedTerms) {
      setError("Please check the box to agree to be contacted before continuing.");
      return;
    }
    setError("");

    // Capture the contact in GHL right away (fire-and-forget) so a mid-survey
    // drop-off is still a callable lead, tagged partial-applicant. The full
    // submit below finds this contact by email and upgrades it in place.
    fetch("/api/apply/partial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: fullName.split(" ")[0] || fullName.trim(),
        lastName: fullName.split(" ").slice(1).join(" ") || "",
        email: email.trim(),
        phone: phone.trim(),
        consent: agreedTerms,
        consentLanguage: CONSENT_TEXT,
        consentVersion: CONSENT_VERSION,
        consentTimestamp: new Date().toISOString(),
      }),
    }).catch(() => {});

    setDirection(1);
    setStep(1);
  }

  async function submitApplication(finalAnswers: Record<string, string>) {
    setLoading(true);
    setError("");

    // Shared browser/server event ID so Meta counts this Lead once
    const metaEventId = newMetaEventId();

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metaEventId,
          pageUrl: window.location.href,
          firstName: fullName.split(" ")[0] || fullName.trim(),
          lastName: fullName.split(" ").slice(1).join(" ") || "",
          email: email.trim(),
          phone: phone.trim(),
          businessName: companyName.trim(),
          // Survey answers mapped onto the GHL custom-field keys the API
          // expects (annualRevenue / bottleneck / aiHistory), as labels so
          // GHL shows "$1M – $5M", not "1m-5m".
          ...applicationFields(slides, finalAnswers),
          referralSource,
          tierInterest,
          funnel,
          // Keep raw revenue too (back-compat with anything reading `revenue`)
          revenue: finalAnswers["revenue"] || "",
          // Full Q&A, written as a contact note so nothing is ever lost
          message: buildSurveyNote(
            slides,
            finalAnswers,
            `${referralSource} Application`,
            noteExtra
          ),
          consent: agreedTerms,
          consentLanguage: CONSENT_TEXT,
          consentVersion: CONSENT_VERSION,
          consentTimestamp: new Date().toISOString(),
          source,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }

      // Every completed application counts as a Lead — the browser half
      // dedupes against the server CAPI event via the shared metaEventId.
      metaTrack("Lead", { source }, metaEventId);

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const progress = (step + 1) / (totalSlides + 1);
  const currentSlide = step >= 1 && step <= slides.length ? slides[step - 1] : null;
  const otherOpen =
    !!currentSlide?.showOtherField &&
    (currentSlide.type === "checkbox"
      ? multi.includes(currentSlide.showOtherField)
      : answers[currentSlide.id] === currentSlide.showOtherField);

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
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          {!submitted && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-navy pr-8">{title}</h2>
              <p className="text-sm text-text-secondary mt-1 mb-6">{intro}</p>
            </>
          )}

          {/* Progress bar */}
          {!submitted && (
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
                Step {step + 1} of {totalSlides}
              </p>
            </div>
          )}

          {/* ── Submitted / Thank You Screen ── */}
          {submitted && (
            <div className="py-2 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-navy">{doneTitle}</h3>
                <p className="text-sm text-text-secondary max-w-md mx-auto">{doneBody}</p>
              </div>
              <CalendarEmbed
                id={calendarId}
                firstName={fullName.trim().split(" ")[0]}
                lastName={fullName.trim().split(" ").slice(1).join(" ")}
                email={email.trim()}
                phone={phone.trim()}
              />
            </div>
          )}

          {/* ── Survey Slides ── */}
          {!submitted && (
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
                      <div>
                        <h3 className="text-lg font-bold text-navy">{currentSlide.question}</h3>
                        {currentSlide.hint && (
                          <p className="text-sm text-text-secondary mt-1">{currentSlide.hint}</p>
                        )}
                      </div>

                      <div className="space-y-2.5">
                        {currentSlide.options.map((option) => {
                          const isSelected =
                            currentSlide.type === "checkbox"
                              ? multi.includes(option.id)
                              : selectedOption === option.id ||
                                answers[currentSlide.id] === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              role={currentSlide.type === "checkbox" ? "checkbox" : "radio"}
                              aria-checked={isSelected}
                              onClick={() => handleOptionSelect(currentSlide, option)}
                              className={`w-full text-left rounded-lg border-2 p-3.5 transition-all duration-200 ${
                                isSelected
                                  ? "border-[#2563EB] bg-blue-50"
                                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all ${
                                    currentSlide.type === "checkbox" ? "rounded-md" : "rounded-full"
                                  } ${
                                    isSelected
                                      ? "border-[#2563EB] bg-[#2563EB]"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3 w-3 text-white" />}
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
                      {otherOpen && (
                        <div className="mt-3 space-y-3">
                          <input
                            type="text"
                            placeholder="Please describe..."
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            autoFocus
                            className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                          />
                          {currentSlide.type === "radio" && (
                            <button
                              type="button"
                              onClick={() => advanceFromOther(currentSlide)}
                              disabled={!otherText.trim()}
                              className="px-6 py-2.5 bg-[#1a3a5c] text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-[#142d49] transition-colors"
                            >
                              Continue
                            </button>
                          )}
                        </div>
                      )}

                      {/* Checkbox slides need an explicit Continue */}
                      {currentSlide.type === "checkbox" && (
                        <button
                          type="button"
                          onClick={() => continueFromCheckbox(currentSlide)}
                          disabled={
                            multi.length === 0 ||
                            (otherOpen && !otherText.trim())
                          }
                          className="w-full py-3.5 bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] text-white rounded-lg text-base font-bold uppercase tracking-wide shadow-lg transition-all duration-200 disabled:opacity-40"
                        >
                          Continue
                        </button>
                      )}

                      {error && (
                        <div
                          role="alert"
                          className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
                        >
                          {error}
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

                  {/* ── Contact Form (first slide) ── */}
                  {step === 0 && !loading && (
                    <form onSubmit={handleContactContinue} className="space-y-4">
                      <h3 className="text-lg font-bold text-navy">
                        First, where can we reach you?
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Then a few quick questions so we can route you to the
                        right next step.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor={`${calendarId}-name`} className="block text-xs font-medium text-gray-600 mb-1">
                            Full Name *
                          </label>
                          <input
                            id={`${calendarId}-name`}
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
                          <label htmlFor={`${calendarId}-company`} className="block text-xs font-medium text-gray-600 mb-1">
                            Company Name
                          </label>
                          <input
                            id={`${calendarId}-company`}
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Acme Inc."
                            className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={`${calendarId}-email`} className="block text-xs font-medium text-gray-600 mb-1">
                          Email *
                        </label>
                        <input
                          id={`${calendarId}-email`}
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
                        <label htmlFor={`${calendarId}-phone`} className="block text-xs font-medium text-gray-600 mb-1">
                          Phone *
                        </label>
                        <input
                          id={`${calendarId}-phone`}
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

                      <ConsentCheckbox
                        id={`${calendarId}-consent`}
                        checked={agreedTerms}
                        onChange={(v) => {
                          setAgreedTerms(v);
                          setError("");
                        }}
                        className="pt-1"
                      />

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
                        {startLabel}
                      </button>
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
