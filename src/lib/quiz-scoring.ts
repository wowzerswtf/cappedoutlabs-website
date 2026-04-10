// ── Quiz Questions, Scoring Matrix, and Tier Calculation ────────────

export interface QuizAnswer {
  questionId: string;
  answerId: string;
}

export interface QuizContact {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
}

export interface ScoredResult {
  total: number;
  tier: Tier;
  dimensions: Record<Dimension, number>;
  answers: Record<string, AnswerOption>;
}

export type Dimension = "scale" | "painClarity" | "aiMaturity" | "urgency" | "strategicFit";

export interface Tier {
  id: string;
  label: string;
  color: string;
  colorHex: string;
  action: "calendar" | "nurture";
  summary: string;
}

export interface AnswerOption {
  id: string;
  text: string;
  score: number;
  tag?: string; // internal mapping for personalization
}

export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  options: AnswerOption[];
}

// ── Questions ───────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  {
    id: "revenue",
    dimension: "scale",
    text: "What's your business doing in annual revenue?",
    options: [
      { id: "rev-lt500k", text: "Under $500K", score: 1 },
      { id: "rev-500k-1m", text: "$500K\u2013$1M", score: 2 },
      { id: "rev-1m-3m", text: "$1M\u2013$3M", score: 4 },
      { id: "rev-3m-10m", text: "$3M\u2013$10M", score: 5 },
      { id: "rev-10m+", text: "$10M+", score: 5 },
    ],
  },
  {
    id: "bottleneck",
    dimension: "painClarity",
    text: "What\u2019s the #1 thing keeping your business from growing 2x in the next 12 months?",
    options: [
      { id: "bn-sales", text: "I can\u2019t find or keep good salespeople", score: 5, tag: "closer-os" },
      { id: "bn-ops", text: "My operations depend on me or a few key people", score: 5, tag: "contractor-os" },
      { id: "bn-leads", text: "We\u2019re drowning in leads but can\u2019t convert them fast enough", score: 4, tag: "ai-sales" },
      { id: "bn-data", text: "I don\u2019t know my numbers well enough to make decisions", score: 3, tag: "data-reporting" },
      { id: "bn-stuck", text: "Honestly, I\u2019m not sure \u2014 I just know we\u2019re stuck", score: 2, tag: "discovery" },
    ],
  },
  {
    id: "ai-maturity",
    dimension: "aiMaturity",
    text: "How is your business currently using AI?",
    options: [
      { id: "ai-none", text: "We\u2019re not \u2014 haven\u2019t figured out where to start", score: 2 },
      { id: "ai-chatgpt", text: "A few people use ChatGPT for random tasks", score: 3 },
      { id: "ai-tried", text: "We\u2019ve tried some tools but nothing stuck", score: 4 },
      { id: "ai-duct-tape", text: "We have some automations but they\u2019re duct-taped together", score: 5 },
      { id: "ai-production", text: "We have real AI systems driving revenue or cutting costs", score: 3 },
    ],
  },
  {
    id: "urgency",
    dimension: "urgency",
    text: "If you found the right AI partner, how fast would you move?",
    options: [
      { id: "urg-yesterday", text: "Yesterday \u2014 this is costing us money every week", score: 5 },
      { id: "urg-30d", text: "Within 30 days if the ROI math makes sense", score: 5 },
      { id: "urg-quarter", text: "This quarter \u2014 it\u2019s on our roadmap", score: 3 },
      { id: "urg-year", text: "Sometime this year, probably", score: 2 },
      { id: "urg-exploring", text: "Just exploring for now", score: 1 },
    ],
  },
  {
    id: "strategic-fit",
    dimension: "strategicFit",
    text: "When you think about the next 3 years, what matters most?",
    options: [
      { id: "sf-exit", text: "Building a business that runs without me", score: 5 },
      { id: "sf-scale", text: "Scaling revenue without scaling headcount", score: 5 },
      { id: "sf-lifestyle", text: "Working less, earning more", score: 4 },
      { id: "sf-compete", text: "Keeping up with competitors who are using AI", score: 3 },
      { id: "sf-cost", text: "Cutting costs wherever possible", score: 2 },
    ],
  },
];

// ── Tiers ────────────────────────────────────────────────────────────

const TIERS: Tier[] = [
  {
    id: "ai-ready",
    label: "AI Ready",
    color: "green",
    colorHex: "#059669",
    action: "calendar",
    summary: "Your business has the scale, the pain clarity, and the strategic mindset to transform with AI infrastructure. The gap isn\u2019t awareness \u2014 it\u2019s execution.",
  },
  {
    id: "ai-primed",
    label: "AI Primed",
    color: "blue",
    colorHex: "#2563EB",
    action: "calendar",
    summary: "You\u2019re in a strong position to leverage AI. You have real pain points and the business maturity to act on them. The right partner closes the gap fast.",
  },
  {
    id: "ai-curious",
    label: "AI Curious",
    color: "amber",
    colorHex: "#D97706",
    action: "nurture",
    summary: "You\u2019re thinking about AI the right way, but a few pieces need to come together first. The good news: you\u2019re closer than most businesses at your stage.",
  },
  {
    id: "ai-aware",
    label: "AI Aware",
    color: "gray",
    colorHex: "#64748B",
    action: "nurture",
    summary: "You\u2019re early in your AI journey. That\u2019s not a bad thing \u2014 it means you can skip the mistakes most businesses make and go straight to what works.",
  },
];

// ── Scoring ──────────────────────────────────────────────────────────

function getTier(score: number): Tier {
  if (score >= 20) return TIERS[0]; // AI Ready
  if (score >= 14) return TIERS[1]; // AI Primed
  if (score >= 9) return TIERS[2];  // AI Curious
  return TIERS[3];                   // AI Aware
}

function findAnswer(questionId: string, answerId: string): AnswerOption | null {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) return null;
  return question.options.find((o) => o.id === answerId) ?? null;
}

export function scoreQuiz(answers: QuizAnswer[]): ScoredResult {
  const dimensions: Record<Dimension, number> = {
    scale: 0,
    painClarity: 0,
    aiMaturity: 0,
    urgency: 0,
    strategicFit: 0,
  };

  const answerMap: Record<string, AnswerOption> = {};

  for (const { questionId, answerId } of answers) {
    const question = QUESTIONS.find((q) => q.id === questionId);
    const answer = findAnswer(questionId, answerId);
    if (!question || !answer) continue;

    dimensions[question.dimension] = answer.score;
    answerMap[questionId] = answer;
  }

  const total = Object.values(dimensions).reduce((sum, v) => sum + v, 0);
  const tier = getTier(total);

  return { total, tier, dimensions, answers: answerMap };
}

// ── Personalization helpers ──────────────────────────────────────────

export function getBottleneckService(result: ScoredResult): {
  name: string;
  headline: string;
  description: string;
  stat: string;
} {
  const tag = result.answers["bottleneck"]?.tag;

  switch (tag) {
    case "closer-os":
      return {
        name: "AI Sales Infrastructure (Closer OS)",
        headline: "Your sales bottleneck has a proven fix.",
        description:
          "We\u2019ve built AI-augmented sales systems that replace the need for large closer teams. One supplement brand went from 3 closers to 1 AI-augmented rep and increased close rate from 18% to 34%.",
        stat: "+1,866% revenue growth in 45 days",
      };
    case "contractor-os":
      return {
        name: "AI Operations Platform (ContractorOS)",
        headline: "Your business shouldn\u2019t depend on any one person.",
        description:
          "We build AI infrastructure that captures institutional knowledge and automates operational decisions \u2014 so the business runs whether you\u2019re there or not.",
        stat: "90% reduction in owner-dependent tasks",
      };
    case "ai-sales":
      return {
        name: "AI Sales + Lead Automation",
        headline: "You have the leads. You need the system.",
        description:
          "When lead volume outpaces your team\u2019s capacity, the answer isn\u2019t more reps \u2014 it\u2019s AI-powered qualification, routing, and follow-up that never sleeps.",
        stat: "77.9% show rate (up from 26.3%)",
      };
    case "data-reporting":
      return {
        name: "AI Decision Intelligence",
        headline: "You can\u2019t optimize what you can\u2019t see.",
        description:
          "We build executive dashboards and automated reporting that surface the metrics that actually matter \u2014 not vanity numbers, but the levers that move revenue.",
        stat: "Real-time visibility across all revenue drivers",
      };
    default:
      return {
        name: "AI Infrastructure Discovery",
        headline: "Let\u2019s find the biggest lever in your business.",
        description:
          "When you know something\u2019s off but can\u2019t pinpoint it, that\u2019s exactly what a discovery call is for. We\u2019ll map your operations and find the #1 place AI moves the needle.",
        stat: "Most clients find 3\u20135 high-impact opportunities",
      };
  }
}

export function getCostOfWaiting(result: ScoredResult): {
  monthly: string;
  annual: string;
  context: string;
} {
  const revenueAnswer = result.answers["revenue"]?.id;

  switch (revenueAnswer) {
    case "rev-10m+":
      return {
        monthly: "$125K\u2013$250K",
        annual: "$1.5M\u2013$3M",
        context: "At your scale, a 15% efficiency gap means seven figures left on the table annually. That\u2019s not a rounding error \u2014 it\u2019s an acquisition, a product line, or a year of runway.",
      };
    case "rev-3m-10m":
      return {
        monthly: "$37K\u2013$125K",
        annual: "$450K\u2013$1.5M",
        context: "At your scale, a 15% efficiency gap means roughly $450K\u2013$1.5M/year in unrealized margin. That\u2019s a hire, a product line, or a down payment on your next acquisition.",
      };
    case "rev-1m-3m":
      return {
        monthly: "$12K\u2013$37K",
        annual: "$150K\u2013$450K",
        context: "At your scale, every month without the right systems is $12K\u2013$37K in unrealized efficiency. Over a year, that adds up to a full-time senior hire you\u2019re funding with waste.",
      };
    case "rev-500k-1m":
      return {
        monthly: "$6K\u2013$12K",
        annual: "$75K\u2013$150K",
        context: "At your stage, the cost isn\u2019t just money \u2014 it\u2019s your time. Every hour spent on tasks AI could handle is an hour not spent growing revenue.",
      };
    default:
      return {
        monthly: "$3K\u2013$6K",
        annual: "$36K\u2013$72K",
        context: "Even at earlier stages, the compound cost of manual processes adds up fast. The businesses that adopt AI infrastructure early scale faster and cheaper.",
      };
  }
}
