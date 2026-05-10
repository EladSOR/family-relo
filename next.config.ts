import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Long cache headers for static OG/social images.
   * These are fetched repeatedly by Facebook, Twitter, LinkedIn, Slack, Discord, etc.
   * Caching at the CDN edge dramatically reduces Vercel Fast Origin Transfer.
   */
  async headers() {
    return [
      {
        source: "/(og-.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.svg|.*\\.ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
