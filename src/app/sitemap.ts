import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/utils/site-metadata";

const routes = [
  "",
  "/projects",
  "/cart",
  "/legal-notice",
  "/privacy-policy",
  "/terms-and-conditions",
  "/right-of-withdrawal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return routes.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
