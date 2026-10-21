#!/usr/bin/env node
// Render a text-on-black VSL from cards.json + audio/NN.mp3 into vsl.mp4.
//
//   node tools/vsl-render/render.mjs tools/vsl-render/out/own
//
// Style matches the live Labs VSL (Vimeo 1180565378): black frame, white
// Inter semibold centred, "CAPPED OUT LABS" letterspaced in grey at the foot.
// Each card is screenshotted from an HTML template with the installed Chrome
// (DevTools protocol, same approach as scripts/snap-funnel.mjs), held for the
// length of its voice clip plus a short gap, then the segments are joined.
//
// Options (env): GAP_SECONDS (default 0.45), END_SECONDS (default 4),
// FADE_SECONDS (default 0.18), CHROME_PATH.
import { existsSync, mkdirSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function run(bin, args) {
  try {
    return execFileSync(bin, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    console.error(`
${bin.split(/[\/]/).pop()} failed:
${err.stderr || err.message}`);
    process.exit(1);
  }
}
const FFMPEG = require("ffmpeg-static");
const FFPROBE = require("ffprobe-static").path;

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node tools/vsl-render/render.mjs <out dir containing cards.json and audio/>");
  process.exit(1);
}
const GAP = Number(process.env.GAP_SECONDS ?? 0.45);
const END = Number(process.env.END_SECONDS ?? 4);
const FADE = Number(process.env.FADE_SECONDS ?? 0.18);
const W = 1920;
const H = 1080;
const FPS = 30;

const { cards } = JSON.parse(readFileSync(join(dir, "cards.json"), "utf8"));
const framesDir = join(dir, "frames");
const segDir = join(dir, "segments");
mkdirSync(framesDir, { recursive: true });
mkdirSync(segDir, { recursive: true });

// Every card needs its clip before we start, so a missing one fails fast.
const missing = cards.filter((c) => !existsSync(join(dir, "audio", `${pad(c.index)}.mp3`)));
if (missing.length) {
  console.error(`missing audio for cards: ${missing.map((c) => c.index).join(", ")}`);
  process.exit(1);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------- card HTML ----------
function cardHtml(text, { end = false } = {}) {
  const size = text.length > 150 ? 50 : text.length > 110 ? 54 : text.length > 70 ? 58 : 62;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;width:${W}px;height:${H}px;background:#000;overflow:hidden}
  body{font-family:Inter,"Segoe UI",system-ui,-apple-system,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
  .stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 170px}
  .text{font-weight:600;font-size:${size}px;line-height:1.38;text-align:center;letter-spacing:-0.005em;text-wrap:balance;max-width:1580px}
  .end .text{font-weight:700;font-size:64px}
  .end .sub{margin-top:28px;font-weight:500;font-size:34px;color:#b5b5b5;text-align:center}
  .foot{position:absolute;left:0;right:0;bottom:66px;text-align:center;font-weight:500;font-size:19px;letter-spacing:.28em;color:#7c7c7c}
</style></head><body class="${end ? "end" : ""}">
<div class="stage"><div>
  <div class="text">${esc(text)}</div>
  ${end ? `<div class="sub">Fill out the form below this video.</div>` : ""}
</div></div>
<div class="foot">CAPPED OUT LABS</div>
</body></html>`;
}

// ---------- headless Chrome over DevTools ----------
const CHROME =
  process.env.CHROME_PATH ||
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => existsSync(p));
if (!CHROME) {
  console.error("Chrome not found; set CHROME_PATH");
  process.exit(1);
}
const port = 9000 + Math.floor(Math.random() * 1000);
const profile = mkdtempSync(join(tmpdir(), "vsl-render-"));
const chrome = spawn(
  CHROME,
  ["--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"],
  { stdio: "ignore" }
);
process.on("exit", () => chrome.kill());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < 100; i++) {
  try {
    if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break;
  } catch {}
  await sleep(150);
}
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let nextId = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });

async function snap(html, file) {
  await send("Page.navigate", { url: "data:text/html;charset=utf-8," + encodeURIComponent(html) });
  // Wait for Inter to load (or time out to the fallback font after 6s).
  await send("Runtime.evaluate", {
    expression: "Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 6000))]).then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))",
    awaitPromise: true,
  });
  const res = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(file, Buffer.from(res.result.data, "base64"));
}

const fontCheck = await (async () => {
  await send("Page.navigate", { url: "data:text/html;charset=utf-8," + encodeURIComponent(cardHtml("font probe")) });
  const r = await send("Runtime.evaluate", {
    expression: "Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 8000))]).then(() => document.fonts.check('600 50px Inter'))",
    awaitPromise: true,
    returnByValue: true,
  });
  return r.result?.result?.value;
})();
console.log(`Inter loaded: ${fontCheck}`);

// ---------- per-card frames + segments ----------
function probe(file) {
  const out = run(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  return Number(out.trim());
}

const list = [];
let total = 0;
const timeline = [];
for (const card of cards) {
  const id = pad(card.index);
  const png = join(framesDir, `${id}.png`);
  const mp3 = join(dir, "audio", `${id}.mp3`);
  const seg = join(segDir, `${id}.mp4`);
  await snap(cardHtml(card.text), png);
  const voice = probe(mp3);
  const hold = voice + GAP;
  // Loudness-normalise each clip so per-line TTS calls sit at one level, pad
  // the gap with silence, fade the card in. Constant settings so concat is a
  // straight stream copy.
  run(FFMPEG, [
    "-y", "-loglevel", "error",
    "-loop", "1", "-framerate", String(FPS), "-i", png,
    "-i", mp3,
    "-filter_complex",
    `[0:v]format=yuv420p,fade=t=in:st=0:d=${FADE}[v];[1:a]aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo,apad=pad_dur=${GAP}[a]`,
    "-map", "[v]", "-map", "[a]",
    "-t", hold.toFixed(3),
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-tune", "stillimage", "-r", String(FPS),
    "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
    "-movflags", "+faststart",
    seg,
  ]);
  timeline.push({ index: card.index, start: total, voice: Number(voice.toFixed(2)), hold: Number(hold.toFixed(2)), text: card.text });
  total += hold;
  list.push(seg);
  process.stdout.write(`card ${id}/${pad(cards.length)}  ${voice.toFixed(2)}s  ${card.text.slice(0, 60)}\n`);
}

// End card: silent, held for END seconds.
{
  const png = join(framesDir, "end.png");
  const seg = join(segDir, "end.mp4");
  await snap(cardHtml("Stop renting your software. Own it.", { end: true }), png);
  run(FFMPEG, [
    "-y", "-loglevel", "error",
    "-loop", "1", "-framerate", String(FPS), "-i", png,
    "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
    "-filter_complex", `[0:v]format=yuv420p,fade=t=in:st=0:d=${FADE},fade=t=out:st=${(END - 0.6).toFixed(2)}:d=0.6[v]`,
    "-map", "[v]", "-map", "1:a",
    "-t", String(END),
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-tune", "stillimage", "-r", String(FPS),
    "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
    seg,
  ]);
  timeline.push({ index: "end", start: total, voice: 0, hold: END, text: "(end card)" });
  total += END;
  list.push(seg);
}

// ---------- concat ----------
const listFile = join(segDir, "list.txt");
writeFileSync(listFile, list.map((f) => `file '${resolve(f).replace(/\\/g, "/").replace(/'/g, "'\\''")}'`).join("\n") + "\n");
const out = join(dir, "vsl.mp4");
run(FFMPEG, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", "-movflags", "+faststart", out]);
writeFileSync(join(dir, "timeline.json"), JSON.stringify({ total: Number(total.toFixed(2)), cards: timeline }, null, 2) + "\n");

const dur = probe(out);
console.log(`\nwrote ${out}`);
const secs = Math.round(dur);
  console.log(`duration ${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, "0")}s, ${cards.length} cards + end card, Inter ${fontCheck ? "yes" : "NO (fallback font)"}`);
ws.close();
chrome.kill();
process.exit(0);
