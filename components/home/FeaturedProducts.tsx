"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/service/storeService";
import ProductCard from "@/components/product/ProductCard";

import RcProductSection from "@/components/home/RcProductSection";

/* ── Section Component ────────────────────────────────────────── */
function ProductSection({
  title,
  subtitle,
  products,
  category,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  category?: string;
}) {
  if (products.length === 0) return null;

  const targetCategory =
    category ||
    (title.includes("1:24") ? "1:24" : title.includes("1:18") ? "1:18" : "");
  const shopHref = targetCategory
    ? `/products?category=${encodeURIComponent(targetCategory)}`
    : "/products";

  return (
    <section className="bg-white py-10 sm:py-14 ">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-black text-[#1a1714] uppercase tracking-wide font-pally leading-tight">
            {title}
          </h2>
          <p className="text-[13px] sm:text-[14px] text-gray-400 font-pally mt-1">
            {subtitle}
          </p>
        </div>

        <div
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p) => (
            <div key={p.id} className="w-[210px] sm:w-[245px] md:w-[275px] shrink-0 flex flex-col items-stretch">
              <ProductCard product={p} variant="light" />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link
            href={shopHref}
            className="bg-[#483c39] hover:bg-[#382e2b] text-white text-[13px] sm:text-[14px] font-medium px-8 sm:px-10 py-2.5 sm:py-3 rounded transition-colors duration-200 cursor-pointer text-center font-pally no-underline inline-block"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function FeaturedProducts() {
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((res) => setProductsList(res));
  }, []);

  const p124 = productsList.filter(
    (p) => p.category === "1:24" || p.category?.toLowerCase().includes("1:24")
  );
  const p118 = productsList.filter(
    (p) => p.category === "1:18" || p.category?.toLowerCase().includes("1:18")
  );
  const prc = productsList.filter(
    (p) =>
      p.category === "RC" ||
      p.category === "RC Toys" ||
      p.category?.toLowerCase().includes("rc")
  );

  return (
    <>
      <ProductSection title="1:24 Diecast" subtitle="Discover collection of 1:24 scale model cars" products={p124} category="1:24" />
      <ProductSection title="1:18 Diecast" subtitle="Discover collection of 1:18 scale model cars" products={p118} category="1:18" />
      <RcProductSection title="RC Toys" subtitle="Remote control cars for every age group" products={prc} />
    </>
  );
}
