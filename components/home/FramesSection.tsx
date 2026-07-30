"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/service/storeService";

export default function FramesSection() {
  const [frames, setFrames] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchProducts().then((res) => {
      const filtered = res.filter(
        (p) =>
          p.category?.toLowerCase() === "frame" ||
          p.category?.toLowerCase() === "3d frames" ||
          p.category?.toLowerCase() === "3d frame"
      );
      setFrames(filtered);
      setLoading(false);
    });
  }, []);

  if (loading || frames.length === 0) return null;

  const visibleFrames = showAll ? frames : frames.slice(0, 4);

  const formatPrice = (product: Product) => {
    if (product.priceStr) return product.priceStr;
    const num = typeof product.price === "number" ? product.price : parseFloat(String(product.price));
    if (isNaN(num)) return `Rs. ${product.price}`;
    return `Rs. ${num.toLocaleString("en-IN")}.00`;
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-black text-[#1a1714] uppercase tracking-wide font-pally leading-tight">
            3D CAR FRAME
          </h2>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {visibleFrames.map((frame) => {
            const title = (frame.shortName || frame.name).toUpperCase();
            return (
              <Link
                key={frame.id}
                href={`/products/${frame.slug || frame.id}`}
                className="group block no-underline"
              >
                {/* Image Frame Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900 rounded-sm">
                  <img
                    src={frame.img || "/images/placeholder.png"}
                    alt={frame.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Pill Sale Badge */}
                  {(frame.badge === "Sale" || (frame.oldPrice && frame.oldPrice > frame.price)) && (
                    <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/90 text-white text-[9px] sm:text-[11px] font-normal px-2 sm:px-2.5 py-0.5 rounded-full tracking-wide shadow-sm">
                      Sale
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="mt-2 sm:mt-3 flex flex-col gap-0.5 sm:gap-1">
                  <h3 className="text-[11px] sm:text-[13px] font-semibold text-[#222222] uppercase tracking-wide leading-snug line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-[11px] sm:text-[13px] text-[#666666] font-normal">
                    {formatPrice(frame)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
          {frames.length > 4 && !showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="bg-[#483c39] hover:bg-[#382e2b] text-white text-[12px] sm:text-[14px] font-medium px-7 sm:px-10 py-2.5 sm:py-3 transition-colors duration-200 cursor-pointer inline-block text-center"
            >
              View all
            </button>
          ) : (
            <Link
              href="/products?category=3D%20Frames"
              className="bg-[#483c39] hover:bg-[#382e2b] text-white text-[12px] sm:text-[14px] font-medium px-7 sm:px-10 py-2.5 sm:py-3 transition-colors duration-200 cursor-pointer inline-block text-center no-underline"
            >
              View all
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}



