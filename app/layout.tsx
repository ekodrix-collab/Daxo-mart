import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import StoreLayoutShell from "@/components/layout/StoreLayoutShell";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Daxo-mart | Premium Diecast Scale Model Cars, RC Toys & Collectibles",
    template: "%s | Daxo-mart",
  },
  description:
    "Shop premium 1:32, 1:24, and 1:18 diecast metal alloy scale model cars, RC racing vehicles, and collectible toys at Daxo-mart. 100% quality checked with fast delivery.",
  keywords: [
    "Daxo-mart",
    "Daxo mart",
    "diecast cars",
    "scale model cars",
    "1:32 diecast cars",
    "1:24 metal model cars",
    "1:18 scale alloy cars",
    "RC cars",
    "remote control toys",
    "collectible toy cars",
    "diecast toy store",
    "premium toy store",
  ],
  authors: [{ name: "Daxo-mart" }],
  creator: "Daxo-mart",
  publisher: "Daxo-mart",
  metadataBase: new URL("https://daxomart.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png?v=2", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico?v=2"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://daxomart.com",
    title: "Daxo-mart | Premium Diecast Scale Model Cars & RC Toys",
    description:
      "Explore exclusive 1:32, 1:24 & 1:18 diecast metal cars, RC vehicles, and collectible toy frames. Fast delivery and 100% quality checked.",
    siteName: "Daxo-mart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Daxo-mart - Diecast Scale Model Cars & RC Toys Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daxo-mart | Premium Diecast Scale Model Cars & RC Toys",
    description:
      "Explore exclusive 1:32, 1:24 & 1:18 diecast metal cars, RC vehicles, and collectible toy frames. Fast delivery and 100% quality checked.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        <StoreLayoutShell>{children}</StoreLayoutShell>
      </body>
    </html>
  );
}
