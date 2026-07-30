"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const COL1 = [
  { label: "1:18", path: "/products?category=1%3A18" },
  { label: "1:24", path: "/products?category=1%3A24" },
  { label: "1:32", path: "/products?category=1%3A32" },
  { label: "1:64", path: "/products?category=1%3A64" },
  { label: "RC Toys", path: "/products?category=RC+Toys" },
  { label: "3D Frames", path: "/products?category=3D+Frames" },
];
const COL2 = [
  { label: "Wishlist", path: "/wishlist" },
  { label: "Return Policy", path: "/returns" },
  { label: "Cart", path: "/cart" },
];
const COL3 = [
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Shipping Policy", path: "/shipping" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Use", path: "/terms" },
];

function FooterLinks({ items }: { items: typeof COL1 }) {
  return (
    <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
      {items.map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            className="text-[13px] text-muted hover:text-accent transition-colors
                       duration-150 no-underline"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.message || "✓ Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Try again.");
      }
    } catch {
      setStatus("success");
      setMessage("✓ Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <div className="mt-7">
      <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream mb-2">Newsletter</p>
      <p className="text-[12px] text-muted mb-3 leading-relaxed">
        Subscribe for new arrivals and exclusive deals.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Your email address"
            disabled={status === "loading"}
            className={`footer-input flex-1 bg-dark3 border text-cream
                       text-[13px] px-3.5 py-2.5 rounded-l-md placeholder:text-dim font-pally outline-none transition-colors ${
                         status === "error" ? "border-red-500" : "border-border focus:border-accent"
                       }`}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-accent hover:bg-accent-lt text-dark text-[12px] font-bold
                       px-4 rounded-r-md border-none cursor-pointer font-pally
                       transition-colors duration-200 shrink-0 flex items-center justify-center min-w-[54px]"
          >
            {status === "loading" ? (
              <div className="w-3.5 h-3.5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              "Go"
            )}
          </button>
        </div>
        {message && (
          <p
            className={`text-[11.5px] font-bold font-pally mt-1.5 transition-all ${
              status === "success" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-dark4 border-t border-border" suppressHydrationWarning>
      <div className="max-w-[1280px] mx-auto px-5 py-16" suppressHydrationWarning>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-border">

          {/* Brand Logo & Bio */}
          <div suppressHydrationWarning>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/daxo-mart-new-logo.png"
                alt="DAXOMART"
                width={220}
                height={70}
                className="h-10 w-auto object-contain mix-blend-screen"
              />
            </Link>
            <p className="text-[13px] text-muted leading-relaxed mb-5">
              India's favourite destination for premium diecast scale models, RC toys, and collector display frames. Every model tells a story.
            </p>
            <div className="flex flex-col gap-2.5 mt-5">
              <a
                href="https://www.instagram.com/daxomart?igsh=cWxxNmp0aTdiMjEw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-[12.5px] font-bold font-pally shadow-md hover:opacity-95 transition-all hover:scale-[1.02] active:scale-[0.98] no-underline w-fit"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Follow us on Instagram</span>
              </a>

              <a
                href="https://chat.whatsapp.com/HKVLOFVzE19HxCbBh7J96t?s=cl&p=a&mlu=4&amv=2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1EBE5B] text-white text-[12.5px] font-bold font-pally shadow-md hover:opacity-95 transition-all hover:scale-[1.02] active:scale-[0.98] no-underline w-fit"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>Join WhatsApp Community</span>
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream mb-5">Our Collection</p>
            <FooterLinks items={COL1} />
          </div>

          {/* Customer */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream mb-5">Customer</p>
            <FooterLinks items={COL2} />
          </div>

          {/* Info + Newsletter */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream mb-5">Quick Info</p>
            <FooterLinks items={COL3} />
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-[12px] text-dim">
          <p>© {new Date().getFullYear()} DAXOMART. All rights reserved.</p>
          <p>Crafted with care for collectors across India</p>
        </div>
      </div>
    </footer>
  );
}
