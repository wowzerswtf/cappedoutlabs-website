# SEO / GEO — Capped Out Labs

How cappedoutlabs.com is optimized for traditional search **and** AI search
engines (GEO — Generative Engine Optimization: ChatGPT Search, Perplexity,
Claude, Gemini AI Overviews).

## Tooling installed

Two Claude Code skill suites drive this work (installed at user level,
`~/.claude/skills/`):

- **claude-seo** (`AgriciDaniel/claude-seo`, v2.2.0) — 25 SEO sub-skills +
  18 sub-agents: technical SEO, schema, sitemaps, GEO, local, backlinks,
  Core Web Vitals. Invoke with `/seo`, `/seo-geo`, `/seo-schema`, etc.
- **geo-optimizer** (`Auriti-Labs/geo-optimizer-skill`, CLI v4.14.0) — Python
  CLI that scores AI-discoverability 0–100 across 8 categories. Installed via
  `pip install geo-optimizer-skill`. Run `geo audit --url https://cappedoutlabs.com`.

### Re-running the audit

```bash
geo audit --url https://cappedoutlabs.com --format json   # full JSON
geo audit --url https://cappedoutlabs.com                 # terminal summary
geo fix   --url https://cappedoutlabs.com --only robots,llms,schema  # suggest fixes
```

## GEO score history

| Date | Score | Band | Notes |
|------|-------|------|-------|
| 2026-06-22 (baseline) | 72 | good | before optimization pass |
| 2026-06-22 (after) | **83** | good | AI discovery + RSS + robots + schema |

Category breakdown (after):

| Category | Score | Max | Status |
|----------|-------|-----|--------|
| robots | 18 | 18 | maxed — all AI citation bots allowed |
| ai_discovery | 6 | 6 | maxed — ai.txt + /ai/*.json |
| signals | 6 | 6 | maxed — RSS feed + lang |
| meta | 14 | 14 | title, description, canonical, OG |
| llms | 12 | ~18 | llms.txt present and structured |
| schema | 12 | ~16 | rich types; gated on sameAs |
| content | 11 | 12 | minus hidden-text/keyword penalty |
| brand_entity | 7 | 10 | gated on external entity profiles |

## What's implemented

### AI crawler access — `src/app/robots.ts`
Single source of truth (a static `public/robots.txt` previously shadowed it and
was removed). Explicitly allows the citation bots that feed AI answers:
`OAI-SearchBot` (ChatGPT Search), `Google-Extended` (Gemini AI Overviews),
`ClaudeBot` / `Claude-SearchBot`, `PerplexityBot`, `Applebot-Extended`,
`Amazonbot`, `Bingbot`, plus `GPTBot` / `anthropic-ai` (training).

### AI discovery endpoints — `public/`
- `/.well-known/ai.txt` — crawler permissions + pointers to the files below
- `/ai/summary.json` — name, description, topics
- `/ai/faq.json` — structured FAQ (mirrors homepage FAQ facts)
- `/ai/service.json` — tiers, pricing, audience
- `/llms.txt` and `/.well-known/llms.txt` — site overview per llmstxt.org

### Structured data — `src/components/SchemaMarkup.tsx`
JSON-LD: Organization, WebSite (+publisher), WebPage, Service (graph of 4
tiers w/ offers), FAQPage, Quiz (assessment), BreadcrumbList, Article (case
study), and **VideoObject** for the VSL. ServiceSchema + VideoSchema render on
the homepage.

### Discovery signals
- `/feed.xml` — RSS feed generated from `resources/data.ts`, linked via
  `<link rel="alternate" type="application/rss+xml">` in the root layout.
- `/sitemap.xml` — all routes including all 8 case studies (was 2/8).

### Factual coherence
AI engines penalize contradictory facts. The audience revenue floor is aligned
to **$250K+** everywhere the firm describes who it works with (homepage, FAQ,
llms.txt, AssessmentSchema, assess page, resources, brand doc). Service prices,
quiz revenue brackets, and funnel pages are intentionally unchanged.

## Remaining roadmap (to reach "excellent" 86+)

These are deliberately **not** done because they require real assets or trade
against positioning — do not fabricate:

1. **External entity profiles** (biggest lever — unblocks schema + brand_entity):
   create a Capped Out Labs LinkedIn, X/Twitter, and Crunchbase, then add them
   to `OrganizationSchema.sameAs`. The code TODO already flags this.
2. **VSL captions/transcript** — upload captions in Vimeo or publish a transcript
   so AI engines can index the spoken content.
3. **Authoritative outbound citations** in resource articles (+AI credibility).
4. **Hidden-text penalty** — the FAQ accordion hides answers via `display:none`;
   consider SSR-rendering answers into the DOM (collapsed via CSS height) so
   crawlers read them without the cloaking signal.
