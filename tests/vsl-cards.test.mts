// Run: npm test
//
// The /f/own VSL video is built one card per spoken chunk (tools/vsl-render).
// These tests pin the chunking so a script edit cannot silently produce a card
// that overflows the frame, drops a sentence, or splits a number across cards.
import { test } from "node:test";
import assert from "node:assert/strict";
import { OWN_VSL_SCRIPT } from "../src/lib/funnels/own.ts";
import {
  MAX_CARD_CHARS,
  buildCards,
  mergeShort,
  scriptWords,
  splitLong,
  splitSentences,
} from "../src/lib/vsl-cards.ts";

test("sentences split on terminal punctuation followed by a capital, digit, quote or dollar", () => {
  assert.deepEqual(splitSentences("You pay for a CRM. A scheduler. A quoting tool."), [
    "You pay for a CRM.",
    "A scheduler.",
    "A quoting tool.",
  ]);
  assert.deepEqual(splitSentences("Is it worth it? $36,000 says yes. 'Own it.'"), [
    "Is it worth it?",
    "$36,000 says yes.",
    "'Own it.'",
  ]);
  assert.deepEqual(splitSentences("Clutch's 2026 guide puts it at 13 months. For most owners that was never real."), [
    "Clutch's 2026 guide puts it at 13 months.",
    "For most owners that was never real.",
  ]);
});

test("a long sentence splits at the clause break nearest its middle, never mid-phrase", () => {
  const long =
    "Add them up and most companies I talk to are paying somewhere between two and ten thousand dollars a month, every month, for as long as they're in business, and the price never holds still for anyone.";
  const parts = splitLong(long, 120);
  assert.ok(parts.length >= 2);
  for (const p of parts) assert.ok(p.length <= 120, `${p.length} chars: ${p}`);
  assert.equal(parts.join(" "), long);
  assert.deepEqual(splitLong("Short one.", 120), ["Short one."]);
  assert.deepEqual(splitLong("No clause break here at all so it stays whole", 10), [
    "No clause break here at all so it stays whole",
  ]);
});

test("short neighbours merge up to the limit, long ones stay alone", () => {
  assert.deepEqual(mergeShort(["You pay for a CRM.", "A scheduler.", "A quoting tool."], 60), [
    "You pay for a CRM. A scheduler. A quoting tool.",
  ]);
  assert.deepEqual(mergeShort(["a".repeat(50), "b".repeat(50)], 60), ["a".repeat(50), "b".repeat(50)]);
  assert.deepEqual(mergeShort([], 60), []);
});

test("the real script becomes cards that fit the frame and lose nothing", () => {
  const cards = buildCards(OWN_VSL_SCRIPT);
  assert.ok(cards.length >= 40 && cards.length <= 90, `${cards.length} cards`);
  cards.forEach((c, i) => {
    assert.equal(c.index, i + 1);
    assert.ok(c.text.length <= MAX_CARD_CHARS, `card ${c.index} is ${c.text.length} chars`);
    assert.ok(c.text.length >= 12, `card ${c.index} is too short to stand alone: ${c.text}`);
    assert.ok(!/^\s|\s$/.test(c.text));
    assert.ok(!/\s{2,}/.test(c.text), `card ${c.index} has doubled whitespace`);
  });
  assert.equal(cards.map((c) => c.text).join(" "), scriptWords(OWN_VSL_SCRIPT));
});

test("beats stay in order and every beat gets at least one card", () => {
  const cards = buildCards(OWN_VSL_SCRIPT);
  const beats = cards.map((c) => c.beat);
  assert.deepEqual([...new Set(beats)], OWN_VSL_SCRIPT.map((_, i) => i));
  for (let i = 1; i < beats.length; i++) assert.ok(beats[i] >= beats[i - 1]);
  assert.equal(cards[0].text.startsWith("How much have you paid"), true);
  assert.equal(cards[cards.length - 1].text, "Fill out the form and let's talk.");
});

test("the spoken numbers never get split across two cards", () => {
  const cards = buildCards(OWN_VSL_SCRIPT);
  const texts = cards.map((c) => c.text);
  for (const phrase of [
    "two hundred twenty-nine thousand dollars",
    "hundred and fifty-seven thousand dollars",
    "hundred and thirty thousand dollars over thirteen months",
    "four hundred twenty thousand dollars",
  ]) {
    assert.ok(texts.some((t) => t.includes(phrase)), `no single card contains "${phrase}"`);
  }
});
