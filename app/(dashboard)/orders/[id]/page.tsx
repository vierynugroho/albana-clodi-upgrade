"use client";

import { useParams, useRouter } from "next/navigation";
import { OrderForm } from "@/components/order/OrderForm";
import { useOrder } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { data: orderData, isLoading, isError, refetch } = useOrder(id);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Memuat data order...</p>
            </div>
        );
    }

    // Error state
    if (isError || !orderData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-center">
                    <p className="font-semibold text-destructive">Gagal memuat data</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Terjadi kesalahan saat memuat data order
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => router.push("/orders")} variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <Button onClick={() => refetch()} variant="outline" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Coba lagi
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/orders")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Edit Order</h1>
                    <p className="text-muted-foreground">
                        Order ID: {orderData.OrderDetail?.code || id}
                    </p>
                </div>
            </div>

            {/* Note: Edit mode perlu refactoring untuk load existing data */}
            <OrderForm
                mode="edit"
                orderId={id}
            />
        </div>
    );
}

