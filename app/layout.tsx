import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

// Manrope for everything; Bricolage Grotesque only for the name "Pet Buddha".
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const brand = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-brand" });

export const metadata: Metadata = {
  title: "Pet Buddha",
  description: "Personalised guidance to help you choose what's best for your pet.",
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.className} ${brand.variable}`}>{children}</body>
    </html>
  );
}
