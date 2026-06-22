export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Capped Out Labs",
    url: "https://cappedoutlabs.com",
    logo: "https://cappedoutlabs.com/og-image.png",
    description:
      "AI transformation infrastructure for operators. Production systems, not strategy decks. From the team behind Capped Out Media.",
    foundingDate: "2024",
    parentOrganization: {
      "@type": "Organization",
      name: "Capped Out Media",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: "https://cappedoutlabs.com/apply",
    },
    // TODO: Add Capped Out Labs LinkedIn/Twitter when created. Using parent company for now.
    sameAs: ["https://www.linkedin.com/company/capped-out-media"],
    serviceType: "AI Consulting",
    areaServed: "United States",
    priceRange: "$15,000 - $500,000+",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Capped Out Labs",
    url: "https://cappedoutlabs.com",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Capped Out Labs",
      url: "https://cappedoutlabs.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function VideoSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Capped Out Labs — How we build AI into how your company runs",
    description:
      "Capped Out Labs builds custom AI into how a company runs — making the work faster and cheaper, built once and reused across the business. Production systems, not strategy decks.",
    thumbnailUrl: "https://cappedoutlabs.com/og-image.png",
    uploadDate: "2026-04-20",
    embedUrl: "https://player.vimeo.com/video/1180565378",
    contentUrl: "https://vimeo.com/1180565378",
    publisher: {
      "@type": "Organization",
      name: "Capped Out Labs",
      logo: {
        "@type": "ImageObject",
        url: "https://cappedoutlabs.com/og-image.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebPageSchema({
  name,
  path,
}: {
  name: string;
  path: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url: `https://cappedoutlabs.com${path}`,
    dateModified: "2026-04-07",
    isPartOf: {
      "@type": "WebSite",
      name: "Capped Out Labs",
      url: "https://cappedoutlabs.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "AI Revenue Sprint",
        provider: { "@type": "Organization", name: "Capped Out Labs" },
        description:
          "2-week AI readiness audit with a single highest-leverage workflow built live. Includes 30-day support and ascension path to Tier 2.",
        offers: {
          "@type": "Offer",
          price: "15000",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Service",
        name: "AI Revenue Infrastructure",
        provider: { "@type": "Organization", name: "Capped Out Labs" },
        description:
          "6–10 week engagement rebuilding 3–5 core workflows with AI across sales, operations, fulfillment, and customer success. Includes staff training and 90-day managed handoff.",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "50000",
          highPrice: "150000",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Service",
        name: "Full AI Transformation",
        provider: { "@type": "Organization", name: "Capped Out Labs" },
        description:
          "3–6 month full infrastructure rebuild with AI agents across all departments. Governance framework, executive dashboards, and complete documentation for due diligence and exit preparation.",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "200000",
          highPrice: "500000",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Service",
        name: "Equity / Rev-Share",
        provider: { "@type": "Organization", name: "Capped Out Labs" },
        description:
          "No upfront cost engagement with 3–10% equity or 10–20% revenue share on incremental lift. Same deliverables as Tier 1 or Tier 2. Business evaluation required before engagement.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: "2026-04-07",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function AssessmentSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "AI Readiness Assessment",
    description:
      "Free 5-question AI readiness assessment for business operators. Scores your business across 5 dimensions — scale, pain clarity, AI maturity, urgency, and strategic fit — then delivers a personalized report with your tier, biggest opportunity, cost-of-waiting analysis, and 90-day roadmap.",
    url: "https://cappedoutlabs.com/assess",
    provider: {
      "@type": "Organization",
      name: "Capped Out Labs",
      url: "https://cappedoutlabs.com",
    },
    about: [
      {
        "@type": "Thing",
        name: "Artificial Intelligence readiness",
        description: "Measuring business readiness for AI infrastructure deployment",
      },
      {
        "@type": "Thing",
        name: "AI consulting assessment",
        description: "Qualification assessment for AI transformation services",
      },
    ],
    educationalLevel: "Professional",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Business operators doing $250K+ in annual revenue",
    },
    numberOfQuestions: 5,
    timeRequired: "PT2M",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free AI readiness assessment with personalized report",
    },
    hasPart: [
      {
        "@type": "Question",
        name: "Business Scale",
        text: "What is your business doing in annual revenue?",
        about: "Revenue qualification and operational complexity assessment",
      },
      {
        "@type": "Question",
        name: "Growth Bottleneck",
        text: "What is the number one thing keeping your business from growing 2x in the next 12 months?",
        about: "Pain point identification mapping to AI solutions (sales, operations, lead conversion, data, general)",
      },
      {
        "@type": "Question",
        name: "AI Maturity",
        text: "How is your business currently using AI?",
        about: "Current state of AI adoption from none to production systems",
      },
      {
        "@type": "Question",
        name: "Timeline and Urgency",
        text: "If you found the right AI partner, how fast would you move?",
        about: "Decision timeline and urgency for AI implementation",
      },
      {
        "@type": "Question",
        name: "Strategic Vision",
        text: "When you think about the next 3 years, what matters most?",
        about: "Strategic alignment with exit-focused AI infrastructure",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CaseStudySchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Closer OS — AI Sales Infrastructure Case Study",
    author: { "@type": "Organization", name: "Capped Out Labs" },
    publisher: {
      "@type": "Organization",
      name: "Capped Out Labs",
      url: "https://cappedoutlabs.com",
    },
    description:
      "AI sales infrastructure deployed into a digital incubator portfolio brand. Revenue grew from $200K to $3.9M (+1,866%), CAC dropped 90%, and ROAS reached 23.4x — all within 45 days of live data.",
    url: "https://cappedoutlabs.com/case-studies",
    about: [
      {
        "@type": "Claim",
        name: "Revenue growth",
        description: "$200K to $3,933,000 (+1,866%) in 45 days",
      },
      {
        "@type": "Claim",
        name: "ROAS improvement",
        description: "2.1x to 23.4x",
      },
      {
        "@type": "Claim",
        name: "CAC reduction",
        description: "$11,765 to $1,217 (-90%)",
      },
      {
        "@type": "Claim",
        name: "Show rate improvement",
        description: "26.3% to 77.9%",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
