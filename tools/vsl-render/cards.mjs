#!/usr/bin/env node
// Dump the VSL cards for a funnel as JSON, one object per on-screen card.
//
//   node tools/vsl-render/cards.mjs own > tools/vsl-render/out/own/cards.json
//
// The card text is exactly what gets spoken and shown, so this file is the
// manifest for both the TTS step and the render step (see README.md).
import { buildCards } from "../../src/lib/vsl-cards.ts";

const slug = process.argv[2] || "own";
const scripts = {
  own: async () => (await import("../../src/lib/funnels/own.ts")).OWN_VSL_SCRIPT,
};
if (!scripts[slug]) {
  console.error(`unknown funnel "${slug}"; known: ${Object.keys(scripts).join(", ")}`);
  process.exit(1);
}
const cards = buildCards(await scripts[slug]());
process.stdout.write(JSON.stringify({ slug, cards }, null, 2) + "\n");
