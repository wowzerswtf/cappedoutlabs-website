"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";

const revenueOptions = [
  "Under $500K",
  "$500K–$1M",
  "$1M–$3M",
  "$3M–$10M",
  "$10M–$50M",
  "$50M+",
];

const teamSizeOptions = ["Solo", "2–5", "6–15", "16–50", "50+"];

const tierOptions = [
  "AI Revenue Sprint $15K",
  "AI Revenue Infrastructure $50K-$150K",
  "Full Transformation $200K+",
  "Equity / Rev-Share",
  "Not sure yet",
];

const referralOptions = [
  "LinkedIn",
  "Meta/Instagram Ad",
  "Referral",
  "Capped Out Media",
  "YouTube",
  "Other",
];

const STEPS = [
  { label: "You", fields: ["fullName", "email", "phone"] },
  { label: "Your Business", fields: ["businessName", "website", "annualRevenue", "teamSize"] },
  { label: "The Opportunity", fields: ["bottleneck", "aiHistory", "tierInterest", "referralSource"] },
] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

export function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    website: "",
    email: "",
    phone: "",
    annualRevenue: "",
    teamSize: "",
    bottleneck: "",
    aiHistory: "",
    tierInterest: "",
    referralSource: "",
  });

  useEffect(() => {
    const tier = searchParams.get("tier");
    if (tier && tierOptions.includes(tier)) {
      setFormData((prev) => ({ ...prev, tierInterest: tier }));
    }
  }, [searchParams]);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  }

  function canAdvance(): boolean {
    if (step === 0) {
      return !!(formData.fullName.trim() && formData.email.trim() && formData.phone.trim());
    }
    if (step === 1) {
      return !!(formData.businessName.trim() && formData.annualRevenue && formData.teamSize);
    }
    return true;
  }

  function nextStep() {
    if (!canAdvance()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prevStep() {
    setError("");
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      nextStep();
      return;
    }

    if (!formData.bottleneck.trim()) {
      setError("Please describe your biggest bottleneck.");
      return;
    }

    setLoading(true);
    setError("");

    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const payload = {
      firstName,
      lastName,
      businessName: formData.businessName,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      annualRevenue: formData.annualRevenue,
      teamSize: formData.teamSize,
      bottleneck: formData.bottleneck,
      aiHistory: formData.aiHistory,
      tierInterest: formData.tierInterest,
      referralSource: formData.referralSource,
      submittedAt: new Date().toISOString(),
      source: "cappedoutlabs.com",
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      router.push("/thank-you");
    } catch (err) {
      try {
        const existing = JSON.parse(
          localStorage.getItem("cappedout_leads") || "[]"
        );
        existing.push(payload);
        localStorage.setItem("cappedout_leads", JSON.stringify(existing));
      } catch {
        // silent
      }
      setError(
        err instanceof Error && err.message.includes("email us")
          ? err.message
          : "Something went wrong submitting your application. Please email us directly at hello@cappedoutlabs.com"
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => {
                if (i < step) {
                  setDirection(-1);
                  setStep(i);
                }
              }}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                i < step
                  ? "bg-electric text-white cursor-pointer hover:bg-electric-dark"
                  : i === step
                    ? "bg-electric/10 text-electric ring-2 ring-electric"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            <span
              className={`hidden sm:block text-sm font-medium transition-colors duration-300 ${
                i <= step ? "text-navy" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 rounded transition-colors duration-500 ${
                  i < step ? "bg-electric" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="relative overflow-hidden min-h-[280px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-5"
          >
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Jane Smith"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business name *</Label>
                  <Input
                    id="businessName"
                    required
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Annual revenue *</Label>
                    <Select
                      required
                      value={formData.annualRevenue}
                      onValueChange={(v) => updateField("annualRevenue", v ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        {revenueOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Team size *</Label>
                    <Select
                      required
                      value={formData.teamSize}
                      onValueChange={(v) => updateField("teamSize", v ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bottleneck">Biggest operational bottleneck *</Label>
                  <Textarea
                    id="bottleneck"
                    required
                    rows={3}
                    value={formData.bottleneck}
                    onChange={(e) => updateField("bottleneck", e.target.value)}
                    placeholder="Where is your business leaking time, money, or revenue right now?"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiHistory">What have you already tried with AI?</Label>
                  <Textarea
                    id="aiHistory"
                    rows={2}
                    value={formData.aiHistory}
                    onChange={(e) => updateField("aiHistory", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Which tier interests you?</Label>
                    <Select
                      value={formData.tierInterest}
                      onValueChange={(v) => updateField("tierInterest", v ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {tierOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>How did you hear about us?</Label>
                    <Select
                      value={formData.referralSource}
                      onValueChange={(v) => updateField("referralSource", v ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {referralOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="rounded-lg h-12 px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-electric hover:bg-electric-dark text-white rounded-lg h-12 text-base font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : step < STEPS.length - 1 ? (
            <>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
}
