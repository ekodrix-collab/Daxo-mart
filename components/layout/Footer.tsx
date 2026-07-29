import Link from "next/link";

const COL1 = [
  { label: "1:32 Diecast",  path: "/products?category=1%3A32" },
  { label: "1:24 Diecast",  path: "/products?category=1%3A24" },
  { label: "1:18 Diecast",  path: "/products?category=1%3A18" },
  { label: "RC Toys",       path: "/products?category=RC" },
  { label: "3D Frames",     path: "/products?category=Frame" },
];
const COL2 = [
  { label: "Wishlist",        path: "/wishlist" },
  { label: "Return Policy",   path: "/returns" },
  { label: "Cart",            path: "/cart" },
];
const COL3 = [
  { label: "About Us",        path: "/about" },
  { label: "Contact",         path: "/contact" },
  { label: "Shipping Policy", path: "/shipping" },
  { label: "Privacy Policy",  path: "/privacy" },
  { label: "Terms of Use",    path: "/terms" },
];

function FooterLinks({ items }: { items: typeof COL1 }) {
  return (
    <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
      {items.map((item) => (
        <li key={item.path}>
          <Link href={item.path}
            className="text-[13px] text-muted hover:text-accent transition-colors
                       duration-150 no-underline">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-dark4 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-5 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-border">

          {/* Brand */}
          <div>
            <span className="block font-pally font-bold text-[20px] tracking-[0.12em] uppercase text-cream mb-4">
              DAXO<span className="text-accent">MART</span>
            </span>
            <p className="text-[13px] text-muted leading-relaxed mb-5">
              India's favourite destination for premium diecast scale models, RC toys, and collector display frames. Every model tells a story.
            </p>
            <div className="flex gap-3">
              {["IG", "FB", "YT", "X"].map((s) => (
                <a key={s} href="#"
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-dark3
                             border border-border text-muted text-[10px] font-bold
                             hover:bg-accent hover:text-dark hover:border-accent
                             transition-all duration-150 no-underline">
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
            <div className="mt-7">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream mb-2">Newsletter</p>
              <p className="text-[12px] text-muted mb-3 leading-relaxed">
                Subscribe for new arrivals and exclusive deals.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="footer-input flex-1 bg-dark3 border border-border border-r-0 text-cream
                             text-[13px] px-3.5 py-2.5 rounded-l-md placeholder:text-dim font-pally outline-none"
                />
                <button className="bg-accent hover:bg-accent-lt text-dark text-[12px] font-bold
                                   px-4 rounded-r-md border-none cursor-pointer font-pally
                                   transition-colors duration-200">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-[12px] text-dim">
          <p>© 2025 DAXOMART. All rights reserved.</p>
          <p>Crafted with care for collectors across India</p>
        </div>
      </div>
    </footer>
  );
}
