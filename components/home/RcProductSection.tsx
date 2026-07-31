"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";

interface RcProductSectionProps {
  title?: string;
  subtitle?: string;
  products: Product[];
}

export default function RcProductSection({
  title = "RC Toys",
  subtitle = "Remote control cars for every age group",
  products,
}: RcProductSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (!products || products.length === 0) return null;

  const mobileVisibleProducts = showAll ? products : products.slice(0, 4);

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-black text-[#1a1714] uppercase tracking-wide font-pally leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[13px] sm:text-[14px] text-gray-400 font-pally mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mobile View: 2-Column Grid (Shows 4 cards first, then all when View All clicked) */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {mobileVisibleProducts.map((p) => (
              <div key={p.id} className="flex flex-col items-stretch">
                <ProductCard product={p} variant="light" />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View: Single Row Horizontal Slide (No buttons), Grid when View All clicked */}
        <div className="hidden md:block">
          {!showAll ? (
            <div
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  className="w-[210px] sm:w-[245px] md:w-[275px] shrink-0 flex flex-col items-stretch"
                >
                  <ProductCard product={p} variant="light" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.map((p) => (
                <div key={p.id} className="flex flex-col items-stretch">
                  <ProductCard product={p} variant="light" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          {!showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="bg-black hover:bg-[#382e2b] text-white text-[13px] sm:text-[14px] font-medium px-8 sm:px-10 py-2.5 sm:py-3 rounded transition-colors duration-200 cursor-pointer text-center font-pally"
            >
              View all
            </button>
          ) : (
            <Link
              href="/products?category=RC"
              className="bg-black hover:bg-[#382e2b] text-white text-[13px] sm:text-[14px] font-medium px-8 sm:px-10 py-2.5 sm:py-3 rounded transition-colors duration-200 cursor-pointer text-center font-pally no-underline inline-block"
            >
              View all
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
