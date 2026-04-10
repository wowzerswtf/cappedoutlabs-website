"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { QUESTIONS, type QuizAnswer } from "@/lib/quiz-scoring";

const TOTAL_STEPS = QUESTIONS.length + 1; // gate screen + 5 questions

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

export function AssessmentQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = gate, 1-5 = questions
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Contact info (gate)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Quiz answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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

    // Capture partial lead (fire-and-forget)
    fetch("/api/apply/partial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      }),
    }).catch(() => {});

    setDirection(1);
    setStep(1);
  }

  function handleOptionSelect(questionId: string, answerId: string) {
    // Show selection feedback
    setSelectedOption(answerId);
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));

    // Auto-advance after brief delay
    setTimeout(() => {
      setSelectedOption(null);
      const questionIndex = step - 1;

      if (questionIndex >= QUESTIONS.length - 1) {
        // Last question — submit
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
            lastName: lastName.trim(),
            email: email.trim(),
            companyName: companyName.trim(),
          },
          answers: quizAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      // Redirect to results with tier info
      const params = new URLSearchParams({
        tier: data.tier.id,
        score: String(data.total),
        label: data.tier.label,
        name: firstName.trim(),
      });
      router.push(`/assess/results?${params.toString()}`);
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
  const progress = step / TOTAL_STEPS;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-text-secondary font-medium">
          <span>{step === 0 ? "Get started" : `Question ${step} of ${QUESTIONS.length}`}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-electric rounded-full"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="relative overflow-hidden min-h-[360px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Gate screen */}
            {step === 0 && (
              <form onSubmit={handleGateSubmit} className="space-y-5">
                <div className="space-y-1 mb-6">
                  <h2 className="text-xl font-bold text-navy">
                    Let&apos;s personalize your assessment
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Takes under 2 minutes. Your results are sent instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-first-name">First name *</Label>
                    <Input
                      id="quiz-first-name"
                      required
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                      placeholder="Jane"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiz-last-name">Last name</Label>
                    <Input
                      id="quiz-last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiz-email">Email *</Label>
                  <Input
                    id="quiz-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="jane@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiz-company">Company name</Label>
                  <Input
                    id="quiz-company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-electric hover:bg-electric-dark text-white rounded-lg h-12 text-base font-semibold"
                >
                  Start Assessment
                </Button>
              </form>
            )}

            {/* Question screens */}
            {currentQuestion && !loading && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-electric uppercase tracking-wide">
                    {currentQuestion.dimension === "scale" && "Business Scale"}
                    {currentQuestion.dimension === "painClarity" && "Growth Bottleneck"}
                    {currentQuestion.dimension === "aiMaturity" && "AI Adoption"}
                    {currentQuestion.dimension === "urgency" && "Timeline"}
                    {currentQuestion.dimension === "strategicFit" && "Strategic Vision"}
                  </p>
                  <h2 className="text-xl font-bold text-navy leading-snug">
                    {currentQuestion.text}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, i) => {
                    const isSelected = selectedOption === option.id || answers[currentQuestion.id] === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        custom={i}
                        variants={optionVariants}
                        initial="hidden"
                        animate="visible"
                        type="button"
                        onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
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
                            {isSelected && <Check className="h-3 w-3 text-white" />}
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

            {/* Loading state */}
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
  );
}
