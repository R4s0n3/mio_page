import SetHtmlLang from "@/app/_components/set-html-lang";
import { pageMetadata } from "@/utils/site-metadata";

export const metadata = pageMetadata({
  title: "Widerrufsbelehrung",
  description:
    "Widerrufsbelehrung und Muster-Widerrufsformular von Mio Mideal.",
  path: "/right-of-withdrawal",
  locale: "de_DE",
});

export default function RightOfWithdrawalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="de">
      <SetHtmlLang lang="de" />
      {children}
    </div>
  );
}
