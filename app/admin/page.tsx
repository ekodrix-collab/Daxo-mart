"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { supabase, OrderStatus } from "@/lib/supabase";
import DashboardTab from "./components/DashboardTab";
import OrdersTab, { type Order } from "./components/OrdersTab";
import ProductsTab from "./components/ProductsTab";
import CategoriesTab from "./components/CategoriesTab";
import CustomersTab from "./components/CustomersTab";
import SettingsTab from "./components/SettingsTab";

const SEED_ORDERS: Order[] = [
  {
    id: "ord-001",
    order_number: "DXM-100001",
    productId: 1,
    productName: "Range Rover Pearl White 1:24",
    price: 1299,
    qty: 2,
    total: 2598,
    customer: "Ravi Kumar",
    phone: "9876543210",
    email: "ravi@example.com",
    address: "12, MG Road, Near Apollo Hospital",
    city: "Kochi",
    state: "Kerala",
    pincode: "682001",
    status: "Confirmed",
    createdAt: "2025-07-25T09:30:00",
  },
  {
    id: "ord-002",
    order_number: "DXM-100002",
    productId: 9,
    productName: "RC Racing Set Red & Blue",
    price: 799,
    qty: 1,
    total: 799,
    customer: "Priya Sharma",
    phone: "9123456780",
    email: "priya@example.com",
    address: "45, Sector 18",
    city: "Noida",
    state: "UP",
    pincode: "201301",
    status: "Shipped",
    createdAt: "2025-07-26T14:00:00",
  },
  {
    id: "ord-003",
    order_number: "DXM-100003",
    productId: 5,
    productName: "Ford F-150 Raptor 1:18",
    price: 2499,
    qty: 1,
    total: 2499,
    customer: "Arjun Mehta",
    phone: "9988776655",
    address: "7/B, Linking Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400054",
    status: "New",
    createdAt: "2025-07-28T10:15:00",
  },
];

type TabType = "dashboard" | "orders" | "products" | "categories" | "customers" | "settings";

function SideItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[13.5px] font-medium tracking-wide transition-all duration-200 text-left group cursor-pointer ${
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
      {active && <ChevronRight size={14} className="text-[#C5A059]/70" />}
    </button>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [email, setEmail] = useState("admin@daxomart.com");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabType>("dashboard");
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Fetch orders from Supabase DB or Fallback Seed
  const fetchOrders = async () => {
    try {
      let dbOrders = null;
      let error = null;

      // Try with joined items first
      const res1 = await supabase
        .from("orders")
        .select(`*, order_items (*)`)
        .order("created_at", { ascending: false });

      if (res1.error) {
        // Fallback to simple orders select
        const res2 = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        dbOrders = res2.data;
        error = res2.error;
      } else {
        dbOrders = res1.data;
      }

      if (dbOrders && dbOrders.length > 0 && !error) {
        const mappedOrders: Order[] = dbOrders.map((o: any) => {
          const item = o.order_items?.[0];
          return {
            id: o.id,
            order_number: o.order_number || `DXM-${o.id.slice(0, 6)}`,
            productName: item?.product_name || o.product_name || "Custom Order Item",
            productImage: item?.product_image || o.product_image,
            price: item?.unit_price || o.total_amount || o.subtotal || o.total || 0,
            qty: item?.quantity || 1,
            total: o.total_amount || o.subtotal || o.total || 0,
            customer: o.customer_name || "Customer",
            phone: o.customer_phone || "",
            email: o.customer_email,
            address: o.shipping_address || "",
            city: o.city || "",
            state: o.state || "",
            pincode: o.pincode || o.postal_code || "",
            notes: o.notes,
            status: (o.status as OrderStatus) || "New",
            createdAt: o.created_at || new Date().toISOString(),
          };
        });
        setOrders(mappedOrders);
      }
    } catch (e) {
      console.warn("Failed to fetch live orders from Supabase:", e);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === "admin@daxomart.com") {
        setAuthed(true);
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

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

    try {
      await supabase.from("orders").update({ status }).eq("id", id);
    } catch (e) {
      console.warn("Failed to sync order status update with DB:", e);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));

    try {
      await supabase.from("orders").delete().eq("id", id);
    } catch (e) {
      console.warn("Failed to sync order deletion with DB:", e);
    }
  };

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

  const tabTitles: Record<TabType, string> = {
    dashboard: "Overview & Analytics",
    orders: "Order Management",
    products: "Product Catalog",
    categories: "Categories & Collections",
    customers: "Customer CRM",
    settings: "System Settings",
  };

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
            <p className="text-gray-400 text-[13px] font-medium">
              Enterprise Admin Portal
            </p>
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
              className="w-full bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.99] text-black font-bold text-[13px] tracking-[0.08em] uppercase py-3.5 rounded-2xl transition-all duration-200 mt-6 disabled:opacity-50 shadow-lg shadow-[#C5A059]/10"
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
        {/* Exact Store Navbar Logo Integration */}
        <div className="p-5 border-b border-[#1E1E22] flex items-center justify-between">
          <Link href="/" className="no-underline flex items-center">
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
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">
            Main Menu
          </p>
          <SideItem
            label="Dashboard"
            icon={LayoutDashboard}
            active={tab === "dashboard"}
            onClick={() => {
              setTab("dashboard");
              setMobileNavOpen(false);
            }}
          />
          <SideItem
            label="Orders"
            icon={ShoppingCart}
            active={tab === "orders"}
            onClick={() => {
              setTab("orders");
              setMobileNavOpen(false);
            }}
          />
          <SideItem
            label="Products"
            icon={Package}
            active={tab === "products"}
            onClick={() => {
              setTab("products");
              setMobileNavOpen(false);
            }}
          />
          <SideItem
            label="Categories"
            icon={Grid}
            active={tab === "categories"}
            onClick={() => {
              setTab("categories");
              setMobileNavOpen(false);
            }}
          />
          <SideItem
            label="Customers"
            icon={Users}
            active={tab === "customers"}
            onClick={() => {
              setTab("customers");
              setMobileNavOpen(false);
            }}
          />
          <SideItem
            label="Settings"
            icon={Settings}
            active={tab === "settings"}
            onClick={() => {
              setTab("settings");
              setMobileNavOpen(false);
            }}
          />
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
              className="lg:hidden text-gray-300 hover:text-white p-1.5 rounded-lg bg-gray-800"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
                <span>Admin</span>
                <ChevronRight size={12} />
                <span className="text-[#C5A059] font-semibold capitalize">{tab}</span>
              </div>
              <h1 className="text-[19px] font-bold text-white tracking-wide font-pally mt-0.5">
                {tabTitles[tab]}
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
              onClick={() => setTab("orders")}
              className="relative p-2.5 rounded-xl bg-[#17171A] border border-[#26262A] text-gray-300 hover:text-white hover:border-[#C5A059] transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#C5A059] rounded-full ring-2 ring-[#0F0F12]" />
            </button>

            {tab === "products" && (
              <button
                onClick={() => {}}
                className="hidden sm:flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[12px] tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Plus size={16} /> Add Product
              </button>
            )}
          </div>
        </header>

        {/* Dark Content Canvas - #0B0B0C */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {tab === "dashboard" && (
            <DashboardTab
              orders={orders as any}
              onNavigateToOrders={() => setTab("orders")}
              onNavigateToProducts={() => setTab("products")}
            />
          )}
          {tab === "orders" && (
            <OrdersTab
              orders={orders}
              onUpdateStatus={updateStatus}
              onDeleteOrder={deleteOrder}
            />
          )}
          {tab === "products" && <ProductsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "customers" && (
            <CustomersTab orders={orders} onUpdateOrderStatus={updateStatus} />
          )}
          {tab === "settings" && (
            <SettingsTab onSignOut={() => setAuthed(false)} />
          )}
        </main>
      </div>
    </div>
  );
}
