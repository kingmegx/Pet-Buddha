import type { Metadata, Viewport } from "next";
import { DM_Sans, Epilogue, Lora } from "next/font/google";
import "./globals.css";

// The type of truus.co: DM Sans for text, Epilogue for headings and the
// name, Lora italic for the odd accent word.
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const brand = Epilogue({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-brand" });
// Italic serif for the odd accent word in big headings, after truus.co.
const accent = Lora({ subsets: ["latin"], style: ["italic"], weight: ["500"], variable: "--font-accent" });

export const metadata: Metadata = {
  title: "Pet Buddha",
  description: "Personalised guidance to help you choose what's best for your pet.",
};

export const viewport: Viewport = { themeColor: "#f0ebe6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${body.className} ${brand.variable} ${accent.variable}`}>{children}</body>
    </html>
  );
}
