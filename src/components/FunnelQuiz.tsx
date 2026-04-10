"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Check, Shield, Clock, Star } from "lucide-react";
import { QUESTIONS } from "@/lib/quiz-scoring";
import type { QuizAnswer } from "@/lib/quiz-scoring";

const TOTAL_STEPS = QUESTIONS.length + 1; // gate + 5 questions
const PROGRESS_OFFSET = 0.15; // Start at 15% — upfront progress bias

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

const optionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

// ── Exit Intent Popup ─────────────────────────────────────────────
function ExitIntentPopup({
  show,
  onClose,
  onContinue,
}: {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-navy">
          Wait — your results are almost ready
        </h3>
        <p className="mt-3 text-text-secondary">
          You&apos;re seconds away from seeing exactly where AI can move the
          needle in your business. Don&apos;t lose your progress.
        </p>
        <div className="mt-6 space-y-3">
          <Button
            onClick={onContinue}
            className="w-full bg-electric hover:bg-electric-dark text-white rounded-xl h-12 text-base font-semibold"
          >
            Finish My Assessment
          </Button>
          <button
            onClick={onClose}
            className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors"
          >
            No thanks, I&apos;ll pass
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main FunnelQuiz Component ─────────────────────────────────────
export function FunnelQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = gate, 1-5 = questions
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Contact info — minimal gate (name + email only)
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  // Quiz answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Exit intent
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentFired, setExitIntentFired] = useState(false);

  // Exit intent detection — desktop mouse leave, mobile back button
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 0 && step > 0 && !exitIntentFired && !loading) {
        setShowExitIntent(true);
        setExitIntentFired(true);
      }
    },
    [step, exitIntentFired, loading]
  );

  useEffect(() => {
    document.addEventListener("mouseout", handleMouseLeave);
    return () => document.removeEventListener("mouseout", handleMouseLeave);
  }, [handleMouseLeave]);

  function goBack() {
    setError("");
    setDirection(-1);
    setSelectedOption(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleGateSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setError("");

    // Partial lead capture — fire and forget
    fetch("/api/apply/partial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.trim(),
        email: email.trim(),
      }),
    }).catch(() => {});

    setDirection(1);
    setStep(1);
  }

  function handleOptionSelect(questionId: string, answerId: string) {
    setSelectedOption(answerId);
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));

    setTimeout(() => {
      setSelectedOption(null);
      const questionIndex = step - 1;

      if (questionIndex >= QUESTIONS.length - 1) {
        submitQuiz({ ...answers, [questionId]: answerId });
      } else {
        setDirection(1);
        setStep((s) => s + 1);
      }
    }, 350);
  }

  async function submitQuiz(finalAnswers: Record<string, string>) {
    setLoading(true);
    setError("");

    const quizAnswers: QuizAnswer[] = Object.entries(finalAnswers).map(
      ([questionId, answerId]) => ({ questionId, answerId })
    );

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            firstName: firstName.trim(),
            lastName: "",
            email: email.trim(),
            companyName: "",
          },
          answers: quizAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      const params = new URLSearchParams({
        tier: data.tier.id,
        score: String(data.total),
        label: data.tier.label,
        name: firstName.trim(),
      });
      router.push(`/f/assess/results?${params.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  const currentQuestion = step > 0 ? QUESTIONS[step - 1] : null;
  // Upfront progress: start at PROGRESS_OFFSET so user feels invested from step 0
  const rawProgress = step / TOTAL_STEPS;
  const progress = PROGRESS_OFFSET + rawProgress * (1 - PROGRESS_OFFSET);

  return (
    <>
      <div className="space-y-6">
        {/* Progress bar — always visible */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-text-secondary font-medium">
            <span>
              {step === 0
                ? "Step 1 of 6"
                : `Step ${step + 1} of ${TOTAL_STEPS + 1}`}
            </span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-electric to-blue-400"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden min-h-[380px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* ── Gate screen — 2 fields only ── */}
              {step === 0 && (
                <form onSubmit={handleGateSubmit} className="space-y-5">
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-bold text-navy">
                      Get your free AI score
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Just your name and email. Results in under 2 minutes.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="funnel-first-name">First name</Label>
                      <Input
                        id="funnel-first-name"
                        required
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setError("");
                        }}
                        placeholder="Jane"
                        autoFocus
                        className="h-12 text-base rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="funnel-email">Email</Label>
                      <Input
                        id="funnel-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="jane@company.com"
                        className="h-12 text-base rounded-xl"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-electric hover:bg-electric-dark text-white rounded-xl h-14 text-base font-semibold shadow-lg shadow-electric/20"
                  >
                    Start My Free Assessment
                  </Button>

                  {/* Trust signals below CTA — social proof at friction point */}
                  <div className="flex items-center justify-center gap-4 text-xs text-text-secondary/70 pt-1">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> No spam
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 2 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" /> Free
                    </span>
                  </div>
                </form>
              )}

              {/* ── Question screens — large clickable options ── */}
              {currentQuestion && !loading && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-electric uppercase tracking-wide">
                      {currentQuestion.dimension === "scale" && "Business Scale"}
                      {currentQuestion.dimension === "painClarity" &&
                        "Growth Bottleneck"}
                      {currentQuestion.dimension === "aiMaturity" &&
                        "AI Adoption"}
                      {currentQuestion.dimension === "urgency" && "Timeline"}
                      {currentQuestion.dimension === "strategicFit" &&
                        "Strategic Vision"}
                    </p>
                    <h2 className="text-xl font-bold text-navy leading-snug">
                      {currentQuestion.text}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => {
                      const isSelected =
                        selectedOption === option.id ||
                        answers[currentQuestion.id] === option.id;
                      return (
                        <motion.button
                          key={option.id}
                          custom={i}
                          variants={optionVariants}
                          initial="hidden"
                          animate="visible"
                          type="button"
                          onClick={() =>
                            handleOptionSelect(currentQuestion.id, option.id)
                          }
                          className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 ${
                            isSelected
                              ? "border-electric bg-electric/5 ring-1 ring-electric/20"
                              : "border-border bg-white hover:border-electric/40 hover:bg-surface/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? "border-electric bg-electric"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-medium leading-snug ${
                                isSelected ? "text-navy" : "text-text-primary"
                              }`}
                            >
                              {option.text}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Back button */}
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
                </div>
              )}

              {/* ── Loading state ── */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-electric/20" />
                    <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-electric animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-lg font-semibold text-navy">
                      Analyzing your results...
                    </p>
                    <p className="text-sm text-text-secondary">
                      Building your personalized AI assessment
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error (quiz phase) */}
        {error && step > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Exit intent popup */}
      <ExitIntentPopup
        show={showExitIntent}
        onClose={() => setShowExitIntent(false)}
        onContinue={() => setShowExitIntent(false)}
      />
    </>
  );
}
