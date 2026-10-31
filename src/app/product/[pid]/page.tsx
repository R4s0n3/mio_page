import type { Metadata } from "next";

import { db } from "@/server/db";
import { HydrateClient } from "@/trpc/server";
import { pageMetadata } from "@/utils/site-metadata";
import SingleView from "../_components/single-view";

function summarize(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 159).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pid: string }>;
}): Promise<Metadata> {
  const { pid } = await params;
  const fallback = pageMetadata({
    title: "Product",
    description: "Shop merch from Mio Mideal.",
    path: `/product/${pid}`,
  });

  try {
    const product = await db.product.findFirst({
      where: { id: pid, deletedAt: null },
      select: { name: true, description: true },
    });

    if (!product) return fallback;

    const descriptionText = product.description?.trim() ?? "";
    const description = descriptionText
      ? summarize(descriptionText)
      : `${product.name} from the Mio Mideal shop.`;

    return pageMetadata({
      title: product.name,
      description,
      path: `/product/${pid}`,
    });
  } catch {
    return fallback;
  }
}

export default async function ProductView({
  params,
}: {
  params: Promise<{ pid: string }>;
}) {
  const { pid } = await params;

  return (
    <HydrateClient>
      <main className="mt-4 flex min-h-screen flex-col items-center gap-16 bg-gradient-to-b from-primary-800 to-primary-900 p-2 py-20 font-subhead text-headings lg:p-8">
        <SingleView pid={pid} />
      </main>
    </HydrateClient>
  );
}
