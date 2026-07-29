"use client";

import PRODUCTS from "@/lib/products";
import StatusBadge from "./StatusBadge";
import { DollarSign, ShoppingBag, Clock, CheckCircle2, ArrowRight, PackageCheck, TrendingUp } from "lucide-react";

interface Order {
  id: string;
  order_number?: string;
  productId?: number;
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
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled" | "New" | "Processing" | "Packed";
  createdAt: string;
}

const fmtINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

interface DashboardTabProps {
  orders: Order[];
  onNavigateToOrders: () => void;
  onNavigateToProducts: () => void;
}

export default function DashboardTab({
  orders,
  onNavigateToOrders,
  onNavigateToProducts,
}: DashboardTabProps) {
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === "Pending" || o.status === "New").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner - Dark Luxury */}
      <div className="bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider border border-[#C5A059]/30">
              Live Store Analytics
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
            Welcome back, Admin 👋
          </h2>
          <p className="text-[13px] text-gray-400 mt-1 font-normal">
            Here is what's happening across DaxoMart diecast store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToOrders}
            className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-bold text-[12px] tracking-wider uppercase px-4 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            Manage Orders <ArrowRight size={14} />
          </button>
          <button
            onClick={onNavigateToProducts}
            className="bg-[#1C1C20] hover:bg-[#25252A] border border-[#2D2D32] text-white font-bold text-[12px] tracking-wider uppercase px-4 py-3 rounded-2xl transition-all cursor-pointer"
          >
            Catalog
          </button>
        </div>
      </div>

      {/* Analytics KPI Grid - Dark Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue Card */}
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md hover:border-[#C5A059]/50 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-gray-400">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/20">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-[28px] font-bold text-white font-pally leading-tight">
            {fmtINR(totalRevenue)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-emerald-400 font-medium">
            <TrendingUp size={14} />
            <span>{orders.filter((o) => o.status !== "Cancelled").length} completed sales</span>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md hover:border-blue-500/50 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-gray-400">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-[28px] font-bold text-white font-pally leading-tight">
            {orders.length}
          </p>
          <p className="text-[12px] text-gray-400 mt-2 font-medium">
            All time recorded orders
          </p>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md hover:border-orange-500/50 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-gray-400">
              Pending Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-[28px] font-bold text-orange-400 font-pally leading-tight">
            {pendingCount}
          </p>
          <p className="text-[12px] text-gray-400 mt-2 font-medium">
            Awaiting dispatch / review
          </p>
        </div>

        {/* Delivered Card */}
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md hover:border-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-gray-400">
              Delivered Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-[28px] font-bold text-emerald-400 font-pally leading-tight">
            {deliveredCount}
          </p>
          <p className="text-[12px] text-gray-400 mt-2 font-medium">
            Successfully fulfilled
          </p>
        </div>
      </div>

      {/* Recent Orders Section - Dark Theme */}
      <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#222226]">
          <div>
            <h3 className="text-[16px] font-bold text-white font-pally">
              Recent Orders
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Latest incoming diecast collectible purchases
            </p>
          </div>
          <button
            onClick={onNavigateToOrders}
            className="text-[13px] font-semibold text-[#C5A059] hover:underline transition-colors flex items-center gap-1 font-pally cursor-pointer"
          >
            View all orders <ArrowRight size={14} />
          </button>
        </div>

        {/* Upgraded Dark Table View */}
        <div className="overflow-x-auto rounded-xl border border-[#222226]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1B1B1E] border-b border-[#222226] sticky top-0">
              <tr>
                {["Order ID", "Customer", "Product", "Total", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-[11px] font-bold tracking-wider uppercase text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222226]">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-[#1C1C20] transition-colors">
                  <td className="px-4 py-4 text-[13px] font-semibold text-[#C5A059] font-mono">
                    {o.order_number || o.id}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#202024] border border-gray-700 text-gray-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {o.customer?.[0]?.toUpperCase() || "C"}
                      </div>
                      <span className="text-[13px] font-medium text-white">
                        {o.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-300 max-w-[220px] truncate font-medium">
                    {o.productName}
                  </td>
                  <td className="px-4 py-4 text-[13px] font-bold text-white">
                    {fmtINR(o.total)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={o.status} size="sm" />
                  </td>
                  <td className="px-4 py-4 text-[12px] text-gray-400">
                    {fmtDate(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diecast Category Inventory Summary */}
      <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md space-y-4">
        <div>
          <h3 className="text-[16px] font-bold text-white font-pally">
            Category Breakdown
          </h3>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Active product models count by category
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(["1:24", "1:18", "RC", "Frame"] as const).map((cat) => {
            const count = PRODUCTS.filter((p) => p.category === cat).length;
            return (
              <div
                key={cat}
                className="bg-[#1B1B1E] border border-[#252529] rounded-2xl p-4 text-center hover:border-[#C5A059]/50 transition-colors"
              >
                <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-[#141416] border border-[#2D2D32] text-[#C5A059] flex items-center justify-center">
                  <PackageCheck size={16} />
                </div>
                <p className="text-[20px] font-bold text-white font-pally">{count}</p>
                <p className="text-[11px] font-bold tracking-wider uppercase text-gray-400 mt-0.5">
                  {cat === "Frame" ? "3D Frames" : cat}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
