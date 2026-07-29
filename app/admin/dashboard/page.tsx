"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAdminOrders } from "@/service/storeService";
import DashboardTab from "../components/DashboardTab";
import { type Order } from "../components/OrdersTab";

const SEED_ORDERS: Order[] = [
  {
    id: "ord-001",
    order_number: "DXM-100001",
    productId: 1,
    productName: "Range Rover Pearl White 1:24",
    price: 1299,
    qty: 2,
    total: 2598,
    customer: "Ravi Kumar",
    phone: "9876543210",
    email: "ravi@example.com",
    address: "12, MG Road, Near Apollo Hospital",
    city: "Kochi",
    state: "Kerala",
    pincode: "682001",
    status: "Confirmed",
    createdAt: "2025-07-25T09:30:00",
  },
  {
    id: "ord-002",
    order_number: "DXM-100002",
    productId: 9,
    productName: "RC Racing Set Red & Blue",
    price: 799,
    qty: 1,
    total: 799,
    customer: "Priya Sharma",
    phone: "9123456780",
    email: "priya@example.com",
    address: "45, Sector 18",
    city: "Noida",
    state: "UP",
    pincode: "201301",
    status: "Shipped",
    createdAt: "2025-07-26T14:00:00",
  },
  {
    id: "ord-003",
    order_number: "DXM-100003",
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
    status: "New",
    createdAt: "2025-07-28T10:15:00",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchAdminOrders,
    placeholderData: SEED_ORDERS,
  });

  const displayOrders = orders.length > 0 ? orders : SEED_ORDERS;

  return (
    <DashboardTab
      orders={displayOrders as any}
      onNavigateToOrders={() => router.push("/admin/orders")}
      onNavigateToProducts={() => router.push("/admin/products")}
    />
  );
}
