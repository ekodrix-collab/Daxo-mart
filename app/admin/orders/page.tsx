"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAdminOrders, syncOrderStockOnStatusChange } from "@/service/storeService";
import { supabase, OrderStatus } from "@/lib/supabase";
import OrdersTab, { type Order } from "../components/OrdersTab";

export default function OrdersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchAdminOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const targetOrder = orders.find((o) => o.id === id);
      if (targetOrder) {
        syncOrderStockOnStatusChange(queryClient, targetOrder, targetOrder.status, status);
      }
      await supabase.from("orders").update({ status }).eq("id", id);
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousOrders = queryClient.getQueryData<Order[]>(["orders"]) || [];
      queryClient.setQueryData<Order[]>(["orders"], (old = []) =>
        old.map((o) => (o.id === id ? { ...o, status } : o))
      );
      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("orders").delete().eq("id", id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousOrders = queryClient.getQueryData<Order[]>(["orders"]) || [];
      queryClient.setQueryData<Order[]>(["orders"], (old = []) =>
        old.filter((o) => o.id !== id)
      );
      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
    },
  });

  return (
    <OrdersTab
      orders={orders}
      onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
      onDeleteOrder={(id) => {
        if (confirm("Delete this order?")) {
          deleteOrderMutation.mutate(id);
        }
      }}
      onOrderClick={(id) => router.push(`/admin/orders/${id}`)}
    />
  );
}
