"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Zap,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { type Product, formatTitleCase } from "@/lib/products";
import { fetchProducts, fetchCategories } from "@/service/storeService";
import { CategoryItem } from "@/lib/categories";
import { BuyNowModal } from "@/app/products/[id]/ProductDetailClient";
import { useCart } from "@/components/cart/CartContext";
import ProductCard from "@/components/product/ProductCard";

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "ALL" },
  { label: "1:18", value: "1:18" },
  { label: "1:24", value: "1:24" },
  { label: "1:32", value: "1:32" },
  { label: "1:36", value: "1:36" },
  { label: "RC Toys", value: "RC Toys" },
  { label: "3D Frames", value: "3D Frames" },
];

const PRICE_PRESETS: { label: string; value: string; min: number; max: number }[] = [
  { label: "All Prices", value: "ALL", min: 0, max: Infinity },
  { label: "Under ₹1,000", value: "UNDER_1000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,500", value: "1000_2500", min: 1000, max: 2500 },
  { label: "₹2,500 - ₹5,000", value: "2500_5000", min: 2500, max: 5000 },
  { label: "Above ₹5,000", value: "ABOVE_5000", min: 5000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Biggest Discount", value: "discount" },
  { label: "Name: A to Z", value: "name-az" },
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [pricePreset, setPricePreset] = useState("ALL");
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("ALL");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category & search params from URL on initial load or URL change
  useEffect(() => {
    let urlCat: string | null = null;
    let urlSearch: string | null = null;

    if (typeof window !== "undefined") {
      const currentSearchParams = new URLSearchParams(window.location.search);
      urlCat = currentSearchParams.get("category");
      urlSearch = currentSearchParams.get("search") || currentSearchParams.get("q");
    } else {
      urlCat = searchParams.get("category");
      urlSearch = searchParams.get("search") || searchParams.get("q");
    }

    if (urlCat && urlCat.trim() !== "" && urlCat.trim() !== "ALL") {
      setCategoryFilter(urlCat.trim());
    } else {
      setCategoryFilter("ALL");
    }

    if (urlSearch && urlSearch.trim() !== "") {
      setSearchQuery(urlSearch.trim());
    } else {
      setSearchQuery("");
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchParams, pathname]);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).then(([prods, cats]) => {
      setProductsList(prods);
      setDbCategories(cats);
      setLoading(false);
    });
  }, []);

  const categoryOptions = useMemo(() => {
    const options = [{ label: "All Categories", value: "ALL" }];
    dbCategories.forEach((c) => {
      options.push({ label: c.name, value: c.filterValue || c.name });
    });
    return options;
  }, [dbCategories]);

  // Count active filter count for badge indicator
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== "ALL") count++;
    if (searchQuery.trim() !== "") count++;
    if (pricePreset !== "ALL") count++;
    if (customMin.trim() !== "" || customMax.trim() !== "") count++;
    if (badgeFilter !== "ALL") count++;
    if (inStockOnly) count++;
    return count;
  }, [categoryFilter, searchQuery, pricePreset, customMin, customMax, badgeFilter, inStockOnly]);

  const hasActiveFilters = activeFilterCount > 0 || sortBy !== "featured";

  // Clear all filters handler
  const handleClearAllFilters = () => {
    setCategoryFilter("ALL");
    setSearchQuery("");
    setPricePreset("ALL");
    setCustomMin("");
    setCustomMax("");
    setBadgeFilter("ALL");
    setInStockOnly(false);
    setSortBy("featured");
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/products");
    }
    router.replace("/products", { scroll: false });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectCategory = (catVal: string) => {
    setCategoryFilter(catVal);
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : searchParams.toString());
    if (catVal && catVal !== "ALL") {
      params.set("category", catVal);
    } else {
      params.delete("category");
    }
    const str = params.toString();
    const newPath = str ? `/products?${str}` : "/products";
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", newPath);
    }
    router.replace(newPath, { scroll: false });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // 1. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.scale.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (categoryFilter && categoryFilter !== "ALL") {
      result = result.filter((p) => {
        const cat = (p.category || "").toLowerCase().trim();
        const sc = (p.scale || "").toLowerCase().trim();
        const filt = categoryFilter.toLowerCase().trim();
        if (filt === "1:18" || filt === "1/18") {
          return cat.includes("1:18") || cat.includes("1/18") || sc.includes("1:18") || sc.includes("1/18");
        }
        if (filt === "1:24" || filt === "1/24") {
          return cat.includes("1:24") || cat.includes("1/24") || sc.includes("1:24") || sc.includes("1/24");
        }
        if (filt === "1:32" || filt === "1/32") {
          return cat.includes("1:32") || cat.includes("1/32") || sc.includes("1:32") || sc.includes("1/32");
        }
        if (filt === "1:36" || filt === "1/36") {
          return cat.includes("1:36") || cat.includes("1/36") || sc.includes("1:36") || sc.includes("1/36");
        }
        if (filt.includes("rc")) return cat.includes("rc") || sc.includes("rc");
        if (filt.includes("frame")) return cat.includes("frame") || sc.includes("frame");
        return cat.includes(filt) || filt.includes(cat);
      });
    }

    // 3. Price Preset Filter
    if (pricePreset !== "ALL") {
      const preset = PRICE_PRESETS.find((pr) => pr.value === pricePreset);
      if (preset) {
        result = result.filter((p) => p.price >= preset.min && p.price <= preset.max);
      }
    }

    // 4. Custom Price Range Filter
    if (customMin !== "") {
      const minVal = Number(customMin);
      if (!isNaN(minVal)) {
        result = result.filter((p) => p.price >= minVal);
      }
    }
    if (customMax !== "") {
      const maxVal = Number(customMax);
      if (!isNaN(maxVal)) {
        result = result.filter((p) => p.price <= maxVal);
      }
    }

    // 5. Badge Filter
    if (badgeFilter !== "ALL") {
      result = result.filter((p) => p.badge === badgeFilter);
    }

    // 6. Stock Filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // 7. Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount") {
      result.sort((a, b) => {
        const discA = a.oldPrice ? ((a.oldPrice - a.price) / a.oldPrice) * 100 : 0;
        const discB = b.oldPrice ? ((b.oldPrice - b.price) / b.oldPrice) * 100 : 0;
        return discB - discA;
      });
    } else if (sortBy === "name-az") {
      result.sort((a, b) => a.shortName.localeCompare(b.shortName));
    }

    return result;
  }, [
    productsList,
    categoryFilter,
    searchQuery,
    pricePreset,
    customMin,
    customMax,
    badgeFilter,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* TOP FILTER BAR CARD (Mobile Only - Matching reference image 1) */}
        <div className="md:hidden bg-white border border-gray-200/80 rounded-2xl p-3.5 sm:p-4 mb-6 shadow-sm flex items-center justify-between gap-4">
          <span className="text-xs sm:text-sm font-semibold text-gray-700 font-pally">
            Found <span className="font-extrabold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "product" : "products"}
          </span>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200/90 text-gray-800 text-xs font-extrabold font-pally px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <SlidersHorizontal size={14} className="text-gray-700" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse ml-0.5" />
            )}
          </button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs">
            <span className="text-gray-500 font-bold mr-1">Active Filters:</span>

            {categoryFilter !== "ALL" && (
              <span className="bg-[#0c0c0c] text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Category: {categoryFilter}
                <X
                  size={12}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => handleSelectCategory("ALL")}
                />
              </span>
            )}

            {searchQuery.trim() && (
              <span className="bg-[#0c0c0c] text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Search: "{searchQuery}"
                <X
                  size={12}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => {
                    setSearchQuery("");
                    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
                    params.delete("search");
                    params.delete("q");
                    const str = params.toString();
                    router.replace(str ? `/products?${str}` : "/products", { scroll: false });
                  }}
                />
              </span>
            )}

            {pricePreset !== "ALL" && (
              <span className="bg-[#0c0c0c] text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Price: {PRICE_PRESETS.find((p) => p.value === pricePreset)?.label}
                <X
                  size={12}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setPricePreset("ALL")}
                />
              </span>
            )}

            {(customMin || customMax) && (
              <span className="bg-[#0c0c0c] text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Range: ₹{customMin || 0} - ₹{customMax || "∞"}
                <X
                  size={12}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => {
                    setCustomMin("");
                    setCustomMax("");
                  }}
                />
              </span>
            )}

            {badgeFilter !== "ALL" && (
              <span className="bg-[#0c0c0c] text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Badge: {badgeFilter}
                <X
                  size={12}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setBadgeFilter("ALL")}
                />
              </span>
            )}

            {inStockOnly && (
              <span className="bg-[#0c0c0c] text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                In Stock Only
                <X
                  size={12}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setInStockOnly(false)}
                />
              </span>
            )}

            {sortBy !== "featured" && (
              <span className="bg-[#0c0c0c] text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Sort: {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                <X
                  size={12}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setSortBy("featured")}
                />
              </span>
            )}

            <button
              onClick={handleClearAllFilters}
              className="text-rose-600 hover:text-rose-700 underline font-bold ml-auto cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Content Layout (Sidebar + Main Grid) */}
        <div className="flex gap-8">
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden md:block w-64 shrink-0 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6 sticky top-[116px] shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2 font-pally">
                  <Filter size={16} className="text-gray-700" /> Filter Products
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAllFilters}
                    className="text-[11px] text-rose-500 hover:underline font-bold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 font-pally">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categoryOptions.map((cat) => {
                    const isSelected = categoryFilter === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => handleSelectCategory(cat.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0c0c0c] text-white font-bold shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Price Range Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 font-pally">
                  Price Range
                </h3>
                <div className="space-y-1">
                  {PRICE_PRESETS.map((preset) => {
                    const isSelected = pricePreset === preset.value;
                    return (
                      <button
                        key={preset.value}
                        onClick={() => {
                          setPricePreset(preset.value);
                          setCustomMin("");
                          setCustomMax("");
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gray-100 border border-gray-900 text-gray-900 font-bold"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <Check size={13} />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Min / Max Inputs */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1 font-medium">Min (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={customMin}
                      onChange={(e) => {
                        setCustomMin(e.target.value);
                        setPricePreset("ALL");
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1 font-medium">Max (₹)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={customMax}
                      onChange={(e) => {
                        setCustomMax(e.target.value);
                        setPricePreset("ALL");
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Product Badges */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 font-pally">
                  Special Badges
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {["ALL", "Sale", "New", "Hot"].map((badge) => {
                    const isSelected = badgeFilter === badge;
                    return (
                      <button
                        key={badge}
                        onClick={() => setBadgeFilter(badge)}
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0c0c0c] text-white"
                            : "bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200"
                        }`}
                      >
                        {badge === "ALL" ? "All Tags" : badge}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Availability */}
              <div className="border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-800 font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#0c0c0c] w-4 h-4 rounded cursor-pointer"
                  />
                  In-Stock Items Only
                </label>
              </div>

              {/* Reset Button at bottom of sidebar */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-extrabold uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={14} /> Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* MAIN PRODUCT GRID */}
          <main className="flex-1">
            {/* Header info bar */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-pally">
                Showing <span className="text-gray-900 font-black">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "Product" : "Products"}
              </span>

              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-gray-800 hover:underline font-bold cursor-pointer"
                >
                  Clear Filters & Show All ({productsList.length})
                </button>
              )}
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 border border-gray-200 rounded-xl aspect-[3/4] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* No products found state */
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center my-6 flex flex-col items-center justify-center gap-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Search size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-pally">No products found</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    We couldn't find any products matching your selected filter criteria. Try
                    clearing filters or searching another keyword.
                  </p>
                </div>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-2 bg-[#0c0c0c] hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer font-pally shadow-lg flex items-center gap-2"
                >
                  <RotateCcw size={15} /> Clear All Filters
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant="light" />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* BOTTOM SHEET FILTER MODAL (Mobile Only - Matching reference image 2) */}
      {mobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-backdrop-fade">
          {/* Backdrop click to dismiss */}
          <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />

          {/* Bottom Sheet Card */}
          <div className="w-full bg-white rounded-t-3xl border-t border-gray-200 max-h-[85vh] p-5 sm:p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-bottom-sheet relative">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3.5 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-gray-900" />
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-900 font-pally">
                    Filter Settings
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearAllFilters}
                      className="text-xs text-amber-600 hover:text-amber-700 font-bold cursor-pointer font-pally"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* 1. SEARCH INPUT */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 font-pally">
                  Search
                </h3>
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-gray-900 outline-none focus:border-black font-pally placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. CATEGORIES (Pills matching image 2 reference) */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 font-pally">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => {
                    const isSelected = categoryFilter === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => handleSelectCategory(cat.value)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold font-pally border transition-all cursor-pointer ${
                          isSelected
                            ? "border-amber-600 text-amber-700 bg-amber-50/50 font-bold shadow-xs"
                            : "border-gray-200 text-gray-700 bg-white hover:border-gray-300"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {cat.value !== "ALL" && <span className="text-gray-400 text-[10px]">›</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. PRICE RANGE */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 font-pally">
                  Price Range
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((preset) => {
                    const isSelected = pricePreset === preset.value;
                    return (
                      <button
                        key={preset.value}
                        onClick={() => {
                          setPricePreset(preset.value);
                          setCustomMin("");
                          setCustomMax("");
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-pally border transition-all cursor-pointer ${
                          isSelected
                            ? "border-amber-600 text-amber-700 bg-amber-50/50 font-bold shadow-xs"
                            : "border-gray-200 text-gray-700 bg-white hover:border-gray-300"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Min / Max Range Inputs */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1 font-medium font-pally">Min (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={customMin}
                      onChange={(e) => {
                        setCustomMin(e.target.value);
                        setPricePreset("ALL");
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-black font-pally"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1 font-medium font-pally">Max (₹)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={customMax}
                      onChange={(e) => {
                        setCustomMax(e.target.value);
                        setPricePreset("ALL");
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-black font-pally"
                    />
                  </div>
                </div>
              </div>

              {/* 4. SORT BY */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 font-pally">
                  Sort By
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-pally border transition-all cursor-pointer ${
                          isSelected
                            ? "border-amber-600 text-amber-700 bg-amber-50/50 font-bold shadow-xs"
                            : "border-gray-200 text-gray-700 bg-white hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. SPECIAL BADGES */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 font-pally">
                  Special Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["ALL", "Sale", "New", "Hot"].map((badge) => {
                    const isSelected = badgeFilter === badge;
                    return (
                      <button
                        key={badge}
                        onClick={() => setBadgeFilter(badge)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer border transition-all ${
                          isSelected
                            ? "border-black text-white bg-black font-bold shadow-xs"
                            : "border-gray-200 text-gray-700 bg-white hover:border-gray-300"
                        }`}
                      >
                        {badge === "ALL" ? "All Tags" : badge}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. AVAILABILITY */}
              <div className="border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-800 font-semibold p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-black w-4 h-4 rounded cursor-pointer"
                  />
                  <span>In-Stock Items Only</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions Sticky Container */}
            <div className="border-t border-gray-100 pt-4 mt-6 sticky bottom-0 bg-white z-10 pb-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#0c0c0c] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl cursor-pointer shadow-lg font-pally active:scale-[0.99] transition-all"
              >
                Apply Filters ({filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white min-h-screen p-10 text-gray-900 flex items-center justify-center font-pally">
          Loading store products...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
