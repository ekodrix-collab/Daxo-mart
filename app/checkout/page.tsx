"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/service/storeService";
import { type Product, formatTitleCase } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import { ArrowLeft, ChevronDown, HelpCircle, Search, ShieldCheck, Truck } from "lucide-react";

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

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const productIdParam = searchParams.get("productId") || searchParams.get("id");
  const qtyParam = searchParams.get("qty") || "1";
  const selectedColorName = searchParams.get("color") || "";
  const selectedSizeName = searchParams.get("size") || "";

  const quantity = Math.max(1, parseInt(qtyParam, 10) || 1);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
    city: "",
    state: "Kerala",
    pincode: "",
    country: "India",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (productIdParam) {
      fetchProducts().then((all) => {
        if (!isMounted) return;
        const found = all.find(
          (p) => String(p.id) === String(productIdParam) || String(p.slug) === String(productIdParam)
        );
        if (found) {
          setProduct(found);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [productIdParam]);

  const setField = (field: string, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Determine items & totals
  const isDirectProduct = !!product;
  const directTotal = product ? product.price * quantity : 0;
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const totalAmount = isDirectProduct ? directTotal : cartTotal;
  const estimatedTax = Math.round((totalAmount * 0.18) / 1.18);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const newErr: { [key: string]: string } = {};
    if (!form.phone.trim() || form.phone.trim().length < 10) {
      newErr.phone = "Valid 10-digit mobile phone number is required";
    }
    if (!form.firstName.trim()) {
      newErr.firstName = "First name is required";
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

    const fullAddress = [
      form.address.trim(),
      form.landmark.trim() ? `Landmark: ${form.landmark.trim()}` : "",
    ]
      .filter(Boolean)
      .join(", ");

    let message = "";
    if (isDirectProduct && product) {
      message = `🛍️ *NEW ORDER* 🛍️

*Address Details*

Name: ${customerFullName}
Full Address: ${form.address.trim()}
City: ${form.city.trim()}
State: ${form.state.trim()}
Landmark: ${form.landmark.trim()}
Pincode: ${form.pincode.trim()}
Mobile Number: ${form.phone.trim()}
${form.email.trim() ? `Email: ${form.email.trim()}\n` : ""}
*Product Details*

Product: ${product.name}
Color: ${selectedColorName || "Standard"}
Scale: ${product.scale || "1:24"}
${selectedSizeName ? `Size: ${selectedSizeName}\n` : ""}Quantity: ${quantity}
Unit Price: ₹${product.price.toLocaleString("en-IN")}
Total Amount: ₹${totalAmount.toLocaleString("en-IN")} (Free Delivery)

Please confirm my order. Thank you!`;
    } else {
      const itemsSummary = cart
        .map((i) => {
          const colorStr = (i as any).colorName || i.product.colors?.[0]?.name || "Standard";
          return `Product: ${i.product.name}\nColor: ${colorStr}\nQuantity: ${i.quantity}\nUnit Price: ${i.product.priceStr}\n`;
        })
        .join("\n");

      message = `🛍️ *NEW ORDER* 🛍️

*Address Details*

Name: ${customerFullName}
Full Address: ${form.address.trim()}
City: ${form.city.trim()}
State: ${form.state.trim()}
Landmark: ${form.landmark.trim()}
Pincode: ${form.pincode.trim()}
Mobile Number: ${form.phone.trim()}
${form.email.trim() ? `Email: ${form.email.trim()}\n` : ""}
*Product Details*

${itemsSummary}
Total Amount: ₹${totalAmount.toLocaleString("en-IN")} (Free Delivery)

Please confirm my order. Thank you!`;
    }

    const waUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    if (isDirectProduct && product) {
      fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerFullName,
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: fullAddress,
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          product_id: product.id.toString(),
          product_name: product.name,
          product_image: product.img,
          quantity: quantity,
          unit_price: product.price,
          subtotal: totalAmount,
        }),
      }).catch((err) => {
        console.error("Async order save error:", err);
      });
    } else {
      clearCart();
    }
  };

  const variantDetailsText = [
    selectedColorName || null,
    selectedSizeName || (product?.scale ? `${product.scale}` : "Regular (1:24)"),
  ]
    .filter(Boolean)
    .join(" / ");

  if (loading) {
    return <CheckoutSkeleton />;
  }

  // If no direct product and cart is empty
  if (!isDirectProduct && cart.length === 0) {
    return (
      <div className="bg-white text-zinc-900 min-h-screen flex flex-col items-center justify-center p-6 text-center font-pally">
        <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-3xl mb-4">
          🛍️
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">No Items to Checkout</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Please select a product or add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md no-underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-zinc-900 min-h-screen font-pally">
      {/* Top Header Bar */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base sm:text-xl font-black text-gray-900 tracking-tight leading-tight">
              Shipping & Address Details
            </h1>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5 hidden sm:block">
              Please enter your contact details and delivery address below.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl shrink-0"
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Form Section */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Information Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-3">
                {/* Mobile Phone Number (Mandatory) */}
                <div>
                  <div className="relative">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder="Mobile phone number *"
                      className={`w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border outline-none transition-all ${
                        errors.phone
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                    />
                    <div className="absolute right-3.5 top-4 text-gray-400" title="Used for order confirmation">
                      <HelpCircle size={17} />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>

                {/* Email Address (Optional) */}
                <div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="Email address (optional)"
                    className="w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 mb-4">
                Delivery Address
              </h2>

              <div className="space-y-4">
                {/* Country Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Country/Region
                  </label>
                  <div className="relative">
                    <select
                      value={form.country}
                      onChange={(e) => setField("country", e.target.value)}
                      className="w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none appearance-none cursor-pointer font-medium"
                    >
                      <option value="India">India</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      placeholder="First name *"
                      className={`w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border outline-none transition-all ${
                        errors.firstName
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      placeholder="Last name (optional)"
                      className="w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="relative">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="Address *"
                    className={`w-full bg-white text-gray-900 text-sm px-4 py-3.5 pr-10 rounded-xl border outline-none transition-all ${
                      errors.address
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  />
                  <Search size={16} className="absolute right-3.5 top-4 text-gray-400 pointer-events-none" />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>
                  )}
                </div>

                {/* Landmark */}
                <div>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) => setField("landmark", e.target.value)}
                    placeholder="Apartment, suite, landmark, etc. (optional)"
                    className="w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                {/* City, State, PIN code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="City"
                      className={`w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border outline-none transition-all ${
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
                      className="w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none appearance-none cursor-pointer font-medium"
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
                      className={`w-full bg-white text-gray-900 text-sm px-4 py-3.5 rounded-xl border outline-none transition-all ${
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

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-4 flex items-center gap-3">
                <Truck size={22} className="text-amber-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Free Shipping</h4>
                  <p className="text-[11px] text-gray-500">Fast delivery across India</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck size={22} className="text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">100% Authentic</h4>
                  <p className="text-[11px] text-gray-500">Direct WhatsApp order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-gray-50/80 border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 h-fit">
            <div className="space-y-6">
              <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200">
                Order Summary
              </h3>

              {/* Items List */}
              {isDirectProduct && product ? (
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs">
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
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-200/90 shadow-xs">
                      <div className="relative w-14 h-14 bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0 flex items-center justify-center">
                        <Image
                          src={item.product.img}
                          alt={item.product.name}
                          width={48}
                          height={48}
                          unoptimized
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {formatTitleCase(item.product.name)}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Qty: {item.quantity} × {item.product.priceStr}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-gray-900 shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price details */}
              <div className="space-y-3 text-xs sm:text-sm pt-2">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">
                    ₹{totalAmount.toLocaleString("en-IN")}
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
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Order via WhatsApp button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#25D366] hover:bg-[#20c05c] active:scale-[0.98] text-white font-pally font-extrabold text-sm sm:text-base tracking-wide py-4 px-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2.5 cursor-pointer mt-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              <span>Place Order via WhatsApp</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="bg-white text-zinc-900 min-h-screen font-pally animate-pulse">
      {/* Top Header Skeleton */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="w-48 h-5 bg-gray-200 rounded" />
            <div className="w-64 h-3 bg-gray-200 rounded hidden sm:block" />
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded-xl shrink-0" />
        </div>
      </header>

      {/* Main Container Skeleton */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Form Section Skeleton */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Section */}
            <div className="space-y-4">
              <div className="w-24 h-6 bg-gray-200 rounded-md" />
              <div className="space-y-3">
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
              </div>
            </div>

            {/* Delivery Section */}
            <div className="space-y-4">
              <div className="w-28 h-6 bg-gray-200 rounded-md" />
              <div className="space-y-4">
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="w-full h-12 bg-gray-200 rounded-xl" />
                  <div className="w-full h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="w-full h-12 bg-gray-200 rounded-xl" />
                  <div className="w-full h-12 bg-gray-200 rounded-xl" />
                  <div className="w-full h-12 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Trust Badges Skeleton */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-16 bg-gray-100 rounded-2xl" />
              <div className="h-16 bg-gray-100 rounded-2xl" />
            </div>
          </div>

          {/* Right Summary Column Skeleton */}
          <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 h-fit">
            <div className="w-36 h-5 bg-gray-200 rounded-md" />
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                <div className="w-1/2 h-3 bg-gray-200 rounded" />
              </div>
              <div className="w-16 h-5 bg-gray-200 rounded" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <div className="w-20 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-4 bg-gray-200 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="w-20 h-4 bg-gray-200 rounded" />
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <div className="w-16 h-6 bg-gray-200 rounded" />
                <div className="w-24 h-6 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="w-full h-14 bg-gray-200 rounded-xl mt-4" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}
