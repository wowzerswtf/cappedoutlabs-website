# Own Your Software funnel (/f/own)

The pitch: stop renting software. Capped Out Labs uses AI to build your own
version of the tools you pay for every month, in weeks, for a fraction of what
custom software used to cost. The code, the data and the hosting end up in the
client's name. Tagline: "Own your software. Own your business."

Built 2026-10-20 because the "AI consultants sell decks" ads stopped pulling.

## What is live

| Piece | Where |
| --- | --- |
| Lander + written VSL | `src/app/(funnel)/f/own/{page,content}.tsx` |
| Survey, attribution, VSL script, video slot | `src/lib/funnels/own.ts` |
| Rent calculator UI | `src/components/RentCalculator.tsx` |
| Calculator math (tested) | `src/lib/rent-math.ts` |
| Shared survey model + note builder (tested) | `src/lib/survey.ts` |
| Funnel tag whitelist (tested) | `src/lib/funnels/registry.ts` |
| VSL card split (tested) | `src/lib/vsl-cards.ts` |
| VSL video renderer | `tools/vsl-render/` |
| Tests | `tests/rent-math.test.mts`, `tests/survey.test.mts`, `tests/vsl-cards.test.mts` |

The page is `noindex` like every `/f/*` lander. It is reached only from ads.
Send traffic to `https://cappedoutlabs.com/f/own?utm_source=fb&utm_campaign=own&utm_content=<ad-key>`;
the UTM parameters land on the GHL contact the same way they do for `/f/vsl`.

## How a lead flows

1. Visitor lands, reads or watches the pitch, usually runs the calculator.
2. Any CTA opens `VSLSurvey` with this funnel's slides (`OWN_SURVEY_SLIDES`).
3. Contact step posts to `/api/apply/partial` immediately (partial-applicant
   tag, Telegram ping, instant SMS nudge if they bail).
4. Last slide posts to `/api/apply` with:
   - `source: "own-funnel"`, `referralSource: "Own Your Software Funnel"`,
     `tierInterest: "Own Your Software build"`, `funnel: "own"`.
   - `annualRevenue` and `bottleneck` custom fields from the survey.
   - `message`: the full Q&A plus the calculator summary (what they pay,
     years paid, projected rent, price-increase share, assumed build, payback)
     so the builder sees the exact numbers the lead saw.
5. `/api/apply` creates or updates the GHL contact, adds the tags
   `labs-applicant`, `tcpa-consent`, and `funnel-own`, creates the opportunity
   at Applied, writes the consent note and the application note, fires the
   Meta `Lead` event (with `custom_data.funnel = "own"`), pings Telegram with a
   `Funnel: Own Your Software` line, sends the confirmation email (own-funnel
   variant), and texts the booking link.
6. The survey's thank-you screen embeds the GHL calendar; booking flows through
   the existing poll + reminder engine untouched.

Filter in GHL by the `funnel-own` tag to see only this pitch's leads.

## The calculator math

All formulas are in `src/lib/rent-math.ts` and pinned by tests.

| Quantity | Formula |
| --- | --- |
| Rent ahead | sum over k = 0..N-1 of 12 x monthly x (1 + r)^k |
| Price-increase share | rent ahead minus 12 x monthly x N |
| Already paid | sum over k = 1..P of 12 x monthly / (1 + r)^k (discounted back, so it understates) |
| Own cost | build + build x upkeep x N |
| Kept | rent ahead minus own cost |
| Payback | ceil(build / monthly) months |

Defaults and sources:

| Input | Default | Why |
| --- | --- | --- |
| Annual increase `r` | 12% | Vertice SaaS Inflation Index, 12.3% YoY as of September 2025 (peak 14% in May 2025). https://www.vertice.one/insights/saas-inflation-rate |
| Upkeep | 20% of build per year | Industry guides quote 15 to 25% a year for custom software maintenance; we take the high end so the comparison leans toward the renter. |
| Old-style custom build | $132,480 over 13 months | Clutch 2026 custom software pricing guide (via https://ipsnews.net/business/2026/07/18/how-much-does-it-cost-to-build-custom-software-in-2026-us-eu-guide/ and https://www.fuzen.io/posts/how-much-does-custom-software-cost). Shown for scale only. |
| Build cost | 12 months of the visitor's rent | Illustrative. The page says so twice. The real number comes from the scoping call. The budget slide still asks about $15K to $100K+. |
| Monthly spend | $3,000 | Middle of what the survey brackets cover. Zylo's 2026 SaaS Management Index puts median SaaS spend at $9,455 per employee per year, so $3,000 a month is a 4-person company's worth. https://zylo.com/news/2026-saas-management-index |

Worked example used in the VSL script ($3,000 a month, 5 years, 12%):

- Rent ahead: $228,703 (spoken as "about two hundred twenty-nine thousand")
- Price increases alone: $48,703 ("forty-nine thousand")
- Build at 12 months of rent: $36,000; own cost over 5 years: $72,000
- Kept: $156,703 ("roughly a hundred and fifty-seven thousand")
- Payback: 12 months
- Already paid over 4 prior years: about $109,345

If any of these change, `tests/rent-math.test.mts` fails and the script in
`src/lib/funnels/own.ts` needs re-recording.

## The VSL

The script lives in `OWN_VSL_SCRIPT` in `src/lib/funnels/own.ts`, one entry per
beat, each with an on-screen `cue` for the editor and the spoken `paragraphs`.
About 750 words, four and a half minutes at a normal pace. Read it straight;
it was written for the ear and has been through the humanizer pass.

Until the video is on Vimeo, the hero shows the same paragraphs as a written
letter with a "Keep reading" fold, so the funnel runs on day one.

The video itself is rendered from the script by `tools/vsl-render` (see its
README): white sentences on black with a voiceover, the same format as the
live `/f/vsl` video. One card per spoken chunk, 53 cards, 6 minutes, 1080p.
The 2026-10-20 render used the ElevenLabs "Brooks" preset through Higgsfield;
swapping the voice means regenerating 53 short clips and re-running the
render, about 50 credits and ten minutes. The card split is pure and tested
(`src/lib/vsl-cards.ts`, `tests/vsl-cards.test.mts`), so a script edit that
would overflow a card or orphan a number fails `npm test` before anyone
records anything.

To switch to video: upload to Vimeo (view: anybody, embed: public, like
1180565378), paste the numeric id into `OWN_VSL_VIMEO_ID`, redeploy. The letter
disappears, the player appears, nothing else changes. Check the player in a
headed browser, never headless (see `tasks/lessons.md`, Vimeo blocks headless
Chrome with a 401 that looks like a broken embed).

Beats, in order: hook (what you've paid, what you own: nothing), the problem
(rent, 12% a year, doesn't fit), what changed (AI build vs $132K / 13 months),
what you get (your own CRM, scheduling, quoting, portal, reporting; you own the
code, data, hosting), the math (the worked example), proof (contractor, law
firm, staffing results from the existing case studies), who it's for ($500K+
owners, not pre-revenue, not chatbots), the ask (form, builder call, number).

## Ad angles that match the page

Headline variants are listed in a comment above the `h1` in `content.tsx`.
Hooks for the ads themselves, same voice:

- "How much have you paid in software subscriptions since you opened? Most owners have never added it up."
- "Your software bill went up 12% last year. It'll do it again. Build your own version instead."
- "You've paid for your CRM five times over. You still don't own it."
- "Custom software used to cost $132K and take a year. It doesn't anymore."
- "Stop renting your software. Own your business."

Use `utm_content` for the ad key so `labs_utm_content` on the contact tells you
which hook brought each lead.

## Survey slides

Tools rented (checkbox, with "something else"), monthly software bill, biggest
frustration (maps to `labs_bottleneck`), revenue (maps to `labs_annual_revenue`),
timeline, budget ($15K to $100K+), and the "you own it outright, sound right?"
check. Nothing gates; every finisher sees the calendar, same rule as the other
funnels (Waynard 2026-08-21).

## Transactional copy touched

Per the 2026-07-27 lesson, post-submit UX and emails change together:

- `src/emails/ApplicationConfirmation.tsx` has an `own` variant: step 2 reads
  "We look at what you're renting before the call", and the secondary button
  points at `/f/own#math` ("Run the numbers on your software rent").
- SMS templates are unchanged; `appliedQualified` is generic enough.
- The GHL workflow "Labs - New Application" was already stripped of its
  contact-facing email (2026-07-29), so nothing stale fires from GHL.

## Verifying

```bash
npm test               # math, survey mapping, funnel registry, script tells
npx tsc --noEmit
npm run lint:slop      # no blocking AI tells
npm run dev            # open http://localhost:3000/f/own
npm run snap -- http://localhost:3000/f/own out/snap   # screenshots + modal walk-through
```

`npm run snap` (`scripts/snap-funnel.mjs`) drives the installed Chrome over the
DevTools protocol: full-page desktop and 390px phone captures, a horizontal
overflow check at phone width (exit code 2 and the offending elements if the
page scrolls sideways), then it opens the survey, fills the contact step,
ticks two tools on the checkbox slide and continues, saving a screenshot of
each state. Plain `chrome --screenshot` cannot do the phone layout because
Chrome enforces a minimum window width.

Local submits need `.env.local` with `GHL_API_KEY`, `GHL_LOCATION_ID`,
`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Without them the
form reaches the API and the API returns the "email us directly" error, which
is the correct dark behaviour. On production, submit a test application with a
real phone, confirm in GHL that the contact carries `funnel-own`, that the
application note ends with the "Software rent calculator" block, and that the
Telegram card shows the Funnel line.

## Known gaps

- The rendered video (`tools/vsl-render/out/own/vsl.mp4`, not committed) is
  waiting on a Vimeo upload. The written letter is the VSL until
  `OWN_VSL_VIMEO_ID` is set.
- Labs' own build pricing is deliberately absent from the page. The calculator
  lets the visitor set the build as months of their rent and says the real
  number comes from the call.
