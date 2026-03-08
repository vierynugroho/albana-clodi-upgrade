"use client";

import { useParams, useRouter } from "next/navigation";
import { OrderForm } from "@/components/order/OrderForm";
import { useOrder } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { data: orderData, isLoading, isError, refetch } = useOrder(id);

    if (isLoading) {
        return (
            <LoadingState />
        );
    }

    if (isError || !orderData) {
        return (
            <ErrorState
                message="Terjadi kesalahan saat memuat data order"
                onRetry={() => refetch()}
                onBack={() => router.push("/orders")}
            />
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

            <OrderForm
                mode="edit"
                orderId={id}
            />
        </div>
    );
}

