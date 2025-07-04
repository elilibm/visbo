import type { NextConfig } from "next";

/**
 * Disable caching of _next/static chunks **only while running `next dev`.**
 * This prevents ChunkLoadError when you wipe `.next` and restart the server.
 */
const devNoCacheHeaders =
  process.env.NODE_ENV === "development"
    ? [
        {
          source: "/_next/static/:path*",
          headers: [
            { key: "Cache-Control", value: "no-store, must-revalidate" }
          ]
        }
      ]
    : [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return devNoCacheHeaders;
  }
};

export default nextConfig;
