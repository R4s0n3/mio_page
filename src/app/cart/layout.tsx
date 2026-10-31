import { pageMetadata } from "@/utils/site-metadata";

export const metadata = pageMetadata({
  title: "Cart",
  description: "Review your Mio Mideal merch and continue to checkout.",
  path: "/cart",
});

export default function CartLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
