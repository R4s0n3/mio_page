import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Mio Mideal - Privacy Policy",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
        <div>
          {children}
        </div>
  );
}