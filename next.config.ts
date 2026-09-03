import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    "*": ["node_modules/next/dist/server/capsize-font-metrics.json"],
  },
};

export default nextConfig;
