"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product, formatTitleCase } from "@/lib/products";
import { BuyNowModal } from "@/app/products/[id]/ProductDetailClient";

interface ProductCardProps {
  product: Product;
  variant?: "dark" | "light";
}

export default function ProductCard({ product, variant = "dark" }: ProductCardProps) {
  const [showBuyModal, setShowBuyModal] = useState(false);

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBuyModal(true);
  };

  const isLight = variant === "light";

  const secondaryImage =
    product.hoverImage ||
    (product.images && product.images.length > 1 && product.images[1] !== product.img
      ? product.images[1]
      : null);

  const formattedTitle = formatTitleCase(product.shortName || product.name);

  return (
    <>
      <div
        className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 h-full justify-between ${
          isLight
            ? "bg-[#fdfdfd] border border-[#e8e0d8] hover:shadow-xl hover:border-black/20"
            : "bg-dark2 border border-border hover:border-accent/40 shadow-lg hover:shadow-accent/5"
        }`}
      >
        <Link href={`/products/${product.slug || product.id}`} className="no-underline block flex-1 flex flex-col">
          {/* Image Box */}
          <div className="bg-white overflow-hidden relative shrink-0" style={{ aspectRatio: "4/3" }}>
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow">
                {discountPercent}% OFF
              </span>
            )}

            {/* Custom Tag / Badge */}
            {product.badge && (
              <span
                className={`absolute top-2.5 right-2.5 z-10 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                  product.badge === "New"
                    ? "bg-emerald-600 text-white"
                    : product.badge === "Sale"
                    ? "bg-amber-500 text-black"
                    : "bg-accent text-dark"
                }`}
              >
                {product.badge}
              </span>
            )}

            {/* Primary Main Cover Image */}
            <img
              src={product.img}
              alt={product.shortName || product.name}
              className={`w-full h-full object-contain p-4 transition-all duration-300 ${
                secondaryImage ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
              }`}
            />

            {/* Secondary Hover Image */}
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.shortName || product.name} hover view`}
                className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
            )}
          </div>

          {/* Details */}
          <div className="p-3.5 sm:p-4 flex flex-col gap-1 flex-1 justify-between">
            <div className="flex items-center justify-between mb-0.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isLight ? "bg-gray-100 text-gray-700" : "bg-dark3 text-muted/80"
                }`}
              >
                {product.category}
              </span>
              {product.inStock ? (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  In Stock
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Product Title — Strict 2-line clamp with overflow hidden & exact height so no half-cut 3rd line peeks through */}
            <div className="h-[2.55rem] overflow-hidden flex items-center">
              <h3
                className={`text-[12.5px] sm:text-[13.5px] font-bold leading-[1.25] line-clamp-2 transition-colors font-pally ${
                  isLight ? "text-[#0c0c0c] group-hover:text-amber-700" : "text-cream group-hover:text-accent"
                }`}
                title={formattedTitle}
              >
                {formattedTitle}
              </h3>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 my-0.5">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <span className={`text-[10px] font-medium ${isLight ? "text-gray-500" : "text-muted"}`}>
                (4.9)
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-[16.5px] sm:text-[17px] font-black font-pally ${isLight ? "text-[#0c0c0c]" : "text-cream"}`}>
                {product.priceStr || `₹${product.price.toLocaleString("en-IN")}`}
              </span>
              {(product.oldPriceStr || (product.oldPrice && product.oldPrice > product.price)) && (
                <span
                  className={`text-[12px] line-through font-medium ${isLight ? "text-gray-400" : "text-muted"}`}
                >
                  {product.oldPriceStr || `₹${product.oldPrice?.toLocaleString("en-IN")}`}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Buy Now Full Width CTA */}
        <div className="p-3.5 sm:p-4 pt-0 mt-auto">
          {!product.inStock || product.stock === 0 ? (
            <button
              disabled
              className="w-full bg-gray-800 text-gray-400 font-bold text-[12px] uppercase tracking-wider py-2.5 rounded-lg font-pally cursor-not-allowed border border-gray-700 opacity-75"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={handleBuy}
              className={`w-full font-black text-[12px] uppercase tracking-wider py-2.5 rounded-lg transition-all font-pally shadow-md cursor-pointer block text-center ${
                isLight
                  ? "bg-[#0c0c0c] hover:bg-black text-white"
                  : "bg-accent hover:bg-accent/90 text-dark hover:shadow-accent/20"
              }`}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>

      {/* Buy Now Modal */}
      <BuyNowModal
        product={product}
        quantity={1}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </>
  );
}
