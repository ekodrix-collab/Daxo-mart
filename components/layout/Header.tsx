"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import SearchModal from "@/components/layout/SearchModal";

const NAV_ITEMS = [
  { title: "Home", path: "/" },
  { title: "1:32 Diecast", path: "/products?category=1%3A32" },
  { title: "1:24 Diecast", path: "/products?category=1%3A24" },
  { title: "1:18 Diecast", path: "/products?category=1%3A18" },
  { title: "RC Toys", path: "/products?category=RC" },
  { title: "3D Frames", path: "/products?category=Frame" },
];

/* Announcement Bar — Free Delivery Available */
const ANNOUNCE = [
  " Free Delivery Available On All Orders",
  " Pan-India Free Shipping Available",
  " Free Delivery Available Across India",
  " Free Delivery Available On All Orders",
  " Pan-India Free Shipping Available",
  " Free Delivery Available Across India",
  " Free Delivery Available On All Orders",
  " Pan-India Free Shipping Available",
  " Free Delivery Available Across India",
  " Free Delivery Available On All Orders",
  " Pan-India Free Shipping Available",
  " Free Delivery Available Across India",
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState("");
  const { cartCount } = useCart();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openSearchModal = (query = "") => {
    setInitialSearchQuery(query);
    setIsSearchModalOpen(true);
    setMobileOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      {/* ── Single announcement marquee ── */}
      <div className="bg-dark2 overflow-hidden h-8 flex items-center">
        <div className="marquee-track gap-15 px-10">
          {ANNOUNCE.map((item, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold tracking-widest uppercase text-muted flex items-center gap-3 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="bg-[#0c0c0c] shadow-[0_2px_20px_rgba(0,0,0,0.45)] relative">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-[70px] gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/images/daxo-mart-new-logo.png"
              alt="DAXOMART"
              width={340}
              height={100}
              className="h-13 w-auto object-contain scale-110 origin-left mix-blend-screen"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="nav-link relative text-[11.5px] font-semibold tracking-[0.1em] uppercase text-muted
                           hover:text-cream transition-colors duration-200 no-underline"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Search + Icons */}
          <div className="flex items-center gap-2">
            {/* Desktop Live Search */}
            <div ref={searchRef} className="relative hidden lg:block">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2.5 bg-dark3 border border-border rounded-md
                           px-3.5 py-2 w-64 focus-within:border-accent transition-colors duration-200"
              >
                <Search size={14} className="text-dim shrink-0" />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="bg-transparent border-none outline-none text-[13px] text-cream w-full
                             placeholder:text-dim font-pally"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted hover:text-cream p-0.5"
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {/* Live Search Dropdown */}
              {showDropdown && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-dark2 border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Matching Products ({searchResults.length})
                      </div>
                      {searchResults.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/products/${prod.slug || prod.id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark3 transition-colors group no-underline"
                        >
                          <div className="w-10 h-10 bg-white rounded-md p-1 shrink-0 flex items-center justify-center overflow-hidden">
                            <Image
                              src={prod.img}
                              alt={prod.shortName}
                              width={40}
                              height={40}
                              unoptimized
                              className="object-contain max-h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12.5px] font-bold text-cream group-hover:text-accent truncate font-pally">
                              {prod.shortName || prod.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                                {prod.category}
                              </span>
                              <span className="text-[11.5px] font-extrabold text-accent">
                                {prod.priceStr}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={(e) => handleSearchSubmit(e)}
                        className="w-full mt-1 bg-dark3 hover:bg-accent/20 text-accent font-bold text-[11px] uppercase tracking-wider py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-pally"
                      >
                        View all results for &quot;{searchQuery}&quot; <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-[12px] text-muted">
                      No products found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Icon Button */}
            <button
              onClick={() => openSearchModal("")}
              className="lg:hidden p-2 rounded-md text-muted hover:text-cream hover:bg-dark3 transition-all duration-200 flex items-center justify-center cursor-pointer"
              title="Search"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-md text-muted hover:text-cream hover:bg-dark3
                         transition-all duration-200 flex items-center justify-center"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-dark font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-pally shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-muted hover:text-cream hover:bg-dark3
                         transition-all duration-200 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-dark3 border-t border-border px-5 py-4 flex flex-col gap-4">
            {/* Mobile Search Input Trigger */}
            <div
              onClick={() => openSearchModal("")}
              className="flex items-center gap-2 bg-dark2 border border-border rounded-lg px-3.5 py-2 cursor-pointer"
            >
              <Search size={14} className="text-muted" />
              <span className="text-xs text-muted font-pally">Search products...</span>
            </div>

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-[12px] font-semibold tracking-[0.1em] uppercase text-muted
                           hover:text-accent transition-colors duration-200 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Split-Layout Search Modal Popover */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        initialQuery={initialSearchQuery}
      />
    </div>
  );
}