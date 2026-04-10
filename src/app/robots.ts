import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/thank-you", "/brand-guidelines.html"],
    },
    sitemap: "https://cappedoutlabs.com/sitemap.xml",
  };
}
