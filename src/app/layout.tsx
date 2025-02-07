import "@/styles/globals.css";
import Header from "./_components/header";
import Footer from "./_components/footer";

import {Jersey_10, Russo_One, Roboto} from 'next/font/google'

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";

const jersey = Jersey_10({ subsets: ['latin'], weight:"400" });
const russo = Russo_One({ subsets: ['latin'], weight:"400" });
const roboto = Roboto({ subsets: ['latin'], weight:["400", "900"] });

export const metadata: Metadata = {
  title: "Mio Mideal",
  description: "Mio Mideal Webspace.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jersey.className} ${russo.className} ${roboto.className}`}>
      <body>
        <TRPCReactProvider>
          <Header />
          {children}
          <Footer />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
