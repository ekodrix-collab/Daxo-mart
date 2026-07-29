"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAdminOrders } from "@/service/storeService";
import { supabase, OrderStatus } from "@/lib/supabase";
import CustomersTab from "../components/CustomersTab";
import { type Order } from "../components/OrdersTab";

export default function CustomersPage() {
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchAdminOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
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
  });

  return (
    <CustomersTab
      orders={orders}
      onUpdateOrderStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
    />
  );
}
