import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Navbar from "@/components/sections/Navbar";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lumière — Where Light Becomes Emotion",
    template: "%s · Lumière",
  },
  description:
    "A cinematic luxury jewelry experience. Hand-crafted diamonds, platinum, and gold — told as story, not as product.",
  keywords: [
    "luxury jewelry",
    "diamond ring",
    "engagement ring",
    "fine jewelry",
    "platinum",
    "gold",
    "high jewelry",
  ],
  authors: [{ name: "Lumière Atelier" }],
  openGraph: {
    title: "Lumière — Where Light Becomes Emotion",
    description:
      "A cinematic 3D experience: follow a diamond from raw stone to finished ring.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SmoothScroll>
          <Cursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
