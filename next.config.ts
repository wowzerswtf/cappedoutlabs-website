import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
