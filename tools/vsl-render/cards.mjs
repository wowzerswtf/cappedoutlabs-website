#!/usr/bin/env node
// Dump the VSL cards for a funnel as JSON, one object per on-screen card.
//
//   node tools/vsl-render/cards.mjs own > tools/vsl-render/out/own/cards.json
//
// paragraphs[] is what the voice reads, one take each (the TTS manifest);
// cards[] is what is shown, and what split-paragraphs.mjs cuts the takes into.
import { buildCards, buildParagraphs } from "../../src/lib/vsl-cards.ts";

const slug = process.argv[2] || "own";
const scripts = {
  own: async () => (await import("../../src/lib/funnels/own.ts")).OWN_VSL_SCRIPT,
};
if (!scripts[slug]) {
  console.error(`unknown funnel "${slug}"; known: ${Object.keys(scripts).join(", ")}`);
  process.exit(1);
}
const script = await scripts[slug]();
const cards = buildCards(script);
const paragraphs = buildParagraphs(script);
process.stdout.write(JSON.stringify({ slug, paragraphs, cards }, null, 2) + "\n");
