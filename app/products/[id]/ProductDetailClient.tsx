"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Product, type SizeOption, formatTitleCase } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import ProductCard from "@/components/product/ProductCard";
import ProductVideoFloating from "@/components/product/ProductVideoFloating";
import { ChevronLeft, ChevronRight, Search, HelpCircle, X, ChevronDown } from "lucide-react";

const INDIAN_STATES = [
  "Kerala",
  "Tamil Nadu",
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Telangana",
  "Andhra Pradesh",
  "Gujarat",
  "West Bengal",
  "Uttar Pradesh",
  "Rajasthan",
  "Punjab",
  "Haryana",
  "Madhya Pradesh",
  "Bihar",
  "Assam",
  "Odisha",
  "Goa",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Puducherry",
  "Chandigarh",
  "Chhattisgarh",
  "Jharkhand",
  "Uttarakhand",
];

// Helper to determine exact scale size string for pill badge
function getScaleSizePillText(scaleStr?: string, categoryStr?: string): { label: string; details: string } {
  const sc = (scaleStr || "").toLowerCase();
  const cat = (categoryStr || "").toLowerCase();

  if (sc.includes("1:16") || sc.includes("1/16")) {
    return { label: "RC Scale (1:16)", details: "(10-12 Inch / 25-30 cm)" };
  }
  if (sc.includes("1:14") || sc.includes("1/14") || sc.includes("1:12") || sc.includes("1/12")) {
    return { label: "Large RC Scale", details: "(12-14 Inch / 30-35 cm)" };
  }
  if (sc.includes("1:18") || sc.includes("1/18") || cat.includes("1:18")) {
    return { label: "Extra Large (1:18)", details: "(10-11 Inch / 24-28 cm)" };
  }
  if (sc.includes("1:32") || sc.includes("1/32") || cat.includes("1:32")) {
    return { label: "Medium (1:32)", details: "(5-6 Inch / 13-15 cm)" };
  }
  if (sc.includes("1:36") || sc.includes("1/36") || cat.includes("1:36")) {
    return { label: "Compact (1:36)", details: "(4.5-5.5 Inch / 11-13 cm)" };
  }
  if (cat.includes("rc") || sc.includes("rc")) {
    return { label: "Remote Control (RC)", details: "(8-12 Inch / 20-30 cm)" };
  }
  if (cat.includes("frame") || sc.includes("frame")) {
    return { label: "Wall 3D Frame", details: "(12-16 Inch / 30-40 cm)" };
  }
  // Default to 1:24 Large
  return { label: "Large (1:24)", details: "(7-8 Inch / 18-21 cm)" };
}

function detectDisplayScale(product: {
  scale?: string;
  category?: string;
  name?: string;
  highlights?: any;
  description?: string;
}): string {
  const highlightsStr = Array.isArray(product.highlights)
    ? product.highlights.join(" ")
    : typeof product.highlights === "string"
    ? product.highlights
    : "";
  const combinedText = `${product.name || ""} ${highlightsStr} ${product.description || ""}`.toLowerCase();

  const scaleMatch = combinedText.match(/1\s*[:/]\s*(10|12|14|16|18|20|24|28|32|43|64)/i);
  if (scaleMatch && scaleMatch[1]) {
    return `1:${scaleMatch[1]}`;
  }

  if (product.scale && product.scale !== "1:24") {
    return product.scale;
  }

  if (product.scale) {
    return product.scale;
  }

  const cat = (product.category || "").toLowerCase();
  if (cat.includes("rc")) return "RC";
  if (cat.includes("frame")) return "3D Frame";
  return "1:24";
}

/* ═══════════════════════════════════════════════════════════════════
   INSTANT BUY NOW WHATSAPP MODAL
═══════════════════════════════════════════════════════════════════ */
export function BuyNowModal({
  product,
  quantity = 1,
  isOpen,
  onClose,
  selectedColorName,
  selectedSizeName,
}: {
  product: Product;
  quantity?: number;
  isOpen: boolean;
  onClose: () => void;
  selectedColorName?: string;
  selectedSizeName?: string;
}) {
  const [form, setForm] = useState({
    emailOrPhone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "Kerala",
    pincode: "",
    country: "India",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const total = product.price * quantity;
  const estimatedTax = Math.round((total * 0.18) / 1.18);

  const setField = (field: string, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const newErr: { [key: string]: string } = {};
    if (!form.emailOrPhone.trim()) {
      newErr.emailOrPhone = "Email or mobile phone number is required";
    }
    if (!form.lastName.trim() && !form.firstName.trim()) {
      newErr.lastName = "Last name or full name is required";
    }
    if (!form.address.trim()) {
      newErr.address = "Address is required";
    }
    if (!form.city.trim()) {
      newErr.city = "City is required";
    }
    if (!form.pincode.trim() || form.pincode.trim().length < 6) {
      newErr.pincode = "Valid 6-digit PIN code required";
    }

    if (Object.keys(newErr).length > 0) {
      setErrors(newErr);
      return;
    }

    const customerFullName = [form.firstName.trim(), form.lastName.trim()]
      .filter(Boolean)
      .join(" ");

    const adminWhatsAppNumber = "919048571147";

    const message = `🛍️ *NEW DIRECT ORDER - DAXOMART* 🛍️

*Customer Details:*
👤 Name: ${customerFullName}
📞 Contact: ${form.emailOrPhone.trim()}
📍 Address: ${form.address.trim()}
🏙️ City: ${form.city.trim()}
📌 State: ${form.state.trim()}
📮 PIN Code: ${form.pincode.trim()}
🌐 Country: ${form.country.trim()}

*Order Details:*
🚗 Product: ${product.name}
📏 Scale: ${product.scale || "1:24"}${selectedColorName ? `\n🎨 Color: ${selectedColorName}` : ""}${selectedSizeName ? `\n📐 Size: ${selectedSizeName}` : ""}
📦 Quantity: ${quantity}
💰 Unit Price: ₹${product.price.toLocaleString("en-IN")}
💵 Total Amount: ₹${total.toLocaleString("en-IN")} (Free Delivery)

Please confirm my order & provide delivery timeline!`;

    const waUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: customerFullName,
        phone: form.emailOrPhone.trim(),
        email: form.emailOrPhone.includes("@") ? form.emailOrPhone.trim() : "",
        address: form.address.trim(),
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

    onClose();
  };

  const variantDetailsText = [
    selectedColorName || null,
    selectedSizeName || product.scale || "Regular (1:24)",
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200 font-pally text-zinc-900 my-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900">
              DAXO <span className="text-amber-700">MART</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Close Checkout"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Left Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-white">
            {/* Contact Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Contact
                </h3>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={form.emailOrPhone}
                  onChange={(e) => setField("emailOrPhone", e.target.value)}
                  placeholder="Email or mobile phone number"
                  className={`w-full bg-white text-gray-900 text-sm px-4 py-3 rounded-xl border outline-none transition-all ${
                    errors.emailOrPhone
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                />
                <div className="absolute right-3.5 top-3.5 text-gray-400" title="Used for order confirmation">
                  <HelpCircle size={17} />
                </div>
              </div>
              {errors.emailOrPhone && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.emailOrPhone}</p>
              )}
            </div>

            {/* Delivery Section */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                Delivery
              </h3>

              <div className="space-y-3">
                {/* Country Dropdown */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Country/Region
                  </label>
                  <div className="relative">
                    <select
                      value={form.country}
                      onChange={(e) => setField("country", e.target.value)}
                      className="w-full bg-white text-gray-900 text-sm px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none appearance-none cursor-pointer font-medium"
                    >
                      <option value="India">India</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      placeholder="First name (optional)"
                      className="w-full bg-white text-gray-900 text-sm px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      placeholder="Last name"
                      className={`w-full bg-white text-gray-900 text-sm px-4 py-3 rounded-xl border outline-none transition-all ${
                        errors.lastName
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="relative">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="Address"
                    className={`w-full bg-white text-gray-900 text-sm px-4 py-3 pr-10 rounded-xl border outline-none transition-all ${
                      errors.address
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  />
                  <Search size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>
                  )}
                </div>

                {/* City, State, PIN code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="City"
                      className={`w-full bg-white text-gray-900 text-sm px-3.5 py-3 rounded-xl border outline-none transition-all ${
                        errors.city
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.city}</p>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                      className="w-full bg-white text-gray-900 text-sm px-3.5 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none appearance-none cursor-pointer font-medium"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={form.pincode}
                      onChange={(e) => setField("pincode", e.target.value)}
                      placeholder="PIN code"
                      className={`w-full bg-white text-gray-900 text-sm px-3.5 py-3 rounded-xl border outline-none transition-all ${
                        errors.pincode
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-gray-50/80 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Product item tile */}
              <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-gray-200/90 shadow-xs">
                <div className="relative w-16 h-16 bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0 flex items-center justify-center">
                  <Image
                    src={product.img}
                    alt={product.name}
                    width={56}
                    height={56}
                    unoptimized
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {formatTitleCase(product.name)}
                  </h4>
                  {variantDetailsText && (
                    <p className="text-[11px] text-gray-500 mt-0.5 font-medium truncate">
                      {variantDetailsText}
                    </p>
                  )}
                </div>
                <span className="text-sm font-extrabold text-gray-900 shrink-0">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Price details */}
              <div className="space-y-3 text-xs sm:text-sm pt-2">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    Shipping <HelpCircle size={14} className="text-gray-400" />
                  </span>
                  <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Free Delivery
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-base sm:text-lg font-black text-gray-900">Total</span>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Including ₹{estimatedTax.toLocaleString("en-IN")} in estimated taxes
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold mr-1">INR</span>
                    <span className="text-lg sm:text-xl font-black text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Order via WhatsApp button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#25D366] hover:bg-[#20c05c] active:scale-[0.98] text-white font-pally font-extrabold text-sm sm:text-base tracking-wide py-3.5 px-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2.5 cursor-pointer mt-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              <span>Place Order via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRecommendedProducts(
  currentProduct: Product,
  allProducts: Product[],
  fallbackProducts: Product[],
  limit: number = 4
): Product[] {
  const catalog = (allProducts && allProducts.length > 0 ? allProducts : fallbackProducts) || [];
  if (!catalog || catalog.length === 0) return [];

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
    const pScale = (p.scale || "").toLowerCase().trim();
    if (pScale && curScale && pScale === curScale) score += 20;

    const pCat = (p.category || "").toLowerCase().trim();
    if (pCat && curCat && pCat === curCat) score += 15;

    const pTitle = p.name.toLowerCase();
    const commonWords = ["diecast", "model", "scale", "car", "black", "red", "white", "blue", "yellow", "metal", "toy"];
    curTitleWords.forEach((word) => {
      if (!commonWords.includes(word) && pTitle.includes(word)) score += 10;
    });

    if (curPrice > 0 && p.price > 0) {
      const priceDiffRatio = Math.abs(p.price - curPrice) / curPrice;
      if (priceDiffRatio <= 0.3) score += 5;
    }

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
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isScaleGuideOpen, setIsScaleGuideOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const { addToCart } = useCart();
  const router = useRouter();

  // Scroll to top and track GA product view on page load / product change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      try {
        import("@/components/analytics/GoogleAnalytics").then(({ trackProductView }) => {
          trackProductView({ id: product.id, name: product.name, price: product.price, category: product.category });
        });
      } catch {}
    }
  }, [product.id, product.name, product.price, product.category]);

  // Only show colors if admin has actually added them
  const colorOptions = product.colors && product.colors.length > 0 ? product.colors : [];
  const hasAdminColors = colorOptions.length > 0;

  const allGalleryImages = Array.from(
    new Set([
      ...(product.images || []),
      product.img,
      ...(colorOptions.map((c) => c.image).filter(Boolean) as string[]),
    ])
  ).filter(Boolean);

  // Only show sizes if admin has actually added them — no static fallback
  const availableSizes: SizeOption[] =
    product.sizes && product.sizes.length > 0 ? product.sizes : [];
  const hasAdminSizes = availableSizes.length > 0;

  const [selectedSizeIdx, setSelectedSizeIdx] = useState<number>(0);
  const activeSizeObj = hasAdminSizes ? (availableSizes[selectedSizeIdx] || availableSizes[0]) : null;
  const activePrice = activeSizeObj?.price || product.price;
  const activeOldPrice = activeSizeObj?.oldPrice || product.oldPrice;

  const dynamicDiscountPercent =
    activeOldPrice && activeOldPrice > activePrice
      ? Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100)
      : 0;

  const dynamicStrikePriceStr =
    activeOldPrice && activeOldPrice > activePrice
      ? `₹${Number(activeOldPrice).toLocaleString("en-IN")}`
      : null;

  const selectedColorName = hasAdminColors ? (colorOptions[selectedColor]?.name || "") : "";
  const selectedSizeName = hasAdminSizes && activeSizeObj ? activeSizeObj.name : "";

  const related = getRecommendedProducts(product, allProducts, [], 4);

  const scalePill = getScaleSizePillText(product.scale, product.category);

  const imageSectionRef = useRef<HTMLDivElement>(null);

  const handleSelectColor = (index: number) => {
    setSelectedColor(index);
    const chosenColor = colorOptions[index];
    if (chosenColor?.image) {
      const imgIdx = allGalleryImages.findIndex((img) => img === chosenColor.image);
      if (imgIdx !== -1) {
        setActiveImg(imgIdx);
      }
    }
    // Auto scroll up to main image on color click (mobile & desktop)
    if (typeof window !== "undefined") {
      if (imageSectionRef.current) {
        const yOffset = -20;
        const element = imageSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevImg = () => {
    if (allGalleryImages.length <= 1) return;
    setActiveImg((prev) => (prev === 0 ? allGalleryImages.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    if (allGalleryImages.length <= 1) return;
    setActiveImg((prev) => (prev === allGalleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNextImg();
    } else if (distance < -minSwipeDistance) {
      handlePrevImg();
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: activePrice,
        priceStr: `₹${activePrice.toLocaleString("en-IN")}`,
        scale: selectedSizeName || product.scale,
      },
      qty
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen relative">
      {/* Premium Added to Cart Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto bg-[#0c0c0c]/95 border border-[#c8a96e]/40 text-white font-pally p-3.5 sm:p-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative w-12 h-12 bg-white rounded-xl p-1 shrink-0 border border-gray-200 shadow-xs flex items-center justify-center">
            <Image
              src={product.img}
              alt={product.name}
              width={44}
              height={44}
              unoptimized
              className="w-full h-full object-contain"
            />
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-xs">
              ✓
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-xs font-bold">✨</span>
              <p className="text-xs font-black text-white tracking-wide">Added to Cart!</p>
            </div>
            <p className="text-[11px] text-gray-400 font-medium truncate max-w-[150px] sm:max-w-[200px] mt-0.5">
              {formatTitleCase(product.name)}
            </p>
          </div>

          <button
            onClick={() => router.push("/cart")}
            className="bg-gradient-to-r from-[#c8a96e] to-[#e2c898] hover:from-[#b5965b] hover:to-[#d4ba8a] active:scale-95 text-black font-extrabold text-[11px] tracking-wider uppercase px-3.5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
          >
            View Cart →
          </button>

          <button
            onClick={() => setAddedToast(false)}
            className="text-gray-400 hover:text-white text-xs p-1 cursor-pointer transition-colors"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] mb-8 flex-wrap">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors no-underline">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="text-gray-500 hover:text-black transition-colors no-underline">Products</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">{product.shortName}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Left: Images */}
          <div ref={imageSectionRef}>
            <div
              className="bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-200/80 shadow-sm select-none touch-pan-y"
              style={{ aspectRatio: "1" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 z-10 text-[10.5px] font-extrabold tracking-wider uppercase px-3.5 py-1.5 rounded-lg shadow-md border ${
                    product.badge === "Limited Edition"
                      ? "bg-amber-600 text-white border-amber-400/40 shadow-amber-900/30"
                      : product.badge === "Best Seller"
                      ? "bg-purple-600 text-white border-purple-400/40 shadow-purple-900/30"
                      : product.badge === "New Arrival" || product.badge === "New"
                      ? "bg-emerald-600 text-white border-emerald-400/40 shadow-emerald-900/30"
                      : product.badge === "Sale"
                      ? "bg-red-600 text-white border-red-400/40 shadow-red-900/30"
                      : "bg-[#C5A059] text-black font-black border-amber-300/40"
                  }`}
                >
                  {product.badge}
                </span>
              )}

              {/* Counter Badge */}
              {allGalleryImages.length > 1 && (
                <span className="absolute top-4 right-4 z-10 text-[11px] font-bold tracking-wider bg-black/70 text-white backdrop-blur-md px-2.5 py-1 rounded-full shadow">
                  {activeImg + 1} / {allGalleryImages.length}
                </span>
              )}

              <Image
                src={allGalleryImages[activeImg] || colorOptions[selectedColor]?.image || product.img}
                alt={product.name}
                width={600}
                height={600}
                unoptimized
                className="w-full h-full object-contain p-8 transition-all duration-300 pointer-events-none"
                priority
              />
            </div>

            {/* Thumbnail Strip with Prev/Next Arrows */}
            {allGalleryImages.length > 1 && (
              <div className="flex items-center gap-2 mt-4">
                {/* Prev Arrow */}
                <button
                  type="button"
                  onClick={handlePrevImg}
                  className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
                  title="Previous Image"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Thumbnails */}
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none flex-1">
                  {allGalleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-50 border-2 shrink-0 overflow-hidden transition-all cursor-pointer ${
                        activeImg === i
                          ? "border-black shadow-sm scale-105"
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

                {/* Next Arrow */}
                <button
                  type="button"
                  onClick={handleNextImg}
                  className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
                  title="Next Image"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-amber-700">
                  {product.category || `${product.scale || "1:24"} Scale`}
                </span>
                <span className="bg-gray-100 border border-gray-200 text-[10px] font-extrabold text-gray-800 px-2.5 py-0.5 rounded-full uppercase">
                  Scale: {detectDisplayScale(product)}
                </span>
              </div>

              {/* 1. Product Title */}
              <h1 className="font-pally font-bold text-[24px] sm:text-[32px] text-gray-900 leading-tight mb-3">
                {formatTitleCase(product.name)}
              </h1>

              {/* 2. Dynamic Price & Sale Discount Badge */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="text-[32px] font-bold text-gray-900 font-pally">
                  ₹{Number(activePrice).toLocaleString("en-IN")}
                </span>
                {dynamicStrikePriceStr && (
                  <span className="text-[18px] text-gray-400 line-through font-medium">
                    {dynamicStrikePriceStr}
                  </span>
                )}
                {dynamicDiscountPercent > 0 && (
                  <span className="bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    SALE {dynamicDiscountPercent}% OFF
                  </span>
                )}
              </div>

              {/* ── 3. COLOR VARIANT PHOTO TILES (Only if admin added colors) ── */}
              {hasAdminColors && (
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-gray-700 mb-2 font-pally">
                    Color{selectedColorName ? `: ` : ""}
                    {selectedColorName && <span className="text-gray-900 font-semibold">{selectedColorName}</span>}
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {colorOptions.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectColor(idx)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-1 transition-all cursor-pointer flex items-center justify-center ${
                          selectedColor === idx
                            ? "bg-gray-100 border-2 border-black shadow-md scale-105"
                            : "bg-gray-50 border border-gray-300 hover:border-gray-500 opacity-90 hover:opacity-100"
                        }`}
                        title={col.name}
                      >
                        {col.image ? (
                          <Image src={col.image} alt={col.name} fill className="object-contain p-1.5" />
                        ) : (
                          <span
                            className="w-10 h-10 rounded-full border border-black/20 shadow-inner"
                            style={{ backgroundColor: col.colorHex || "#C5A059" }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 4. MULTI-SIZE OPTION PILLS (Only if admin added sizes) ── */}
              {hasAdminSizes && (
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-gray-700 mb-2 font-pally">
                    Size
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {availableSizes.map((sz, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSizeIdx(idx)}
                        className={`px-5 py-2.5 rounded-full text-[13px] font-bold font-pally transition-all cursor-pointer flex items-center gap-2 ${
                          selectedSizeIdx === idx
                            ? "bg-black text-white border-2 border-black shadow-md scale-102"
                            : "bg-white border border-gray-300 text-gray-800 hover:border-black hover:text-black"
                        }`}
                      >
                        <span>{sz.name}</span>
                        {sz.price && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              selectedSizeIdx === idx
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            ₹{sz.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Highlights */}
              {((product.highlights && product.highlights.length > 0) || (product.features && product.features.length > 0)) && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200/80 rounded-xl">
                  <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-amber-700 mb-3 font-mono flex items-center gap-1.5">
                    <span>✨</span> Product Highlights
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13.5px] text-gray-800">
                    {(product.highlights && product.highlights.length > 0 ? product.highlights : product.features).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-pally leading-snug">
                        <span className="text-emerald-600 font-extrabold shrink-0 mt-0.5">✔</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* High-Converting Trust Badges Bar */}
              <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#0C0C0C] border border-[#C5A059]/30 rounded-2xl mb-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 p-1">
                  <span className="text-xl">🚚</span>
                  <div>
                    <p className="text-[11px] font-extrabold text-[#C5A059] leading-tight font-pally">Free Delivery</p>
                    <p className="text-[9.5px] text-gray-400 hidden sm:block font-medium">Pan-India Express</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 p-1 border-x border-gray-800">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <p className="text-[11px] font-extrabold text-white leading-tight font-pally">100% Quality</p>
                    <p className="text-[9.5px] text-gray-400 hidden sm:block font-medium">Inspected Alloy Body</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 p-1">
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="text-[11px] font-extrabold text-emerald-400 leading-tight font-pally">WhatsApp / COD</p>
                    <p className="text-[9.5px] text-gray-400 hidden sm:block font-medium">Instant Support</p>
                  </div>
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-gray-500 mb-2">
                  Quantity
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl w-fit">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-200 rounded-l-xl transition-colors text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-gray-900 text-[15px] font-bold font-pally">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-200 rounded-r-xl transition-colors text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS: BUY NOW & ADD TO CART */}
              {!product.inStock || product.stock === 0 ? (
                <div className="mb-6 space-y-2">
                  <button
                    type="button"
                    disabled
                    className="w-full bg-gray-200 text-gray-500 font-pally font-extrabold text-[15px] tracking-wider py-4 rounded-2xl cursor-not-allowed border border-gray-300 flex items-center justify-center gap-2"
                  >
                    <span>CURRENTLY OUT OF STOCK</span>
                  </button>
                  <p className="text-[12px] text-center font-medium text-rose-500">
                    This item is temporarily sold out. Check back soon or contact support for restock updates.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams({
                        productId: product.id.toString(),
                        qty: qty.toString(),
                      });
                      if (selectedColorName) params.set("color", selectedColorName);
                      if (selectedSizeName) params.set("size", selectedSizeName);
                      router.push(`/checkout?${params.toString()}`);
                    }}
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
                    className="w-full bg-black hover:bg-zinc-800 text-white font-pally font-extrabold text-[15px] tracking-wider py-4 rounded-2xl transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span>ADD TO CART</span>
                  </button>
                </div>
              )}

              {/* Free Shipping & COD perks strip */}
              <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-gray-50 border border-gray-200/80 rounded-xl mb-6">
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                  <span className="text-[11px] font-semibold text-gray-800">COD Available</span>
                </div>
                <div className="flex items-center gap-2 justify-center border-x border-gray-200">
                  <span className="text-emerald-600 font-bold text-sm">🚚</span>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-emerald-600 font-bold text-sm">✨</span>
                  <span className="text-[11px] font-semibold text-gray-800">100% Quality Checked</span>
                </div>
              </div>

              {/* ── ACCORDION 1: PRODUCT DESCRIPTION ── */}
              {product.description && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                    className="w-full flex items-center justify-between text-left py-2 font-pally font-bold text-[16px] text-gray-900 cursor-pointer group"
                  >
                    <span className="flex items-center gap-2 group-hover:text-amber-700 transition-colors">
                      <span>📝</span> Product Description
                    </span>
                    <span className="text-gray-400 group-hover:text-amber-700 transition-colors text-xl font-bold">
                      {isDescriptionOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isDescriptionOpen && (
                    <div className="mt-3 bg-gray-50 border border-gray-200 p-4 sm:p-5 rounded-2xl text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-wrap font-sans animate-in fade-in duration-200">
                      {product.description}
                    </div>
                  )}
                </div>
              )}

              {/* ── ACCORDION 2: SCALE SIZE GUIDE ── */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <button
                  type="button"
                  onClick={() => setIsScaleGuideOpen(!isScaleGuideOpen)}
                  className="w-full flex items-center justify-between text-left py-2 font-pally font-bold text-[16px] text-gray-900 cursor-pointer group"
                >
                  <span className="flex items-center gap-2 group-hover:text-amber-700 transition-colors">
                    <span>📏</span> Scale Size Guide
                  </span>
                  <span className="text-gray-400 group-hover:text-amber-700 transition-colors text-xl font-bold">
                    {isScaleGuideOpen ? "−" : "+"}
                  </span>
                </button>

                {isScaleGuideOpen && (
                  <div className="mt-3 bg-gray-50 border border-gray-200 p-4 sm:p-5 rounded-2xl space-y-4 text-[13px] text-gray-600 leading-relaxed font-sans animate-in fade-in duration-200">
                    <div>
                      <p className="font-bold text-gray-900 text-[14px] mb-1">What is diecast scale?</p>
                      <p className="text-gray-700 leading-relaxed text-[12.5px]">
                        Diecast scale is a measure of diecast car size relative to the actual real-world vehicle. It may seem confusing at first, but it&apos;s really simple!
                      </p>
                    </div>

                    {/* Model Car Scale/Size Guide Visual Comparison Table */}
                    <div>
                      <h4 className="text-[12px] font-extrabold uppercase tracking-wider text-amber-700 mb-3 font-mono">
                        Model Car Scale / Size Guide
                      </h4>

                      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white text-dark">
                        {/* 1:18 Scale Row - Big / Prominent */}
                        <div className="grid grid-cols-12 border-b border-gray-200 items-center">
                          <div className="col-span-5 p-3 flex items-center justify-center bg-white border-r border-gray-200">
                            <div className="w-full h-20 sm:h-24 relative flex items-center justify-center">
                              <Image
                                src="/images/scale-1-18.png"
                                alt="1:18 Diecast car scale guide"
                                fill
                                className="object-contain p-1 scale-105"
                              />
                            </div>
                          </div>
                          <div className="col-span-7 p-3.5">
                            <p className="font-extrabold text-[14px] text-black">1:18 scale</p>
                            <p className="text-[11.5px] text-gray-600 mt-0.5 leading-snug">
                              Length (approx.) 23 - 28 cm<br />
                              238 mm, 9.5 - 11 inches
                            </p>
                          </div>
                        </div>

                        {/* 1:24 Scale Row - Medium Baseline */}
                        <div className="grid grid-cols-12 border-b border-gray-200 items-center">
                          <div className="col-span-5 p-3 flex items-center justify-center bg-white border-r border-gray-200">
                            <div className="w-full h-16 sm:h-18 relative flex items-center justify-center">
                              <Image
                                src="/images/scale-1-24.png"
                                alt="1:24 Diecast car scale guide"
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          </div>
                          <div className="col-span-7 p-3.5">
                            <p className="font-extrabold text-[14px] text-black">1:24 scale</p>
                            <p className="text-[11.5px] text-gray-600 mt-0.5 leading-snug">
                              Length (approx.) 16.5 - 20 cm<br />
                              179 mm, 6.5 - 8 inches
                            </p>
                          </div>
                        </div>

                        {/* 1:32 Scale Row - Smaller (Not over small) */}
                        <div className="grid grid-cols-12 items-center">
                          <div className="col-span-5 p-3 flex items-center justify-center bg-white border-r border-gray-200">
                            <div className="w-full h-14 sm:h-16 relative flex items-center justify-center">
                              <Image
                                src="/images/scale-1-32.png"
                                alt="1:32 Diecast car scale guide"
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          </div>
                          <div className="col-span-7 p-3.5">
                            <p className="font-extrabold text-[14px] text-black">1:32 scale</p>
                            <p className="text-[11.5px] text-gray-600 mt-0.5 leading-snug">
                              Length (approx.) 12 - 15 cm<br />
                              130 mm, 5 - 6 inches
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[12px] text-gray-700 leading-relaxed">
                      A 1/18 scale diecast car is usually about 24 - 28cm (depending on the size of the actual car). A 1/24 scale diecast car is generally about 16 - 20cm. Many of the cars made in smaller scales (1/32) are made so that the car is around 5 inches long.
                    </p>
                  </div>
                )}
              </div>

              {/* ── ACCORDION 3: SPECIFICATIONS & BOX CONTENTS ── */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                  className="w-full flex items-center justify-between text-left py-2 font-pally font-bold text-[16px] text-gray-900 cursor-pointer group"
                >
                  <span className="flex items-center gap-2 group-hover:text-amber-700 transition-colors">
                    <span>📋</span> Specifications & Box Contents
                  </span>
                  <span className="text-gray-400 group-hover:text-amber-700 transition-colors text-xl font-bold">
                    {isSpecsOpen ? "−" : "+"}
                  </span>
                </button>

                {isSpecsOpen && (
                  <div className="mt-3 space-y-4 text-[13.5px] text-gray-600 leading-relaxed animate-in fade-in duration-200">
                    {/* What's Included List */}
                    {product.includedItems && product.includedItems.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 mb-2">What&apos;s Included in Box</h4>
                        <ul className="space-y-1.5 text-gray-800">
                          {product.includedItems.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-emerald-600 font-bold">✔</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Specifications table */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                      <div className="flex justify-between border-b border-gray-200 pb-1.5">
                        <span className="text-gray-500">Scale Ratio:</span>
                        <span className="text-gray-900 font-bold">{product.scale || product.category || "N/A"}</span>
                      </div>
                      {Array.isArray((product as any).specs) &&
                        (product as any).specs.map((sp: { key: string; value: string }, idx: number) => (
                          <div key={idx} className="flex justify-between border-b border-gray-200 pb-1.5">
                            <span className="text-gray-500">{sp.key}:</span>
                            <span className="text-gray-900 font-bold">{sp.value}</span>
                          </div>
                        ))}
                      <div className="flex justify-between border-b border-gray-200 pb-1.5">
                        <span className="text-gray-500">SKU Code:</span>
                        <span className="text-gray-900 font-bold">{product.sku}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-1.5">
                        <span className="text-gray-500">Availability:</span>
                        <span className="text-emerald-600 font-bold">In Stock & Ready to Dispatch</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping:</span>
                        <span className="text-emerald-600 font-extrabold uppercase">Free Shipping Across India</span>
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
          <div className="mt-16 sm:mt-24 border-t border-gray-200 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-amber-700">
                    CURATED FOR YOUR COLLECTION
                  </span>
                </div>
                <h2 className="font-pally font-bold text-[22px] sm:text-[28px] text-gray-900 tracking-tight">
                  Pairs Perfectly With Your Selection
                </h2>
                <p className="text-[12.5px] text-gray-600 mt-1">
                  Handpicked models matching the {product.scale || "scale"} & precision craftsmanship of your model.
                </p>
              </div>
              <Link
                href="/products"
                className="text-[12px] font-bold text-amber-700 hover:text-black transition-colors no-underline flex items-center gap-1.5 shrink-0"
              >
                <span>Explore All Models</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} variant="light" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Reel / Popup Video Preview */}
      <ProductVideoFloating
        videoUrl={product.videoUrl}
        productName={product.name}
      />
    </div>
  );
}
