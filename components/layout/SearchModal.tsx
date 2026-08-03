"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import PRODUCTS, { type Product, formatTitleCase } from "@/lib/products";
import { fetchProducts } from "@/service/storeService";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const STORE_PAGES = [
  { title: "1:24 Diecast Catalog", path: "/products?category=1%3A24" },
  { title: "1:18 Diecast Catalog", path: "/products?category=1%3A18" },
  { title: "1:32 Diecast Catalog", path: "/products?category=1%3A32" },
  { title: "RC Racing Toys", path: "/products?category=RC+Toys" },
  { title: "3D Car Frames", path: "/products?category=3D+Frames" },
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
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, initialQuery]);

  // Generate popular suggestions with real capitalized brand & model names
  const defaultPopularSuggestions = useMemo(() => {
    const list: string[] = [];
    if (productsList && productsList.length > 0) {
      productsList.forEach((p) => {
        if (p.name) {
          // Extract brand/model (e.g., "1:32 BMW M4 G82 Premium..." -> "BMW M4 G82")
          const cleaned = p.name
            .replace(/^\d+:\d+\s*/i, "")
            .split(" - ")[0]
            .split(" Premium ")[0]
            .split(" Die-Cast ")[0]
            .split(" Diecast ")[0];
          if (cleaned && cleaned.trim().length > 2) {
            list.push(formatTitleCase(cleaned.trim()));
          }
        }
      });
    }
    const unique = Array.from(new Set(list));
    if (unique.length > 0) return unique.slice(0, 6);

    return [
      "BMW M4 G82",
      "BMW M6 GT3",
      "Rolls Royce Cullinan",
      "Land Rover Defender",
      "Range Rover",
      "1:24 Diecast",
    ];
  }, [productsList]);

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
            .flatMap((p) => [formatTitleCase(p.name), p.shortName ? formatTitleCase(p.shortName) : null, p.category, p.scale])
            .filter((str): str is string => !!str && str.toLowerCase().includes(cleanQuery))
        )
      ).slice(0, 6)
    : defaultPopularSuggestions;

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

  return (
    <div className="fixed inset-0 z-[100] bg-[#0c0c0c]/95 sm:bg-black/80 backdrop-blur-md flex flex-col sm:items-center sm:justify-start sm:pt-10 sm:px-4 overflow-hidden">
      {/* Full screen mobile container / Centered desktop card */}
      <div className="w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[85vh] bg-white text-black sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-gray-200">
        
        {/* Top Search Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-b border-gray-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit(query);
            }}
            className="border-2 border-gray-900 rounded-xl p-2 sm:p-3 flex items-center justify-between gap-2 bg-white"
          >
            <div className="flex-1 min-w-0 pl-1">
              <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest leading-none mb-1 font-mono">
                Search DaxoMart
              </label>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type model, BMW, scale 1:24..."
                className="w-full bg-transparent text-black font-bold text-[15px] sm:text-[17px] outline-none placeholder:text-gray-400 font-pally p-0 leading-tight"
              />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear input"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="p-2 bg-[#C5A059] hover:bg-[#b08b46] text-black rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                title="Submit search"
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-black transition-colors cursor-pointer shrink-0"
                title="Close search"
              >
                <X size={22} />
              </button>
            </div>
          </form>
        </div>

        {/* Scrollable Content View */}
        <div className="flex-1 px-4 sm:px-5 py-4 space-y-6 bg-white overflow-y-auto">
          {/* 1. SUGGESTIONS */}
          <div>
            <div className="text-[10.5px] font-extrabold uppercase tracking-widest text-amber-800/80 border-b border-gray-100 pb-1.5 mb-3 font-mono flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#C5A059]" /> Popular Suggestions
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSearchSubmit(item)}
                  className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#C5A059]/20 hover:border-[#C5A059] border border-gray-200 text-[13px] font-bold text-gray-900 transition-all cursor-pointer font-pally leading-snug"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 2. MATCHING PAGES */}
          {matchingPages.length > 0 && (
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-1.5 mb-3 font-mono">
                Store Categories & Pages
              </div>
              <div className="flex flex-wrap gap-2">
                {matchingPages.map((page, idx) => (
                  <Link
                    key={idx}
                    href={page.path}
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[12.5px] font-semibold text-gray-800 no-underline font-pally"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. MATCHING PRODUCTS */}
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-1.5 mb-3 font-mono">
              Matching Products ({matchingProducts.length})
            </div>

            <div className="space-y-3">
              {matchingProducts.length > 0 ? (
                matchingProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug || p.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group no-underline border border-transparent hover:border-gray-200"
                  >
                    <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden">
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
                      <h4 className="text-[13.5px] font-bold text-gray-900 group-hover:text-[#C5A059] transition-colors leading-snug line-clamp-1 font-pally">
                        {formatTitleCase(p.name)}
                      </h4>
                      <p className="text-[12px] font-extrabold text-gray-900 mt-0.5 font-pally">
                        ₹{p.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-black transition-colors shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-[13px] text-gray-400">
                  No matching products found for &quot;{query}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Search Trigger Action */}
        <button
          type="button"
          onClick={() => handleSearchSubmit(query)}
          className="w-full border-t border-gray-100 px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group cursor-pointer bg-white shrink-0"
        >
          <span className="text-[14px] font-bold text-gray-900 font-pally">
            View all results for &quot;{query || "products"}&quot;
          </span>
          <ArrowRight size={18} className="text-gray-700 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
