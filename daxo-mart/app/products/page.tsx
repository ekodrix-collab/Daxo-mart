import Image from "next/image";
import Link from "next/link";
import PRODUCTS from "@/lib/products";

export const metadata = {
  title: "All Products – DAXOMART",
  description: "Browse all diecast scale models, RC toys and 3D display frames at DAXOMART.",
};

export default function ProductsPage() {
  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-[1280px] mx-auto px-5 py-12">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold uppercase tracking-wider text-cream">All Products</h1>
          <p className="text-[14px] text-muted mt-1">{PRODUCTS.length} products across 4 categories</p>
        </div>

        {/* Category sections */}
        {(["1:24", "1:18", "RC", "Frame"] as const).map((cat) => {
          const items = PRODUCTS.filter((p) => p.category === cat);
          const label = cat === "Frame" ? "3D Car Frames" : cat === "RC" ? "RC Toys" : `${cat} Diecast`;
          return (
            <div key={cat} className="mb-12">
              <div className="flex items-center gap-4 mb-5">
                <h2 className="text-[18px] font-bold uppercase tracking-wider text-cream">{label}</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[12px] text-muted">{items.length} items</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`}
                    className="group bg-dark2 border border-border rounded-lg overflow-hidden
                               hover:border-accent hover:-translate-y-1 transition-all duration-200
                               no-underline flex flex-col">
                    <div className="bg-white overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      <Image src={p.img} alt={p.shortName} width={300} height={225}
                        className="w-full h-full object-contain p-3 group-hover:scale-105
                                   transition-transform duration-300" />
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      {p.badge && (
                        <span className={`self-start text-[9px] font-bold tracking-wider uppercase
                                         px-2 py-0.5 rounded-sm
                                         ${p.badge === "New" ? "bg-green text-white" :
                                           p.badge === "Sale" ? "bg-promo text-white" :
                                           "bg-accent text-dark"}`}>
                          {p.badge}
                        </span>
                      )}
                      <p className="text-[13px] font-semibold text-cream leading-snug flex-1">{p.shortName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-cream">{p.priceStr}</span>
                        <span className="text-[11px] text-dim line-through">{p.oldPriceStr}</span>
                      </div>
                      <span className="mt-1 text-center text-[11px] font-bold tracking-wider uppercase
                                       bg-accent text-dark py-2 rounded transition-colors
                                       group-hover:bg-accent-lt">
                        Buy Now
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
