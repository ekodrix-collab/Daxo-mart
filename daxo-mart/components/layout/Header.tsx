"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { title: "Home",      path: "/" },
  { title: "1:32",      path: "/1-32" },
  { title: "1:24",      path: "/1-24" },
  { title: "1:18",      path: "/1-18" },
  { title: "RC Toys",   path: "/rc-toys" },
  { title: "3D Frames", path: "/frames" },
  { title: "Contact",   path: "/contact" },
];

/* Announcement Bar — Free Delivery Available */
const ANNOUNCE = [
  "⚡ Free Delivery Available On All Orders",
  "🚀 Pan-India Free Shipping Available",
  "✨ Free Delivery Available Across India",
  "⚡ Free Delivery Available On All Orders",
  "🚀 Pan-India Free Shipping Available",
  "✨ Free Delivery Available Across India",
  // duplicate set for seamless loop
  "⚡ Free Delivery Available On All Orders",
  "🚀 Pan-India Free Shipping Available",
  "✨ Free Delivery Available Across India",
  "⚡ Free Delivery Available On All Orders",
  "🚀 Pan-India Free Shipping Available",
  "✨ Free Delivery Available Across India",
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <div className="sticky top-0 z-50">

      {/* ── Single announcement marquee ── */}
      <div className="bg-dark2 border-b border-border overflow-hidden h-9 flex items-center">
        <div className="marquee-track gap-14 px-10">
          {ANNOUNCE.map((item, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold tracking-widest uppercase text-muted flex items-center gap-2 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="bg-dark2 border-b border-border shadow-[0_2px_20px_rgba(0,0,0,0.45)]">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-[66px] gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="font-pally font-bold text-[22px] tracking-[0.12em] uppercase text-cream no-underline shrink-0
                       hover:text-accent transition-colors duration-200"
          >
            DAXO<span className="text-accent">MART</span>
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
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2.5 bg-dark3 border border-border rounded-md
                            px-3.5 py-2 w-64 focus-within:border-accent transition-colors duration-200">
              <Search size={14} className="text-dim shrink-0" />
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] text-cream w-full
                           placeholder:text-dim font-pally"
              />
            </div>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 rounded-md text-muted hover:text-cream hover:bg-dark3
                         transition-all duration-200 flex items-center justify-center"
            >
              <User size={18} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-md text-muted hover:text-cream hover:bg-dark3
                         transition-all duration-200 flex items-center justify-center"
            >
              <ShoppingBag size={18} />
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
    </div>
  );
}