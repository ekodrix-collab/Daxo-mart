"use client";

export type OrderStatusType =
  | "New"
  | "Pending"
  | "Contacted"
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface StatusBadgeProps {
  status: OrderStatusType | string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const normStatus = (status || "New").toString().trim();

  let styles = "bg-amber-500/15 text-amber-400 border-amber-500/30";

  switch (normStatus) {
    case "New":
    case "Pending":
      styles = "bg-amber-500/15 text-amber-400 border-amber-500/30";
      break;
    case "Contacted":
      styles = "bg-purple-500/15 text-purple-400 border-purple-500/30";
      break;
    case "Confirmed":
      styles = "bg-blue-500/15 text-blue-400 border-blue-500/30";
      break;
    case "Processing":
      styles = "bg-orange-500/15 text-orange-400 border-orange-500/30";
      break;
    case "Packed":
      styles = "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
      break;
    case "Shipped":
      styles = "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      break;
    case "Delivered":
      styles = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      break;
    case "Cancelled":
      styles = "bg-red-500/15 text-red-400 border-red-500/30";
      break;
    default:
      styles = "bg-gray-800 text-gray-400 border-gray-700";
  }

  const padding = size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-[12px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${padding} ${styles} transition-all duration-150 shrink-0`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {normStatus}
    </span>
  );
}
