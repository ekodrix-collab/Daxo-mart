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

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/daxomart?igsh=cWxxNmp0aTdiMjEw",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "whatsapp",
    href: "https://chat.whatsapp.com/HKVLOFVzE19HxCbBh7J96t?s=cl&p=a&mlu=4&amv=2",
    icon: (
      <svg
        className="w-3.5 h-3.5 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.39 0 .02 5.37.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62A11.95 11.95 0 0 0 12.02 24C18.65 24 24 18.63 24 12c0-3.2-1.25-6.22-3.48-8.52zM12.02 21.82a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.67.96.98-3.58-.23-.37a9.8 9.8 0 1 1 8.27 4.57zm5.38-7.35c-.29-.15-1.71-.84-1.98-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.07-.29-.15-1.2-.44-2.29-1.42-.85-.76-1.43-1.7-1.6-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.54-.88-2.1-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-.98 2.43.02 1.43 1.03 2.8 1.18 2.99.15.19 2.02 3.08 4.9 4.32.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.71-.7 1.95-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z" />
      </svg>
    ),
  },
];

function FooterLinks({ items }: { items: typeof COL1 }) {
  return (
    <ul className="flex flex-col gap-2.5 list-none p-0 m-0 pb-2 sm:pb-0">
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
    <div>
      <p className="text-[12px] text-muted mb-3 leading-relaxed">
        Subscribe for new arrivals and exclusive deals.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2 pb-2 sm:pb-0">
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
                       text-[13px] px-3.5 py-2.5 rounded-l-md placeholder:text-dim font-pally outline-none transition-colors ${status === "error" ? "border-red-500" : "border-border focus:border-accent"
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
            className={`text-[11.5px] font-bold font-pally mt-1.5 transition-all ${status === "success" ? "text-emerald-400" : "text-red-400"
              }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

function FooterAccordionSection({
  title,
  children,
  defaultOpen = false,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-border/60 sm:border-none py-3.5 sm:py-0 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left sm:cursor-default sm:pointer-events-none focus:outline-none group sm:mb-5"
        aria-expanded={isOpen}
      >
        <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream group-hover:text-accent sm:group-hover:text-cream transition-colors">
          {title}
        </span>
        <span
          className={`sm:hidden text-muted transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : ""
            }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen
            ? "max-h-[500px] opacity-100 mt-3 sm:mt-0"
            : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100 sm:mt-0"
          }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-dark4 border-t border-border" suppressHydrationWarning>
      <div className="max-w-[1280px] mx-auto px-5 py-12 sm:py-16" suppressHydrationWarning>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-12 pb-8 sm:pb-12 border-b border-border">

          {/* Brand Logo & Bio */}
          <div className="border-b border-border/60 sm:border-none pb-6 sm:pb-0 mb-4 sm:mb-0" suppressHydrationWarning>
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
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-dark3
                             border border-border text-muted
                             hover:bg-accent hover:text-dark hover:border-accent
                             transition-all duration-150 no-underline"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <FooterAccordionSection title="Our Collection">
            <FooterLinks items={COL1} />
          </FooterAccordionSection>

          {/* Customer */}
          <FooterAccordionSection title="Customer">
            <FooterLinks items={COL2} />
          </FooterAccordionSection>

          {/* Info + Newsletter */}
          <div>
            <FooterAccordionSection title="Quick Info">
              <FooterLinks items={COL3} />
            </FooterAccordionSection>

            <div className="pt-4 sm:pt-0 mt-3 sm:mt-7">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream mb-3">Newsletter</p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-2 sm:gap-3 pt-6 text-[12px] text-dim">
          <p>© {new Date().getFullYear()} DAXOMART. All rights reserved.</p>
          <p>
            Crafted by{" "}
            <a
              href="https://ekodrix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent font-semibold transition-colors no-underline"
            >
              Ekodrix
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
