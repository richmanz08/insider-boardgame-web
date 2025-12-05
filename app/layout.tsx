import type { Metadata } from "next";
import { Kanit, Prompt } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/provider/InsiderAppProvider";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Insider Game - เกมสืบสวนสุดมันส์",
  description: "เกม Insider เกมสืบหาผู้บงการ เล่นกับเพื่อนได้ทุกที่ทุกเวลา",
  openGraph: {
    title: "Insider Game - เกมสืบสวนสุดมันส์",
    description: "เกม Insider เกมสืบหาผู้บงการ เล่นกับเพื่อนได้ทุกที่ทุกเวลา",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${kanit.variable} ${prompt.variable} antialiased`}
        style={{ fontFamily: "var(--font-prompt), sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
