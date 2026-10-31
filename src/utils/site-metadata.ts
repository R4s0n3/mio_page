import type { Metadata } from "next";

export const siteName = "Mio Mideal";

export const siteDescription =
  "Mio Mideal — music, projects, merch, and sponsors.";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Ignore a malformed build-time value and use the public site origin.
    }
  }

  return "https://miomideal.com";
}

export function pageMetadata({
  title,
  description,
  path = "/",
  locale = "en_US",
  index = true,
}: {
  title: string;
  description: string;
  path?: string;
  locale?: string;
  index?: boolean;
}): Metadata {
  const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale,
      url: path,
      siteName,
      title: fullTitle,
      description,
      images: [{ url: "/SVG/logo.svg", alt: siteName }],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
      images: ["/SVG/logo.svg"],
    },
  };
}
