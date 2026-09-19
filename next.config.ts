import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Front Desk corpus is read from disk at runtime by the chat route; trace it into the function.
  outputFileTracingIncludes: {
    "/api/chat": ["./data/corpus/**", "./data/*.json"],
  },
};

export default nextConfig;
