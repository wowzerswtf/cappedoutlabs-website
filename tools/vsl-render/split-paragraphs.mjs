#!/usr/bin/env node
// Cut per-paragraph voice takes (para/NN.mp3) into per-card clips (audio/NN.mp3).
//
//   node tools/vsl-render/split-paragraphs.mjs tools/vsl-render/out/own
//
// The voice is generated one paragraph per take so the delivery flows instead
// of restarting on every line. The on-screen cards are sentences inside those
// paragraphs, so each card boundary is a sentence end, and the voice pauses
// there (about 0.6s, versus 0.3s at a comma). For every boundary we take the
// pause nearest to where the boundary should fall by character count, scored
// so a longer pause wins a tie, and cut in the middle of it. Leading and
// trailing silence of each take is trimmed so the render's own gap sets the
// rhythm. Writes split.json with every cut so the choice can be checked.
//
// Options (env): SILENCE_DB (default -32), MIN_PAUSE (default 0.18s),
// LEAD_KEEP (default 0.08s), TAIL_KEEP (default 0.15s).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FFMPEG = require("ffmpeg-static");
const FFPROBE = require("ffprobe-static").path;

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node tools/vsl-render/split-paragraphs.mjs <out dir containing cards.json and para/>");
  process.exit(1);
}
const SILENCE_DB = Number(process.env.SILENCE_DB ?? -32);
const MIN_PAUSE = Number(process.env.MIN_PAUSE ?? 0.18);
const LEAD_KEEP = Number(process.env.LEAD_KEEP ?? 0.08);
const TAIL_KEEP = Number(process.env.TAIL_KEEP ?? 0.15);

const pad = (n) => String(n).padStart(2, "0");
const { cards, paragraphs } = JSON.parse(readFileSync(join(dir, "cards.json"), "utf8"));
if (!paragraphs) {
  console.error("cards.json has no paragraphs; regenerate it with cards.mjs");
  process.exit(1);
}
const audioDir = join(dir, "audio");
mkdirSync(audioDir, { recursive: true });

function duration(file) {
  return Number(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }).trim());
}

/** [{start, end}] silences in the clip, from ffmpeg's silencedetect (stderr). */
function detect(file) {
  const r = spawnSync(FFMPEG, ["-i", file, "-af", `silencedetect=n=${SILENCE_DB}dB:d=${MIN_PAUSE}`, "-f", "null", "-"], { encoding: "utf8" });
  const out = [];
  let start = null;
  for (const m of r.stderr.matchAll(/silence_(start|end): ([\d.]+)/g)) {
    if (m[1] === "start") start = Number(m[2]);
    else if (start !== null) {
      out.push({ start, end: Number(m[2]) });
      start = null;
    }
  }
  return out;
}

function cut(src, dst, from, to) {
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", src, "-ss", from.toFixed(3), "-to", to.toFixed(3), "-c:a", "libmp3lame", "-b:a", "192k", dst]);
}

const report = [];
let problems = 0;
for (const para of paragraphs) {
  const src = join(dir, "para", `${pad(para.index)}.mp3`);
  if (!existsSync(src)) {
    console.error(`missing take for paragraph ${para.index}: ${src}`);
    process.exit(1);
  }
  const mine = cards.filter((c) => c.paragraph === para.index);
  const total = duration(src);
  const sil = detect(src);

  // Speech window: trim leading / trailing silence but keep a little of each.
  let speechStart = 0;
  let speechEnd = total;
  if (sil.length && sil[0].start <= 0.01) speechStart = Math.max(0, sil[0].end - LEAD_KEEP);
  if (sil.length && sil[sil.length - 1].end >= total - 0.01) speechEnd = Math.min(total, sil[sil.length - 1].start + TAIL_KEEP);
  const inner = sil.filter((s) => s.start > speechStart && s.end < speechEnd);

  // Expected boundary times by character share of the spoken window.
  const chars = mine.map((c) => c.text.length);
  const sum = chars.reduce((a, b) => a + b, 0);
  const span = speechEnd - speechStart;
  const cuts = [];
  let acc = 0;
  let lastCut = speechStart;
  for (let k = 0; k < mine.length - 1; k++) {
    acc += chars[k];
    const expected = speechStart + (acc / sum) * span;
    // Candidates must come after the previous cut and leave room for the rest.
    const cands = inner.filter((s) => s.start > lastCut + 0.3);
    if (!cands.length) {
      cuts.push({ at: expected, pause: null, expected, note: "no pause found, cut by character share" });
      problems++;
      lastCut = expected;
      continue;
    }
    const best = cands
      .map((s) => {
        const mid = (s.start + s.end) / 2;
        const len = s.end - s.start;
        // Distance in seconds, minus a bonus for longer pauses (sentence ends).
        return { s, mid, len, score: Math.abs(mid - expected) - 1.2 * len };
      })
      .sort((a, b) => a.score - b.score)[0];
    const drift = Math.abs(best.mid - expected);
    cuts.push({ at: best.mid, pause: Number(best.len.toFixed(2)), expected: Number(expected.toFixed(2)), drift: Number(drift.toFixed(2)), note: drift > 1.5 ? "far from expected position" : undefined });
    if (drift > 1.5) problems++;
    lastCut = best.mid;
  }

  let from = speechStart;
  mine.forEach((card, i) => {
    const to = i < cuts.length ? cuts[i].at : speechEnd;
    cut(src, join(audioDir, `${pad(card.index)}.mp3`), from, to);
    report.push({ card: card.index, paragraph: para.index, from: Number(from.toFixed(2)), to: Number(to.toFixed(2)), seconds: Number((to - from).toFixed(2)), cut: i < cuts.length ? cuts[i] : undefined, text: card.text });
    from = to;
  });
  process.stdout.write(`paragraph ${pad(para.index)}: ${mine.length} card(s), ${total.toFixed(1)}s, ${inner.length} pause(s)\n`);
}
writeFileSync(join(dir, "split.json"), JSON.stringify({ silenceDb: SILENCE_DB, minPause: MIN_PAUSE, cards: report }, null, 2) + "\n");
console.log(`wrote ${report.length} card clips to ${audioDir}; ${problems} cut(s) need a look (see split.json)`);
process.exit(problems ? 2 : 0);
