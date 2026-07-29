"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchAdminOrders, syncOrderStockOnStatusChange } from "@/service/storeService";
import { supabase, OrderStatus } from "@/lib/supabase";
import StatusBadge from "../../components/StatusBadge";
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  PhoneCall,
  User,
  MapPin,
  Clock,
  Package,
  Calendar,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { type Order } from "../../components/OrdersTab";

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

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchAdminOrders,
  });

  const order = orders.find((o) => o.id === orderId);

  const updateStatusMutation = useMutation({
    mutationFn: async (status: OrderStatus) => {
      if (order) {
        syncOrderStockOnStatusChange(queryClient, order, order.status, status);
      }
      await supabase.from("orders").update({ status }).eq("id", orderId);
    },
    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousOrders = queryClient.getQueryData<Order[]>(["orders"]) || [];
      queryClient.setQueryData<Order[]>(["orders"], (old = []) =>
        old.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      return { previousOrders };
    },
  });

  const handlePrintInvoice = () => {
    if (!order) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.order_number || order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111; }
            .header { border-bottom: 2px solid #C5A059; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .title { font-size: 24px; font-weight: bold; color: #000; }
            .meta { font-size: 13px; color: #555; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .table th { background: #f8f8f8; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">DAXO-MART INVOICE</div>
              <div class="meta">Official Tax Invoice & Delivery Note</div>
            </div>
            <div style="text-align: right;">
              <strong>Order #: ${order.order_number || order.id}</strong><br/>
              Date: ${fmtDate(order.createdAt)}
            </div>
          </div>
          <div style="margin-bottom: 20px;">
            <strong>Billed & Shipped To:</strong><br/>
            ${order.customer}<br/>
            ${order.address}<br/>
            ${order.city}, ${order.state} - ${order.pincode}<br/>
            Phone: ${order.phone}
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.productName}</td>
                <td>${order.qty}</td>
                <td>₹${order.price.toLocaleString("en-IN")}</td>
                <td>₹${order.total.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total Paid: ₹${order.total.toLocaleString("en-IN")}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading Order Details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-12 text-center text-gray-400">
        <p className="text-lg font-bold text-white mb-2">Order Not Found</p>
        <p className="text-sm text-gray-400 mb-6">The requested order ID could not be located.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 bg-[#C5A059] text-black font-bold px-5 py-2.5 rounded-xl no-underline"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>
    );
  }

  const displayOrderNum = order.order_number || order.id;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141416] border border-[#222226] p-5 rounded-[20px] shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/orders")}
            className="p-2.5 rounded-xl bg-[#1C1C20] hover:bg-[#25252A] text-gray-300 hover:text-white border border-[#2A2A2F] transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-extrabold text-[#C5A059] font-mono">
                {displayOrderNum}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Placed on {fmtDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={order.status}
            onChange={(e) => updateStatusMutation.mutate(e.target.value as OrderStatus)}
            className="text-[12px] font-bold uppercase px-3 py-2 rounded-xl border border-[#2D2D32] bg-[#1C1C20] text-white outline-none cursor-pointer hover:border-[#C5A059]"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-[#141416] text-white">
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrintInvoice}
            className="flex items-center gap-2 bg-[#202024] hover:bg-[#2A2A30] text-white font-medium text-[13px] px-4 py-2 rounded-xl border border-gray-800 transition-colors cursor-pointer"
          >
            <Printer size={15} /> Print Invoice
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Customer & Address Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md">
            <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400 mb-4 flex items-center gap-2">
              <User size={16} className="text-[#C5A059]" /> Customer Information
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#202024]">
                <span className="text-[13px] text-gray-400">Full Name</span>
                <span className="text-[14px] font-bold text-white">{order.customer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#202024]">
                <span className="text-[13px] text-gray-400">Phone Number</span>
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${order.phone}`}
                    className="text-[13px] font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <PhoneCall size={12} /> {order.phone}
                  </a>
                  <a
                    href={`https://wa.me/${order.phone.startsWith("91") ? "" : "91"}${order.phone}?text=${encodeURIComponent(
                      `Hi ${order.customer}, regarding your DAXO-MART Order ${displayOrderNum} (${order.productName}): Status update is ${order.status}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/30 text-[11px] font-medium flex items-center gap-1"
                  >
                    <MessageSquare size={12} /> WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[13px] text-gray-400">Email Address</span>
                <span className="text-[13px] text-gray-300 font-medium">
                  {order.email || "Not Provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md">
            <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400 mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-[#C5A059]" /> Shipping & Delivery Address
            </h4>
            <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#28282D]">
              <p className="text-[15px] font-semibold text-white">{order.customer}</p>
              <p className="text-[13.5px] text-gray-300 mt-1.5 leading-relaxed">
                {order.address}
              </p>
              <p className="text-[13px] font-bold text-[#C5A059] mt-2">
                {order.city}, {order.state} — {order.pincode}
              </p>
            </div>
            {order.notes && (
              <div className="mt-4 text-[13px] p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <strong className="block text-[11px] uppercase tracking-wider text-amber-400 mb-1">
                  Customer Delivery Notes:
                </strong>
                {order.notes}
              </div>
            )}
          </div>

          {/* Fulfillment Audit Trail */}
          <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md">
            <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-[#C5A059]" /> Audit & History
            </h4>
            <div className="space-y-4 pl-3 border-l-2 border-[#C5A059]/40 ml-2">
              <div className="relative pl-5">
                <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-[#C5A059]" />
                <p className="text-[14px] font-bold text-white">Order Created</p>
                <p className="text-[12px] text-gray-400">{fmtDate(order.createdAt)}</p>
              </div>
              <div className="relative pl-5">
                <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-emerald-400" />
                <p className="text-[14px] font-bold text-white">
                  Current Status: {order.status}
                </p>
                <p className="text-[12px] text-gray-400">Database Synced</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Line Items & Total */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md">
            <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400 mb-4 flex items-center gap-2">
              <Package size={16} className="text-[#C5A059]" /> Ordered Items
            </h4>
            <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#28282D] flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#141416] border border-[#2A2A2E] overflow-hidden shrink-0 relative">
                {order.productImage ? (
                  <Image
                    src={order.productImage}
                    alt={order.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Package size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-white truncate">
                  {order.productName}
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  Unit Price: {fmtINR(order.price)} | Qty: {order.qty}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-extrabold text-[#C5A059] font-pally">
                  {fmtINR(order.total)}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222226] space-y-2.5">
              <div className="flex justify-between text-[13px] text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium text-white">{fmtINR(order.total)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-gray-400">
                <span>Express Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-[15px] font-extrabold text-white pt-2 border-t border-[#25252B]">
                <span>Total Paid</span>
                <span className="text-[#C5A059] font-pally">{fmtINR(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
