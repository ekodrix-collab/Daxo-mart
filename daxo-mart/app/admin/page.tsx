"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PRODUCTS, { type Product } from "@/lib/products";

/* ─── Types ───────────────────────────────────────────────────────── */
interface Order {
  id: string;
  productId: number;
  productName: string;
  price: number;
  qty: number;
  total: number;
  customer: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

const ADMIN_PASSWORD = "daxomart2025";
const STORAGE_KEY_ORDERS = "dm_orders";
const STORAGE_KEY_PRODUCTS = "dm_products";

/* ─── Seed orders for demo ─────────────────────────────────────────── */
const SEED_ORDERS: Order[] = [
  {
    id: "ORD-001",
    productId: 1,
    productName: "Range Rover Pearl White 1:24",
    price: 1299,
    qty: 2,
    total: 2598,
    customer: "Ravi Kumar",
    phone: "9876543210",
    address: "12, MG Road, Near Apollo Hospital",
    city: "Kochi",
    state: "Kerala",
    pincode: "682001",
    status: "Confirmed",
    createdAt: "2025-07-25T09:30:00",
  },
  {
    id: "ORD-002",
    productId: 9,
    productName: "RC Racing Set Red & Blue",
    price: 799,
    qty: 1,
    total: 799,
    customer: "Priya Sharma",
    phone: "9123456780",
    address: "45, Sector 18",
    city: "Noida",
    state: "UP",
    pincode: "201301",
    status: "Shipped",
    createdAt: "2025-07-26T14:00:00",
  },
  {
    id: "ORD-003",
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
    status: "Pending",
    createdAt: "2025-07-28T10:15:00",
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────── */
const STATUS_COLORS: Record<Order["status"], string> = {
  Pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Shipped:   "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Delivered: "bg-green/15 text-green border-green/30",
  Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ─── Sidebar item ────────────────────────────────────────────────── */
function SideItem({
  label, icon, active, onClick,
}: {
  label: string; icon: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-semibold
                  tracking-wide transition-all duration-150 text-left
                  ${active
                    ? "bg-accent text-dark"
                    : "text-muted hover:bg-dark3 hover:text-cream"}`}
    >
      <span className="text-[18px]">{icon}</span>
      {label}
    </button>
  );
}

/* ─── Stat card ───────────────────────────────────────────────────── */
function Stat({ label, value, sub, color }: {
  label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="bg-dark2 border border-border rounded-xl p-5">
      <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted mb-1">{label}</p>
      <p className={`text-[28px] font-bold ${color}`}>{value}</p>
      <p className="text-[12px] text-dim mt-1">{sub}</p>
    </div>
  );
}

/* ─── Main Admin App ──────────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [tab, setTab] = useState<"dashboard" | "orders" | "products" | "settings">("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orderFilter, setOrderFilter] = useState<string>("All");
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({ status: "Pending", qty: 1 });
  const [search, setSearch] = useState("");

  /* load from localStorage */
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("dm_admin_auth");
    if (storedAuth === "1") setAuthed(true);

    const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
    setOrders(storedOrders ? JSON.parse(storedOrders) : SEED_ORDERS);
  }, []);

  const saveOrders = (o: Order[]) => {
    setOrders(o);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(o));
  };

  /* ── Login ── */
  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("dm_admin_auth", "1");
    } else {
      setPwErr("Incorrect password. Try again.");
    }
  };

  /* ── Derived stats ── */
  const totalRevenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const filteredOrders = orders
    .filter((o) => orderFilter === "All" || o.status === orderFilter)
    .filter((o) => !search || o.customer.toLowerCase().includes(search.toLowerCase())
      || o.id.toLowerCase().includes(search.toLowerCase()));

  /* ── Order status update ── */
  const updateStatus = (id: string, status: Order["status"]) => {
    saveOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  /* ── Delete order ── */
  const deleteOrder = (id: string) => {
    if (confirm("Delete this order?")) saveOrders(orders.filter((o) => o.id !== id));
  };

  /* ── Add order ── */
  const addOrder = () => {
    if (!newOrder.customer || !newOrder.productId) return;
    const prod = products.find((p) => p.id === newOrder.productId);
    const o: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      productId: newOrder.productId!,
      productName: prod?.shortName ?? "Unknown",
      price: prod?.price ?? 0,
      qty: newOrder.qty ?? 1,
      total: (prod?.price ?? 0) * (newOrder.qty ?? 1),
      customer: newOrder.customer ?? "",
      phone: newOrder.phone ?? "",
      address: newOrder.address ?? "",
      city: newOrder.city ?? "",
      state: newOrder.state ?? "",
      pincode: newOrder.pincode ?? "",
      status: (newOrder.status as Order["status"]) ?? "Pending",
      createdAt: new Date().toISOString(),
    };
    saveOrders([o, ...orders]);
    setShowAddOrder(false);
    setNewOrder({ status: "Pending", qty: 1 });
  };

  /* ──────────────────────────────── LOGIN SCREEN ─────────── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-cream font-pally">
              DAXO<span className="text-accent">MART</span>
            </h1>
            <p className="text-muted text-[13px] mt-1">Admin Panel</p>
          </div>
          <div className="bg-dark2 border border-border rounded-2xl p-8">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">
              Sign in to continue
            </p>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setPwErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Admin password"
              className="w-full bg-dark3 border border-border text-cream text-[14px] font-pally
                         px-4 py-3 rounded-lg outline-none focus:border-accent transition-colors
                         placeholder:text-dim mb-2"
            />
            {pwErr && <p className="text-red-400 text-[12px] mb-3">{pwErr}</p>}
            <button
              onClick={login}
              className="w-full bg-accent hover:bg-accent-lt text-dark font-bold text-[13px]
                         tracking-[0.1em] uppercase py-3 rounded-lg transition-all duration-150 font-pally mt-2"
            >
              Login
            </button>
          </div>
          <p className="text-center text-[11px] text-dim mt-4">
            Default password: <span className="text-muted">daxomart2025</span>
          </p>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────── DASHBOARD CONTENT ─────── */
  const DashboardTab = () => (
    <div>
      <h2 className="text-[20px] font-bold text-cream mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Revenue" value={fmtINR(totalRevenue)} sub={`${orders.filter(o=>o.status!=="Cancelled").length} orders`} color="text-accent" />
        <Stat label="Total Orders"  value={String(orders.length)} sub="All time" color="text-cream" />
        <Stat label="Pending"       value={String(pendingCount)} sub="Awaiting confirmation" color="text-yellow-400" />
        <Stat label="Delivered"     value={String(deliveredCount)} sub="Successfully shipped" color="text-green" />
      </div>

      {/* Recent orders */}
      <h3 className="text-[15px] font-bold text-cream mb-3">Recent Orders</h3>
      <div className="bg-dark2 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark3 border-b border-border">
            <tr>
              {["Order ID", "Customer", "Product", "Total", "Status", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] font-bold tracking-wider uppercase text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id} className="border-b border-border hover:bg-dark3 transition-colors">
                <td className="px-4 py-3 text-[12px] font-semibold text-accent">{o.id}</td>
                <td className="px-4 py-3 text-[13px] text-cream">{o.customer}</td>
                <td className="px-4 py-3 text-[12px] text-muted max-w-[180px] truncate">{o.productName}</td>
                <td className="px-4 py-3 text-[13px] font-bold text-cream">{fmtINR(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded border ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted">{fmtDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products overview */}
      <h3 className="text-[15px] font-bold text-cream mt-8 mb-3">Product Inventory</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["1:24","1:18","RC","Frame"] as Product["category"][]).map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          return (
            <div key={cat} className="bg-dark2 border border-border rounded-xl p-4 text-center">
              <p className="text-[24px] font-bold text-cream">{count}</p>
              <p className="text-[11px] font-bold tracking-wider uppercase text-muted mt-1">
                {cat === "Frame" ? "3D Frames" : cat + " Scale"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ──────────────────────────────── ORDERS TAB ─────────────── */
  const OrdersTab = () => (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-[20px] font-bold text-cream">Orders</h2>
        <button
          onClick={() => setShowAddOrder(true)}
          className="bg-accent hover:bg-accent-lt text-dark text-[12px] font-bold tracking-wider
                     uppercase px-5 py-2.5 rounded-lg transition-colors font-pally"
        >
          + Add Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-dark3 border border-border text-cream text-[13px] px-4 py-2 rounded-lg
                     outline-none focus:border-accent transition-colors font-pally placeholder:text-dim flex-1 min-w-[160px]"
        />
        {["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setOrderFilter(f)}
            className={`px-3 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-colors
                        ${orderFilter === f ? "bg-accent text-dark" : "bg-dark3 text-muted hover:text-cream border border-border"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-dark2 border border-border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead className="bg-dark3 border-b border-border">
            <tr>
              {["ID", "Customer", "Product", "Qty", "Total", "City", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="px-3 py-3 text-[10px] font-bold tracking-wider uppercase text-muted whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-muted text-[13px]">No orders found.</td>
              </tr>
            )}
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-b border-border hover:bg-dark3 transition-colors">
                <td className="px-3 py-3 text-[12px] font-semibold text-accent whitespace-nowrap">{o.id}</td>
                <td className="px-3 py-3">
                  <p className="text-[13px] text-cream font-semibold">{o.customer}</p>
                  <p className="text-[11px] text-dim">{o.phone}</p>
                </td>
                <td className="px-3 py-3 text-[12px] text-muted max-w-[140px] truncate">{o.productName}</td>
                <td className="px-3 py-3 text-[13px] text-cream font-bold">{o.qty}</td>
                <td className="px-3 py-3 text-[13px] font-bold text-cream whitespace-nowrap">{fmtINR(o.total)}</td>
                <td className="px-3 py-3 text-[12px] text-muted">{o.city}</td>
                <td className="px-3 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as Order["status"])}
                    className="bg-dark3 border border-border text-cream text-[11px] font-bold
                               tracking-wide uppercase px-2 py-1.5 rounded outline-none
                               focus:border-accent transition-colors cursor-pointer font-pally"
                  >
                    {(["Pending","Confirmed","Shipped","Delivered","Cancelled"] as Order["status"][]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-[11px] text-muted whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${o.phone.startsWith("91") ? "" : "91"}${o.phone}?text=${encodeURIComponent(`Hi ${o.customer}, your DAXOMART order ${o.id} for ${o.productName} is now ${o.status}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30
                                 px-2 py-1 rounded hover:bg-[#25D366]/40 transition-colors no-underline"
                    >
                      WA
                    </a>
                    <button
                      onClick={() => deleteOrder(o.id)}
                      className="text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30
                                 px-2 py-1 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Order Modal */}
      {showAddOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark2 border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-cream">Add Manual Order</h3>
              <button onClick={() => setShowAddOrder(false)} className="text-muted hover:text-cream text-[20px]">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Customer Name", key: "customer", span: 2 },
                { label: "Phone", key: "phone" },
                { label: "City", key: "city" },
                { label: "State", key: "state" },
                { label: "Pincode", key: "pincode" },
                { label: "Address", key: "address", span: 2 },
              ].map(({ label, key, span }) => (
                <div key={key} className={span === 2 ? "col-span-2" : ""}>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-1">{label}</label>
                  <input
                    type="text"
                    value={(newOrder as Record<string, string>)[key] ?? ""}
                    onChange={(e) => setNewOrder((n) => ({ ...n, [key]: e.target.value }))}
                    className="w-full bg-dark3 border border-border text-cream text-[13px] font-pally
                               px-3 py-2 rounded outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-1">Product</label>
                <select
                  value={newOrder.productId ?? ""}
                  onChange={(e) => setNewOrder((n) => ({ ...n, productId: parseInt(e.target.value) }))}
                  className="w-full bg-dark3 border border-border text-cream text-[13px] font-pally
                             px-3 py-2 rounded outline-none focus:border-accent transition-colors cursor-pointer"
                >
                  <option value="">Select product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.shortName} — {p.priceStr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-1">Qty</label>
                <input
                  type="number" min={1} max={10}
                  value={newOrder.qty ?? 1}
                  onChange={(e) => setNewOrder((n) => ({ ...n, qty: parseInt(e.target.value) }))}
                  className="w-full bg-dark3 border border-border text-cream text-[13px] font-pally
                             px-3 py-2 rounded outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-1">Status</label>
                <select
                  value={newOrder.status ?? "Pending"}
                  onChange={(e) => setNewOrder((n) => ({ ...n, status: e.target.value as Order["status"] }))}
                  className="w-full bg-dark3 border border-border text-cream text-[13px] font-pally
                             px-3 py-2 rounded outline-none focus:border-accent transition-colors cursor-pointer"
                >
                  {["Pending","Confirmed","Shipped","Delivered","Cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={addOrder}
                className="flex-1 bg-accent hover:bg-accent-lt text-dark font-bold text-[12px]
                           tracking-wider uppercase py-3 rounded-lg transition-colors font-pally"
              >
                Save Order
              </button>
              <button
                onClick={() => setShowAddOrder(false)}
                className="px-5 bg-dark3 border border-border text-muted hover:text-cream
                           text-[12px] font-bold tracking-wider uppercase py-3 rounded-lg
                           transition-colors font-pally"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ──────────────────────────────── PRODUCTS TAB ───────────── */
  const ProductsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-bold text-cream">Products <span className="text-dim text-[15px] ml-2">({products.length})</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id}
            className="bg-dark2 border border-border rounded-xl p-4 flex gap-4 items-start
                       hover:border-accent transition-colors">
            <div className="bg-white rounded-lg shrink-0 overflow-hidden" style={{ width: 72, height: 72 }}>
              <Image src={p.img} alt={p.shortName} width={72} height={72}
                className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-cream leading-snug truncate">{p.shortName}</p>
              <p className="text-[10px] text-muted mt-0.5">{p.sku} · {p.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[14px] font-bold text-accent">{p.priceStr}</span>
                <span className="text-[11px] text-dim line-through">{p.oldPriceStr}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border
                                  ${p.inStock ? "bg-green/10 text-green border-green/30" : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                  {p.inStock ? "In Stock" : "Out of Stock"}
                </span>
                {p.badge && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5
                                   rounded bg-accent/20 text-accent border border-accent/30">
                    {p.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ──────────────────────────────── SETTINGS TAB ───────────── */
  const SettingsTab = () => (
    <div>
      <h2 className="text-[20px] font-bold text-cream mb-6">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark2 border border-border rounded-xl p-6">
          <h3 className="text-[14px] font-bold text-cream mb-4">Store Info</h3>
          {[
            { label: "Store Name", value: "DAXOMART" },
            { label: "WhatsApp Number", value: "9048571147" },
            { label: "Email", value: "admin@daxomart.com" },
          ].map(({ label, value }) => (
            <div key={label} className="mb-4">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-1">{label}</label>
              <input
                type="text"
                defaultValue={value}
                className="w-full bg-dark3 border border-border text-cream text-[13px] font-pally
                           px-4 py-2.5 rounded outline-none focus:border-accent transition-colors"
              />
            </div>
          ))}
          <button className="bg-accent hover:bg-accent-lt text-dark font-bold text-[12px] tracking-wider
                             uppercase px-5 py-2.5 rounded transition-colors font-pally mt-2">
            Save Changes
          </button>
        </div>

        <div className="bg-dark2 border border-border rounded-xl p-6">
          <h3 className="text-[14px] font-bold text-cream mb-4">Admin Access</h3>
          <div className="mb-4">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-1">Current Password</label>
            <input type="password" className="w-full bg-dark3 border border-border text-cream text-[13px] font-pally
                                              px-4 py-2.5 rounded outline-none focus:border-accent transition-colors" />
          </div>
          <div className="mb-4">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-1">New Password</label>
            <input type="password" className="w-full bg-dark3 border border-border text-cream text-[13px] font-pally
                                              px-4 py-2.5 rounded outline-none focus:border-accent transition-colors" />
          </div>
          <button className="bg-dark3 border border-border hover:border-accent text-cream font-bold text-[12px]
                             tracking-wider uppercase px-5 py-2.5 rounded transition-colors font-pally">
            Change Password
          </button>

          <div className="mt-6 pt-5 border-t border-border">
            <button
              onClick={() => { sessionStorage.removeItem("dm_admin_auth"); setAuthed(false); }}
              className="text-red-400 hover:text-red-300 text-[12px] font-bold tracking-wider uppercase
                         transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ──────────────────────────────── MAIN LAYOUT ────────────── */
  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-56 bg-dark2 border-r border-border flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <span className="font-pally font-bold text-[18px] tracking-[0.12em] uppercase text-cream">
            DAXO<span className="text-accent">MART</span>
          </span>
          <p className="text-[10px] text-dim mt-0.5 tracking-wider uppercase">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          <SideItem label="Dashboard" icon="📊" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
          <SideItem label="Orders"    icon="📦" active={tab === "orders"}    onClick={() => setTab("orders")} />
          <SideItem label="Products"  icon="🚗" active={tab === "products"}  onClick={() => setTab("products")} />
          <SideItem label="Settings"  icon="⚙️" active={tab === "settings"} onClick={() => setTab("settings")} />
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center
                            text-dark text-[12px] font-bold shrink-0">
              A
            </div>
            <div>
              <p className="text-[12px] font-bold text-cream">Admin</p>
              <p className="text-[10px] text-dim">DAXOMART</p>
            </div>
          </div>
          <a href="/" className="text-[11px] text-muted hover:text-accent transition-colors no-underline">
            ← Back to store
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-8 max-w-[1100px]">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "orders"    && <OrdersTab />}
          {tab === "products"  && <ProductsTab />}
          {tab === "settings"  && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}
