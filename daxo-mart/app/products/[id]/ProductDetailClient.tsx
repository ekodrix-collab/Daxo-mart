"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PRODUCTS, { type Product } from "@/lib/products";

const WA = "919048571147";

/* ═══════════════════════════════════════════════════════════════════
   ORDER FORM
═══════════════════════════════════════════════════════════════════ */
function OrderForm({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState<"form" | "review">("form");
  const [form, setForm] = useState({
    name: "", phone: "", address: "", landmark: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const total = product.price * qty;

  /* validate */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                     e.name    = "Required";
    if (!/^[6-9]\d{9}$/.test(form.phone))     e.phone   = "Enter valid 10-digit mobile";
    if (!form.address.trim())                  e.address = "Required";
    if (!form.city.trim())                     e.city    = "Required";
    if (!form.state.trim())                    e.state   = "Required";
    if (!/^\d{6}$/.test(form.pincode))        e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* send to WhatsApp */
  const placeOrder = () => {
    const msg = [
      `🛒 *NEW ORDER – DAXOMART*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 *Product:* ${product.name}`,
      `🔖 *SKU:* ${product.sku}`,
      `💰 *Price:* ${product.priceStr} × ${qty} = ₹${total.toLocaleString("en-IN")}`,
      ``,
      `👤 *Customer*`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      ``,
      `📍 *Delivery Address*`,
      form.address,
      form.landmark ? `Landmark: ${form.landmark}` : null,
      `${form.city}, ${form.state} – ${form.pincode}`,
      ``,
      `Please confirm this order. Thank you! 🙏`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  /* ── Input helper ── */
  const Input = ({
    label, field, type = "text", placeholder, half = false,
  }: {
    label: string; field: keyof typeof form; type?: string;
    placeholder?: string; half?: boolean;
  }) => (
    <div className={half ? "col-span-1" : "col-span-2 sm:col-span-2"}>
      <label className="block text-[10.5px] font-bold tracking-[0.1em] uppercase text-muted mb-1.5">
        {label}
        {["name","phone","address","city","state","pincode"].includes(field) &&
          <span className="text-promo ml-0.5">*</span>
        }
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-dark text-cream text-[14px] font-pally px-4 py-2.5 rounded-lg
                    border outline-none transition-all duration-150 placeholder:text-dim
                    ${errors[field]
                      ? "border-red-500 focus:border-red-400"
                      : "border-border focus:border-accent"}`}
      />
      {errors[field] && (
        <p className="text-red-400 text-[11px] mt-1 font-semibold">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div id="order-section" className="bg-dark2 border border-border rounded-2xl p-6 mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center
                        text-dark text-[13px] font-bold shrink-0">1</div>
        <div>
          <h3 className="text-[16px] font-bold text-cream">Place Your Order</h3>
          <p className="text-[12px] text-muted">
            Fill in your address — we'll confirm your order on WhatsApp within minutes.
          </p>
        </div>
      </div>

      {step === "form" && (
        <>
          {/* Quantity picker */}
          <div className="mb-5">
            <label className="block text-[10.5px] font-bold tracking-[0.1em] uppercase text-muted mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-0 w-fit">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 bg-dark border border-border rounded-l-lg text-cream text-xl
                           flex items-center justify-center hover:bg-dark3 hover:border-accent
                           transition-all duration-150"
              >
                −
              </button>
              <span className="w-14 h-10 bg-dark border-y border-border text-cream font-bold
                               text-[16px] flex items-center justify-center">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="w-10 h-10 bg-dark border border-border rounded-r-lg text-cream text-xl
                           flex items-center justify-center hover:bg-dark3 hover:border-accent
                           transition-all duration-150"
              >
                +
              </button>
              <span className="ml-4 text-[13px] text-muted">
                × {product.priceStr} = <span className="text-cream font-bold">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </span>
            </div>
          </div>

          {/* Address grid */}
          <div className="grid grid-cols-2 gap-3.5 mb-5">
            <div className="col-span-2 sm:col-span-1">
              <Input label="Full Name" field="name" placeholder="e.g. Ravi Kumar" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Input label="Mobile Number" field="phone" type="tel" placeholder="10-digit number" />
            </div>
            <Input label="House / Flat / Building, Street" field="address"
              placeholder="e.g. 12A, Green Valley Road" />
            <Input label="Landmark (Optional)" field="landmark" placeholder="e.g. Near Big Bazaar" />
            <div className="col-span-2 sm:col-span-1">
              <Input label="City" field="city" placeholder="e.g. Kochi" half />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Input label="State" field="state" placeholder="e.g. Kerala" half />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Input label="Pincode" field="pincode" type="tel" placeholder="6-digit pincode" half />
            </div>
          </div>

          {/* Review button */}
          <button
            onClick={() => { if (validate()) setStep("review"); }}
            className="w-full bg-accent hover:bg-accent-lt text-dark font-bold text-[13px]
                       tracking-wider uppercase py-3.5 rounded-xl transition-all duration-200
                       hover:-translate-y-0.5 font-pally"
          >
            Review Order →
          </button>
        </>
      )}

      {step === "review" && (
        <>
          {/* Review card */}
          <div className="bg-dark rounded-xl border border-border p-4 mb-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">Product</p>
                <p className="text-[14px] font-bold text-cream mt-0.5">{product.shortName}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">Total</p>
                <p className="text-[22px] font-bold text-accent">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Name</p>
                <p className="text-cream font-semibold">{form.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Phone</p>
                <p className="text-cream font-semibold">{form.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Delivery Address</p>
                <p className="text-cream font-semibold leading-snug">
                  {form.address}{form.landmark ? `, ${form.landmark}` : ""}
                  <br />{form.city}, {form.state} – {form.pincode}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Quantity</p>
                <p className="text-cream font-semibold">{qty} unit{qty > 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Delivery</p>
                <p className="text-green font-semibold">
                  {total >= 999 ? "FREE" : "₹60"}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <button
            onClick={placeOrder}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20c05c]
                       text-white font-bold text-[15px] tracking-wider py-4 rounded-xl
                       transition-all duration-200 hover:-translate-y-0.5 font-pally
                       shadow-[0_4px_24px_rgba(37,211,102,0.3)]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556
                       5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245
                       2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893
                       11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807
                       c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885
                       .002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889
                       9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387
                       -5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031
                       -.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941
                       1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39
                       -1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13
                       -.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099
                       -.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242
                       -.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198
                       0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462
                       1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306
                       1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085
                       1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Confirm Order on WhatsApp
          </button>

          <button
            onClick={() => setStep("form")}
            className="w-full mt-3 text-[12px] font-semibold text-muted hover:text-cream
                       transition-colors text-center py-2"
          >
            ← Edit Details
          </button>

          <p className="text-center text-[11px] text-dim mt-2">
            Tapping above opens WhatsApp with your order details pre-filled.
            Our team will confirm within minutes.
          </p>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE CLIENT COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-[1280px] mx-auto px-5 py-10">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-[12px] mb-8 flex-wrap">
          <Link href="/" className="text-muted hover:text-accent transition-colors no-underline">Home</Link>
          <span className="text-dim">/</span>
          <Link href="/products" className="text-muted hover:text-accent transition-colors no-underline">Products</Link>
          <span className="text-dim">/</span>
          <span className="text-cream font-semibold">{product.shortName}</span>
        </nav>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Left: Images ── */}
          <div>
            {/* Main image */}
            <div className="bg-white rounded-2xl overflow-hidden relative border border-gray-100"
              style={{ aspectRatio: "1" }}>
              {product.badge && (
                <span className={`absolute top-4 left-4 z-10 text-[10px] font-bold tracking-wider
                                 uppercase px-3 py-1 rounded-md
                                 ${product.badge === "New" ? "bg-green text-white" :
                                   product.badge === "Sale" ? "bg-promo text-white" :
                                   "bg-accent text-dark"}`}>
                  {product.badge}
                </span>
              )}
              <Image
                src={product.images[activeImg] ?? product.img}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-contain p-10"
                priority
              />
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl bg-white border-2 overflow-hidden transition-all
                                ${activeImg === i ? "border-accent shadow-[0_0_12px_rgba(200,169,110,0.4)]" : "border-transparent"}`}
                  >
                    <Image src={img} alt="" width={64} height={64}
                      className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info + Order ── */}
          <div>
            {/* Category + scale */}
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-accent mb-2">
              {product.category === "RC" ? "RC Toys" : product.category === "Frame" ? "3D Display Frame" : `${product.scale} Diecast Scale`}
            </p>

            {/* Title */}
            <h1 className="font-pally font-bold text-[26px] sm:text-[30px] text-cream
                           leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-[34px] font-bold text-cream">{product.priceStr}</span>
              <span className="text-[18px] text-dim line-through">{product.oldPriceStr}</span>
              <span className="bg-green/15 text-green border border-green/30 text-[12px]
                               font-bold px-2.5 py-1 rounded-lg">
                {discount}% OFF
              </span>
            </div>

            {/* Divider */}
            <div className="section-rule mb-4" />

            {/* Meta row */}
            <div className="flex items-center gap-5 mb-5 text-[12px] flex-wrap">
              <span className="text-muted">
                SKU: <span className="text-cream font-semibold">{product.sku}</span>
              </span>
              <span className={`font-bold ${product.inStock ? "text-green" : "text-red-400"}`}>
                {product.inStock ? "● In Stock" : "● Out of Stock"}
              </span>
              <span className="text-muted">
                Scale: <span className="text-cream font-semibold">{product.scale}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-[14px] text-muted leading-relaxed mb-5">{product.description}</p>

            {/* Features */}
            <div className="bg-dark2 border border-border rounded-xl p-4 mb-2">
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted mb-3">
                What's included / Features
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-muted">
                    <span className="text-accent shrink-0 mt-0.5 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* ORDER FORM */}
            <OrderForm product={product} />

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5">
              {["🔒 Secure", "📦 Packed with care", "🚚 Pan-India delivery", "↩️ 7-day returns"].map((b) => (
                <span key={b} className="text-[11px] text-dim font-semibold">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-[20px] font-bold uppercase tracking-wider text-cream mb-2">
              You Might Also Like
            </h2>
            <div className="section-rule" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}
                  className="group bg-dark2 border border-border rounded-xl overflow-hidden
                             hover:border-accent hover:-translate-y-1 transition-all duration-200
                             no-underline flex flex-col">
                  <div className="bg-white overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <Image src={p.img} alt={p.shortName} width={280} height={210}
                      className="w-full h-full object-contain p-3
                                 group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <p className="text-[12px] font-semibold text-cream leading-snug">{p.shortName}</p>
                    <div className="flex items-center gap-2 mt-auto pt-1">
                      <span className="text-[14px] font-bold text-accent">{p.priceStr}</span>
                      <span className="text-[11px] text-dim line-through">{p.oldPriceStr}</span>
                    </div>
                    <span className="mt-2 text-center bg-accent group-hover:bg-accent-lt text-dark
                                     text-[10px] font-bold tracking-wider uppercase py-2 rounded-lg
                                     transition-colors">
                      Buy Now
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
