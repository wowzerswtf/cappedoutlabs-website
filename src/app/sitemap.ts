import type { MetadataRoute } from "next";
import { resourceSlugs } from "./resources/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cappedoutlabs.com";

  const resourceEntries = resourceSlugs.map((slug) => ({
    url: `${baseUrl}/resources/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const serviceSlugs = ["ai-revenue-sprint", "ai-revenue-infrastructure", "full-ai-transformation", "equity-rev-share"];
  const serviceEntries = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const caseStudySlugs = ["portfolio-brand-ai-sales-infrastructure", "contractor-business-automation"];
  const caseStudyEntries = caseStudySlugs.map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...serviceEntries,
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...caseStudyEntries,
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...resourceEntries,
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/apply`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];
}
