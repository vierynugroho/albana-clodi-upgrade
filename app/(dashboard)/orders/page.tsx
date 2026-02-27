"use client";

import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/order/OrderTable";
import { OrderFilters } from "@/components/order/OrderFilters";
import { Plus, ShoppingCart, Loader2, RefreshCw, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useDeleteOrder, useCancelOrder } from "@/hooks/useOrders";
import { useOrdersPaginated } from "@/hooks/useOrders";
import { useSalesChannels } from "@/hooks/useSalesChannels";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useCustomers } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { mapApiOrdersToOrders } from "@/lib/mappers";
import { exportOrders } from "@/lib/services/order.service";
import type { Order } from "@/types";
import type { OrderQueryParams } from "@/types/api";
import { LoadingState } from "@/components/shared/LoadingState";

// === Old import (commented out — replaced by useOrdersPaginated) ===
// import { useOrders } from "@/hooks/useOrders";
// ===================================================================

const ITEMS_PER_PAGE = 20;

export default function OrderPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Filter state
  const [filters, setFilters] = useState<OrderQueryParams>({});
  const [isExporting, setIsExporting] = useState(false);

  // === Cursor-based pagination state ===
  const [currentPage, setCurrentPage] = useState(1);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [totalItems, setTotalItems] = useState(0);

  // Current cursor for the active page
  const currentCursor = cursorHistory[currentPage - 1] ?? null;

  // Memoize query params
  const queryParams = useMemo(() => {
    const params: OrderQueryParams = {
      ...filters,
      limit: ITEMS_PER_PAGE,
    };
    if (currentCursor) {
      params.cursor = currentCursor;
    }
    // Remove empty values
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof OrderQueryParams];
      if (value === "" || value === undefined || value === null) {
        delete params[key as keyof OrderQueryParams];
      }
    });
    return params;
  }, [filters, currentCursor]);

  // === Old useOrders (commented out — replaced by useOrdersPaginated) ===
  // const {
  //   data: apiOrders = [],
  //   isLoading,
  //   isError,
  //   refetch
  // } = useOrders(queryParams);
  // =====================================================================

  // Fetch orders with cursor-based pagination
  const {
    data: paginatedResult,
    isLoading,
    isError,
    refetch,
  } = useOrdersPaginated(queryParams);

  // Extract data and meta from paginated result
  const apiOrders = paginatedResult?.data ?? [];
  const meta = paginatedResult?.meta ?? {};

  // Update cursor state when data arrives
  const prevMetaRef = useRef(meta);
  useEffect(() => {
    if (meta !== prevMetaRef.current) {
      prevMetaRef.current = meta;
      const nc = meta.nextCursor ?? null;
      setNextCursor(nc);
      setHasNext(Boolean(nc) && apiOrders.length > 0);
      if (meta.totalItems !== undefined) {
        setTotalItems(meta.totalItems);
      }
    }
  }, [meta, apiOrders.length]);

  // Reset pagination when filters change
  const filtersRef = useRef(filters);
  useEffect(() => {
    if (filtersRef.current !== filters) {
      filtersRef.current = filters;
      setCurrentPage(1);
      setCursorHistory([null]);
      setNextCursor(null);
      setHasNext(false);
      setTotalItems(0);
    }
  }, [filters]);

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

  // Pagination handler (cursor-based)
  const totalPages = totalItems > 0
    ? Math.ceil(totalItems / ITEMS_PER_PAGE)
    : currentPage + (hasNext ? 1 : 0);

  const handlePageChange = useCallback((page: number) => {
    if (isLoading) return;
    if (page < 1) return;

    // Go to first page
    if (page === 1) {
      setCursorHistory([null]);
      setCurrentPage(1);
      return;
    }

    // Previous page
    if (page < currentPage) {
      const cursorForPage = cursorHistory[page - 1] ?? null;
      setCurrentPage(page);
      // Cursor is already in history, the queryParams memo will pick it up
      return;
    }

    // Next page (must be sequential for cursor)
    if (page === currentPage + 1) {
      if (!hasNext || !nextCursor) return;
      setCursorHistory((prev) => {
        const copy = [...prev];
        copy[page - 1] = nextCursor;
        return copy;
      });
      setCurrentPage(page);
      return;
    }
  }, [isLoading, currentPage, hasNext, nextCursor, cursorHistory]);

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
  if (isLoading && apiOrders.length === 0) {
    return (
      <LoadingState />
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
          {totalItems > 0 ? (
            <>
              Menampilkan <span className="font-semibold text-foreground">{orders.length}</span> dari{" "}
              <span className="font-semibold text-foreground">{totalItems}</span> order
            </>
          ) : (
            <>
              Menampilkan <span className="font-semibold text-foreground">{orders.length}</span> order
            </>
          )}
          {Object.keys(filters).length > 0 && " (dengan filter)"}
        </p>
        {Object.keys(filters).length > 0 && (
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

      {/* Order Table with Server-Side Pagination */}
      <OrderTable
        orders={orders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onPrint={handlePrint}
        onCancel={handleCancel}
        serverPagination={{
          currentPage,
          totalPages,
          totalItems: totalItems || orders.length,
          itemsPerPage: ITEMS_PER_PAGE,
          hasNext,
          hasPrev: currentPage > 1,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}
