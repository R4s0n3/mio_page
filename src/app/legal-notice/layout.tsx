import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Mio Mideal - Legal Notice",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
        <div>
          {children}
        </div>
  );
}