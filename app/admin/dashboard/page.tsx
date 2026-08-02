"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAdminOrders } from "@/service/storeService";
import DashboardTab from "../components/DashboardTab";
import { type Order } from "../components/OrdersTab";

export default function DashboardPage() {
  const router = useRouter();
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchAdminOrders,
  });

  return (
    <DashboardTab
      orders={orders as any}
      onNavigateToOrders={() => router.push("/admin/orders")}
      onNavigateToProducts={() => router.push("/admin/products")}
    />
  );
}
