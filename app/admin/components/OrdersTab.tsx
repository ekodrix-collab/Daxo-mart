"use client";

import { useState } from "react";
import { OrderStatus } from "@/lib/supabase";
import StatusBadge from "./StatusBadge";
import {
  Search,
  MessageSquare,
  PhoneCall,
  Printer,
  FileText,
  X,
  MapPin,
  User,
  Clock,
  Package,
  Calendar,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronRight,
  LayoutGrid,
  List,
  Truck,
  Send,
  Copy,
  Check,
} from "lucide-react";

export interface Order {
  id: string;
  order_number?: string;
  productId?: number | string;
  productName: string;
  productImage?: string;
  price: number;
  qty: number;
  total: number;
  customer: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
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
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ── Amazon-Style Professional WhatsApp Message Generator ── */
export function buildAmazonStyleWhatsAppMsg(
  order: Order,
  targetStatus: OrderStatus = order.status,
  courierName: string = "BlueDart Express",
  trackingNo: string = ""
): string {
  const orderNum = order.order_number || order.id;
  const itemsList = `🚗 *Product:* ${order.productName}\n📦 *Qty:* ${order.qty} × ₹${order.price.toLocaleString("en-IN")}\n💰 *Total Amount:* ₹${order.total.toLocaleString("en-IN")} (Free Express Shipping)`;
  const deliveryAddr = `📍 *Delivery Address:*\n${order.customer}\n${order.address}, ${order.city}, ${order.state} - ${order.pincode}\n📞 *Contact:* +91 ${order.phone}`;
  const trackingId = trackingNo || `DXM${Math.floor(100000 + Math.random() * 900000)}`;

  switch (targetStatus) {
    case "New":
    case "Confirmed":
      return `🛍️ *DAXOMART - ORDER CONFIRMED* 🛍️\n\nDear *${order.customer}*,\n\nThank you for your order at DAXOMART! Your order *#${orderNum}* has been confirmed and placed into priority processing.\n\n${itemsList}\n\n${deliveryAddr}\n\n⏳ *Next Step:* Our quality team is inspecting and packing your diecast model in multi-layer protective packaging.\n\nNeed assistance? Reply directly to this WhatsApp chat!\n🌐 *DAXOMART Official Store*`;

    case "Processing":
    case "Packed":
      return `📦 *DAXOMART - PACKED & READY FOR DISPATCH* 📦\n\nDear *${order.customer}*,\n\nGreat news! Your DAXOMART order *#${orderNum}* has passed quality inspection and is packed securely.\n\n${itemsList}\n\n${deliveryAddr}\n\n🛡️ *Packing Note:* Sealed in damage-proof collector box.\n🚚 *Dispatch:* Handing over to express courier shortly.\n\nThank you for choosing DAXOMART! 🏎️💨`;

    case "Shipped":
      return `🚚 *DAXOMART - ORDER SHIPPED & IN TRANSIT* 🚚\n\nDear *${order.customer}*,\n\nYour DAXOMART order *#${orderNum}* has been dispatched via *${courierName}*!\n\n${itemsList}\n\n🚛 *Courier Partner:* ${courierName}\n🔢 *Tracking AWB:* *${trackingId}*\n⏱️ *Est. Delivery:* Within 3-5 Working Days\n\n${deliveryAddr}\n\nTrack your order anytime or chat with us for live status updates.\n🌐 *DAXOMART Diecast Store*`;

    case "Delivered":
      return `✅ *DAXOMART - ORDER DELIVERED* ✅\n\nDear *${order.customer}*,\n\nYour order *#${orderNum}* has been delivered to your shipping address!\n\n${itemsList}\n\nWe hope you love your new collector model! 🌟\n\n⭐ *Share Your Model:* Send us a photo or video of your unboxing to be featured on our official page!\n\nThank you for shopping with DAXOMART! 🏎️💨`;

    case "Cancelled":
      return `⚠️ *DAXOMART - ORDER CANCELLED* ⚠️\n\nDear *${order.customer}*,\n\nYour order *#${orderNum}* for *${order.productName}* has been cancelled.\n\nIf you have any questions or would like assistance placing a new order, reply directly to this chat.\n\nDAXOMART Customer Care`;

    default:
      return `📦 *DAXOMART ORDER UPDATE (#${orderNum})*\n\nDear *${order.customer}*,\n\nStatus Update: *${targetStatus}*\n\n${itemsList}\n\n${deliveryAddr}\n\nThank you for shopping with DAXOMART!`;
  }
}

interface OrdersTabProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  onOrderClick?: (id: string) => void;
}

export default function OrdersTab({
  orders,
  onUpdateStatus,
  onDeleteOrder,
  onOrderClick,
}: OrdersTabProps) {
  const [orderFilter, setOrderFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // WhatsApp Customization State for Modal
  const [courierName, setCourierName] = useState("BlueDart Express");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [copiedMsg, setCopiedMsg] = useState(false);

  const handleSelectOrder = (o: Order) => {
    if (onOrderClick) {
      onOrderClick(o.id);
    } else {
      setSelectedOrder(o);
      setTrackingNumber(`DXM${Math.floor(100000 + Math.random() * 900000)}`);
    }
  };

  const filteredOrders = orders
    .filter((o) => orderFilter === "All" || o.status === orderFilter)
    .filter(
      (o) =>
        !search ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        (o.order_number || o.id).toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search)
    );

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.order_number || order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; pb: 20px; }
            .title { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
            .section { margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f8f8f8; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">DAXOMART DIECAST</div>
              <p>Official Tax Invoice</p>
            </div>
            <div>
              <p><strong>Order #:</strong> ${order.order_number || order.id}</p>
              <p><strong>Date:</strong> ${fmtDate(order.createdAt)}</p>
            </div>
          </div>
          <div class="section">
            <h3>Customer & Shipping Details</h3>
            <p><strong>Name:</strong> ${order.customer}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Email:</strong> ${order.email || "N/A"}</p>
            <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
          </div>
          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${order.productName}</td>
                  <td>${order.qty}</td>
                  <td>${fmtINR(order.price)}</td>
                  <td>${fmtINR(order.total)}</td>
                </tr>
              </tbody>
            </table>
            <p class="total">Grand Total: ${fmtINR(order.total)}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getWhatsAppUrl = (order: Order, status: OrderStatus = order.status) => {
    const rawPhone = order.phone.replace(/[^0-9]/g, "");
    const formattedPhone = rawPhone.startsWith("91") ? rawPhone : `91${rawPhone}`;
    const msg = buildAmazonStyleWhatsAppMsg(order, status, courierName, trackingNumber);
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
            Order Fulfillment Center
          </h2>
          <p className="text-[13px] text-gray-400 mt-1 font-normal">
            Manage incoming diecast orders, automated Amazon-style WhatsApp status alerts &amp; courier dispatching.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-[#C5A059]/15 text-[#C5A059] font-bold text-[12px] rounded-full border border-[#C5A059]/30">
            {orders.length} Total Orders
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {["All", ...ALL_STATUSES].map((f) => {
            const count =
              f === "All"
                ? orders.length
                : orders.filter((o) => o.status === f).length;
            const active = orderFilter === f;
            return (
              <button
                key={f}
                onClick={() => setOrderFilter(f)}
                className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold tracking-wide transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
                  active
                    ? "bg-[#C5A059] text-black border-[#C5A059] shadow-sm font-bold"
                    : "bg-[#141416] text-gray-300 border-[#222226] hover:bg-[#1A1A1D]"
                }`}
              >
                <span>{f}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    active ? "bg-black text-[#C5A059] font-bold" : "bg-[#202024] text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & View Toggle */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Order #, customer, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141416] border border-[#222226] text-white text-[13px] pl-10 pr-4 py-2 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#141416] border border-[#222226] p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-2 rounded-lg text-[12px] transition-all flex items-center gap-1.5 font-semibold cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#C5A059] text-black font-bold shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              title="Card Grid View"
              className={`p-2 rounded-lg text-[12px] transition-all flex items-center gap-1.5 font-semibold cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[#C5A059] text-black font-bold shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Table or Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-12 text-center text-gray-400 text-[14px]">
          No orders found matching criteria.
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222226] bg-[#1A1A1D] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Shipping Location</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222226] text-[13px]">
                {filteredOrders.map((o) => {
                  const displayOrderNum = o.order_number || o.id;
                  const waUrl = getWhatsAppUrl(o);
                  return (
                    <tr
                      key={o.id}
                      onClick={() => handleSelectOrder(o)}
                      className="hover:bg-[#1C1C20] transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-[#C5A059] font-mono group-hover:text-white transition-colors">
                          {displayOrderNum}
                        </span>
                        <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(o.createdAt)}</p>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-bold text-white">{o.customer}</p>
                        <p className="text-[12px] text-gray-400 font-mono">{o.phone}</p>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-semibold text-gray-200 truncate">{o.productName}</p>
                        <p className="text-[11px] text-gray-400">Qty: {o.qty}</p>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-gray-300 truncate text-[12px]">{o.address}</p>
                        <p className="text-[11px] text-gray-400">{o.city}, {o.state}</p>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-[#C5A059] font-pally text-[14px]">
                          {fmtINR(o.total)}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateStatus(o.id, e.target.value as OrderStatus)}
                          className="text-[11.5px] font-bold uppercase px-2.5 py-1 rounded-full border border-[#2D2D32] bg-[#1C1C20] text-white outline-none cursor-pointer hover:border-[#C5A059]"
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-[#141416] text-white">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg border border-emerald-500/30 transition-colors flex items-center gap-1 font-bold text-[11px]"
                            title="Send Amazon-Style WhatsApp Alert"
                          >
                            <MessageSquare size={14} />
                            <span>WhatsApp</span>
                          </a>
                          <button
                            onClick={() => handleSelectOrder(o)}
                            className="p-2 bg-[#202024] hover:bg-[#2A2A30] text-white rounded-lg border border-gray-800 transition-colors"
                            title="View Order & Send Update"
                          >
                            <ChevronRight size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteOrder(o.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((o) => {
            const displayOrderNum = o.order_number || o.id;
            const waUrl = getWhatsAppUrl(o);
            return (
              <div
                key={o.id}
                onClick={() => handleSelectOrder(o)}
                className="bg-[#141416] border border-[#222226] rounded-[20px] p-5 flex flex-col justify-between hover:border-[#C5A059]/60 hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group"
              >
                <div>
                  {/* Order Top Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#222226]">
                    <div>
                      <span className="text-[14px] font-extrabold text-[#C5A059] font-mono group-hover:text-white transition-colors">
                        {displayOrderNum}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(o.createdAt)}</p>
                    </div>

                    {/* Status Dropdown */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          onUpdateStatus(o.id, e.target.value as OrderStatus)
                        }
                        className="text-[12px] font-bold uppercase px-3 py-1 rounded-full border border-[#2D2D32] bg-[#1C1C20] text-white outline-none cursor-pointer hover:border-[#C5A059]"
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-[#141416] text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#202024] border border-gray-700 text-gray-300 font-bold text-[12px] flex items-center justify-center shrink-0">
                        {o.customer?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-white truncate">{o.customer}</p>
                        <p className="text-[12px] text-gray-400 font-mono">{o.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Location */}
                  <div className="bg-[#1B1B1E] border border-[#252529] rounded-xl p-3 mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin size={12} className="text-[#C5A059]" /> Shipping Address
                    </p>
                    <p className="text-[12px] text-gray-300 line-clamp-2 leading-snug">
                      {o.address}
                    </p>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1">
                      {o.city}, {o.state} - {o.pincode}
                    </p>
                  </div>

                  {/* Product Summary Item */}
                  <div className="bg-[#1B1B1E] border border-[#252529] rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-white truncate">
                        {o.productName}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Qty: {o.qty} × ₹{o.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-[15px] font-extrabold text-[#C5A059] whitespace-nowrap font-pally">
                      {fmtINR(o.total)}
                    </span>
                  </div>
                </div>

                {/* Quick Card Footer */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="pt-3 border-t border-[#222226] flex items-center justify-between gap-2"
                >
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11.5px] font-bold py-2 rounded-xl transition-colors no-underline cursor-pointer"
                  >
                    <MessageSquare size={14} /> WhatsApp Alert
                  </a>

                  <button
                    onClick={() => handleSelectOrder(o)}
                    className="bg-[#202024] hover:bg-[#2A2A30] text-white px-3 py-2 text-[11.5px] font-bold rounded-xl transition-colors flex items-center gap-1 border border-gray-800 cursor-pointer"
                  >
                    Details <ChevronRight size={13} />
                  </button>

                  <button
                    onClick={() => onDeleteOrder(o.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
                    title="Delete Order"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SHOWCASE ORDER DETAIL MODAL & AMAZON-STYLE WHATSAPP GENERATOR ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#121214] border border-[#222226] rounded-[24px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto text-white">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#222226] flex items-center justify-between bg-[#0B0B0C] rounded-t-[24px] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-black font-bold flex items-center justify-center text-[14px]">
                  DXM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[18px] font-bold font-mono text-white">
                      {selectedOrder.order_number || selectedOrder.id}
                    </h3>
                    <StatusBadge status={selectedOrder.status} size="sm" />
                  </div>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Order placed on {fmtDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-xl bg-[#202024] hover:bg-[#2C2C32] text-gray-300 flex items-center justify-center transition-colors border border-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Showcase Grid Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0B0B0C]">
              
              {/* LEFT COLUMN: Customer & Address Info */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Customer Profile Card */}
                <div className="bg-[#141416] border border-[#222226] rounded-[18px] p-5 shadow-md">
                  <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400 mb-3 flex items-center gap-2">
                    <User size={16} className="text-[#C5A059]" /> Customer Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-[#202024]">
                      <span className="text-[13px] text-gray-400">Name</span>
                      <span className="text-[13px] font-bold text-white">
                        {selectedOrder.customer}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#202024]">
                      <span className="text-[13px] text-gray-400">Phone</span>
                      <a
                        href={`tel:${selectedOrder.phone}`}
                        className="text-[13px] font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <PhoneCall size={12} /> {selectedOrder.phone}
                      </a>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[13px] text-gray-400">Email</span>
                      <span className="text-[13px] text-gray-300 font-medium">
                        {selectedOrder.email || "Not Provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Card */}
                <div className="bg-[#141416] border border-[#222226] rounded-[18px] p-5 shadow-md">
                  <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400 mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-[#C5A059]" /> Shipping & Delivery Address
                  </h4>
                  <div className="p-3 bg-[#1C1C20] rounded-xl border border-[#28282D]">
                    <p className="text-[14px] font-semibold text-white">
                      {selectedOrder.customer}
                    </p>
                    <p className="text-[13px] text-gray-300 mt-1 leading-relaxed">
                      {selectedOrder.address}
                    </p>
                    <p className="text-[12px] font-bold text-gray-400 mt-1">
                      {selectedOrder.city}, {selectedOrder.state} — {selectedOrder.pincode}
                    </p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-3 text-[12.5px] p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      <strong className="block text-[11px] uppercase text-amber-400 mb-0.5">
                        Customer Notes:
                      </strong>
                      {selectedOrder.notes}
                    </div>
                  )}
                </div>

                {/* ── AMAZON-STYLE WHATSAPP TEMPLATE GENERATOR & PREVIEW ── */}
                <div className="bg-[#141416] border border-[#222226] rounded-[18px] p-5 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[13px] font-bold tracking-wider uppercase text-emerald-400 flex items-center gap-2 font-pally">
                      <MessageSquare size={16} /> Amazon-Style WhatsApp Template
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Auto-Formatted
                    </span>
                  </div>

                  {/* Status Selection Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {ALL_STATUSES.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          onUpdateStatus(selectedOrder.id, st);
                          setSelectedOrder({ ...selectedOrder, status: st });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase shrink-0 transition-all border cursor-pointer ${
                          selectedOrder.status === st
                            ? "bg-emerald-500 text-black border-emerald-400 shadow-md font-extrabold"
                            : "bg-[#1C1C20] text-gray-400 border-[#28282D] hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Courier & Tracking Input for Shipped Status */}
                  {selectedOrder.status === "Shipped" && (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#1C1C20] rounded-xl border border-[#28282D]">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          Courier Partner
                        </label>
                        <select
                          value={courierName}
                          onChange={(e) => setCourierName(e.target.value)}
                          className="w-full bg-[#121214] border border-gray-700 text-white text-[12px] font-bold rounded-lg p-2 outline-none"
                        >
                          <option value="BlueDart Express">BlueDart Express</option>
                          <option value="Delhivery Courier">Delhivery Courier</option>
                          <option value="DTDC Express">DTDC Express</option>
                          <option value="India Post Speed Post">India Post Speed Post</option>
                          <option value="XpressBees Courier">XpressBees Courier</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          Tracking AWB #
                        </label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g. DXM849201"
                          className="w-full bg-[#121214] border border-gray-700 text-white text-[12px] font-mono font-bold rounded-lg p-2 outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Message Live Preview */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Message Preview:
                    </label>
                    <pre className="w-full bg-[#0A0A0C] border border-[#252529] rounded-xl p-3.5 text-[12px] text-gray-200 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {buildAmazonStyleWhatsAppMsg(selectedOrder, selectedOrder.status, courierName, trackingNumber)}
                    </pre>
                  </div>

                  {/* Direct Send WhatsApp Button */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={getWhatsAppUrl(selectedOrder, selectedOrder.status)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[12.5px] tracking-wider uppercase py-3 rounded-xl transition-all flex items-center justify-center gap-2 no-underline shadow-lg"
                    >
                      <Send size={15} /> Send WhatsApp Alert To Customer
                    </a>

                    <button
                      onClick={() => {
                        const msg = buildAmazonStyleWhatsAppMsg(selectedOrder, selectedOrder.status, courierName, trackingNumber);
                        navigator.clipboard.writeText(msg);
                        setCopiedMsg(true);
                        setTimeout(() => setCopiedMsg(false), 2000);
                      }}
                      className="bg-[#202024] hover:bg-[#2A2A30] text-gray-300 font-bold text-[12px] px-3.5 py-3 rounded-xl transition-all flex items-center gap-1.5 border border-gray-700 cursor-pointer"
                      title="Copy Message Text"
                    >
                      {copiedMsg ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                      <span>{copiedMsg ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Order Items & Summary */}
              <div className="lg:col-span-5 space-y-5">
                {/* Product Info Card */}
                <div className="bg-[#141416] border border-[#222226] rounded-[18px] p-5 shadow-md">
                  <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400 mb-3 flex items-center gap-2">
                    <Package size={16} className="text-[#C5A059]" /> Purchased Product
                  </h4>
                  <div className="flex items-start gap-3 p-3 bg-[#1C1C20] rounded-xl border border-[#28282D] mb-4">
                    {selectedOrder.productImage ? (
                      <img
                        src={selectedOrder.productImage}
                        alt={selectedOrder.productName}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-700 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#0F0F10] text-[#C5A059] flex items-center justify-center font-bold text-[18px] shrink-0 border border-[#252529]">
                        DXM
                      </div>
                    )}
                    <div>
                      <p className="text-[14px] font-bold text-white line-clamp-2">
                        {selectedOrder.productName}
                      </p>
                      <p className="text-[12px] text-gray-400 mt-1">
                        Qty: {selectedOrder.qty} × {fmtINR(selectedOrder.price)}
                      </p>
                    </div>
                  </div>

                  {/* Summary Pricing */}
                  <div className="space-y-2 pt-2 border-t border-[#202024]">
                    <div className="flex justify-between text-[13px] text-gray-400">
                      <span>Subtotal</span>
                      <span>{fmtINR(selectedOrder.price * selectedOrder.qty)}</span>
                    </div>
                    <div className="flex justify-between text-[13px] text-gray-400">
                      <span>Shipping Fee</span>
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-[16px] font-bold text-white pt-2 border-t border-[#2A2A30]">
                      <span>Total Amount</span>
                      <span className="text-[#C5A059] font-pally">
                        {fmtINR(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Print Invoice & Shipping Label */}
                <div className="bg-[#141416] border border-[#222226] rounded-[18px] p-5 shadow-md space-y-3">
                  <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400">
                    Fulfillment Documents
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handlePrintInvoice(selectedOrder)}
                      className="bg-[#202024] hover:bg-[#2A2A30] text-white font-bold text-[12px] py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-700 cursor-pointer"
                    >
                      <Printer size={15} /> Print Invoice
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(selectedOrder)}
                      className="bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[12px] py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <FileText size={15} /> Shipping Label
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions Footer */}
            <div className="p-5 border-t border-[#222226] bg-[#0F0F12] rounded-b-[24px] flex items-center justify-between gap-3 sticky bottom-0 z-10">
              <a
                href={getWhatsAppUrl(selectedOrder, selectedOrder.status)}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[12px] px-5 py-3 rounded-xl transition-all flex items-center gap-2 no-underline shadow-lg"
              >
                <Send size={15} /> Open WhatsApp ({selectedOrder.status})
              </a>

              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-[#202024] hover:bg-[#2A2A30] text-white font-bold text-[12px] px-5 py-3 rounded-xl transition-all cursor-pointer border border-gray-700"
              >
                Close Modal
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
