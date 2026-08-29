import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung | Mio Mideal",
  description:
    "Widerrufsbelehrung und Muster-Widerrufsformular von Mio Mideal.",
};

export default function RightOfWithdrawalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}
