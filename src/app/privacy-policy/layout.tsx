import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Mio Mideal",
  description: "Informationen zum Datenschutz bei Mio Mideal.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}
