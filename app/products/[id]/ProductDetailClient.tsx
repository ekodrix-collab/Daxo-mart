"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PRODUCTS, { type Product, formatTitleCase } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import ProductVideoFloating from "@/components/product/ProductVideoFloating";

const WA_NUMBER = "919048571147";

const INDIAN_STATES = [
  "Kerala",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi (NCT)",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

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
    state: "Kerala",
    landmark: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
    if (!form.landmark.trim()) e.landmark = "Landmark is required";
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
      `Name: ${form.name.trim()}`,
      `Full Address: ${form.address.trim()}`,
      `City: ${form.city.trim()}`,
      `State: ${form.state.trim()}`,
      `Landmark: ${form.landmark.trim()}`,
      `Pincode: ${form.pincode.trim()}`,
      `Mobile Number: ${form.phone.trim()}`,
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
        full_address: [form.address.trim(), form.landmark.trim() ? `Landmark: ${form.landmark.trim()}` : ""].filter(Boolean).join(", "),
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
            <p className="text-[13px] font-bold text-cream truncate">{formatTitleCase(product.name)}</p>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
                Landmark
              </label>
              <input
                type="text"
                value={form.landmark}
                onChange={(e) => setField("landmark", e.target.value)}
                placeholder="e.g. Near Bus Stand"
                className={`w-full bg-dark text-cream text-[13px] px-3.5 py-2.5 rounded-xl border outline-none font-pally ${errors.landmark ? "border-red-500" : "border-border focus:border-accent"
                  }`}
              />
              {errors.landmark && <p className="text-red-400 text-[11px] mt-0.5">{errors.landmark}</p>}
            </div>
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
              {errors.city && <p className="text-red-400 text-[11px] mt-0.5">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
                State *
              </label>
              <div className="relative">
                <select
                  value={form.state || "Kerala"}
                  onChange={(e) => setField("state", e.target.value)}
                  className={`w-full bg-dark text-cream text-[13px] px-3 py-2.5 rounded-xl border outline-none font-pally appearance-none cursor-pointer pr-8 ${
                    errors.state ? "border-red-500" : "border-border focus:border-accent"
                  }`}
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st} className="bg-dark text-cream py-1.5">
                      {st}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-accent">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
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
                className={`w-full bg-dark text-cream text-[13px] px-3.5 py-2.5 rounded-xl border outline-none font-pally ${errors.pincode ? "border-red-500" : "border-border focus:border-accent"
                  }`}
              />
              {errors.pincode && <p className="text-red-400 text-[11px] mt-0.5">{errors.pincode}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold tracking-wider uppercase text-muted mb-1">
                City *
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="City"
                className={`w-full bg-dark text-cream text-[13px] px-3.5 py-2.5 rounded-xl border outline-none font-pally ${errors.city ? "border-red-500" : "border-border focus:border-accent"
                  }`}
              />
              {errors.city && <p className="text-red-400 text-[11px] mt-0.5">{errors.city}</p>}
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
                className={`w-full bg-dark text-cream text-[13px] px-3.5 py-2.5 rounded-xl border outline-none font-pally ${errors.state ? "border-red-500" : "border-border focus:border-accent"
                  }`}
              />
              {errors.state && <p className="text-red-400 text-[11px] mt-0.5">{errors.state}</p>}
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
/* ═══════════════════════════════════════════════════════════════════
   SMART RECOMMENDATION ENGINE (MULTI-TIERED CONTEXTUAL MATCHING)
═══════════════════════════════════════════════════════════════════ */
function getRecommendedProducts(
  currentProduct: Product,
  allProducts: Product[],
  fallbackProducts: Product[],
  limit: number = 4
): Product[] {
  const catalog = (allProducts && allProducts.length > 0 ? allProducts : fallbackProducts) || [];
  if (!catalog || catalog.length === 0) return [];

  // Filter out current product and inactive products
  const candidates = catalog.filter(
    (p) =>
      String(p.id) !== String(currentProduct.id) &&
      String(p.slug) !== String(currentProduct.slug) &&
      p.isActive !== false
  );

  const curScale = (currentProduct.scale || "").toLowerCase().trim();
  const curCat = (currentProduct.category || "").toLowerCase().trim();
  const curTitleWords = currentProduct.name
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const curPrice = currentProduct.price;

  const scored = candidates.map((p) => {
    let score = 0;

    // 1. Scale Match (e.g. 1:24 vs 1:24)
    const pScale = (p.scale || "").toLowerCase().trim();
    if (pScale && curScale && pScale === curScale) {
      score += 20;
    }

    // 2. Category Match (e.g. Diecast vs RC vs Frame)
    const pCat = (p.category || "").toLowerCase().trim();
    if (pCat && curCat && pCat === curCat) {
      score += 15;
    }

    // 3. Car Brand / Model Keyword Overlap
    const pTitle = p.name.toLowerCase();
    const commonWords = ["diecast", "model", "scale", "car", "black", "red", "white", "blue", "yellow", "metal", "toy"];
    curTitleWords.forEach((word) => {
      if (!commonWords.includes(word) && pTitle.includes(word)) {
        score += 10;
      }
    });

    // 4. Price Proximity (within ±30% range)
    if (curPrice > 0 && p.price > 0) {
      const priceDiffRatio = Math.abs(p.price - curPrice) / curPrice;
      if (priceDiffRatio <= 0.3) {
        score += 5;
      }
    }

    // 5. Featured badge boost
    if (p.badge) score += 2;

    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.product);
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PRODUCT DETAIL CLIENT PAGE
═══════════════════════════════════════════════════════════════════ */
export default function ProductDetailClient({
  product,
  allProducts = [],
}: {
  product: Product;
  allProducts?: Product[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [qty, setQty] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(true);

  const { addToCart } = useCart();
  const router = useRouter();

  // Available color options or defaults if none configured
  const colorOptions = product.colors && product.colors.length > 0 ? product.colors : [];

  // Combine main images array with any color variant images for complete sub-images gallery
  const allGalleryImages = Array.from(
    new Set([
      ...(product.images || []),
      product.img,
      ...(colorOptions.map((c) => c.image).filter(Boolean) as string[]),
    ])
  ).filter(Boolean);

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const strikePriceStr =
    product.oldPrice && product.oldPrice > product.price
      ? product.oldPriceStr || `₹${Number(product.oldPrice).toLocaleString("en-IN")}`
      : product.oldPriceStr || null;

  const related = getRecommendedProducts(product, allProducts, PRODUCTS, 4);

  const handleSelectColor = (index: number) => {
    setSelectedColor(index);
    const chosenColor = colorOptions[index];
    if (chosenColor?.image) {
      const imgIdx = allGalleryImages.findIndex((img) => img === chosenColor.image);
      if (imgIdx !== -1) {
        setActiveImg(imgIdx);
      }
    }
  };

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
                src={allGalleryImages[activeImg] || colorOptions[selectedColor]?.image || product.img}
                alt={product.name}
                width={600}
                height={600}
                unoptimized
                className="w-full h-full object-contain p-8 transition-all duration-300"
                priority
              />
            </div>

            {/* Thumbnail Strip (Sub-Images) */}
            {allGalleryImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
                {allGalleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl bg-white border-2 shrink-0 overflow-hidden transition-all cursor-pointer ${
                      activeImg === i
                        ? "border-accent shadow-[0_0_12px_rgba(200,169,110,0.4)] scale-105"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Sub image ${i + 1}`}
                      width={64}
                      height={64}
                      unoptimized
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-accent">
                  {product.category === "RC" ? "RC Toys" : product.category === "Frame" ? "3D Display Frame" : `${product.scale} Diecast Scale`}
                </span>
                <span className="bg-dark2 border border-border text-[10px] font-extrabold text-cream px-2 py-0.5 rounded-full uppercase">
                  Scale: {product.scale || "1:24"}
                </span>
              </div>

              <h1 className="font-pally font-bold text-[24px] sm:text-[32px] text-cream leading-tight mb-3">
                {formatTitleCase(product.name)}
              </h1>

              {/* Price & Strike MRP & Off tag */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-[32px] font-bold text-cream font-pally">
                  {product.priceStr || `₹${Number(product.price).toLocaleString("en-IN")}`}
                </span>
                {strikePriceStr && (
                  <span className="text-[18px] text-dim line-through font-medium">
                    {strikePriceStr}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-promo text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                    SALE {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Trust badges banner (3 pillars) */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-dark2/80 border border-border rounded-xl mb-6">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 p-1">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <p className="text-[11px] font-bold text-cream leading-tight">100% Original</p>
                    <p className="text-[9.5px] text-muted hidden sm:block">Authentic Collectible</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 p-1 border-x border-border/60">
                  <span className="text-xl">⭐</span>
                  <div>
                    <p className="text-[11px] font-bold text-cream leading-tight">4.9/5 Rating</p>
                    <p className="text-[9.5px] text-muted hidden sm:block">Customer Approved</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 p-1">
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="text-[11px] font-bold text-cream leading-tight">WhatsApp Order</p>
                    <p className="text-[9.5px] text-muted hidden sm:block">Direct & Instant Support</p>
                  </div>
                </div>
              </div>

              {/* Key Features & Bullet Points */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6 p-4 bg-dark2/90 border border-border/80 rounded-xl">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-accent mb-2.5 font-mono flex items-center gap-1.5">
                    <span>✨</span> Key Model Highlights
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] text-cream">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-pally leading-snug">
                        <span className="text-emerald-400 font-extrabold shrink-0 mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Color Options Section */}
              {colorOptions.length > 0 && (
                <div className="mb-6">
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-muted mb-2">
                    Color Option: <span className="text-cream font-semibold">{colorOptions[selectedColor]?.name}</span>
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {colorOptions.map((col, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectColor(idx)}
                        className={`group relative rounded-xl p-1 border-2 transition-all flex items-center gap-2 cursor-pointer ${
                          selectedColor === idx
                            ? "border-accent bg-dark3 shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                            : "border-border bg-dark2 hover:border-gray-500"
                        }`}
                      >
                        {col.image ? (
                          <div className="w-12 h-12 bg-white rounded-lg overflow-hidden relative p-0.5 shrink-0">
                            <Image src={col.image} alt={col.name} fill className="object-contain p-0.5" />
                          </div>
                        ) : (
                          <span
                            className="w-8 h-8 rounded-full border border-white/20 inline-block shrink-0 shadow-inner"
                            style={{ backgroundColor: col.colorHex || "#C5A059" }}
                          />
                        )}
                        <span className="text-[12px] font-bold text-cream px-2 pr-3">
                          {col.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

              {/* ACTION BUTTONS: BUY NOW & ADD TO CART */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setShowBuyModal(true)}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#1EBE5B] hover:from-[#20c05c] hover:to-[#1aa850] text-white font-pally font-extrabold text-[15px] tracking-wider py-4 rounded-2xl transition-all shadow-[0_4px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>BUY IT NOW</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-dark3 hover:bg-dark2 text-accent border border-accent/60 hover:border-accent font-pally font-extrabold text-[15px] tracking-wider py-4 rounded-2xl transition-all shadow-md hover:shadow-[0_0_20px_rgba(197,160,89,0.25)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span>ADD TO CART</span>
                </button>
              </div>

              {/* Free Shipping & COD perks strip */}
              <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-dark2 border border-border rounded-xl mb-6">
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-emerald-400 font-bold text-sm">✓</span>
                  <span className="text-[11px] font-semibold text-cream">COD Available</span>
                </div>
                <div className="flex items-center gap-2 justify-center border-x border-border/60">
                  <span className="text-emerald-400 font-bold text-sm">🚚</span>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-emerald-400 font-bold text-sm">✨</span>
                  <span className="text-[11px] font-semibold text-cream">100% Quality Checked</span>
                </div>
              </div>

              {/* Collapsible Description & Specifications Section */}
              <div className="border-t border-border pt-4">
                <button
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className="w-full flex items-center justify-between text-left py-2 font-pally font-bold text-[16px] text-cream cursor-pointer"
                >
                  <span>Description & Scale Details</span>
                  <span className="text-muted text-lg">{isDescOpen ? "−" : "+"}</span>
                </button>

                {isDescOpen && (
                  <div className="mt-3 space-y-4 text-[13.5px] text-muted leading-relaxed animate-in fade-in duration-200">
                    <p>{product.description}</p>
                    <div className="bg-dark2 p-4 rounded-xl border border-border space-y-2">
                      <div className="flex justify-between border-b border-border/60 pb-1.5">
                        <span className="text-gray-400">Scale Ratio:</span>
                        <span className="text-cream font-bold">{product.scale || "1:24"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/60 pb-1.5">
                        <span className="text-gray-400">SKU Code:</span>
                        <span className="text-cream font-bold">{product.sku}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/60 pb-1.5">
                        <span className="text-gray-400">Availability:</span>
                        <span className="text-emerald-400 font-bold">In Stock & Ready to Dispatch</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shipping:</span>
                        <span className="text-emerald-400 font-extrabold uppercase">Free Shipping Across India</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Related / Recommended Products */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-24 border-t border-border/80 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-accent">
                    CURATED FOR YOUR COLLECTION
                  </span>
                </div>
                <h2 className="font-pally font-bold text-[22px] sm:text-[28px] text-cream tracking-tight">
                  Pairs Perfectly With Your Selection
                </h2>
                <p className="text-[12.5px] text-muted mt-1">
                  Handpicked models matching the {product.scale || "scale"} & precision craftsmanship of your model.
                </p>
              </div>
              <Link
                href="/products"
                className="text-[12px] font-bold text-accent hover:text-cream transition-colors no-underline flex items-center gap-1.5 shrink-0"
              >
                <span>Explore All Models</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => {
                const itemDiscount =
                  p.oldPrice > p.price
                    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                    : 0;

                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug || p.id}`}
                    className="group bg-dark2 border border-border rounded-2xl overflow-hidden
                               hover:border-accent hover:shadow-[0_8px_30px_rgba(197,160,89,0.18)] hover:-translate-y-1.5 transition-all duration-300
                               no-underline flex flex-col relative"
                  >
                    {/* Scale & Discount badges on thumbnail */}
                    <div className="bg-white overflow-hidden relative" style={{ aspectRatio: "4/3" }}>
                      <span className="absolute top-2.5 left-2.5 z-10 text-[9.5px] font-extrabold text-dark bg-cream/90 backdrop-blur-md px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                        {p.scale || "1:24"}
                      </span>

                      {itemDiscount > 0 && (
                        <span className="absolute top-2.5 right-2.5 z-10 text-[9.5px] font-extrabold text-white bg-promo px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                          {itemDiscount}% OFF
                        </span>
                      )}

                      <Image
                        src={p.img}
                        alt={p.shortName || p.name}
                        width={280}
                        height={210}
                        className="w-full h-full object-contain p-4 group-hover:scale-108 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1 bg-dark2">
                      <div>
                        <span className="text-[10px] font-bold text-accent/80 uppercase tracking-widest block mb-1">
                          {p.category === "RC" ? "RC Toy" : p.category === "Frame" ? "3D Display" : `${p.scale || "1:24"} Scale`}
                        </span>
                        <p className="text-[13px] font-bold text-cream leading-snug group-hover:text-accent transition-colors line-clamp-2">
                          {p.shortName || p.name}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/50">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[15px] font-extrabold text-cream font-pally">{p.priceStr}</span>
                          {p.oldPriceStr && (
                            <span className="text-[11px] text-dim line-through">{p.oldPriceStr}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedModalProduct(p);
                          }}
                          className="text-[11px] font-pally font-extrabold text-accent hover:text-white bg-accent/10 hover:bg-accent px-3 py-1.5 rounded-lg border border-accent/30 tracking-wider uppercase transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          BUY NOW
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Instant Checkout Modal for Main Product */}
      <BuyNowModal
        product={product}
        quantity={qty}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />

      {/* Instant Checkout Modal for Recommended Product */}
      {selectedModalProduct && (
        <BuyNowModal
          product={selectedModalProduct}
          quantity={1}
          isOpen={!!selectedModalProduct}
          onClose={() => setSelectedModalProduct(null)}
        />
      )}

      {/* Floating Showcase Video Reel */}
      <ProductVideoFloating
        videoUrl={product.videoUrl}
        productName={product.name}
      />
    </div>
  );
}
