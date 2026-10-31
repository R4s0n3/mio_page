import "@/styles/globals.css";

import SetHtmlLang from "@/app/_components/set-html-lang";
import { pageMetadata } from "@/utils/site-metadata";

export const metadata = pageMetadata({
  title: "Impressum",
  description: "Anbieterkennzeichnung und Kontaktangaben von Mio Mideal.",
  path: "/legal-notice",
  locale: "de_DE",
});

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="de">
      <SetHtmlLang lang="de" />
      {children}
    </div>
  );
}
