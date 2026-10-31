import "@/styles/globals.css";

import SetHtmlLang from "@/app/_components/set-html-lang";
import { pageMetadata } from "@/utils/site-metadata";

export const metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description: "Informationen zum Datenschutz bei Mio Mideal.",
  path: "/privacy-policy",
  locale: "de_DE",
});

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="de">
      <SetHtmlLang lang="de" />
      {children}
    </div>
  );
}
