"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type CategoryItem } from "@/lib/categories";
import { fetchCategories } from "@/service/storeService";

export default function Categories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    fetchCategories().then((res) => {
      if (res.length > 0) {
        setCategories(res);
      }
    });
  }, []);

  return (
    <section className="bg-white pt-5 pb-10 sm:pt-7 sm:pb-12 md:pt-8 md:pb-14">
      {/* Title — Clean tight top padding, no huge whitespace */}
      <h2 className="text-center text-[22px] sm:text-[26px] md:text-[28px] font-black tracking-[0.18em] uppercase text-[#0c0c0c] mb-6 sm:mb-8 font-pally">
        Shop By Category
      </h2>

      {/* Circle Grid / Row */}
      <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8 md:gap-10 max-w-[1200px] mx-auto px-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.filterValue)}`}
            className="group flex flex-col items-center gap-2.5 sm:gap-3.5 no-underline"
          >
            {/* Circle container */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full bg-[#0c0c0c] border-4 border-[#1f1f1f] overflow-hidden flex items-center justify-center shrink-0 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#C5A059] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)] shadow-md">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover object-center rounded-full block transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Label */}
            <span className="text-[13px] sm:text-[14px] font-bold tracking-wide text-[#0c0c0c] font-pally text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
