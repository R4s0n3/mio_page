import "@/styles/globals.css";

import SetHtmlLang from "@/app/_components/set-html-lang";
import { pageMetadata } from "@/utils/site-metadata";

export const metadata = pageMetadata({
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen von Mio Mideal.",
  path: "/terms-and-conditions",
  locale: "de_DE",
});

export default function TosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="de">
      <SetHtmlLang lang="de" />
      {children}
    </div>
  );
}
