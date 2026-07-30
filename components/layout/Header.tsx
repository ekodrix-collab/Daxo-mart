"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import SearchModal from "@/components/layout/SearchModal";

const NAV_ITEMS = [
  { title: "Home", path: "/" },
  { title: "1:32", path: "/products?category=1%3A32" },
  { title: "1:24", path: "/products?category=1%3A24" },
  { title: "1:18", path: "/products?category=1%3A18" },
  { title: "1:64", path: "/products?category=1%3A64" },
  { title: "RC Toys", path: "/products?category=RC+Toys" },
  { title: "3D Frames", path: "/products?category=3D+Frames" },
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
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState("");
  const { cartCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
    } else {
      router.push("/");
    }
  };

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled && !mobileOpen;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div
        className={`overflow-hidden h-8 flex items-center transition-colors duration-300 ${
          isTransparent ? "bg-black/40 backdrop-blur-md" : "bg-dark2"
        }`}
      >
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
      <header
        className={`relative transition-all duration-300 ${
          isTransparent
            ? "bg-transparent shadow-none "
            : "bg-[#0c0c0c] shadow-[0_2px_20px_rgba(0,0,0,0.45)]"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-[70px] gap-6">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="shrink-0 flex items-center cursor-pointer">
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
            {/* Desktop Search Input Trigger */}
            <div
              onClick={() => openSearchModal("")}
              className={`hidden lg:flex items-center gap-2.5 border rounded-md px-3.5 py-2 w-64 cursor-pointer transition-colors duration-200 ${
                isTransparent
                  ? "bg-black/40 border-white/20 hover:border-accent"
                  : "bg-dark3 border-border hover:border-accent"
              }`}
            >
              <Search size={14} className="text-dim shrink-0" />
              <span className="text-[13px] text-dim font-pally select-none">Search products…</span>
            </div>

            {/* Mobile Search Icon Button */}
            <button
              onClick={() => openSearchModal("")}
              className={`lg:hidden p-2 rounded-md transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isTransparent
                  ? "text-muted hover:text-cream hover:bg-black/50"
                  : "text-muted hover:text-cream hover:bg-dark3"
              }`}
              title="Search"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative p-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                isTransparent
                  ? "text-muted hover:text-cream hover:bg-black/50"
                  : "text-muted hover:text-cream hover:bg-dark3"
              }`}
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
              className={`md:hidden p-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                isTransparent
                  ? "text-muted hover:text-cream hover:bg-black/50"
                  : "text-muted hover:text-cream hover:bg-dark3"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0c0c0c] border-t border-border px-5 py-4 flex flex-col gap-4">
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