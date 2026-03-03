"use client";

import { OrderForm } from "@/components/order/OrderForm";

export default function AddOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Tambah Order</h1>
        <p className="text-muted-foreground">Buat order baru untuk pelanggan</p>
      </div>

      <OrderForm />
    </div>
  );
}

