import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB | Mio Mideal",
  description: "Allgemeine Geschäftsbedingungen von Mio Mideal.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function TosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}
