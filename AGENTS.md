# Capped Out Labs — website agent notes

## Copy quality guard (no AI slop)

All user-facing copy must read like a human operator wrote it, not an LLM. A
pre-commit hook enforces this so slop can't ship by accident.

- **Linter:** `scripts/check-ai-slop.mjs` — flags AI-writing tells (buzzwords like
  "seamless"/"cutting-edge", "it's not just X, it's Y" parallelisms, filler like
  "in today's landscape", chatbot artifacts, "leverage" as a verb). Patterns
  mirror the `humanizer` skill.
- **Pre-commit hook:** `.githooks/pre-commit` runs the linter on the lines you're
  adding in staged content files (`src/**/*.{ts,tsx}`, `public/**/*.{txt,json,html,md}`).
  Blocking tells reject the commit; em dashes and curly quotes warn only.
- **Activate on a fresh clone:** `npm install` sets it up automatically (the
  `prepare` script runs `git config core.hooksPath .githooks`). To set it manually:
  `git config core.hooksPath .githooks`.
- **Audit the whole site:** `npm run lint:slop`.
- **Escapes:** add `slop-ok` to a line to whitelist it intentionally, or
  `git commit --no-verify` to bypass the hook entirely (use sparingly).

When copy does trip the guard, fix the wording — run the `humanizer` skill if you
want a full rewrite rather than a one-line fix.
