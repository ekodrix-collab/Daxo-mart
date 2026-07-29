"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, ExternalLink, X, User, ShoppingBag, Clock, ChevronRight, MessageSquare } from "lucide-react";
import { OrderStatus } from "@/lib/supabase";
import { Order } from "./OrdersTab";
import StatusBadge from "./StatusBadge";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  full_address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
}

interface CustomersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const ALL_STATUSES: OrderStatus[] = [
  "New",
  "Contacted",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const fmtINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CustomersTab({ orders, onUpdateOrderStatus }: CustomersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Map orders to unique customers dynamically
  const customerMap = new Map<string, Customer>();

  orders.forEach((o) => {
    const key = o.phone;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: `CUST-${o.phone.slice(-4)}`,
        name: o.customer,
        phone: o.phone,
        email: o.email,
        full_address: o.address,
        city: o.city,
        state: o.state,
        pincode: o.pincode,
        totalOrders: 1,
        totalSpent: o.total || 0,
        lastOrderDate: o.createdAt,
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.totalOrders += 1;
      existing.totalSpent += o.total || 0;
      if (new Date(o.createdAt) > new Date(existing.lastOrderDate || 0)) {
        existing.lastOrderDate = o.createdAt;
      }
    }
  });

  const customerList = Array.from(customerMap.values());

  const filtered = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.phone.includes(searchTerm) ||
      (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Customer order history (newest first)
  const customerOrders = selectedCustomer
    ? orders
        .filter((o) => o.phone === selectedCustomer.phone)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
            Customer CRM Directory
          </h2>
          <p className="text-[13px] text-gray-400 mt-1 font-normal">
            Inspect customer profiles, lifetime purchases, delivery addresses and order timeline history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#C5A059]/15 text-[#C5A059] font-bold text-[12px] rounded-full border border-[#C5A059]/30">
            {customerList.length} Total Customers
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full lg:w-80">
        <input
          type="text"
          placeholder="Search customer name, phone, city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#141416] border border-[#222226] text-white text-[13px] px-4 py-2.5 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
        />
      </div>

      {/* Customers List / Table - Dark Theme */}
      <div className="bg-[#141416] border border-[#222226] rounded-[20px] overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead className="bg-[#1B1B1E] border-b border-[#222226]">
              <tr>
                {["Customer", "Contact Details", "Lifetime Orders", "Total Spent", "Last Active", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[11px] font-bold tracking-wider uppercase text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222226]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-[14px]">
                    No customers found matching search criteria.
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr
                  key={c.phone}
                  onClick={() => setSelectedCustomer(c)}
                  className="hover:bg-[#1C1C20] transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#202024] border border-[#C5A059]/40 text-[#C5A059] font-bold text-[13px] flex items-center justify-center shrink-0">
                        {c.name?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-white group-hover:text-[#C5A059] transition-colors font-pally">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-gray-400">{c.city ? `${c.city}, ${c.state}` : "India"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] text-white font-mono flex items-center gap-1.5">
                      <Phone size={13} className="text-gray-400 shrink-0" /> {c.phone}
                    </p>
                    {c.email && (
                      <p className="text-[12px] text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <Mail size={13} className="text-gray-400 shrink-0" /> {c.email}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-white bg-[#202024] border border-gray-700 px-3 py-1 rounded-full">
                      {c.totalOrders} {c.totalOrders === 1 ? "Order" : "Orders"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-bold text-[#C5A059] font-pally">
                    {fmtINR(c.totalSpent)}
                  </td>
                  <td className="px-6 py-4 text-[12px] text-gray-400">
                    {c.lastOrderDate
                      ? new Date(c.lastOrderDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(c);
                      }}
                      className="bg-[#202024] hover:bg-[#C5A059] hover:text-black text-white text-[12px] font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 border border-gray-700 cursor-pointer"
                    >
                      View CRM <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE MODAL / DRAWER - Dark Theme */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#121214] border-l border-[#222226] w-full max-w-2xl h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 text-white">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#222226] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F0F10] text-[#C5A059] border border-[#C5A059]/40 font-bold text-[18px] flex items-center justify-center">
                    {selectedCustomer.name?.[0]?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">
                      Customer Profile & History
                    </span>
                    <h3 className="text-[22px] font-extrabold text-white font-pally leading-tight">
                      {selectedCustomer.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-9 h-9 rounded-full bg-[#202024] hover:bg-[#2C2C32] flex items-center justify-center text-gray-300 transition-colors border border-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              {/* CRM Info Cards Grid */}
              <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-5 mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Phone Contact
                    </span>
                    <p className="text-white font-mono font-bold text-[14px]">
                      {selectedCustomer.phone}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Email Address
                    </span>
                    <p className="text-gray-300 font-mono font-medium">
                      {selectedCustomer.email || "Not provided"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Shipping Address
                    </span>
                    <p className="text-white leading-relaxed font-semibold">
                      {selectedCustomer.full_address || "Address stored on order timeline"}
                    </p>
                    <p className="text-gray-400 text-[12px] mt-0.5">
                      {selectedCustomer.city}, {selectedCustomer.state} — {selectedCustomer.pincode}
                    </p>
                  </div>
                </div>

                {/* Contact Action Buttons */}
                <div className="pt-4 border-t border-[#222226] flex items-center gap-3">
                  <a
                    href={`https://wa.me/${selectedCustomer.phone.startsWith("91") ? "" : "91"}${selectedCustomer.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] tracking-wider uppercase py-3 rounded-2xl transition-all flex items-center justify-center gap-2 no-underline shadow-md"
                  >
                    <MessageSquare size={15} /> WhatsApp Direct
                  </a>

                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="px-5 bg-[#202024] hover:bg-[#2A2A30] border border-gray-700 text-white font-bold text-[12px] tracking-wider uppercase py-3 rounded-2xl transition-all flex items-center justify-center gap-2 no-underline"
                  >
                    <Phone size={15} /> Call Customer
                  </a>
                </div>
              </div>

              {/* Order History Header */}
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-white uppercase tracking-wider font-pally">
                  Order History ({customerOrders.length})
                </h4>
                <span className="text-[12px] text-gray-400 font-medium">Newest First</span>
              </div>

              {/* Order History Cards */}
              <div className="space-y-4">
                {customerOrders.map((o) => {
                  const displayOrderNum = o.order_number || o.id;
                  return (
                    <div
                      key={o.id}
                      className="bg-[#141416] border border-[#222226] rounded-[18px] p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[14px] font-extrabold text-[#C5A059] font-mono">
                            {displayOrderNum}
                          </span>
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Status Select Pill */}
                        <select
                          value={o.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(o.id, e.target.value as OrderStatus)
                          }
                          className="text-[11px] font-bold uppercase px-3 py-1 rounded-full border border-[#2D2D32] bg-[#1C1C20] text-white outline-none cursor-pointer hover:border-[#C5A059]"
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-[#141416] text-white">
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product details */}
                      <div className="bg-[#1B1B1E] border border-[#252529] rounded-xl p-3 flex items-center justify-between text-[13px]">
                        <div>
                          <p className="font-bold text-white">{o.productName}</p>
                          <p className="text-[11px] text-gray-400">Qty: {o.qty}</p>
                        </div>
                        <span className="text-[15px] font-extrabold text-[#C5A059] font-pally">
                          {fmtINR(o.total)}
                        </span>
                      </div>

                      <div className="text-[12px] text-gray-300">
                        <span className="font-bold text-white">Shipping: </span>
                        {o.address}, {o.city}, {o.state} - {o.pincode}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
