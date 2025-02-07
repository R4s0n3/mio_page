import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Mio Mideal - Terms and Conditions",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function TosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
        <div>
          {children}
        </div>
  );
}