import type { Metadata, Viewport } from "next";
import { Outfit, Patrick_Hand } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
// A hand-drawn face, used only for the "Pet Buddha" name on the landing page.
const hand = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--font-hand" });

export const metadata: Metadata = {
  title: "Pet Buddha",
  description: "Personalised guidance to help you choose what's best for your pet.",
};

export const viewport: Viewport = { themeColor: "#f5e6cf" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${hand.variable}`}>{children}</body>
    </html>
  );
}
