"use client";

import React, { useState, useEffect } from "react";
import { getStoredBrands, INITIAL_BRANDS, type BrandItem } from "@/lib/brands";

export default function BrandsBar() {
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);

  useEffect(() => {
    const loadBrands = () => {
      const allBrands = getStoredBrands();
      const active = allBrands.filter((b) => b.is_active !== false);
      if (active.length > 0) {
        setBrands(active);
      }
    };

    loadBrands();

    window.addEventListener("dm_brands_updated", loadBrands);
    return () => window.removeEventListener("dm_brands_updated", loadBrands);
  }, []);

  const marqueeItems = [...brands, ...brands, ...brands];

  return (
    <section className="bg-black py-20 overflow-hidden w-full relative z-10">
      <div className="marquee-track flex items-center w-max gap-30 px-5 hover:[animation-play-state:paused]">
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
                className="h-25  w-auto object-contain drop-shadow-sm"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
