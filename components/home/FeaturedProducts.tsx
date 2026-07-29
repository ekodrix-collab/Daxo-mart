"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/service/storeService";
import { BuyNowModal } from "@/app/products/[id]/ProductDetailClient";

/* ── Product Card Component ───────────────────────────────────── */
function ProductCard({ p }: { p: Product }) {
  const [showBuyModal, setShowBuyModal] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBuyModal(true);
  };

  return (
    <>
      <div className="group flex flex-col shrink-0 w-[210px] sm:w-[245px] md:w-[275px] bg-[#fdfdfd] border border-[#e8e0d8] rounded-2xl p-3 sm:p-4 hover:shadow-xl hover:border-black/20 transition-all duration-200">
        <Link href={`/products/${p.id}`} className="no-underline block flex-1">
          {/* Image Box */}
          <div className="relative bg-[#f4f4f4] rounded-xl overflow-hidden h-[150px] sm:h-[180px] md:h-[200px] flex items-center justify-center mb-3">
            <img
              src={p.img}
              alt={p.name}
              className="w-[85%] h-[85%] object-contain object-center block group-hover:scale-105 transition-transform duration-300"
            />
            {/* Sale Badge */}
            {p.badge && (
              <span className="absolute bottom-2.5 left-2.5 bg-[#0c0c0c] text-white text-[10px] sm:text-[11px] font-bold tracking-wider px-2.5 py-1 rounded font-pally">
                {p.badge}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="text-[12px] sm:text-[13px] font-bold text-[#0c0c0c] uppercase tracking-wide leading-snug line-clamp-2 mb-1 font-pally min-h-[36px]">
            {p.name}
          </h3>

          {/* Price */}
          <p className="text-[14px] sm:text-[15px] font-bold text-[#0c0c0c] mb-2 font-pally">
            Rs. {p.price.toLocaleString("en-IN")}.00
          </p>
        </Link>

        {/* ── ACTION BUTTON: BUY NOW ── */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={handleBuyNow}
            className="w-full bg-[#0c0c0c] hover:bg-black text-white text-[12px] font-extrabold uppercase tracking-wider py-3 rounded-xl transition-all font-pally shadow-sm cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Buy Now Modal */}
      <BuyNowModal
        product={p}
        quantity={1}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </>
  );
}

/* ── Section Component ────────────────────────────────────────── */
function ProductSection({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  const pages = Math.ceil(products.length / 5) || 1;

  return (
    <section className="bg-white py-10 sm:py-14 border-b border-[#e8e0d8]">
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
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="bg-none border-none text-[20px] text-gray-400 cursor-pointer px-2">‹</button>
          <span className="text-[12px] sm:text-[13px] text-gray-600 font-pally">1/{pages}</span>
          <button className="bg-none border-none text-[20px] text-gray-600 cursor-pointer px-2">›</button>
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

  const p124 = productsList.filter((p) => p.category === "1:24");
  const p118 = productsList.filter((p) => p.category === "1:18");
  const prc = productsList.filter((p) => p.category === "RC");

  return (
    <>
      <ProductSection title="1:24 Diecast" subtitle="Discover collection of 1:24 scale model cars" products={p124} />
      <ProductSection title="1:18 Diecast" subtitle="Discover collection of 1:18 scale model cars" products={p118} />
      <ProductSection title="RC Toys" subtitle="Remote control cars for every age group" products={prc} />
    </>
  );
}
