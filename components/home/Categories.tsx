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
    <section className="bg-white pt-14 md:pt-16">
      {/* Title — Clean tight top padding, no huge whitespace */}
      <h2 className="text-center text-[26px] sm:text-[30px] md:text-[34px] font-black text-[#1a1714] uppercase tracking-wide font-pally leading-tight mb-8 md:mb-10">
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
