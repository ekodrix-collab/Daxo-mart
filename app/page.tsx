import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import BrandsBar from "@/components/home/BrandsBar";
import FramesSection from "@/components/home/FramesSection";
import type { Metadata } from "next";
import { generateFaqJsonLd, generateStoreJsonLd } from "@/lib/jsonLd";

export const metadata: Metadata = {
  title: "DaxoMart™ | India's #1 Diecast Scale Model Cars, RC Toys & 3D Frames Store",
  description:
    "Buy original 1:18, 1:24 & 1:32 scale diecast metal alloy model cars, RC drift cars, and 3D collectible frames online at DaxoMart India. 100% Quality Checked with Free Pan-India Express Shipping & COD.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStoreJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqJsonLd()) }}
      />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <FramesSection />
      <BrandsBar />
      <Testimonials />
    </>
  );
}
