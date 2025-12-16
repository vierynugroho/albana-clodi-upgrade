"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/order/OrderTable";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-01-15",
    customer: {
      id: "1",
      name: "John Doe",
      category: "customer",
      province: "Jawa Barat",
      city: "Bandung",
      district: "Coblong",
      village: "Dago",
      postalCode: "40135",
      email: "john@example.com",
      phone: "081234567890",
      address: "Jl. Dago No. 123",
    },
    products: [],
    warehouse: {
      id: "1",
      name: "Gudang Utama",
      origin: "Bandung",
      phone: "081234567890",
      address: "Jl. Soekarno Hatta",
      status: true,
    },
    salesChannel: "Shopee",
    shippingCost: 15000,
    weight: 2,
    insurance: 5000,
    discount: 10000,
    subtotal: 500000,
    total: 510000,
    paymentStatus: "lunas",
    orderStatus: "selesai",
  },
];

export default function OrderPage() {
  const router = useRouter();
  const [orders] = useState<Order[]>(mockOrders);

  const handleEdit = (order: Order) => {
    router.push(`/order/${order.id}`);
  };

  const handleDelete = (orderId: string) => {
    console.log("Delete order:", orderId);
  };

  const handleView = (order: Order) => {
    router.push(`/order/${order.id}`);
  };

  const handlePrint = (orderIds: string[]) => {
    console.log("Print orders:", orderIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order</h1>
          <p className="text-muted-foreground">Kelola semua order pelanggan</p>
        </div>
        <Button onClick={() => router.push("/order/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Order
        </Button>
      </div>

      <OrderTable
        orders={orders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onPrint={handlePrint}
      />
    </div>
  );
}
