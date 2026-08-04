import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import StoreLayoutShell from "@/components/layout/StoreLayoutShell";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import {
  generateOrganizationJsonLd,
  generateWebsiteJsonLd,
  generateStoreJsonLd,
  generateFaqJsonLd,
} from "@/lib/jsonLd";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://daxomart.resellerpro.in";

export const metadata: Metadata = {
  title: {
    default: "DaxoMart™ | India's #1 Premium Diecast Scale Model Cars, RC Toys & Collectibles",
    template: "%s | DaxoMart",
  },
  description:
    "Shop original 1:18, 1:24 & 1:32 scale diecast metal alloy model cars, RC racing vehicles, and 3D collectible car frames at DaxoMart India. 100% quality checked with Free Express Delivery & COD.",
  keywords: [
    "DaxoMart",
    "daxomart",
    "daxomart.com",
    "Daxo Mart",
    "daxo mart diecast",
    "diecast cars India",
    "buy diecast cars online India",
    "scale model cars India",
    "1:18 diecast cars India",
    "1:24 metal model cars India",
    "1:32 diecast scale cars",
    "RC drift cars India",
    "remote control toys India",
    "3D car frame collectibles",
    "diecast car shop Kochi Kerala",
    "collectible toy cars India",
    "best diecast store India",
  ],
  authors: [{ name: "DaxoMart" }],
  creator: "DaxoMart",
  publisher: "DaxoMart",
  metadataBase: new URL(SITE_URL),
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
    locale: "en_IN",
    url: SITE_URL,
    title: "DaxoMart™ | India's #1 Premium Diecast Scale Model Cars & RC Toys Store",
    description:
      "Explore exclusive 1:18, 1:24 & 1:32 scale diecast metal alloy cars, RC vehicles, and collectible 3D frames. 100% Quality Checked with Free Express Shipping.",
    siteName: "DaxoMart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DaxoMart - Premium Diecast Scale Model Cars & RC Toys Store India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DaxoMart™ | India's #1 Premium Diecast Scale Model Cars & RC Toys Store",
    description:
      "Explore exclusive 1:18, 1:24 & 1:32 scale diecast metal alloy cars, RC vehicles, and collectible 3D frames. 100% Quality Checked with Free Express Shipping.",
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
  verification: {
    google: ["ZUKT2xCn4jt0UYdZ70hL1SxDsZgr3zkVkpaa6gQj0nI", "F7wXxuFf0rMI3syRIW43FUoJ5xu8IrrtzguF5fKjF5I"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStoreJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFaqJsonLd()),
          }}
        />
      </head>
      <body className={geist.className} suppressHydrationWarning>
        <StoreLayoutShell>{children}</StoreLayoutShell>
      </body>
    </html>
  );
}

