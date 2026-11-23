import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: {
    default: "Hội Ghép tạng Việt Nam (VSOT)",
    template: "%s | VSOT",
  },
  description:
    "Hội Ghép tạng Việt Nam — Vietnam Society of Organ Transplantation.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-vsot-locale") === "en" ? "en" : "vi";

  return (
    <html lang={locale} className={beVietnam.variable}>
      <body>{children}</body>
    </html>
  );
}
