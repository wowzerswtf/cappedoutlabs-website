// Run: npm test   (node's built-in runner, TypeScript via type stripping)
//
// Hand-computed reference values for the /f/own calculator. The worked
// example in the VSL script ($3,000/mo, 5 years, 12%) is pinned here, so if
// the math ever changes the script's spoken numbers fail loudly.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_HIKE_RATE,
  DEFAULT_INPUTS,
  DEFAULT_UPKEEP_RATE,
  describeSummary,
  formatMoney,
  formatPercent,
  hikeShare,
  monthlyAtEnd,
  ownCost,
  paybackMonths,
  rentAhead,
  rentPaid,
  summarize,
} from "../src/lib/rent-math.ts";

const near = (actual: number, expected: number, tolerance = 1) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${expected} +/- ${tolerance}, got ${actual}`
  );

test("the VSL's worked example: $3,000/mo for 5 years at 12% is about $228,703", () => {
  // 36,000 x (1.12^5 - 1) / 0.12 = 36,000 x 6.35285 = 228,702.5, rounds to 228,703
  near(rentAhead(3000, 5, 0.12), 228_703);
  near(hikeShare(3000, 5, 0.12), 48_703);
});

test("with no price increases rent is just monthly x 12 x years", () => {
  assert.equal(rentAhead(3000, 5, 0), 180_000);
  assert.equal(hikeShare(3000, 5, 0), 0);
  assert.equal(rentPaid(3000, 4, 0), 144_000);
});

test("year one is at today's rate, so a one-year projection has no hike", () => {
  near(rentAhead(1000, 1, 0.12), 12_000, 0.001);
  assert.equal(monthlyAtEnd(1000, 1, 0.12), 1000);
  near(monthlyAtEnd(1000, 6, 0.12), 1762.34, 0.01); // 1.12^5
});

test("past rent is discounted back, so it is lower than the naive total", () => {
  // 36,000 x (1/1.12 + 1/1.12^2 + 1/1.12^3 + 1/1.12^4) = 36,000 x 3.0373 = 109,345
  near(rentPaid(3000, 4, 0.12), 109_345);
  assert.ok(rentPaid(3000, 4, 0.12) < 3000 * 12 * 4);
  assert.equal(rentPaid(3000, 0, 0.12), 0);
});

test("owning: build once plus upkeep every year", () => {
  assert.equal(ownCost(36_000, 5, 0.2), 72_000);
  assert.equal(ownCost(36_000, 5, 0), 36_000);
});

test("payback is whole months of today's rent", () => {
  assert.equal(paybackMonths(36_000, 3000), 12);
  assert.equal(paybackMonths(36_001, 3000), 13);
  assert.equal(paybackMonths(10_000, 0), Infinity);
});

test("the default inputs reproduce the script's numbers end to end", () => {
  const s = summarize(DEFAULT_INPUTS);
  assert.equal(s.monthly, 3000);
  assert.equal(s.yearsAhead, 5);
  assert.equal(s.hikeRate, DEFAULT_HIKE_RATE);
  near(s.rentAhead, 228_703);
  near(s.hikeShare, 48_703);
  assert.equal(s.buildCost, 36_000);
  assert.equal(s.ownCost, 72_000);
  near(s.kept, 156_703);
  assert.equal(s.paybackMonths, 12);
  near(s.alreadyPaid, 109_345);
  assert.equal(DEFAULT_UPKEEP_RATE, 0.2);
});

test("summarize clamps hostile input instead of producing nonsense", () => {
  const s = summarize({ monthly: -50, yearsPaid: 999, yearsAhead: 0, hikeRate: 5, buildMonths: 0 });
  assert.equal(s.monthly, 250);
  assert.equal(s.yearsPaid, 25);
  assert.equal(s.yearsAhead, 1);
  assert.equal(s.hikeRate, 0.25);
  assert.equal(s.buildCost, 3 * 250);
  const nan = summarize({ monthly: NaN, yearsPaid: NaN, yearsAhead: NaN, hikeRate: NaN, buildMonths: NaN });
  assert.equal(nan.monthly, 250);
  assert.ok(Number.isFinite(nan.rentAhead));
});

test("owning can lose when the build is huge and the horizon is short", () => {
  const s = summarize({ monthly: 500, yearsPaid: 0, yearsAhead: 1, hikeRate: 0.12, buildMonths: 36 });
  assert.ok(s.kept < 0, "a 3-year build over a 1-year horizon should not pay back");
});

test("money and percent formatting", () => {
  assert.equal(formatMoney(228_702.4), "$228,702");
  assert.equal(formatMoney(-1234), "-$1,234");
  assert.equal(formatMoney(Infinity), "$0");
  assert.equal(formatPercent(0.12), "12%");
  assert.equal(formatPercent(0.123), "12%");
});

test("the note for the closer carries every number the lead saw", () => {
  const note = describeSummary(summarize(DEFAULT_INPUTS));
  assert.match(note, /from \/f\/own/);
  assert.match(note, /Monthly spend today: \$3,000/);
  assert.match(note, /Next 5 years of rent at 12%\/yr increases: \$228,703/);
  assert.match(note, /Of which price increases: \$48,703/);
  assert.match(note, /Build assumed at \$36,000 \(12 months of rent\)/);
  assert.match(note, /Kept by owning: \$156,703; payback 12 months/);
});
