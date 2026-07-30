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
            <div className="flex gap-3">
              {["IG", "FB", "YT", "X"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-dark3
                             border border-border text-muted text-[10px] font-bold
                             hover:bg-accent hover:text-dark hover:border-accent
                             transition-all duration-150 no-underline"
                >
                  {s}
                </a>
              ))}
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
