"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PRODUCTS, { type Product } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";

const WA_NUMBER = "919048571147";

/* ═══════════════════════════════════════════════════════════════════
   CHECKOUT MODAL FOR INSTANT "BUY NOW"
═══════════════════════════════════════════════════════════════════ */
export function BuyNowModal({
  product,
  quantity,
  isOpen,
  onClose,
}: {
  product: Product;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const total = product.price * quantity;

  const setField = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      e.phone = "Enter valid 10-digit mobile number";
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email.trim()))
      e.email = "Enter valid email address";
    if (!form.address.trim()) e.address = "Full address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode.trim()))
      e.pincode = "Enter valid 6-digit pincode";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    const orderNumber = `DXM-${Math.floor(100000 + Math.random() * 900000)}`;

    const waMessage = [
      `Hi DAXO-MART, I would like to place an order!`,
      ``,
      `📦 *Order:* ${orderNumber}`,
      `🛒 *Product:* ${product.shortName || product.name} (Qty: ${quantity})`,
      `💰 *Total Amount:* ₹${total.toLocaleString("en-IN")}`,
      `👤 *Name:* ${form.name.trim()}`,
      ``,
      `Please confirm my order. Thank you! 🙏`,
    ].join("\n");

    // 1. Instantly trigger WhatsApp window in user event context (prevents popup blocker)
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`, "_blank");

    // 2. Fire background async order save without blocking the user
    fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: form.email.trim() || undefined,
        full_address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        product_id: product.id.toString(),
        product_name: product.name,
        product_image: product.img,
        quantity: quantity,
        unit_price: product.price,
        subtotal: total,
      }),
    }).catch((err) => {
      console.error("Async order save error:", err);
    });

    // 3. Immediately close modal with zero delay
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark2 border border-border rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
              Quick Order via WhatsApp
            </span>
            <h3 className="text-[18px] font-bold text-cream font-pally">
              Complete Shipping Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-dark3 hover:bg-dark border border-border flex items-center justify-center text-muted hover:text-cream text-lg"
          >
            ✕
          </button>
        </div>

        {/* Product summary strip */}
        <div className="bg-dark border border-border rounded-xl p-3 mb-5 flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-lg p-1 shrink-0">
            <Image src={product.img} alt="" width={56} height={56} className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-cream truncate">{product.name}</p>
            <p className="text-[11px] text-muted">
              Qty: {quantity} × {product.priceStr}
            </p>
          </div>
          <span className="text-[15px] font-extrabold text-accent font-pally">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Form grid */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={`w-full bg-dark text-cream text-[13px] px-3.5 py-2.5 rounded-xl border outline-none font-pally ${errors.name ? "border-red-500" : "border-border focus:border-accent"
                }`}
            />
            {errors.name && <p className="text-red-400 text-[11px] mt-0.5">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="10-digit mobile"
                className={`w-full bg-dark text-cream text-[13px] px-3.5 py-2.5 rounded-xl border outline-none font-pally ${errors.phone ? "border-red-500" : "border-border focus:border-accent"
                  }`}
              />
              {errors.phone && <p className="text-red-400 text-[11px] mt-0.5">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full bg-dark text-cream text-[13px] px-3.5 py-2.5 rounded-xl border border-border focus:border-accent outline-none font-pally"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
              Full Address *
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="House/Flat No, Street"
              className={`w-full bg-dark text-cream text-[13px] px-3.5 py-2.5 rounded-xl border outline-none font-pally ${errors.address ? "border-red-500" : "border-border focus:border-accent"
                }`}
            />
            {errors.address && <p className="text-red-400 text-[11px] mt-0.5">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
                City *
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="City"
                className={`w-full bg-dark text-cream text-[13px] px-3 py-2.5 rounded-xl border outline-none font-pally ${errors.city ? "border-red-500" : "border-border focus:border-accent"
                  }`}
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
                State *
              </label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
                placeholder="State"
                className={`w-full bg-dark text-cream text-[13px] px-3 py-2.5 rounded-xl border outline-none font-pally ${errors.state ? "border-red-500" : "border-border focus:border-accent"
                  }`}
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
                Pincode *
              </label>
              <input
                type="tel"
                value={form.pincode}
                onChange={(e) => setField("pincode", e.target.value)}
                placeholder="6-digit"
                className={`w-full bg-dark text-cream text-[13px] px-3 py-2.5 rounded-xl border outline-none font-pally ${errors.pincode ? "border-red-500" : "border-border focus:border-accent"
                  }`}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-[#25D366] hover:bg-[#20c05c] active:scale-[0.98] text-white font-pally font-extrabold text-[15px] tracking-wide py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
          </svg>
          <span>Place Order via WhatsApp</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PRODUCT DETAIL CLIENT PAGE
═══════════════════════════════════════════════════════════════════ */
export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="bg-dark min-h-screen relative">
      {/* Toast alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green text-white font-pally font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <span>✓ Added to Cart!</span>
          <button
            onClick={() => router.push("/cart")}
            className="underline text-[12px] hover:text-dark uppercase font-extrabold ml-2"
          >
            View Cart →
          </button>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] mb-8 flex-wrap">
          <Link href="/" className="text-muted hover:text-accent transition-colors no-underline">Home</Link>
          <span className="text-dim">/</span>
          <Link href="/products" className="text-muted hover:text-accent transition-colors no-underline">Products</Link>
          <span className="text-dim">/</span>
          <span className="text-cream font-semibold">{product.shortName}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Left: Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden relative border border-gray-100 shadow-md"
              style={{ aspectRatio: "1" }}>
              {product.badge && (
                <span className={`absolute top-4 left-4 z-10 text-[10px] font-bold tracking-wider
                                 uppercase px-3 py-1 rounded-md shadow-sm
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
                className="w-full h-full object-contain p-8"
                priority
              />
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl bg-white border-2 shrink-0 overflow-hidden transition-all
                                ${activeImg === i ? "border-accent shadow-[0_0_12px_rgba(200,169,110,0.4)]" : "border-transparent"}`}
                  >
                    <Image src={img} alt="" width={64} height={64}
                      className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-accent mb-2">
                {product.category === "RC" ? "RC Toys" : product.category === "Frame" ? "3D Display Frame" : `${product.scale} Diecast Scale`}
              </p>

              <h1 className="font-pally font-bold text-[26px] sm:text-[34px] text-cream leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-[34px] font-bold text-cream">{product.priceStr}</span>
                <span className="text-[18px] text-dim line-through">{product.oldPriceStr}</span>
                <span className="bg-green/15 text-green border border-green/30 text-[12px] font-bold px-2.5 py-1 rounded-lg">
                  {discount}% OFF
                </span>
              </div>

              <div className="section-rule mb-4" />

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

              <p className="text-[14px] text-muted leading-relaxed mb-6">{product.description}</p>

              {/* Quantity Picker */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-muted mb-2">
                  Quantity
                </label>
                <div className="flex items-center bg-dark2 border border-border rounded-xl w-fit">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-cream hover:bg-dark3 transition-colors text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-cream text-[15px] font-bold font-pally">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-cream hover:bg-dark3 transition-colors text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ── ACTION BUTTONS: BUY NOW & ADD TO CART ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setShowBuyModal(true)}
                  className="w-full bg-[#25D366] hover:bg-[#20c05c] text-white font-pally font-extrabold text-[15px] tracking-wider py-4 rounded-2xl transition-all shadow-[0_4px_24px_rgba(37,211,102,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>Buy Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-accent hover:bg-accent-lt text-dark font-pally font-extrabold text-[15px] tracking-wider py-4 rounded-2xl transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 border-t border-border">
              {["🔒 100% Secure Order", "📦 Express Dispatch", "🚚 Pan-India Shipping"].map((b) => (
                <span key={b} className="text-[11px] text-dim font-semibold">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <h2 className="text-[20px] font-bold uppercase tracking-wider text-cream mb-2">
              You Might Also Like
            </h2>
            <div className="section-rule" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instant Checkout Modal */}
      <BuyNowModal
        product={product}
        quantity={qty}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </div>
  );
}
