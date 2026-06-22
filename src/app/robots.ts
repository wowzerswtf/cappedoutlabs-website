import type { MetadataRoute } from "next";

// AI search & citation bots — these power AI Overviews, ChatGPT Search,
// Perplexity, and Claude citations. Plus training crawlers (allowed) and Googlebot.
const aiAndSearchBots = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bingbot",
  "GPTBot",
  "anthropic-ai",
  "Googlebot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thank-you", "/brand-guidelines.html"],
      },
      {
        userAgent: aiAndSearchBots,
        allow: "/",
      },
    ],
    sitemap: "https://cappedoutlabs.com/sitemap.xml",
    host: "https://cappedoutlabs.com",
  };
}
