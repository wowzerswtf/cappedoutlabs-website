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
