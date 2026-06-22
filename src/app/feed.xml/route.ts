import { resourcePages } from "@/app/(main)/resources/data";

export const dynamic = "force-static";

const BASE_URL = "https://cappedoutlabs.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = [...resourcePages]
    .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
    .map((page) => {
      const url = `${BASE_URL}/resources/${page.slug}`;
      const description = page.shortDescription || page.metaDescription;
      return `    <item>
      <title>${escapeXml(page.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(page.datePublished).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const lastBuild =
    [...resourcePages]
      .map((p) => p.datePublished)
      .sort()
      .reverse()[0] ?? "2026-01-01";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Capped Out Labs — Resources</title>
    <link>${BASE_URL}/resources</link>
    <description>AI transformation playbooks and case studies for operators. Production systems, not strategy decks.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
