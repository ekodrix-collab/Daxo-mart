"use client";

import React, { useState, useEffect } from "react";
import { getStoredBrands, type BrandItem } from "@/lib/brands";

export default function BrandsBar() {
  const [brands, setBrands] = useState<BrandItem[]>([]);

  useEffect(() => {
    const fetchBrandsData = async () => {
      const allBrands = await getStoredBrands();
      const active = allBrands.filter((b) => b.is_active !== false);
      setBrands(active);
    };

    fetchBrandsData();
  }, []);

  if (brands.length === 0) {
    return null;
  }

  const marqueeItems = [...brands, ...brands, ...brands];

  return (
    <section className="bg-white py-6 md:py-16 lg:py-20 overflow-hidden w-full relative z-10">
      <div className="marquee-track flex items-center w-max gap-10 md:gap-20 lg:gap-30 px-5 hover:[animation-play-state:paused]">
        {marqueeItems.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-110"
            title={item.name}
          >
            {item.logoUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.logoUrl}
                alt={item.name}
                className="h-15 sm:h-16 md:h-20 lg:h-25 w-auto object-contain drop-shadow-sm"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
