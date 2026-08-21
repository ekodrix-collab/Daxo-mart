"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAdminOrders } from "@/service/storeService";
import { supabase } from "@/lib/supabase";
import DashboardTab from "../components/DashboardTab";
import { type Order } from "../components/OrdersTab";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchAdminOrders,
    refetchInterval: 5000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <DashboardTab
      orders={orders as any}
      onNavigateToOrders={() => router.push("/admin/orders")}
      onNavigateToProducts={() => router.push("/admin/products")}
    />
  );
}
