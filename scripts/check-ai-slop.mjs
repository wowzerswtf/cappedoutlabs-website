#!/usr/bin/env node
/**
 * check-ai-slop.mjs — guards cappedoutlabs.com copy against AI-writing tells.
 *
 * Default (pre-commit): scans only the lines you're ADDING in staged content
 * files, so it catches new slop without nagging about pre-existing text.
 *   node scripts/check-ai-slop.mjs            # staged added lines (blocking)
 *   node scripts/check-ai-slop.mjs --all      # every tracked content file (audit)
 *
 * Exit code 1 = blocking tells found (commit is rejected).
 * WARN-level tells (em dashes, curly quotes, rule-of-three) print but never block.
 *
 * Escapes:
 *   - Put `slop-ok` anywhere on a line to whitelist that line.
 *   - `git commit --no-verify` bypasses the hook entirely (use sparingly).
 *
 * Based on the same "Signs of AI writing" patterns as the humanizer skill.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ALL = process.argv.includes("--all");

// Only these files carry user-facing copy worth policing.
const INCLUDE = [
  /^src\/.*\.(ts|tsx)$/,
  /^public\/.*\.(txt|json|html|md)$/,
];
// Generated/structural files and word-lists that legitimately contain the tokens.
const EXCLUDE = [
  /^src\/components\/ui\//,            // shadcn primitives — no prose
  /^public\/brand-guidelines\.html$/, // contains an intentional "words to avoid" list
  /^scripts\/check-ai-slop\.mjs$/,    // this file lists the patterns
  /\.(test|spec)\.(ts|tsx)$/,
  /^public\/.*\.(map)$/,
];

// BLOCK: high-precision tells that are almost never legitimate human copy.
const BLOCK = [
  { id: "ai-vocab", re: /\b(seamless(ly)?|cutting[-\s]edge|tapestry|pivotal|delve|supercharge|world[-\s]class|game[-\s]chang(er|ing)|best[-\s]in[-\s]class|ever[-\s]evolving|treasure trove|paradigm shift)\b/i,
    msg: "AI buzzword" },
  { id: "ai-phrase", re: /\b(testament to|in today'?s (world|landscape|fast[-\s]paced)|at its core|the real question is|let'?s dive in|without further ado|rest assured|needless to say|it'?s worth noting that|look no further|take it to the next level|unlock(ing)? (the|your) (power|potential)|elevate your)\b/i,
    msg: "AI filler / signposting phrase" },
  { id: "negative-parallelism", re: /\b(it'?s|this is|that'?s)\s+not\s+(just|merely|simply|only)\b[^.!?]*\b(it'?s|it is|but)\b/i,
    msg: 'negative parallelism ("it\'s not just X, it\'s Y")' },
  { id: "not-only-but", re: /\bnot only\b[^.!?]*\bbut also\b/i,
    msg: 'negative parallelism ("not only X but also Y")' },
  { id: "chatbot-artifact", re: /\b(I hope this helps|let me know if you'?d like|great question|certainly!|of course!|here'?s? (a|an) (overview|breakdown) of)\b/i,
    msg: "chatbot correspondence artifact" },
  { id: "leverage-verb", re: /\bleverage(s|d)?\s+(the|our|your|their|its|a|an|ai|advanced|powerful|cutting)\b/i,
    msg: 'promotional "leverage" as a verb' },
];

// WARN: useful signals, but too noisy to block on (structural separators, etc.).
const WARN = [
  { id: "em-dash", re: /—|\\u2014|&mdash;/, msg: "em dash (prefer comma/period/parens in prose)" },
  { id: "curly-quote", re: /[‘’“”]/, msg: "curly quote (prefer straight quotes / HTML entities)" },
];
// These files use `—` as a list/label separator by format convention — skip WARN there.
const WARN_EXCLUDE = [
  /^public\/llms\.txt$/,
  /^public\/\.well-known\//,
  /^public\/ai\//,
  /^public\/brand\//,
];

// Run git with an argument array — no shell, so paths with odd characters are safe.
function git(...args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function included(path) {
  if (EXCLUDE.some((re) => re.test(path))) return false;
  return INCLUDE.some((re) => re.test(path));
}

/** Returns [{ path, line, text }] of candidate lines to scan. */
function collectLines() {
  const out = [];
  if (ALL) {
    const files = git("ls-files")
      .split("\n").map((s) => s.trim()).filter(Boolean).filter(included);
    for (const path of files) {
      let content;
      try { content = readFileSync(path, "utf8"); } catch { continue; }
      content.split("\n").forEach((text, i) => out.push({ path, line: i + 1, text }));
    }
    return out;
  }
  // Staged mode: parse added lines from the cached diff, tracking new line numbers.
  const files = git("diff", "--cached", "--name-only", "--diff-filter=ACM")
    .split("\n").map((s) => s.trim()).filter(Boolean).filter(included);
  for (const path of files) {
    const diff = git("diff", "--cached", "-U0", "--", path);
    let newLine = 0;
    for (const raw of diff.split("\n")) {
      const hunk = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (hunk) { newLine = parseInt(hunk[1], 10); continue; }
      if (raw.startsWith("+++")) continue;
      if (raw.startsWith("+")) {
        out.push({ path, line: newLine, text: raw.slice(1) });
        newLine++;
      }
    }
  }
  return out;
}

function scan() {
  const lines = collectLines();
  const blocks = [];
  const warns = [];
  for (const { path, line, text } of lines) {
    if (text.includes("slop-ok")) continue;
    for (const rule of BLOCK) {
      const m = text.match(rule.re);
      if (m) blocks.push({ path, line, rule, hit: m[0], text: text.trim() });
    }
    if (!WARN_EXCLUDE.some((re) => re.test(path))) {
      for (const rule of WARN) {
        const m = text.match(rule.re);
        if (m) warns.push({ path, line, rule, hit: m[0], text: text.trim() });
      }
    }
  }
  return { blocks, warns };
}

function fmt(items) {
  for (const { path, line, rule, hit, text } of items) {
    const snippet = text.length > 120 ? text.slice(0, 117) + "..." : text;
    console.log(`  ${path}:${line}  [${rule.id}] ${rule.msg}`);
    console.log(`      → "${hit}"   in: ${snippet}`);
  }
}

const { blocks, warns } = scan();

if (warns.length) {
  console.log(`\n\x1b[33m⚠  ${warns.length} AI-tell warning(s)\x1b[0m (not blocking):`);
  fmt(warns);
}

if (blocks.length) {
  console.log(`\n\x1b[31m✖  ${blocks.length} AI-writing tell(s) block this commit:\x1b[0m`);
  fmt(blocks);
  console.log(`\nFix the copy (run the humanizer skill if unsure), or:`);
  console.log(`  • add "slop-ok" to a line to whitelist it intentionally`);
  console.log(`  • git commit --no-verify  to bypass entirely\n`);
  process.exit(1);
}

if (!ALL && !warns.length) {
  console.log("\x1b[32m✓ no AI-writing tells in staged copy\x1b[0m");
} else if (ALL && !blocks.length) {
  console.log(`\n\x1b[32m✓ no blocking AI-writing tells across tracked content\x1b[0m`);
}
process.exit(0);
