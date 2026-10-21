// Survey slide model + the pure mapping from answers to what /api/apply gets.
//
// VSLSurvey (the modal) renders these; funnels supply their own slide list.
// Kept free of React so `npm test` can prove that a given set of answers
// produces the right GHL fields and the right contact note.

export type SurveyOption = {
  id: string;
  label: string;
};

export type SurveySlide = {
  id: string;
  question: string;
  /** radio advances on tap; checkbox collects several and needs Continue. */
  type: "radio" | "checkbox";
  options: SurveyOption[];
  /** Option id that reveals a free-text box instead of advancing. */
  showOtherField?: string;
  /** Short line under the question. */
  hint?: string;
  /** Label used in the GHL contact note. Defaults to the question. */
  noteLabel?: string;
  /** GHL custom field this answer's label is written to. */
  field?: "annualRevenue" | "bottleneck" | "aiHistory";
};

/** Separator for checkbox answers stored in the answers map. */
export const MULTI_SEPARATOR = ",";

export function otherKey(slideId: string): string {
  return `${slideId}-other`;
}

/** Resolve a stored answer (option id, or ids for checkbox) back to the label
 *  a human would read in GHL. "Other" slides return the typed text. */
export function answerLabel(
  slides: SurveySlide[],
  answers: Record<string, string>,
  slideId: string
): string {
  const slide = slides.find((s) => s.id === slideId);
  const raw = answers[slideId];
  if (!slide || !raw) return "";

  const labelOf = (id: string) => {
    const opt = slide.options.find((o) => o.id === id);
    if (slide.showOtherField && id === slide.showOtherField) {
      return answers[otherKey(slideId)] || opt?.label || "";
    }
    return opt?.label || "";
  };

  if (slide.type === "checkbox") {
    return raw.split(MULTI_SEPARATOR).map(labelOf).filter(Boolean).join(", ");
  }
  return labelOf(raw);
}

/** GHL custom-field values keyed by the API's payload names. */
export function applicationFields(
  slides: SurveySlide[],
  answers: Record<string, string>
): Partial<Record<NonNullable<SurveySlide["field"]>, string>> {
  const out: Partial<Record<NonNullable<SurveySlide["field"]>, string>> = {};
  for (const slide of slides) {
    if (!slide.field) continue;
    const label = answerLabel(slides, answers, slide.id);
    if (label) out[slide.field] = label;
  }
  return out;
}

/** The full Q&A as one contact note. `extra` is appended verbatim (used for
 *  the rent calculator summary on /f/own). */
export function buildSurveyNote(
  slides: SurveySlide[],
  answers: Record<string, string>,
  heading: string,
  extra?: string
): string {
  const lines = slides.map(
    (s) => `${s.noteLabel ?? s.question}: ${answerLabel(slides, answers, s.id) || "N/A"}`
  );
  const body = [heading, "", ...lines].join("\n");
  return extra?.trim() ? `${body}\n\n${extra.trim()}` : body;
}

/** Original VSL application survey, shared by /f/vsl, /f/vsl-b and /apply-now.
 *  The survey scores nothing; every completed application reaches the
 *  calendar (Waynard 2026-08-21). Answers are triage context for the closer. */
export const DEFAULT_SURVEY_SLIDES: SurveySlide[] = [
  {
    id: "business-type",
    question: "Which best describes you?",
    noteLabel: "Business Type",
    type: "radio",
    options: [
      { id: "operator", label: "I own/operate a business doing $500K+/yr" },
      { id: "investor", label: "I'm an investor looking to deploy AI into a portfolio company" },
      { id: "executive", label: "I'm a C-suite executive exploring AI transformation" },
      { id: "other", label: "Other" },
    ],
    showOtherField: "other",
  },
  {
    id: "revenue",
    question: "What's your current annual revenue?",
    noteLabel: "Revenue",
    field: "annualRevenue",
    type: "radio",
    options: [
      { id: "under-500k", label: "Under $500K" },
      { id: "500k-1m", label: "$500K – $1M" },
      { id: "1m-5m", label: "$1M – $5M" },
      { id: "5m-10m", label: "$5M – $10M" },
      { id: "10m-50m", label: "$10M – $50M" },
      { id: "50m-plus", label: "$50M+" },
    ],
  },
  {
    id: "biggest-bottleneck",
    question: "What's the biggest bottleneck in your business right now?",
    noteLabel: "Biggest Bottleneck",
    field: "bottleneck",
    type: "radio",
    options: [
      { id: "sales", label: "Sales: leads aren't converting, or show rate is low" },
      { id: "ops", label: "Operations: too many manual processes to scale" },
      { id: "hiring", label: "Hiring: can't find or afford the right people" },
      { id: "costs", label: "Customer acquisition costs are too high" },
      { id: "systems", label: "No systems: running on tribal knowledge and hustle" },
    ],
  },
  {
    id: "ai-experience",
    question: "Have you tried implementing AI or automation before?",
    noteLabel: "AI Experience",
    field: "aiHistory",
    type: "radio",
    options: [
      { id: "yes-failed", label: "Yes, but it didn't stick or deliver ROI" },
      { id: "yes-basic", label: "Yes, using basic tools (ChatGPT, Zapier, etc.)" },
      { id: "yes-advanced", label: "Yes, we run custom AI/ML systems in production" },
      { id: "no", label: "No, haven't started yet" },
    ],
  },
  {
    id: "budget",
    question: "Do you have $15K–$100K+ allocated for AI infrastructure in the next 90 days?",
    noteLabel: "Budget",
    type: "radio",
    options: [
      { id: "yes", label: "Yes, budget is approved and ready" },
      { id: "likely", label: "Likely, but I need to see the plan first" },
      { id: "no", label: "No, not right now" },
    ],
  },
  {
    id: "timeline",
    question: "How soon do you want to move?",
    noteLabel: "Timeline",
    type: "radio",
    options: [
      { id: "asap", label: "Immediately, ready to start this month" },
      { id: "30-days", label: "Within 30 days" },
      { id: "90-days", label: "Within 90 days" },
      { id: "exploring", label: "Just exploring for now" },
    ],
  },
  {
    id: "understand-model",
    question: "Do you understand that we're a done-for-you AI deployment firm, not a consulting shop or agency?",
    noteLabel: "Understands Model",
    type: "radio",
    options: [
      { id: "yes", label: "Yes, I want production systems deployed into my business" },
      { id: "tell-me-more", label: "Tell me more on the call" },
    ],
  },
];
