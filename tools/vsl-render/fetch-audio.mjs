#!/usr/bin/env node
// Download the per-card voiceover clips listed in audio.json into audio/NN.mp3.
//
//   node tools/vsl-render/fetch-audio.mjs tools/vsl-render/out/own
//
// audio.json is { "<card index>": "<https url>", ... } written by hand (or by
// the agent) from the TTS job results. Already-downloaded clips are skipped, so
// re-running after a partial failure only fetches what is missing.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node tools/vsl-render/fetch-audio.mjs <out dir containing audio.json>");
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(join(dir, "audio.json"), "utf8"));
const audioDir = join(dir, "audio");
mkdirSync(audioDir, { recursive: true });

let fetched = 0;
let failed = 0;
for (const [index, url] of Object.entries(manifest)) {
  const file = join(audioDir, `${String(index).padStart(2, "0")}.mp3`);
  if (existsSync(file)) continue;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    fetched++;
  } catch (err) {
    failed++;
    console.error(`card ${index}: ${err.message}`);
  }
}
console.log(`fetched ${fetched}, failed ${failed}, total in manifest ${Object.keys(manifest).length}`);
process.exit(failed ? 1 : 0);
