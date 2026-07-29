"use client";

import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        <CartProvider>
          {!isAdmin && <Header />}
          <main style={{ flex: 1 }}>{children}</main>
          {!isAdmin && <Footer />}
        </CartProvider>
      </body>
    </html>
  );
}
