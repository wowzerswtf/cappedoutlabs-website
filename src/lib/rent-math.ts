// The math behind the "stop renting your software" funnel (/f/own).
//
// Pure functions, no React, no I/O, so the numbers on the page can be checked
// by `npm test` against hand-computed values. Every assumption that feeds the
// calculator lives here as a named constant with its source, so the page and
// the docs cannot drift from each other.

/** Year-over-year SaaS price increase. Vertice SaaS Inflation Index: 12.3%
 *  YoY as of September 2025 (peaked at 14% in May 2025). We use 12%. */
export const DEFAULT_HIKE_RATE = 0.12;

/** Annual hosting + upkeep as a share of the build cost. Industry guides quote
 *  15% to 25% a year for custom software maintenance; we use the high end so
 *  the comparison is conservative in the renter's favour. */
export const DEFAULT_UPKEEP_RATE = 0.2;

/** Clutch 2026 custom software pricing guide: average project $132,480 over
 *  about 13 months. Shown on the page as "what custom used to cost". */
export const OLD_CUSTOM_BUILD_COST = 132_480;
export const OLD_CUSTOM_BUILD_MONTHS = 13;

export interface RentInputs {
  /** What they pay for software today, per month, in dollars. */
  monthly: number;
  /** How many years they have already been paying (at roughly today's mix). */
  yearsPaid: number;
  /** How many years ahead to project. */
  yearsAhead: number;
  /** Annual price increase, e.g. 0.12 for 12%. */
  hikeRate: number;
  /** Build cost expressed as months of today's rent (12 = one year of rent). */
  buildMonths: number;
  /** Annual upkeep as a share of build cost. Defaults to DEFAULT_UPKEEP_RATE. */
  upkeepRate?: number;
}

export interface RentSummary {
  monthly: number;
  yearsPaid: number;
  yearsAhead: number;
  hikeRate: number;
  /** Rough total already handed over, discounting back for past price rises. */
  alreadyPaid: number;
  /** Rent over the next `yearsAhead` years with annual increases compounding. */
  rentAhead: number;
  /** The part of `rentAhead` that is price increases on top of today's rate. */
  hikeShare: number;
  /** What the monthly bill will be in the final projected year. */
  monthlyAtEnd: number;
  /** Build cost in dollars (buildMonths x monthly). */
  buildCost: number;
  /** Build plus upkeep over the same horizon. */
  ownCost: number;
  /** rentAhead minus ownCost. Negative means owning costs more. */
  kept: number;
  /** Months of rent it takes to pay the build back. */
  paybackMonths: number;
}

export const INPUT_LIMITS = {
  monthly: { min: 250, max: 50_000, step: 50 },
  yearsPaid: { min: 0, max: 25, step: 1 },
  yearsAhead: { min: 1, max: 10, step: 1 },
  hikeRate: { min: 0, max: 0.25, step: 0.01 },
  buildMonths: { min: 3, max: 36, step: 1 },
} as const;

export const DEFAULT_INPUTS: RentInputs = {
  monthly: 3000,
  yearsPaid: 4,
  yearsAhead: 5,
  hikeRate: DEFAULT_HIKE_RATE,
  buildMonths: 12,
};

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Sum of 12 x monthly x (1 + r)^k for k = 0 .. years-1. Year one is at
 *  today's rate; each following year is one increase higher. */
export function rentAhead(monthly: number, years: number, hikeRate: number): number {
  if (years <= 0 || monthly <= 0) return 0;
  const annual = monthly * 12;
  if (hikeRate === 0) return annual * years;
  const growth = 1 + hikeRate;
  return annual * ((Math.pow(growth, years) - 1) / hikeRate);
}

/** What the past `years` cost, assuming prices rose at `hikeRate` to reach
 *  today's bill. Each earlier year was cheaper, so this is lower than a
 *  naive monthly x 12 x years, which keeps the claim honest. */
export function rentPaid(monthly: number, years: number, hikeRate: number): number {
  if (years <= 0 || monthly <= 0) return 0;
  const annual = monthly * 12;
  if (hikeRate === 0) return annual * years;
  const growth = 1 + hikeRate;
  let total = 0;
  for (let k = 1; k <= years; k++) total += annual / Math.pow(growth, k);
  return total;
}

/** The slice of future rent that exists only because of price increases. */
export function hikeShare(monthly: number, years: number, hikeRate: number): number {
  return rentAhead(monthly, years, hikeRate) - monthly * 12 * years;
}

/** Monthly bill in the final projected year (after years-1 increases). */
export function monthlyAtEnd(monthly: number, years: number, hikeRate: number): number {
  if (years <= 0) return monthly;
  return monthly * Math.pow(1 + hikeRate, years - 1);
}

/** Build once, then pay upkeep every year of the horizon. */
export function ownCost(buildCost: number, years: number, upkeepRate: number): number {
  return buildCost + buildCost * upkeepRate * years;
}

/** Whole months of today's rent needed to cover the build. */
export function paybackMonths(buildCost: number, monthly: number): number {
  if (monthly <= 0) return Infinity;
  return Math.ceil(buildCost / monthly);
}

export function summarize(raw: RentInputs): RentSummary {
  const monthly = clamp(raw.monthly, INPUT_LIMITS.monthly.min, INPUT_LIMITS.monthly.max);
  const yearsPaid = Math.round(clamp(raw.yearsPaid, INPUT_LIMITS.yearsPaid.min, INPUT_LIMITS.yearsPaid.max));
  const yearsAhead = Math.round(clamp(raw.yearsAhead, INPUT_LIMITS.yearsAhead.min, INPUT_LIMITS.yearsAhead.max));
  const hikeRate = clamp(raw.hikeRate, INPUT_LIMITS.hikeRate.min, INPUT_LIMITS.hikeRate.max);
  const buildMonths = Math.round(clamp(raw.buildMonths, INPUT_LIMITS.buildMonths.min, INPUT_LIMITS.buildMonths.max));
  const upkeepRate = raw.upkeepRate ?? DEFAULT_UPKEEP_RATE;

  const ahead = rentAhead(monthly, yearsAhead, hikeRate);
  const buildCost = buildMonths * monthly;
  const own = ownCost(buildCost, yearsAhead, upkeepRate);

  return {
    monthly,
    yearsPaid,
    yearsAhead,
    hikeRate,
    alreadyPaid: rentPaid(monthly, yearsPaid, hikeRate),
    rentAhead: ahead,
    hikeShare: hikeShare(monthly, yearsAhead, hikeRate),
    monthlyAtEnd: monthlyAtEnd(monthly, yearsAhead, hikeRate),
    buildCost,
    ownCost: own,
    kept: ahead - own,
    paybackMonths: paybackMonths(buildCost, monthly),
  };
}

/** "$228,702". Whole dollars, US grouping, no decimals. */
export function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

/** "12%" from 0.12. */
export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/** Plain-text summary for the GHL contact note and the Telegram ping, so a
 *  closer sees the exact numbers the lead saw before the call. */
export function describeSummary(s: RentSummary): string {
  return [
    "Software rent calculator (from /f/own)",
    `Monthly spend today: ${formatMoney(s.monthly)}`,
    `Years already paying: ${s.yearsPaid} (about ${formatMoney(s.alreadyPaid)} paid so far)`,
    `Next ${s.yearsAhead} years of rent at ${formatPercent(s.hikeRate)}/yr increases: ${formatMoney(s.rentAhead)}`,
    `Of which price increases: ${formatMoney(s.hikeShare)}`,
    `Monthly bill by year ${s.yearsAhead}: ${formatMoney(s.monthlyAtEnd)}`,
    `Build assumed at ${formatMoney(s.buildCost)} (${Math.round(s.buildCost / s.monthly)} months of rent), owning for ${s.yearsAhead} years incl. upkeep: ${formatMoney(s.ownCost)}`,
    `Kept by owning: ${formatMoney(s.kept)}; payback ${s.paybackMonths} months`,
  ].join("\n");
}
