"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Grid,
  Users,
  Settings,
  ArrowLeft,
  Search,
  Bell,
  Plus,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Award,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminQueryProvider from "./components/QueryProvider";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Grid },
  { label: "Brands", href: "/admin/brands", icon: Award },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function playOrderNotificationChime() {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1760, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.12);

    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.warn("Audio chime error:", err);
  }
}

function SideItem({
  label,
  href,
  icon: Icon,
  active,
  badgeCount,
  onClick,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
  badgeCount?: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[13.5px] font-medium tracking-wide transition-all duration-200 text-left group cursor-pointer no-underline ${
        active
          ? "bg-[#1C1C20] text-white font-semibold border border-white/10 shadow-sm"
          : "text-gray-400 hover:bg-[#141416] hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center">
          {active && (
            <span className="absolute -left-3.5 w-1 h-5 bg-[#C5A059] rounded-r-full shadow-[0_0_8px_#C5A059]" />
          )}
          <Icon
            size={20}
            className={`transition-colors ${
              active ? "text-[#C5A059]" : "text-gray-400 group-hover:text-white"
            }`}
          />
        </div>
        <span>{label}</span>
      </div>
      {badgeCount && badgeCount > 0 ? (
        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-[0_0_10px_rgba(220,38,38,0.8)]">
          {badgeCount}
        </span>
      ) : active ? (
        <ChevronRight size={14} className="text-[#C5A059]/70" />
      ) : null}
    </Link>
  );
}

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [email, setEmail] = useState("admin@daxomart.com");
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [newOrdersCount, setNewOrdersCount] = useState<number>(0);
  const [latestOrderToast, setLatestOrderToast] = useState<{
    orderNumber: string;
    customerName: string;
    amount: number;
  } | null>(null);

  // Realtime Supabase Orders WebSocket & Fast Polling
  useEffect(() => {
    if (!authed) return;

    // 1. Subscribe to Supabase Realtime WebSocket
    const channel = supabase
      .channel("realtime-orders-admin-global")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload: any) => {
          const newOrd = payload.new;
          if (newOrd) {
            setNewOrdersCount((prev) => prev + 1);
            playOrderNotificationChime();
            setLatestOrderToast({
              orderNumber: newOrd.order_number || `#DXM-${newOrd.id}`,
              customerName: newOrd.customer_name || "New Customer",
              amount: Number(newOrd.total_amount || 0),
            });
            setTimeout(() => setLatestOrderToast(null), 9000);
          }
        }
      )
      .subscribe();

    // 2. Initial count check
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "New")
      .then(({ count }) => {
        if (count !== null) setNewOrdersCount(count);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authed]);

  // Clear notification count badge when admin opens /admin/orders
  useEffect(() => {
    if (pathname.startsWith("/admin/orders")) {
      setNewOrdersCount(0);
    }
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === "admin@daxomart.com") {
        setAuthed(true);
      } else {
        setAuthed(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === "admin@daxomart.com") {
        setAuthed(true);
      } else {
        setAuthed(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    setLoading(true);
    setPwErr("");

    if (email.trim().toLowerCase() !== "admin@daxomart.com") {
      setPwErr("Access denied: Only authorized admin email can log in.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pw,
      });

      if (error) {
        setPwErr(error.message);
      } else if (data?.user?.email === "admin@daxomart.com") {
        setAuthed(true);
      } else {
        setPwErr("Unauthorized admin role.");
      }
    } catch {
      setPwErr("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Derive breadcrumb / section title
  const getHeaderTitle = () => {
    if (pathname.startsWith("/admin/products/new")) return "Create New Product";
    if (pathname.match(/\/admin\/products\/[^/]+\/edit/)) return "Edit Product";
    if (pathname.startsWith("/admin/products")) return "Product Catalog";
    if (pathname.match(/\/admin\/orders\/[^/]+/)) return "Order Details";
    if (pathname.startsWith("/admin/orders")) return "Order Management";
    if (pathname.startsWith("/admin/categories")) return "Categories & Collections";
    if (pathname.startsWith("/admin/customers")) return "Customer CRM";
    if (pathname.startsWith("/admin/settings")) return "System Settings";
    return "Overview & Analytics";
  };

  const getSectionName = () => {
    if (pathname.startsWith("/admin/products")) return "Products";
    if (pathname.startsWith("/admin/orders")) return "Orders";
    if (pathname.startsWith("/admin/categories")) return "Categories";
    if (pathname.startsWith("/admin/customers")) return "Customers";
    if (pathname.startsWith("/admin/settings")) return "Settings";
    return "Dashboard";
  };

  // Show dark loading spinner until auth status resolved
  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center text-[#C5A059] font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 tracking-wider">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────── LOGIN SCREEN ─────────── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#141416] border border-gray-800 text-[#C5A059] mb-4 shadow-xl">
              <ShieldCheck size={28} />
            </div>
            <div className="flex justify-center mb-2">
              <Image
                src="/images/daxo-mart-new-logo-transparent.png"
                alt="DAXOMART"
                width={260}
                height={80}
                className="h-16 w-auto object-contain mix-blend-screen"
                priority
              />
            </div>
            <p className="text-gray-400 text-[13px] font-medium">Enterprise Admin Portal</p>
          </div>

          <div className="bg-[#121214] border border-[#222226] rounded-[20px] p-8 shadow-2xl backdrop-blur-md">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#C5A059] mb-6">
              Authorized Authentication
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setPwErr("");
                  }}
                  placeholder="admin@daxomart.com"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Security Key / Password
                </label>
                <input
                  type="password"
                  value={pw}
                  onChange={(e) => {
                    setPw(e.target.value);
                    setPwErr("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                  placeholder="Enter admin password"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            {pwErr && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[13px]">
                {pwErr}
              </div>
            )}

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.99] text-black font-bold text-[13px] tracking-[0.08em] uppercase py-3.5 rounded-2xl transition-all duration-200 mt-6 disabled:opacity-50 shadow-lg shadow-[#C5A059]/10 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Access Control Panel"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────── MAIN LAYOUT ────────────── */
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex text-white font-sans antialiased">
      {/* Full Dark Luxury Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-64 bg-[#070708] border-r border-[#1E1E22] flex flex-col shrink-0 transition-transform duration-300 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Navbar Logo */}
        <div className="p-5 border-b border-[#1E1E22] flex items-center justify-between">
          <Link href="/admin/dashboard" className="no-underline flex items-center">
            <Image
              src="/images/daxo-mart-new-logo-transparent.png"
              alt="DAXOMART"
              width={220}
              height={65}
              className="h-12 w-auto object-contain mix-blend-screen scale-110 origin-left cursor-pointer"
              priority
            />
          </Link>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">
            Main Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin" || pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <SideItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                active={isActive}
                badgeCount={item.label === "Orders" ? newOrdersCount : undefined}
                onClick={() => setMobileNavOpen(false)}
              />
            );
          })}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-[#1E1E22] bg-[#0D0D0F]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#9E7B35] flex items-center justify-center text-black font-bold text-[13px] shrink-0 shadow-md">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">
                Store Administrator
              </p>
              <p className="text-[11px] text-gray-400 truncate">admin@daxomart.com</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-[12px] font-medium text-gray-400 hover:text-[#C5A059] transition-colors no-underline flex items-center justify-between pt-2.5 border-t border-gray-800/80"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={14} /> Exit to Storefront
            </span>
            <ExternalLink size={12} className="opacity-60" />
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Luxury Top Header - #0F0F12 */}
        <header className="sticky top-0 z-30 bg-[#0F0F12] text-white border-b border-[#1E1E22] px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden text-gray-300 hover:text-white p-1.5 rounded-lg bg-gray-800 cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
                <span>Admin</span>
                <ChevronRight size={12} />
                <span className="text-[#C5A059] font-semibold capitalize">
                  {getSectionName()}
                </span>
              </div>
              <h1 className="text-[19px] font-bold text-white tracking-wide font-pally mt-0.5">
                {getHeaderTitle()}
              </h1>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#17171A] border border-[#26262A] rounded-xl px-3.5 py-2 text-gray-300 text-[13px] w-64 focus-within:border-[#C5A059] transition-all">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search orders, products..."
                className="bg-transparent border-none outline-none text-white text-[13px] w-full placeholder:text-gray-500"
              />
            </div>

            <button
              onClick={() => {
                setNewOrdersCount(0);
                router.push("/admin/orders");
              }}
              className="relative p-2.5 rounded-xl bg-[#17171A] border border-[#26262A] text-gray-300 hover:text-white hover:border-[#C5A059] transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              {newOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {newOrdersCount}
                </span>
              )}
            </button>

            {pathname === "/admin/products" && (
              <button
                onClick={() => router.push("/admin/products/new")}
                className="hidden sm:flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[12px] tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Plus size={16} /> Add Product
              </button>
            )}
          </div>
        </header>

        {/* REALTIME NEW ORDER FLOATING TOAST NOTIFICATION */}
        {latestOrderToast && (
          <div
            onClick={() => {
              router.push("/admin/orders");
              setLatestOrderToast(null);
            }}
            className="fixed top-5 right-5 z-50 bg-[#121215] border-2 border-emerald-500 text-white p-4 rounded-2xl shadow-[0_12px_40px_rgba(34,197,94,0.3)] backdrop-blur-xl flex items-center gap-4 cursor-pointer animate-in fade-in slide-in-from-top-5 duration-300 max-w-sm w-full"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 animate-pulse">
              <ShoppingCart size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400">
                  🚨 NEW LIVE ORDER!
                </span>
                <span className="text-[11px] font-mono text-gray-400">{latestOrderToast.orderNumber}</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">{latestOrderToast.customerName}</h4>
              <p className="text-xs text-[#C5A059] font-extrabold mt-0.5">
                ₹{latestOrderToast.amount.toLocaleString("en-IN")} • Tap to view
              </p>
            </div>
          </div>
        )}

        {/* Dark Content Canvas - #0B0B0C */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

import { ToastProvider } from "@/components/ToastProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminQueryProvider>
        <AdminShellContent>{children}</AdminShellContent>
      </AdminQueryProvider>
    </ToastProvider>
  );
}
