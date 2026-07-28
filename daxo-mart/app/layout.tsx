import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "DAXOMART – Premium Diecast Scale Models & RC Toys",
  description:
    "India's #1 destination for premium 1:18, 1:24, 1:32 diecast scale model cars, remote control RC toys, and collector 3D display frames. Shop now for fast delivery.",
  keywords: "diecast cars, scale models, RC toys, toy cars, 1:18, 1:24, 1:32, collector, display frames",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
