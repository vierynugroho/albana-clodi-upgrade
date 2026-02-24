"use client";

import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/order/OrderTable";
import { OrderFilters } from "@/components/order/OrderFilters";
import { Plus, ShoppingCart, Loader2, RefreshCw, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useOrders, useDeleteOrder, useCancelOrder } from "@/hooks/useOrders";
import { useSalesChannels } from "@/hooks/useSalesChannels";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useCustomers } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { mapApiOrdersToOrders } from "@/lib/mappers";
import { exportOrders } from "@/lib/services/order.service";
import type { Order } from "@/types";
import type { OrderQueryParams } from "@/types/api";

export default function OrderPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Filter state
  const [filters, setFilters] = useState<OrderQueryParams>({});
  const [isExporting, setIsExporting] = useState(false);

  // Memoize query params to prevent unnecessary re-fetches
  const queryParams = useMemo(() => {
    const params: OrderQueryParams = { ...filters };
    // Remove empty values
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof OrderQueryParams];
      if (value === "" || value === undefined || value === null) {
        delete params[key as keyof OrderQueryParams];
      }
    });
    return params;
  }, [filters]);

  // Fetch orders with filters
  const {
    data: apiOrders = [],
    isLoading,
    isError,
    refetch
  } = useOrders(queryParams);

  // Fetch filter options
  const { data: salesChannels = [], isLoading: isLoadingSalesChannels } = useSalesChannels();
  const { data: paymentMethods = [], isLoading: isLoadingPaymentMethods } = usePaymentMethods();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();

  const isLoadingOptions = isLoadingSalesChannels || isLoadingPaymentMethods || isLoadingCustomers;

  // Mutations
  const deleteMutation = useDeleteOrder();
  const cancelMutation = useCancelOrder();

  // Map API orders to frontend Order type
  const orders: Order[] = mapApiOrdersToOrders(apiOrders);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportOrders("excel");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast({
        title: "Berhasil",
        description: "Data order berhasil diexport",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Gagal mengexport",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleEdit = (order: Order) => {
    router.push(`/orders/${order.id}`);
  };

  const handleDelete = (orderId: string) => {
    if (!confirm("Hapus order ini?")) return;

    deleteMutation.mutate(orderId, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Order berhasil dihapus",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal menghapus order",
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      },
    });
  };

  const handleCancel = (orderId: string) => {
    if (!confirm("Batalkan order ini?")) return;

    cancelMutation.mutate(orderId, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Order berhasil dibatalkan",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal membatalkan order",
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      },
    });
  };

  const handleView = (order: Order) => {
    router.push(`/orders/${order.id}`);
  };

  const handlePrint = (orderIds: string[]) => {
    router.push(`/print/shipping-label?ids=${orderIds.join(",")}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data orders...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data orders
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-primary" />
            Order
          </h1>
          <p className="page-description">Kelola semua order pelanggan Anda</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
          <Button onClick={() => router.push("/orders/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onFiltersChange={setFilters}
        salesChannels={salesChannels}
        paymentMethods={paymentMethods}
        customers={customers}
        isLoadingOptions={isLoadingOptions}
      />

      {/* Order Count Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{orders.length}</span> order
          {Object.keys(queryParams).length > 0 && " (dengan filter)"}
        </p>
        {Object.keys(queryParams).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({})}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset filter
          </Button>
        )}
      </div>

      {/* Order Table */}
      <OrderTable
        orders={orders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onPrint={handlePrint}
        onCancel={handleCancel}
      />
    </div>
  );
}
