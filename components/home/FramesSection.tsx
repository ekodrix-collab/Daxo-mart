"use client";

import { useState, useEffect } from "react";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/service/storeService";
import ProductCard from "@/components/product/ProductCard";

export default function FramesSection() {
  const [frames, setFrames] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((res) => {
      setFrames(res.filter((p) => p.category === "Frame" || p.category === "3D Frames"));
    });
  }, []);

  if (frames.length === 0) return null;

  return (
    <section className="bg-white py-12 md:py-16 ">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-[26px] sm:text-[32px] md:text-[34px] font-black text-[#1a1714] uppercase tracking-wide font-pally leading-tight">
            3D Car Frame
          </h2>
          <p className="text-[13px] sm:text-[14px] text-gray-500 font-pally mt-1">
            Wall-mounted diorama display frames for serious collectors
          </p>
        </div>

        {/* Responsive 3-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {frames.map((frame) => (
            <ProductCard key={frame.id} product={frame} variant="light" />
          ))}
        </div>
      </div>
    </section>
  );
}
