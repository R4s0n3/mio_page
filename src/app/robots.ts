import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/utils/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/order-status", "/success", "/sponsors/success"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
