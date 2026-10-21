#!/usr/bin/env node
/**
 * snap-funnel.mjs: screenshot a funnel page at desktop and phone widths and
 * click through the VSLSurvey modal, using only the Chrome already on the
 * machine (DevTools protocol over the Node built-in WebSocket; no Playwright).
 *
 *   node scripts/snap-funnel.mjs http://localhost:3000/f/own out/
 *
 * Writes desktop.png, mobile.png (full page), then modal-contact.png,
 * modal-slide1.png, modal-slide2.png at phone size. Headless Chrome enforces a
 * minimum window width, so --screenshot alone cannot produce a real 390px
 * layout; device emulation through the protocol can.
 *
 * Env: CHROME_PATH to override the Chrome binary.
 */

import { existsSync, mkdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2];
const outDir = process.argv[3] || ".";
if (!url) {
  console.error("usage: node scripts/snap-funnel.mjs <url> [outDir]");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

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
const profile = mkdtempSync(join(tmpdir(), "snap-funnel-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);
process.on("exit", () => chrome.kill());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForChrome() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {}
    await sleep(150);
  }
  throw new Error("Chrome did not start");
}

await waitForChrome();
const target = await (
  await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })
).json();
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
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const res = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (res.result?.exceptionDetails) {
    throw new Error(res.result.exceptionDetails.text || "evaluate failed");
  }
  return res.result?.result?.value;
}

async function emulate(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 700,
  });
}

async function screenshot(name, { width, fullPage }) {
  const height = fullPage
    ? Math.min(await evaluate("document.documentElement.scrollHeight"), 16000)
    : width < 700
      ? 844
      : 900;
  await emulate(width, height);
  await sleep(500);
  const res = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: fullPage,
  });
  const file = join(outDir, `${name}.png`);
  writeFileSync(file, Buffer.from(res.result.data, "base64"));
  console.log(`wrote ${file} (${width}x${height})`);
}

// Click the first button whose text contains `text`.
async function clickButton(text) {
  const ok = await evaluate(`(() => {
    const b = [...document.querySelectorAll("button")].find(x => x.textContent.toLowerCase().includes(${JSON.stringify(text.toLowerCase())}));
    if (!b) return false; b.click(); return true;
  })()`);
  if (!ok) throw new Error(`no button containing "${text}"`);
  await sleep(500);
}

// Type into a React-controlled input so its onChange fires.
async function fill(selector, value) {
  const ok = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  })()`);
  if (!ok) throw new Error(`no input ${selector}`);
}

await send("Page.enable");
await send("Runtime.enable");
await emulate(1280, 900);
await send("Page.navigate", { url });
await sleep(3500);

await screenshot("desktop", { width: 1280, fullPage: true });
await emulate(390, 844);
await sleep(400);
await screenshot("mobile", { width: 390, fullPage: true });

// Horizontal overflow check at phone width: the page must not scroll sideways.
const overflow = await evaluate(
  "document.documentElement.scrollWidth - document.documentElement.clientWidth"
);
console.log(`mobile horizontal overflow: ${overflow}px ${overflow > 0 ? "(FAIL)" : "(ok)"}`);
if (overflow > 0) {
  const offenders = await evaluate(`(() => {
    const w = document.documentElement.clientWidth;
    return [...document.querySelectorAll("body *")]
      .map(el => ({ el, r: el.getBoundingClientRect() }))
      .filter(x => x.r.right > w + 1 && x.r.width > 0)
      .sort((a, b) => b.r.right - a.r.right)
      .slice(0, 8)
      .map(x => x.el.tagName.toLowerCase() + "." + String(x.el.className).split(" ").slice(0, 4).join(".") + " right=" + Math.round(x.r.right));
  })()`);
  for (const line of offenders) console.log(`  overflows: ${line}`);
}

// Survey modal walk-through at phone size.
await evaluate("window.scrollTo(0, 0)");
await clickButton("build estimate");
await screenshot("modal-contact", { width: 390, fullPage: false });

await fill("input[id$='-name']", "Test Lead");
await fill("input[id$='-company']", "Snap QA");
await fill("input[id$='-email']", "snap-qa@example.com");
await fill("input[id$='-phone']", "5555550123");
await evaluate(`(() => { const c = document.querySelector("input[id$='-consent']"); if (c && !c.checked) c.click(); return true; })()`);
await clickButton("start my");
await screenshot("modal-slide1", { width: 390, fullPage: false });

// Checkbox slide: pick two options, continue.
await evaluate(`(() => {
  const opts = [...document.querySelectorAll("button[role='checkbox']")];
  opts[0]?.click(); opts[2]?.click(); return opts.length;
})()`);
await sleep(300);
await clickButton("continue");
await screenshot("modal-slide2", { width: 390, fullPage: false });

const step = await evaluate(`(document.body.innerText.match(/Step \\d+ of \\d+/) || [""])[0]`);
console.log(`after checkbox slide: ${step}`);

ws.close();
chrome.kill();
process.exit(overflow > 0 ? 2 : 0);
