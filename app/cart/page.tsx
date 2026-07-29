"use client";

import { useCart } from "@/components/cart/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const WA_NUMBER = "919048571147";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

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
      `👤 *Name:* ${form.name.trim()}`,
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
        full_address: form.address.trim(),
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
      <div className="bg-dark min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-dark2 border border-border rounded-full flex items-center justify-center text-accent text-3xl mb-4">
          🛒
        </div>
        <h2 className="text-[24px] font-bold text-cream font-pally mb-2">Your Cart is Empty</h2>
        <p className="text-[14px] text-muted max-w-sm mb-6">
          Explore our diecast scale models and RC toys to add items to your cart.
        </p>
        <Link
          href="/products"
          className="bg-accent hover:bg-accent-lt text-dark font-pally font-bold text-[14px] tracking-wider uppercase px-6 py-3 rounded-xl transition-all no-underline shadow-md"
        >
          Explore Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen py-10 sm:py-14">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-8">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-extrabold text-cream font-pally">Shopping Cart</h1>
            <p className="text-[13px] text-muted mt-1">{cart.length} unique item(s) in cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-[12px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-pally"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-dark2 border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 p-1">
                  <Image
                    src={item.product.img}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-cream truncate font-pally">
                    {item.product.name}
                  </h3>
                  <p className="text-[12px] text-accent font-semibold mt-0.5">
                    {item.product.priceStr}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-dark border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-cream hover:bg-dark3 transition-colors font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-cream text-[13px] font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-cream hover:bg-dark3 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[11px] text-dim hover:text-red-400 font-semibold transition-colors ml-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[16px] font-extrabold text-cream font-pally">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary & Order Checkout */}
          <div className="bg-dark2 border border-border rounded-2xl p-6 h-fit shadow-xl">
            <h3 className="text-[16px] font-bold text-cream font-pally uppercase tracking-wider mb-4 pb-3 border-b border-border">
              Order Summary
            </h3>

            <div className="space-y-2 text-[13px] mb-4">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-cream font-semibold">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping Fee</span>
                <span className="text-green font-semibold">FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[18px] font-extrabold text-cream pt-3 border-t border-border mb-6 font-pally">
              <span>Total Amount</span>
              <span className="text-accent">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>

            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-accent hover:bg-accent-lt text-dark font-pally font-extrabold text-[14px] tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Proceed to Checkout →
              </button>
            ) : (
              <div className="space-y-3 pt-2 border-t border-border">
                <p className="text-[11px] font-bold text-accent uppercase tracking-wider">Shipping Details</p>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="w-full bg-dark text-cream text-[12px] px-3 py-2 rounded-lg border border-border focus:border-accent outline-none font-pally"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className="w-full bg-dark text-cream text-[12px] px-3 py-2 rounded-lg border border-border focus:border-accent outline-none font-pally"
                />
                <input
                  type="text"
                  placeholder="Full Address *"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  className="w-full bg-dark text-cream text-[12px] px-3 py-2 rounded-lg border border-border focus:border-accent outline-none font-pally"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City *"
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className="w-full bg-dark text-cream text-[12px] px-2 py-2 rounded-lg border border-border focus:border-accent outline-none font-pally"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={form.state}
                    onChange={(e) => setField("state", e.target.value)}
                    className="w-full bg-dark text-cream text-[12px] px-2 py-2 rounded-lg border border-border focus:border-accent outline-none font-pally"
                  />
                  <input
                    type="tel"
                    placeholder="Pincode *"
                    value={form.pincode}
                    onChange={(e) => setField("pincode", e.target.value)}
                    className="w-full bg-dark text-cream text-[12px] px-2 py-2 rounded-lg border border-border focus:border-accent outline-none font-pally"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-[#25D366] hover:bg-[#20c05c] text-white font-pally font-extrabold text-[14px] tracking-wide py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3"
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
