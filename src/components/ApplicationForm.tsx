"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Loader2 } from "lucide-react";

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

export function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
      // Fallback: save locally for recovery
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name *</Label>
          <Input
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Jane Smith"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name *</Label>
          <Input
            id="businessName"
            required
            value={formData.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
          />
        </div>
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
          <Label>Current team size *</Label>
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

      <div className="space-y-2">
        <Label htmlFor="bottleneck">Biggest operational bottleneck *</Label>
        <Textarea
          id="bottleneck"
          required
          rows={3}
          value={formData.bottleneck}
          onChange={(e) => updateField("bottleneck", e.target.value)}
          placeholder="Where is your business leaking time, money, or revenue right now?"
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

      <div className="space-y-2">
        <Label>Which tier interests you most?</Label>
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

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-electric hover:bg-electric-dark text-white rounded-lg h-12 text-base font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  );
}
