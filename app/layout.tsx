import type { Metadata, Viewport } from "next";
import { Manrope, Patrick_Hand } from "next/font/google";
import "./globals.css";

// Manrope for everything; Patrick Hand only for the name "Pet Buddha".
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const hand = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--font-hand" });

export const metadata: Metadata = {
  title: "Pet Buddha",
  description: "Personalised guidance to help you choose what's best for your pet.",
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.className} ${hand.variable}`}>{children}</body>
    </html>
  );
}
