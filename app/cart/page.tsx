"use client";

import { useCart } from "@/components/cart/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, Truck } from "lucide-react";

const WA_NUMBER = "919048571147";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Always scroll to top of page on mount when Cart page opens
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const setField = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter valid 10-digit mobile number";
    if (!form.address.trim()) e.address = "Full address is required";
    if (!form.landmark.trim()) e.landmark = "Landmark is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter valid 6-digit pincode";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = () => {
    if (!validate()) return;

    const firstItem = cart[0]?.product;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const orderNumber = `DXM-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsSummary = cart.map((i) => `• ${i.product.shortName} (Qty: ${i.quantity})`).join("\n");

    const waMessage = [
      `Hi DAXO-MART, I would like to place an order for my Cart!`,
      ``,
      `📦 *Order:* ${orderNumber}`,
      `🛒 *Items:*`,
      itemsSummary,
      `💰 *Total Amount:* ₹${totalAmount.toLocaleString("en-IN")}`,
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

    // 1. Immediately open WhatsApp without waiting for network API call
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`, "_blank");
    clearCart();

    // 2. Persist order asynchronously to database in background
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
        product_id: firstItem?.id.toString(),
        product_name: cart.map((i) => `${i.product.shortName} (Qty: ${i.quantity})`).join(", "),
        product_image: firstItem?.img,
        quantity: totalQty,
        unit_price: totalAmount,
        subtotal: totalAmount,
      }),
    }).catch((err) => {
      console.error("Async cart order save error:", err);
    });
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-800 text-3xl mb-4 shadow-sm">
          <ShoppingBag size={36} className="text-gray-700" />
        </div>
        <h2 className="text-[24px] font-black text-gray-900 font-pally mb-2">Your Cart is Empty</h2>
        <p className="text-[14px] text-gray-500 max-w-sm mb-6 font-pally">
          Explore our diecast scale models and RC toys to add items to your cart.
        </p>
        <Link
          href="/products"
          className="bg-[#0c0c0c] hover:bg-black text-white font-pally font-extrabold text-[13px] tracking-wider uppercase px-7 py-3.5 rounded-xl transition-all no-underline shadow-lg active:scale-95 flex items-center gap-2"
        >
          Explore Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-zinc-900 min-h-screen py-8 sm:py-14 font-pally">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">

        {/* Back Link & Header */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-4 no-underline"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
            <div>
              <h1 className="text-[26px] sm:text-[32px] font-black text-gray-900">Shopping Cart</h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"} selected
              </p>
            </div>
            <button
              onClick={clearCart}
              className="hidden sm:flex self-start sm:self-auto text-[12px] text-rose-600 hover:text-rose-700 font-extrabold uppercase tracking-wider bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs items-center gap-1.5"
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm hover:border-gray-300 transition-all"
              >
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0 p-1.5 flex items-center justify-center">
                  <Image
                    src={item.product.img}
                    alt={item.product.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Meta */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex justify-between items-start gap-2 w-full">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 sm:line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-700 mt-0.5">
                        {item.product.priceStr}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[12px] text-gray-400 hover:text-rose-600 font-bold transition-colors p-1 shrink-0"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity controls & Total item price */}
                  <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors font-bold cursor-pointer"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-gray-900 text-xs font-extrabold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors font-bold cursor-pointer"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <span className="text-base font-black text-gray-900">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust highlights banner */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 flex items-center gap-3">
                <Truck size={20} className="text-amber-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Free Express Delivery</h4>
                  <p className="text-[10px] text-gray-500">Pan-India fast shipping</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">100% Verified Quality</h4>
                  <p className="text-[10px] text-gray-500">Original diecast scale models</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-5 sm:p-6 h-fit shadow-sm">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4 pb-3 border-b border-gray-200">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs mb-4">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Shipping Fee</span>
                <span className="text-emerald-700 font-extrabold uppercase">FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-black text-gray-900 pt-3 border-t border-gray-200 mb-6">
              <span>Total Amount</span>
              <span className="text-gray-900">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>

            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-[#0c0c0c] hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-md cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>
            ) : (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <p className="text-[11px] font-extrabold text-gray-900 uppercase tracking-wider mb-2">
                  Shipping Address Details
                </p>

                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="w-full bg-white text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none placeholder:text-gray-400"
                  />
                  {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className="w-full bg-white text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none placeholder:text-gray-400"
                  />
                  {errors.phone && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Full Address *"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className="w-full bg-white text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none placeholder:text-gray-400"
                  />
                  {errors.address && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.address}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Landmark *"
                    value={form.landmark}
                    onChange={(e) => setField("landmark", e.target.value)}
                    className="w-full bg-white text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none placeholder:text-gray-400"
                  />
                  {errors.landmark && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.landmark}</p>}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="City *"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      className="w-full bg-white text-gray-900 text-xs px-2.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none placeholder:text-gray-400"
                    />
                    {errors.city && <p className="text-[9px] text-rose-500 font-bold mt-0.5">{errors.city}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State *"
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                      className="w-full bg-white text-gray-900 text-xs px-2.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none placeholder:text-gray-400"
                    />
                    {errors.state && <p className="text-[9px] text-rose-500 font-bold mt-0.5">{errors.state}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Pincode *"
                      value={form.pincode}
                      onChange={(e) => setField("pincode", e.target.value)}
                      className="w-full bg-white text-gray-900 text-xs px-2.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none placeholder:text-gray-400"
                    />
                    {errors.pincode && <p className="text-[9px] text-rose-500 font-bold mt-0.5">{errors.pincode}</p>}
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-[#25D366] hover:bg-[#20c05c] text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4 active:scale-[0.99]"
                >
                  {loading ? "Processing..." : "Place Order via WhatsApp"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
