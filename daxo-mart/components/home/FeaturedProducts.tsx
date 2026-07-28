import Link from "next/link";
import PRODUCTS, { type Product } from "@/lib/products";

const P124 = PRODUCTS.filter((p) => p.category === "1:24");
const P118 = PRODUCTS.filter((p) => p.category === "1:18");
const PRC  = PRODUCTS.filter((p) => p.category === "RC");

const SWATCHES: Record<number, string[]> = {
  1: ["/images/car-suv.png", "/images/car-phantom.png", "/images/car-jeep.png"],
  2: ["/images/car-phantom.png", "/images/car-suv.png"],
  3: ["/images/car-jeep.png"],
  4: ["/images/car-vintage.png", "/images/car-suv.png"],
  5: ["/images/car-pickup.png", "/images/car-suv.png", "/images/car-phantom.png"],
  6: ["/images/car-suv.png", "/images/car-phantom.png"],
  7: ["/images/car-phantom.png", "/images/car-jeep.png"],
  8: ["/images/car-vintage.png", "/images/car-suv.png"],
  9: ["/images/rc-car.png", "/images/rc-car-white.png", "/images/rc-car-formula.png"],
  10: ["/images/rc-car-white.png", "/images/rc-car.png"],
  11: ["/images/rc-car.png", "/images/rc-car-formula.png"],
  12: ["/images/rc-car-formula.png", "/images/rc-car-white.png"],
};

/* ── Card ─────────────────────────────────────────────────────── */
function ProductCard({ p }: { p: Product }) {
  const swatches = SWATCHES[p.id] ?? [p.img];

  return (
    <Link
      href={`/products/${p.id}`}
      className="group flex flex-col no-underline shrink-0 w-[200px] sm:w-[230px] md:w-[265px] cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Image box */}
      <div className="relative bg-[#f4f4f4] rounded-lg overflow-hidden h-[160px] sm:h-[190px] md:h-[215px] flex items-center justify-center mb-3">
        <img
          src={p.img}
          alt={p.name}
          className="w-[85%] h-[85%] object-contain object-center block"
        />
        {/* Sale badge */}
        <span className="absolute bottom-2.5 left-2.5 bg-[#1a1714] text-white text-[10px] sm:text-[11px] font-bold tracking-wider px-2.5 sm:px-3 py-1 rounded font-pally">
          Sale
        </span>
      </div>

      {/* Name */}
      <h3 className="text-[12px] sm:text-[13px] font-bold text-[#1a1714] uppercase tracking-wide leading-snug line-clamp-2 mb-1.5 font-pally min-h-[36px]">
        {p.name}
      </h3>

      {/* Price */}
      <p className="text-[14px] sm:text-[15px] font-bold text-[#1a1714] mb-2 font-pally">
        Rs. {p.price.toLocaleString("en-IN")}.00
      </p>

      {/* Swatches */}
      <div className="flex gap-1.5">
        {swatches.map((src, i) => (
          <div
            key={i}
            className={`w-7 h-5 sm:w-9 sm:h-6 rounded overflow-hidden bg-gray-200 shrink-0 ${i === 0 ? "border-2 border-[#1a1714]" : "border border-gray-300"}`}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover block"
            />
          </div>
        ))}
      </div>
    </Link>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
function ProductSection({ title, subtitle, products }: {
  title: string; subtitle: string; products: Product[];
}) {
  const pages = Math.ceil(products.length / 5) || 1;
  return (
    <section className="bg-white py-10 sm:py-14 border-b border-[#e8e0d8]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-black text-[#1a1714] uppercase tracking-wide font-pally leading-tight">
            {title}
          </h2>
          <p className="text-[13px] sm:text-[14px] text-gray-400 font-pally mt-1">
            {subtitle}
          </p>
        </div>

        {/* Horizontal scroll with touch support and hidden scrollbars */}
        <div
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 scrollbar-hide touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="bg-none border-none text-[20px] text-gray-400 cursor-pointer px-2">‹</button>
          <span className="text-[12px] sm:text-[13px] text-gray-600 font-pally">1/{pages}</span>
          <button className="bg-none border-none text-[20px] text-gray-600 cursor-pointer px-2">›</button>
        </div>
      </div>
    </section>
  );
}

export default function FeaturedProducts() {
  return (
    <>
      <ProductSection title="1:24 Diecast" subtitle="Discover collection of 1:24 scale model cars" products={P124} />
      <ProductSection title="1:18 Diecast" subtitle="Discover collection of 1:18 scale model cars (1:18 > 1:24)" products={P118} />
      <ProductSection title="RC Toys" subtitle="Remote control cars for every age group" products={PRC} />
    </>
  );
}
