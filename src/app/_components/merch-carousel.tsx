"use client";
import { api } from "@/trpc/react";
import EmblaCarousel from "./carousel/carousel";
import "@/styles/carousel/style.css";
import LoadingSpinner from "./loading-spinner";

type MerchRaw = {
  id: string;
  name: string;
  price: number | null;
  image: string | null;
  description: string | null;
  type?: { id: string; name: string };
};

export default function MerchCarousel() {
  const { data: items } = api.product.getMerch.useQuery<MerchRaw[]>();

  if (!items) return null;

  const madeItems = items.map((i) => ({
    id: i.id,
    description: i.description,
    name: i.name,
    type: i.type?.name ?? "",
    image: i.image,
    price: i.price ?? 0,
  }));

  return <EmblaCarousel slides={madeItems} options={{}} />;
}
