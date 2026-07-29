"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/service/storeService";

export default function FramesSection() {
  const [frames, setFrames] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((res) => {
      setFrames(res.filter((p) => p.category === "Frame"));
    });
  }, []);

  if (frames.length === 0) return null;

  return (
    <section className="bg-white py-12 md:py-16 border-b border-[#e8e0d8]">
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
            <Link
              key={frame.id}
              href={`/products/${frame.slug || frame.id}`}
              className="group flex flex-col no-underline cursor-pointer transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Image Box */}
              <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3.5">
                <img
                  src={frame.img}
                  alt={frame.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {/* Badge */}
                {frame.badge && (
                  <span className="absolute bottom-3 left-3 bg-[#1a1714] text-white text-[11px] font-bold tracking-wider px-3 py-1 rounded font-pally">
                    {frame.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1714] uppercase tracking-wide leading-snug line-clamp-2 mb-1.5 font-pally">
                {frame.name}
              </h3>

              {/* Price */}
              <p className="text-[15px] sm:text-[16px] font-bold text-[#1a1714] font-pally">
                Rs. {frame.price.toLocaleString("en-IN")}.00
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
