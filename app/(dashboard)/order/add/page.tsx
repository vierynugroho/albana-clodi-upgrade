"use client";

import { OrderForm } from "@/components/order/OrderForm";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";

export default function AddOrderPage() {
  const router = useRouter();

  const handleSubmit = (data: Partial<Order>) => {
    console.log("Create order:", data);
    // API call here
    router.push("/order");
  };

  const handleCancel = () => {
    router.push("/order");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Order</h1>
        <p className="text-muted-foreground">Buat order baru untuk pelanggan</p>
      </div>

      <OrderForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
