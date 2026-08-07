import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // www was in DNS but never attached to the Vercel project, so it served a
  // certificate error until 2026-08-06. It now resolves, and this keeps the
  // apex canonical so the two hostnames don't split ranking signals.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.cappedoutlabs.com" }],
        destination: "https://cappedoutlabs.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/llms.txt",
        destination: "/api/llms-txt",
      },
    ];
  },
};

export default nextConfig;
