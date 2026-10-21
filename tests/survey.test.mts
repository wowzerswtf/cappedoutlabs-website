// Run: npm test
//
// Proves the shared survey mapping: a set of answers turns into the GHL
// custom fields and the contact note the closer reads. Pins the original
// VSL note format so the refactor to per-funnel slides changed nothing for
// /f/vsl, /f/vsl-b and /apply-now.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SURVEY_SLIDES,
  answerLabel,
  applicationFields,
  buildSurveyNote,
  otherKey,
} from "../src/lib/survey.ts";
import { OWN_FUNNEL, OWN_SURVEY_SLIDES, OWN_VSL_SCRIPT } from "../src/lib/funnels/own.ts";
import { FUNNELS, funnelDef, funnelTag } from "../src/lib/funnels/registry.ts";

test("default survey: labels, fields and the exact legacy note format", () => {
  const answers = {
    "business-type": "operator",
    revenue: "1m-5m",
    "biggest-bottleneck": "ops",
    "ai-experience": "yes-basic",
    budget: "yes",
    timeline: "30-days",
    "understand-model": "yes",
  };
  assert.deepEqual(applicationFields(DEFAULT_SURVEY_SLIDES, answers), {
    annualRevenue: "$1M – $5M",
    bottleneck: "Operations: too many manual processes to scale",
    aiHistory: "Yes, using basic tools (ChatGPT, Zapier, etc.)",
  });
  assert.equal(
    buildSurveyNote(DEFAULT_SURVEY_SLIDES, answers, "VSL Funnel Application"),
    [
      "VSL Funnel Application",
      "",
      "Business Type: I own/operate a business doing $500K+/yr",
      "Revenue: $1M – $5M",
      "Biggest Bottleneck: Operations: too many manual processes to scale",
      "AI Experience: Yes, using basic tools (ChatGPT, Zapier, etc.)",
      "Budget: Yes, budget is approved and ready",
      "Timeline: Within 30 days",
      "Understands Model: Yes, I want production systems deployed into my business",
    ].join("\n")
  );
});

test("an 'Other' answer uses the typed text, and a missing answer reads N/A", () => {
  const answers = { "business-type": "other", [otherKey("business-type")]: "Franchise owner" };
  assert.equal(answerLabel(DEFAULT_SURVEY_SLIDES, answers, "business-type"), "Franchise owner");
  const note = buildSurveyNote(DEFAULT_SURVEY_SLIDES, answers, "X");
  assert.match(note, /Business Type: Franchise owner/);
  assert.match(note, /Revenue: N\/A/);
  // "Other" picked but nothing typed falls back to the option label
  assert.equal(answerLabel(DEFAULT_SURVEY_SLIDES, { "business-type": "other" }, "business-type"), "Other");
});

test("own funnel: checkbox answers join as labels, other text included", () => {
  const answers = {
    tools: "crm,quoting,other",
    [otherKey("tools")]: "Fleet tracking",
    spend: "1500-5000",
    frustration: "price",
    revenue: "1m-5m",
    timeline: "asap",
    budget: "likely",
    "understand-model": "yes",
  };
  assert.equal(
    answerLabel(OWN_SURVEY_SLIDES, answers, "tools"),
    "CRM / sales pipeline, Quoting, estimates or invoicing, Fleet tracking"
  );
  assert.deepEqual(applicationFields(OWN_SURVEY_SLIDES, answers), {
    bottleneck: "The price keeps going up",
    annualRevenue: "$1M to $5M",
  });
  const note = buildSurveyNote(
    OWN_SURVEY_SLIDES,
    answers,
    `${OWN_FUNNEL.referralSource} Application`,
    "Software rent calculator (from /f/own)\nMonthly spend today: $3,000"
  );
  assert.match(note, /^Own Your Software Funnel Application\n\n/);
  assert.match(note, /Tools rented: CRM \/ sales pipeline, Quoting, estimates or invoicing, Fleet tracking/);
  assert.match(note, /Monthly software spend: \$1,500 to \$5,000/);
  assert.match(note, /\n\nSoftware rent calculator \(from \/f\/own\)\nMonthly spend today: \$3,000$/);
});

test("own funnel: every slide id is unique and every option id is unique within its slide", () => {
  const ids = OWN_SURVEY_SLIDES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const slide of OWN_SURVEY_SLIDES) {
    const opts = slide.options.map((o) => o.id);
    assert.equal(new Set(opts).size, opts.length, `duplicate option in ${slide.id}`);
    if (slide.showOtherField) {
      assert.ok(opts.includes(slide.showOtherField), `${slide.id} showOtherField points at a missing option`);
    }
  }
});

test("own funnel attribution is registered and resolves to a GHL tag", () => {
  assert.equal(funnelTag(OWN_FUNNEL.slug), "funnel-own");
  assert.equal(funnelDef(OWN_FUNNEL.slug)?.path, "/f/own");
  assert.equal(funnelTag("OWN "), "funnel-own", "slug lookup is case and whitespace tolerant");
  assert.equal(funnelTag("drop-table"), null, "unknown slugs never become tags");
  assert.equal(funnelTag(undefined), null);
  assert.equal(funnelTag(""), null);
  for (const [slug, def] of Object.entries(FUNNELS)) {
    assert.match(def.tag, /^funnel-[a-z0-9-]+$/, `${slug} tag must be a safe GHL tag`);
  }
});

test("the VSL script has no dashes, no AI tells, and ends on the ask", () => {
  const text = OWN_VSL_SCRIPT.flatMap((s) => s.paragraphs).join("\n");
  assert.doesNotMatch(text, /[—–]/, "no em or en dashes in spoken copy");
  assert.doesNotMatch(text, /\b(seamless|cutting[- ]edge|leverage|game[- ]chang|world[- ]class|unlock)\b/i);
  assert.doesNotMatch(text, /\bnot (just|only|merely)\b[^.]*\bbut\b/i, "no not-X-but-Y");
  const last = OWN_VSL_SCRIPT[OWN_VSL_SCRIPT.length - 1];
  assert.match(last.paragraphs[last.paragraphs.length - 1], /form/i);
  assert.ok(OWN_VSL_SCRIPT.every((s) => s.cue.length > 0 && s.paragraphs.length > 0));
});
