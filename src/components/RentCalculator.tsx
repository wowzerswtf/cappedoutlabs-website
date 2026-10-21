"use client";

// The "do the math" block on /f/own. Inputs on the left, the renter's own
// numbers on the right, updated as they drag. All arithmetic lives in
// src/lib/rent-math.ts so it is unit-tested and the assumptions are named.

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  DEFAULT_INPUTS,
  DEFAULT_UPKEEP_RATE,
  INPUT_LIMITS,
  OLD_CUSTOM_BUILD_COST,
  OLD_CUSTOM_BUILD_MONTHS,
  clamp,
  formatMoney,
  formatPercent,
  summarize,
  type RentInputs,
  type RentSummary,
} from "@/lib/rent-math";
import { metaTrack } from "@/lib/meta/client";

const YEARS_AHEAD_CHOICES = [3, 5, 7, 10] as const;
const BUILD_MONTHS_CHOICES = [6, 12, 18, 24] as const;

export function RentCalculator({
  onChange,
  onCta,
  ctaLabel = "Get my exact number",
}: {
  /** Fires on every recalculation so the page can echo the numbers. */
  onChange?: (summary: RentSummary) => void;
  /** Primary action under the results. */
  onCta?: () => void;
  ctaLabel?: string;
}) {
  const [inputs, setInputs] = useState<RentInputs>(DEFAULT_INPUTS);
  const [monthlyText, setMonthlyText] = useState(String(DEFAULT_INPUTS.monthly));
  const touched = useRef(false);

  const summary = useMemo(() => summarize(inputs), [inputs]);

  useEffect(() => {
    onChange?.(summary);
  }, [summary, onChange]);

  function update(patch: Partial<RentInputs>) {
    if (!touched.current) {
      touched.current = true;
      // Custom pixel event for audience building: people who ran the math.
      metaTrack("RentCalculated");
    }
    setInputs((prev) => ({ ...prev, ...patch }));
  }

  function commitMonthly(text: string) {
    const parsed = Number(text.replace(/[^0-9.]/g, ""));
    const next = clamp(
      Number.isFinite(parsed) ? parsed : DEFAULT_INPUTS.monthly,
      INPUT_LIMITS.monthly.min,
      INPUT_LIMITS.monthly.max
    );
    setMonthlyText(String(Math.round(next)));
    update({ monthly: next });
  }

  const rentBar = 100;
  const ownBar = Math.max(4, Math.round((summary.ownCost / summary.rentAhead) * 100));

  return (
    <div className="rounded-2xl border border-border bg-white shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* ── Inputs ── */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-surface border-b lg:border-b-0 lg:border-r border-border/70 space-y-6">
          <div>
            <label htmlFor="rent-monthly" className="block text-sm font-semibold text-navy">
              What you pay for software each month
            </label>
            <div className="mt-2 flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                <input
                  id="rent-monthly"
                  type="text"
                  inputMode="numeric"
                  value={monthlyText}
                  onChange={(e) => setMonthlyText(e.target.value)}
                  onBlur={(e) => commitMonthly(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitMonthly((e.target as HTMLInputElement).value);
                  }}
                  className="w-full h-11 pl-7 pr-3 border border-gray-300 rounded-lg text-base font-mono font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] bg-white"
                />
              </div>
              <span className="text-sm text-text-secondary">/ month</span>
            </div>
            <input
              aria-label="Monthly software spend slider"
              type="range"
              min={INPUT_LIMITS.monthly.min}
              max={15000}
              step={INPUT_LIMITS.monthly.step}
              value={Math.min(inputs.monthly, 15000)}
              onChange={(e) => {
                const v = Number(e.target.value);
                setMonthlyText(String(v));
                update({ monthly: v });
              }}
              className="mt-3 w-full accent-[#2563EB]"
            />
            <p className="mt-1 text-xs text-text-secondary">
              Add up the CRM, scheduling, quoting, invoicing, portal, reporting and chat.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="rent-years-paid" className="text-sm font-semibold text-navy">
                Years you&apos;ve already been paying
              </label>
              <span className="font-mono text-sm font-semibold text-navy">{inputs.yearsPaid}</span>
            </div>
            <input
              id="rent-years-paid"
              type="range"
              min={INPUT_LIMITS.yearsPaid.min}
              max={INPUT_LIMITS.yearsPaid.max}
              step={1}
              value={inputs.yearsPaid}
              onChange={(e) => update({ yearsPaid: Number(e.target.value) })}
              className="mt-2 w-full accent-[#2563EB]"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-navy">Years to look ahead</p>
            <div className="mt-2 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Years ahead">
              {YEARS_AHEAD_CHOICES.map((y) => (
                <button
                  key={y}
                  type="button"
                  role="radio"
                  aria-checked={inputs.yearsAhead === y}
                  onClick={() => update({ yearsAhead: y })}
                  className={`h-10 rounded-lg border-2 text-sm font-semibold transition-colors ${
                    inputs.yearsAhead === y
                      ? "border-[#2563EB] bg-blue-50 text-navy"
                      : "border-gray-200 bg-white text-text-secondary hover:border-blue-300"
                  }`}
                >
                  {y} yrs
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="rent-hike" className="text-sm font-semibold text-navy">
                Annual price increase
              </label>
              <span className="font-mono text-sm font-semibold text-navy">
                {formatPercent(inputs.hikeRate)}
              </span>
            </div>
            <input
              id="rent-hike"
              type="range"
              min={0}
              max={25}
              step={1}
              value={Math.round(inputs.hikeRate * 100)}
              onChange={(e) => update({ hikeRate: Number(e.target.value) / 100 })}
              className="mt-2 w-full accent-[#2563EB]"
            />
            <p className="mt-1 text-xs text-text-secondary">
              12% is what Vertice measured across thousands of renewals in 2025. Set it to 0 if you don&apos;t believe them.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-navy">If the build cost this many months of your rent</p>
            <div className="mt-2 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Build cost in months of rent">
              {BUILD_MONTHS_CHOICES.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={inputs.buildMonths === m}
                  onClick={() => update({ buildMonths: m })}
                  className={`h-10 rounded-lg border-2 text-sm font-semibold transition-colors ${
                    inputs.buildMonths === m
                      ? "border-[#2563EB] bg-blue-50 text-navy"
                      : "border-gray-200 bg-white text-text-secondary hover:border-blue-300"
                  }`}
                >
                  {m} mo
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              The real number comes from the call. This is yours to move.
            </p>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 p-6 sm:p-8 space-y-6" aria-live="polite">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Keep renting for {summary.yearsAhead} more years
            </p>
            <p className="mt-1 text-4xl sm:text-5xl font-bold font-mono text-navy tracking-tight">
              {formatMoney(summary.rentAhead)}
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              <span className="font-semibold text-red-600">{formatMoney(summary.hikeShare)}</span> of
              that is price increases on tools you already have. By year {summary.yearsAhead} the
              bill is {formatMoney(summary.monthlyAtEnd)} a month. What you own at the end: $0.
            </p>
          </div>

          {summary.yearsPaid > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              You&apos;ve already paid roughly{" "}
              <span className="font-mono font-bold">{formatMoney(summary.alreadyPaid)}</span> over the
              last {summary.yearsPaid} {summary.yearsPaid === 1 ? "year" : "years"}. Equity from it: $0.
            </div>
          )}

          <div className="rounded-xl border border-green-200 bg-green-50/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-800">
              Build it once and own it
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="text-3xl sm:text-4xl font-bold font-mono text-green-800 tracking-tight">
                {formatMoney(summary.ownCost)}
              </p>
              <p className="text-sm text-green-900">
                over the same {summary.yearsAhead} years: a {formatMoney(summary.buildCost)} build plus
                hosting and upkeep at {formatPercent(DEFAULT_UPKEEP_RATE)} a year.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-green-900/70">You keep</p>
                <p className="font-mono text-xl font-bold text-green-800">
                  {formatMoney(summary.kept)}
                </p>
              </div>
              <div>
                <p className="text-xs text-green-900/70">Build pays for itself in</p>
                <p className="font-mono text-xl font-bold text-green-800">
                  {summary.paybackMonths} {summary.paybackMonths === 1 ? "month" : "months"}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-side bars */}
          <div className="space-y-2" aria-hidden="true">
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-text-secondary">Rent</span>
              <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-navy" style={{ width: `${rentBar}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-text-secondary">Own</span>
              <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-[width] duration-300"
                  style={{ width: `${ownBar}%` }}
                />
              </div>
            </div>
          </div>

          {onCta && (
            <button
              type="button"
              onClick={onCta}
              className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-wide text-white bg-[#1a3a5c] hover:bg-[#142d49] border-2 border-[#2563EB] rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {ctaLabel}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <p className="text-[11px] leading-relaxed text-text-secondary/80">
            Assumptions: price increases compound yearly at the rate you set (Vertice SaaS Inflation
            Index: 12.3% year over year, September 2025). Past spend is discounted back at the same
            rate, so it understates what you paid. Upkeep is {formatPercent(DEFAULT_UPKEEP_RATE)} of
            the build per year, the top of the 15 to 25% range industry guides quote. For scale, Clutch&apos;s
            2026 guide puts the average old-style custom build at {formatMoney(OLD_CUSTOM_BUILD_COST)} over{" "}
            {OLD_CUSTOM_BUILD_MONTHS} months. Your build is scoped and priced on the call.
          </p>
        </div>
      </div>
    </div>
  );
}
