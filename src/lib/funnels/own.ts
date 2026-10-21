// Everything specific to the "stop renting your software" funnel at /f/own:
// the survey, the attribution strings, the VSL script, and the video slot.
//
// Copy in this file is user-facing. It has been through the humanizer pass and
// the slop linter; keep it that way (no em dashes, no buzzwords, no "not X
// but Y"). The page component only lays this out.

import type { SurveySlide } from "@/lib/survey";

/** Vimeo video id for the recorded VSL. Leave null until the video exists:
 *  the hero then shows the written letter below instead of a player, so the
 *  funnel can run on day one. Paste the id (digits only) once it's uploaded
 *  and redeploy; nothing else changes. */
export const OWN_VSL_VIMEO_ID: string | null = "1237888260";

/** Attribution sent with every application from this funnel. */
export const OWN_FUNNEL = {
  slug: "own",
  source: "own-funnel",
  referralSource: "Own Your Software Funnel",
  tierInterest: "Own Your Software build",
} as const;

/** Survey slides. Answers are triage context for the builder on the call;
 *  nothing here gates anyone out, every finisher reaches the calendar. */
export const OWN_SURVEY_SLIDES: SurveySlide[] = [
  {
    id: "tools",
    question: "Which of these do you pay for every month?",
    hint: "Pick everything that applies.",
    noteLabel: "Tools rented",
    type: "checkbox",
    options: [
      { id: "crm", label: "CRM / sales pipeline" },
      { id: "scheduling", label: "Scheduling, booking or dispatch" },
      { id: "quoting", label: "Quoting, estimates or invoicing" },
      { id: "jobs", label: "Project or job management" },
      { id: "inventory", label: "Inventory or ordering" },
      { id: "portal", label: "Customer portal or client app" },
      { id: "reporting", label: "Reporting / dashboards" },
      { id: "other", label: "Something else" },
    ],
    showOtherField: "other",
  },
  {
    id: "spend",
    question: "What's your total monthly software bill, roughly?",
    noteLabel: "Monthly software spend",
    type: "radio",
    options: [
      { id: "under-500", label: "Under $500" },
      { id: "500-1500", label: "$500 to $1,500" },
      { id: "1500-5000", label: "$1,500 to $5,000" },
      { id: "5000-15000", label: "$5,000 to $15,000" },
      { id: "15000-plus", label: "$15,000 or more" },
    ],
  },
  {
    id: "frustration",
    question: "What bugs you most about renting it?",
    noteLabel: "Biggest frustration",
    field: "bottleneck",
    type: "radio",
    options: [
      { id: "price", label: "The price keeps going up" },
      { id: "fit", label: "It doesn't fit how we actually work" },
      { id: "waste", label: "We pay for seats and features nobody uses" },
      { id: "lock-in", label: "Our data is locked inside their system" },
      { id: "sprawl", label: "We duct-tape five tools together to get through a day" },
      { id: "own", label: "Nothing in particular. I'd just rather own it" },
    ],
  },
  {
    id: "revenue",
    question: "What's your current annual revenue?",
    noteLabel: "Revenue",
    field: "annualRevenue",
    type: "radio",
    options: [
      { id: "under-500k", label: "Under $500K" },
      { id: "500k-1m", label: "$500K to $1M" },
      { id: "1m-5m", label: "$1M to $5M" },
      { id: "5m-10m", label: "$5M to $10M" },
      { id: "10m-50m", label: "$10M to $50M" },
      { id: "50m-plus", label: "$50M+" },
    ],
  },
  {
    id: "timeline",
    question: "How soon do you want your own version running?",
    noteLabel: "Timeline",
    type: "radio",
    options: [
      { id: "asap", label: "As soon as possible. I'd start this month" },
      { id: "30-days", label: "Within 30 days" },
      { id: "90-days", label: "Within 90 days" },
      { id: "exploring", label: "Just looking for now" },
    ],
  },
  {
    id: "budget",
    question: "Do you have $15K to $100K+ set aside to build software you own?",
    noteLabel: "Budget",
    type: "radio",
    options: [
      { id: "yes", label: "Yes, the budget is ready" },
      { id: "likely", label: "Probably, once I see the scope and the number" },
      { id: "no", label: "No, not right now" },
    ],
  },
  {
    id: "understand-model",
    question:
      "We build the software and hand it to you, with the code, data and hosting in your name. You own it outright. Is that what you're after?",
    noteLabel: "Understands model",
    type: "radio",
    options: [
      { id: "yes", label: "Yes, that's what I want" },
      { id: "tell-me-more", label: "Walk me through it on the call" },
    ],
  },
];

export interface ScriptSection {
  /** On-screen cue for the teleprompter / editor. Not shown on the page. */
  cue: string;
  paragraphs: string[];
}

/** The VSL, in the order it is spoken. The page renders the paragraphs as a
 *  written letter until OWN_VSL_VIMEO_ID is set; the docs render the cues too.
 *  Numbers quoted here come from src/lib/rent-math.ts constants and the
 *  worked example in docs/own-your-software-funnel.md. */
export const OWN_VSL_SCRIPT: ScriptSection[] = [
  {
    cue: "Hook. Direct to camera. On screen: a running total that climbs from $0.",
    paragraphs: [
      "How much have you paid in software subscriptions since you started your business? Add it up from the month you opened. Most owners I ask have never done it, and when they do, the number lands somewhere between a nice truck and a down payment on a house.",
      "Here's what you own at the end of it: nothing. Cancel next month and it's gone, and the records, the workflows and the years of setup go with it.",
    ],
  },
  {
    cue: "The problem. On screen: logos blurred, prices stacking up.",
    paragraphs: [
      "I'm Waynard with Capped Out Labs. We build software for businesses, and I want to show you why the deal you're getting on software is worse than it looks.",
      "You pay for a CRM. A scheduler. A quoting tool. Something for invoices, something for the team chat, something for the customer portal. Each one is a few hundred a month, so none of them ever feels like a decision. Add them up and most companies I talk to are paying somewhere between two and ten thousand dollars a month, every month, for as long as they're in business.",
      "And the price doesn't hold still. Vertice tracks what software vendors actually charge at renewal across thousands of contracts, and their index has been running at about twelve percent a year. That's four times inflation. On their numbers, the bill you pay today roughly doubles over the next six years, for the same tools doing the same job.",
      "Meanwhile none of it fits how you work. You bend your process to fit the software. You pay for seats your team doesn't use and features you never turn on, and the one thing that would actually save you time is in the enterprise tier, or on the roadmap, or a flat no.",
    ],
  },
  {
    cue: "What changed. On screen: '13 months, $132K' crossed out.",
    paragraphs: [
      "Until recently the alternative was worse. Custom software meant an agency, a six figure quote and a year of meetings. Clutch's 2026 pricing guide puts the average custom build at about a hundred and thirty thousand dollars over thirteen months. For most owners that was never a real option, so you rented.",
      "That's the part that changed. We build software with AI now. I mean the application itself: the screens, the database, the integrations, written and tested by AI, with an engineer directing it and checking every piece. What used to take a team a year takes us weeks. What used to cost six figures costs a fraction of that.",
    ],
  },
  {
    cue: "What you get. On screen: screens of a CRM, a scheduler, a portal, each stamped 'yours'.",
    paragraphs: [
      "We look at the tools you're renting and we build your own version. Your CRM, built around your sales process. Your scheduling and dispatch. Your quoting and invoicing, wired straight into your accounting. A customer portal with your name on it. The reports you actually run the business on, in one place.",
      "And when it's done, you own it. The code sits in a repository under your account. The data sits in a database you control. The hosting runs under your company's name and bills you directly, usually for less than one of the subscriptions it replaced. If we got hit by a bus tomorrow, your software keeps running, and any competent developer can pick it up.",
    ],
  },
  {
    cue: "The math. On screen: the calculator from the page, numbers filling in live.",
    paragraphs: [
      "Take a real-sized example. Say you're paying three thousand a month across your tools. Over the next five years, with twelve percent annual increases, that's about two hundred twenty-nine thousand dollars in rent. Forty-nine thousand of that is price increases alone. At the end of the five years you own nothing.",
      "Now say the build costs one year of that rent, thirty-six thousand. Add hosting and upkeep at twenty percent a year, which is the high end of what the industry quotes. Five years of owning it comes to about seventy-two thousand. You keep roughly a hundred and fifty-seven thousand dollars, and you own the asset. The build pays for itself in twelve months, and every month after that is yours.",
      "There's a calculator on this page. Put your own numbers in. It takes ten seconds, and the number is usually uncomfortable.",
    ],
  },
  {
    cue: "Proof. On screen: the three results as cards.",
    paragraphs: [
      "We've done this for a contracting company that was spending eighteen hours a week on estimates, invoices and QuickBooks. Their own system does it now, and they went from getting paid in twenty-one days to four. A law firm whose inquiries took forty-eight hours to route now answers them in minutes, which added four hundred twenty thousand dollars in billable work in ninety days. A staffing agency went from five placements a month to fourteen on software that matches candidates and writes the outreach for them.",
    ],
  },
  {
    cue: "Who it's for. Direct to camera.",
    paragraphs: [
      "This is for owners doing at least five hundred thousand a year who pay real money for software and are tired of renting it. If you're pre-revenue, or you want someone to set up a chatbot, we're the wrong call.",
    ],
  },
  {
    cue: "The ask. On screen: arrow down to the form, then the calendar.",
    paragraphs: [
      "The next step is the short form below this video. Tell us what you're paying for and what you'd want to own. Then you'll pick a time for a thirty minute call with one of our builders. On that call we map your tools, tell you what we'd build first, and give you a real number. If it makes sense, we start. If it doesn't, you'll at least know what your software is costing you.",
      "Stop renting your software. Own it. Own your business.",
      "Fill out the form and let's talk.",
    ],
  },
];
