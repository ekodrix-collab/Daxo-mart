"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  { label: "1:64", value: "1:64" },
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
    const urlCat = searchParams.get("category");
    const urlSearch = searchParams.get("search") || searchParams.get("q");
    if (urlCat) {
      setCategoryFilter(urlCat);
    } else {
      setCategoryFilter("ALL");
    }
    if (urlSearch) {
      setSearchQuery(urlSearch);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

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
    router.replace("/products", { scroll: false });
  };

  const handleSelectCategory = (catVal: string) => {
    setCategoryFilter(catVal);
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    if (catVal && catVal !== "ALL") {
      params.set("category", catVal);
    } else {
      params.delete("category");
    }
    const str = params.toString();
    router.replace(str ? `/products?${str}` : "/products", { scroll: false });
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
    if (categoryFilter !== "ALL") {
      result = result.filter((p) => {
        const cat = p.category.toLowerCase();
        const filt = categoryFilter.toLowerCase();
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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6">
        


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
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6 sticky top-24 shadow-sm">
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

      {/* MOBILE FILTER MODAL / DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm md:hidden">
          <div className="w-[88%] max-w-sm bg-white border-r border-gray-200 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2 font-pally">
                  <SlidersHorizontal size={18} className="text-gray-700" /> Filter Products
                </h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 font-pally">
                  Category
                </h3>
                <div className="space-y-1.5">
                  {categoryOptions.map((cat) => {
                    const isSelected = categoryFilter === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => {
                          handleSelectCategory(cat.value);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#0c0c0c] text-white font-bold shadow-md"
                            : "text-gray-600 bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Price Presets */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 font-pally">
                  Price Range
                </h3>
                <div className="space-y-1.5">
                  {PRICE_PRESETS.map((preset) => {
                    const isSelected = pricePreset === preset.value;
                    return (
                      <button
                        key={preset.value}
                        onClick={() => setPricePreset(preset.value)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? "bg-gray-100 border border-gray-900 text-gray-900 font-bold"
                            : "text-gray-600 bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <Check size={13} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Badges */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 font-pally">
                  Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["ALL", "Sale", "New", "Hot"].map((badge) => {
                    const isSelected = badgeFilter === badge;
                    return (
                      <button
                        key={badge}
                        onClick={() => setBadgeFilter(badge)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase cursor-pointer transition-all ${
                          isSelected ? "bg-[#0c0c0c] text-white font-bold" : "bg-gray-100 text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {badge}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Bottom Actions */}
            <div className="border-t border-gray-100 pt-4 mt-6 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#0c0c0c] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl cursor-pointer shadow-lg font-pally"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    handleClearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-gray-100 text-rose-600 text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
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
