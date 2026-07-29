"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import PRODUCTS, { type Product } from "@/lib/products";
import { fetchProducts } from "@/service/storeService";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const POPULAR_SUGGESTIONS = [
  "bmw",
  "bmw m4 gt",
  "bmw m3",
  "bentley",
  "bmw m8",
  "mercedes benz",
  "bugatti",
  "hummer ev",
];

const STORE_PAGES = [
  { title: "HTML Sitemap", path: "/sitemap" },
  { title: "My Account", path: "/cart" },
  { title: "1:24 Diecast Catalog", path: "/products?category=1%3A24" },
  { title: "1:18 Diecast Catalog", path: "/products?category=1%3A18" },
  { title: "3D Car Frames", path: "/products?category=Frame" },
];

export default function SearchModal({ isOpen, onClose, initialQuery = "" }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts().then((res) => {
      if (res && res.length > 0) setProductsList(res);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleSearchSubmit = (searchVal: string) => {
    const term = searchVal.trim();
    if (!term) return;
    onClose();
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  const cleanQuery = query.trim().toLowerCase();

  // Dynamic Suggestions based on Query
  const suggestions = cleanQuery
    ? Array.from(
        new Set(
          productsList
            .flatMap((p) => [p.name, p.shortName, p.category, p.scale])
            .filter((str): str is string => !!str && str.toLowerCase().includes(cleanQuery))
        )
      ).slice(0, 5)
    : POPULAR_SUGGESTIONS.slice(0, 5);

  // Dynamic Pages based on Query
  const matchingPages = cleanQuery
    ? STORE_PAGES.filter((page) => page.title.toLowerCase().includes(cleanQuery))
    : [];

  // Dynamic Products based on Query
  const matchingProducts = cleanQuery
    ? productsList
        .filter((p) => {
          return (
            p.name.toLowerCase().includes(cleanQuery) ||
            p.shortName.toLowerCase().includes(cleanQuery) ||
            p.category.toLowerCase().includes(cleanQuery) ||
            (p.sku && p.sku.toLowerCase().includes(cleanQuery))
          );
        })
        .slice(0, 5)
    : productsList.slice(0, 5);

  // Highlight matching substring
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return <span className="font-semibold text-gray-900">{text}</span>;
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return <span className="font-semibold text-gray-900">{text}</span>;

    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + highlight.length);
    const after = text.substring(idx + highlight.length);

    return (
      <span className="text-gray-900 font-medium">
        {before}
        <strong className="font-black text-black">{match}</strong>
        {after}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center pt-3 sm:pt-10 px-2 sm:px-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl flex items-start gap-2 my-auto pb-6">
        {/* Main White Search Card */}
        <div className="flex-1 bg-white text-black rounded-xs shadow-2xl overflow-hidden border border-gray-200">
          {/* Top Search Input Container */}
          <div className="p-3 sm:p-4 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit(query);
              }}
              className="border-2 border-gray-800 rounded-xs p-2.5 sm:p-3 flex items-center justify-between gap-3 bg-white"
            >
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1 font-mono">
                  Search
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type model, brand, or scale..."
                  className="w-full bg-transparent text-black font-bold text-base sm:text-lg outline-none placeholder:text-gray-400 font-pally p-0 leading-tight"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="w-6 h-6 rounded-full border border-gray-300 text-gray-400 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
                <button
                  type="submit"
                  className="p-1.5 text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  <Search size={22} />
                </button>
              </div>
            </form>
          </div>

          {/* Results Content Section */}
          <div className="px-4 sm:px-5 py-2 space-y-6 bg-white max-h-[70vh] overflow-y-auto">
            {/* 1. SUGGESTIONS */}
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-1.5 mb-3 font-mono">
                Suggestions
              </div>
              <ul className="space-y-2.5 text-[14px]">
                {suggestions.length > 0 ? (
                  suggestions.map((item, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit(item)}
                        className="text-left w-full hover:text-black transition-colors cursor-pointer font-pally leading-snug block"
                      >
                        {renderHighlightedText(item, cleanQuery)}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-[12px] text-gray-400">No suggestions</li>
                )}
              </ul>
            </div>

            {/* 2. PAGES (Optional matching pages) */}
            {matchingPages.length > 0 && (
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-1.5 mb-3 font-mono">
                  Pages
                </div>
                <ul className="space-y-2 text-[13px]">
                  {matchingPages.map((page, idx) => (
                    <li key={idx}>
                      <Link
                        href={page.path}
                        onClick={onClose}
                        className="text-gray-700 hover:text-black font-semibold text-[13px] block transition-colors no-underline font-pally"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. PRODUCTS */}
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-1.5 mb-3 font-mono">
                Products
              </div>

              <div className="space-y-3.5">
                {matchingProducts.length > 0 ? (
                  matchingProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-1 hover:bg-gray-50 transition-colors group no-underline"
                    >
                      <div className="w-14 h-14 bg-white border border-gray-200 rounded-md p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <Image
                          src={p.img}
                          alt={p.name}
                          width={56}
                          height={56}
                          unoptimized
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] sm:text-[13.5px] font-medium text-gray-800 group-hover:text-black transition-colors leading-snug line-clamp-2 font-pally">
                          {p.name}
                        </h4>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-[13px] text-gray-400">
                    No matching products found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <button
            type="button"
            onClick={() => handleSearchSubmit(query)}
            className="w-full border-t border-gray-100 px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group cursor-pointer bg-white"
          >
            <span className="text-[14px] sm:text-[15px] font-normal text-gray-800 font-pally">
              Search for &quot;{query || ""}&quot;
            </span>
            <ArrowRight size={18} className="text-gray-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-gray-300 p-1.5 transition-colors cursor-pointer shrink-0 mt-2"
          title="Close search"
        >
          <X size={26} />
        </button>
      </div>
    </div>
  );
}
