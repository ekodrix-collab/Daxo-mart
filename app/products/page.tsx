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
import { type Product } from "@/lib/products";
import { fetchProducts, fetchCategories } from "@/service/storeService";
import { CategoryItem } from "@/lib/categories";
import { BuyNowModal } from "@/app/products/[id]/ProductDetailClient";
import { useCart } from "@/components/cart/CartContext";

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "ALL" },
  { label: "1:24 Diecast", value: "1:24" },
  { label: "1:18 Diecast", value: "1:18" },
  { label: "1:32 Diecast", value: "1:32" },
  { label: "RC Toys", value: "RC" },
  { label: "3D Car Frames", value: "Frame" },
];

const PRICE_PRESETS: { label: string; value: string; min: number; max: number }[] = [
  { label: "All Prices", value: "ALL", min: 0, max: Infinity },
  { label: "Under ₹1,000", value: "UNDER_1000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,500", value: "1000_2500", min: 1000, max: 2500 },
  { label: "₹2,500 - ₹5,000", value: "2500_5000", min: 2500, max: 5000 },
  { label: "Above ₹5,000", value: "ABOVE_5000", min: 5000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Featured & Popular", value: "featured" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Biggest Discount", value: "discount" },
  { label: "Name: A to Z", value: "name-az" },
];

function SingleProductCard({ p }: { p: Product }) {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBuyModal(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discountPercent =
    p.oldPrice && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : 0;

  return (
    <>
      <div className="group bg-dark2 border border-border/80 hover:border-accent/60 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1 relative">
        <Link href={`/products/${p.id}`} className="no-underline block flex-1">
          {/* Image Box */}
          <div className="bg-white overflow-hidden relative" style={{ aspectRatio: "4/3" }}>
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow">
                {discountPercent}% OFF
              </span>
            )}

            {/* Custom Tag / Badge */}
            {p.badge && (
              <span
                className={`absolute top-2.5 right-2.5 z-10 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${p.badge === "New"
                    ? "bg-emerald-600 text-white"
                    : p.badge === "Sale"
                      ? "bg-amber-500 text-black"
                      : "bg-accent text-dark"
                  }`}
              >
                {p.badge}
              </span>
            )}

            <Image
              src={p.img}
              alt={p.shortName}
              width={320}
              height={240}
              unoptimized
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Details */}
          <div className="p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80 bg-dark3 px-2 py-0.5 rounded">
                {p.category}
              </span>
              {p.inStock ? (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  In Stock
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-semibold">Out of Stock</span>
              )}
            </div>

            <h3 className="text-[14px] font-bold text-cream leading-tight line-clamp-2 mt-0.5 group-hover:text-accent transition-colors font-pally">
              {p.shortName}
            </h3>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 my-0.5">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <span className="text-[10px] text-muted font-medium">(4.9)</span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[17px] font-black text-cream font-pally">{p.priceStr}</span>
              {p.oldPriceStr && (
                <span className="text-[12px] text-muted line-through font-medium">
                  {p.oldPriceStr}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Buy Now Full Width CTA */}
        <div className="p-4 pt-0 mt-auto">
          {(!p.inStock || p.stock === 0) ? (
            <button
              disabled
              className="w-full bg-gray-800 text-gray-400 font-bold text-[12px] uppercase tracking-wider py-2.5 rounded-lg font-pally cursor-not-allowed border border-gray-700 opacity-75"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={handleBuy}
              className="w-full bg-accent hover:bg-accent/90 text-dark font-black text-[12px] uppercase tracking-wider py-2.5 rounded-lg transition-all font-pally shadow-md hover:shadow-accent/20 cursor-pointer block text-center"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>

      <BuyNowModal
        product={p}
        quantity={1}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </>
  );
}

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

  // Check if active filters are present
  const hasActiveFilters = useMemo(() => {
    return (
      categoryFilter !== "ALL" ||
      searchQuery.trim() !== "" ||
      pricePreset !== "ALL" ||
      customMin.trim() !== "" ||
      customMax.trim() !== "" ||
      badgeFilter !== "ALL" ||
      inStockOnly ||
      sortBy !== "featured"
    );
  }, [
    categoryFilter,
    searchQuery,
    pricePreset,
    customMin,
    customMax,
    badgeFilter,
    inStockOnly,
    sortBy,
  ]);

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
    router.push("/products", { scroll: false });
  };

  // Select Category handler
  const handleSelectCategory = (cat: string) => {
    setCategoryFilter(cat);
    if (cat === "ALL") {
      router.push("/products", { scroll: false });
    } else {
      router.push(`/products?category=${encodeURIComponent(cat)}`, { scroll: false });
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = productsList.filter((p) => p.isActive !== false);

    // 1. Category Filter
    if (categoryFilter !== "ALL") {
      const selectedCatObj = dbCategories.find(
        (c) => c.filterValue === categoryFilter || c.slug === categoryFilter || c.name === categoryFilter
      );
      result = result.filter((p) => {
        if (!p.category) return false;
        if (p.category === categoryFilter) return true;
        if (p.scale && p.scale === categoryFilter) return true;
        if (selectedCatObj) {
          if (p.category === selectedCatObj.name || p.category === selectedCatObj.filterValue) return true;
        }
        return false;
      });
    }

    // 2. Search Query Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.scale && p.scale.toLowerCase().includes(q))
      );
    }

    // 3. Price Preset Filter
    if (pricePreset !== "ALL") {
      const foundPreset = PRICE_PRESETS.find((p) => p.value === pricePreset);
      if (foundPreset) {
        result = result.filter(
          (p) => p.price >= foundPreset.min && p.price <= foundPreset.max
        );
      }
    }

    // 4. Custom Min/Max Price Filter
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
    <div className="bg-dark min-h-screen pb-20">
      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6">
        {/* Top Control Bar (Search, Mobile Filter Toggle, Sort, Clear Filters) */}
        <div className="bg-dark2 border border-border rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Search by model, scale, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark3 border border-border/80 focus:border-accent rounded-lg pl-9 pr-8 py-2 text-xs text-cream outline-none font-pally transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-cream cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 bg-dark3 hover:bg-dark border border-border text-cream text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <Filter size={15} className="text-accent" /> Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              )}
            </button>

            {/* Clear Filters Button (Always highlighted when active) */}
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
              >
                <RotateCcw size={13} /> Clear Filters
              </button>
            )}

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs text-muted">
              <ArrowUpDown size={14} className="hidden sm:inline text-accent" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark3 border border-border/80 text-cream text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-accent cursor-pointer font-pally"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-dark3/50 border border-border/60 p-3 rounded-lg text-xs">
            <span className="text-muted font-bold mr-1">Active Filters:</span>

            {categoryFilter !== "ALL" && (
              <span className="bg-accent/10 border border-accent/30 text-accent px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Category: {categoryFilter}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleSelectCategory("ALL")}
                />
              </span>
            )}

            {pricePreset !== "ALL" && (
              <span className="bg-accent/10 border border-accent/30 text-accent px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Price: {PRICE_PRESETS.find((p) => p.value === pricePreset)?.label}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setPricePreset("ALL")}
                />
              </span>
            )}

            {(customMin || customMax) && (
              <span className="bg-accent/10 border border-accent/30 text-accent px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Range: ₹{customMin || "0"} - ₹{customMax || "∞"}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => {
                    setCustomMin("");
                    setCustomMax("");
                  }}
                />
              </span>
            )}

            {searchQuery && (
              <span className="bg-accent/10 border border-accent/30 text-accent px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Search: "{searchQuery}"
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setSearchQuery("")}
                />
              </span>
            )}

            {badgeFilter !== "ALL" && (
              <span className="bg-accent/10 border border-accent/30 text-accent px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                Tag: {badgeFilter}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setBadgeFilter("ALL")}
                />
              </span>
            )}

            {inStockOnly && (
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                In Stock Only
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setInStockOnly(false)}
                />
              </span>
            )}

            <button
              onClick={handleClearAllFilters}
              className="text-rose-400 hover:underline font-bold ml-auto text-[11px] cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Content Layout: Sidebar + Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden md:block w-64 lg:w-72 shrink-0 space-y-6">
            <div className="bg-dark2 border border-border rounded-xl p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-cream flex items-center gap-2 font-pally">
                  <SlidersHorizontal size={16} className="text-accent" /> Filter Products
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAllFilters}
                    className="text-[11px] text-rose-400 hover:underline font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div>
                <h3 className="text-xs font-bold text-cream uppercase tracking-wider mb-3">
                  Category
                </h3>
                <div className="space-y-1">
                  {categoryOptions.map((cat) => {
                    const isSelected = categoryFilter === cat.value;
                    const count =
                      cat.value === "ALL"
                        ? productsList.length
                        : productsList.filter((p) => p.category === cat.value).length;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => handleSelectCategory(cat.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${isSelected
                            ? "bg-accent text-dark font-extrabold"
                            : "text-muted hover:text-cream hover:bg-dark3"
                          }`}
                      >
                        <span>{cat.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? "bg-dark/20 text-dark" : "bg-dark3 text-dim"
                            }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Price Presets */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-bold text-cream uppercase tracking-wider mb-3">
                  Price Range
                </h3>
                <div className="space-y-1">
                  {PRICE_PRESETS.map((preset) => {
                    const isSelected = pricePreset === preset.value;
                    return (
                      <button
                        key={preset.value}
                        onClick={() => setPricePreset(preset.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${isSelected
                            ? "bg-accent/20 border border-accent/50 text-accent font-bold"
                            : "text-muted hover:text-cream hover:bg-dark3"
                          }`}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <Check size={14} className="text-accent" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Min / Max inputs */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted block mb-1 font-medium">Min (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={customMin}
                      onChange={(e) => {
                        setCustomMin(e.target.value);
                        setPricePreset("ALL");
                      }}
                      className="w-full bg-dark3 border border-border rounded px-2.5 py-1.5 text-xs text-cream outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted block mb-1 font-medium">Max (₹)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={customMax}
                      onChange={(e) => {
                        setCustomMax(e.target.value);
                        setPricePreset("ALL");
                      }}
                      className="w-full bg-dark3 border border-border rounded px-2.5 py-1.5 text-xs text-cream outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Product Badges */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-bold text-cream uppercase tracking-wider mb-3">
                  Special Badges
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {["ALL", "Sale", "New", "Hot"].map((badge) => {
                    const isSelected = badgeFilter === badge;
                    return (
                      <button
                        key={badge}
                        onClick={() => setBadgeFilter(badge)}
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all cursor-pointer ${isSelected
                            ? "bg-accent text-dark"
                            : "bg-dark3 text-muted hover:text-cream border border-border"
                          }`}
                      >
                        {badge === "ALL" ? "All Tags" : badge}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Availability */}
              <div className="border-t border-border pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-cream font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-accent w-4 h-4 rounded cursor-pointer"
                  />
                  In-Stock Items Only
                </label>
              </div>

              {/* Reset Button at bottom of sidebar */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="w-full bg-dark3 hover:bg-rose-500/20 text-rose-400 border border-border hover:border-rose-500/40 text-xs font-extrabold uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
              <span className="text-xs font-bold uppercase tracking-wider text-muted font-pally">
                Showing <span className="text-cream font-black">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "Product" : "Products"}
              </span>

              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-accent hover:underline font-bold cursor-pointer"
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
                    className="bg-dark2 border border-border rounded-xl aspect-[3/4] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* No products found state */
              <div className="bg-dark2 border border-border rounded-2xl p-12 text-center my-6 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-dark3 flex items-center justify-center text-muted">
                  <Search size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-cream font-pally">No products found</h3>
                  <p className="text-xs text-muted mt-1 max-w-sm">
                    We couldn't find any products matching your selected filter criteria. Try
                    clearing filters or searching another keyword.
                  </p>
                </div>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-2 bg-accent hover:bg-accent/90 text-dark font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer font-pally shadow-lg flex items-center gap-2"
                >
                  <RotateCcw size={15} /> Clear All Filters
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <SingleProductCard key={product.id} p={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL / DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm md:hidden">
          <div className="w-[85%] max-w-sm bg-dark2 border-r border-border h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-cream flex items-center gap-2 font-pally">
                  <SlidersHorizontal size={18} className="text-accent" /> Filter Products
                </h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded bg-dark3 text-muted hover:text-cream cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <h3 className="text-xs font-bold text-cream uppercase tracking-wider mb-3">
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
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${isSelected
                            ? "bg-accent text-dark font-bold"
                            : "text-muted bg-dark3"
                          }`}
                      >
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Price Presets */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-bold text-cream uppercase tracking-wider mb-3">
                  Price Range
                </h3>
                <div className="space-y-1.5">
                  {PRICE_PRESETS.map((preset) => {
                    const isSelected = pricePreset === preset.value;
                    return (
                      <button
                        key={preset.value}
                        onClick={() => setPricePreset(preset.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${isSelected
                            ? "bg-accent/20 border border-accent text-accent font-bold"
                            : "text-muted bg-dark3"
                          }`}
                      >
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Badges */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-bold text-cream uppercase tracking-wider mb-3">
                  Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["ALL", "Sale", "New", "Hot"].map((badge) => {
                    const isSelected = badgeFilter === badge;
                    return (
                      <button
                        key={badge}
                        onClick={() => setBadgeFilter(badge)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase cursor-pointer ${isSelected ? "bg-accent text-dark" : "bg-dark3 text-muted"
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
            <div className="border-t border-border pt-4 mt-6 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-accent text-dark font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    handleClearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-dark3 text-rose-400 text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
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
        <div className="bg-dark min-h-screen p-10 text-white flex items-center justify-center">
          Loading store products...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
