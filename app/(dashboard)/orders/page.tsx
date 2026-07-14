"use client";

import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/order/OrderTable";
import { OrderFilters } from "@/components/order/OrderFilters";
import { OrderExportDialog } from "@/components/order/OrderExportDialog";
import { Plus, ShoppingCart, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useDeleteOrder, useCancelOrder, useExportOrders } from "@/hooks/useOrders";
import { useOrdersPaginated } from "@/hooks/useOrders";
import { useSalesChannels } from "@/hooks/useSalesChannels";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useCustomers } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { mapApiOrdersToOrders } from "@/lib/mappers";
import type { Order } from "@/types";
import type { OrderQueryParams } from "@/types/api";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

const ITEMS_PER_PAGE = 20;

export default function OrderPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [filters, setFilters] = useState<OrderQueryParams>({});
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [totalItems, setTotalItems] = useState(0);

  const currentCursor = cursorHistory[currentPage - 1] ?? null;

  const queryParams = useMemo(() => {
    const params: OrderQueryParams = {
      ...filters,
      limit: ITEMS_PER_PAGE,
    };
    if (currentCursor) {
      params.cursor = currentCursor;
    }
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof OrderQueryParams];
      if (value === "" || value === undefined || value === null) {
        delete params[key as keyof OrderQueryParams];
      }
    });
    return params;
  }, [filters, currentCursor]);

  const {
    data: paginatedResult,
    isLoading,
    isError,
    refetch,
  } = useOrdersPaginated(queryParams);

  const apiOrders = paginatedResult?.data ?? [];
  const meta = useMemo(() => paginatedResult?.meta ?? {}, [paginatedResult?.meta]);

  useEffect(() => {
    const nc = meta.nextCursor ?? null;
    setNextCursor(nc);
    setHasNext(Boolean(nc) && apiOrders.length > 0);

    if (typeof meta.totalItems === "number") {
      setTotalItems(meta.totalItems);
    }
  }, [meta, apiOrders.length]);

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

  const { data: salesChannels = [], isLoading: isLoadingSalesChannels } = useSalesChannels();
  const { data: paymentMethods = [], isLoading: isLoadingPaymentMethods } = usePaymentMethods();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();

  const isLoadingOptions = isLoadingSalesChannels || isLoadingPaymentMethods || isLoadingCustomers;

  const deleteMutation = useDeleteOrder();
  const cancelMutation = useCancelOrder();
  const exportMutation = useExportOrders();

  const orders: Order[] = mapApiOrdersToOrders(apiOrders);
  const totalPages = totalItems > 0
    ? Math.ceil(totalItems / ITEMS_PER_PAGE)
    : currentPage + (hasNext ? 1 : 0);

  const handlePageChange = useCallback((page: number) => {
    if (isLoading) return;
    if (page < 1) return;

    if (page === 1) {
      setCursorHistory([null]);
      setCurrentPage(1);
      return;
    }

    if (page < currentPage) {
      setCurrentPage(page);
      return;
    }

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
  }, [isLoading, currentPage, hasNext, nextCursor]);

  const handleExportClick = () => {
    setIsExportDialogOpen(true);
  };

  const handleExport = (exportParams: { startDate?: string; endDate?: string; month?: string; year?: string; week?: string }) => {
    exportMutation.mutate(exportParams, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Data order berhasil diexport",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal mengexport",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });
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
        const rawMessage = getApiErrorMessage(error);
        // Tampilkan pesan ramah untuk error foreign key installments
        const description = rawMessage.toLowerCase().includes("installment")
          ? "Order ini memiliki data cicilan sehingga tidak dapat dihapus. Hubungi administrator untuk menghapus data cicilan terlebih dahulu."
          : rawMessage;
        toast({
          title: "Gagal menghapus order",
          description,
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
          description: getApiErrorMessage(error),
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

  if (isLoading && apiOrders.length === 0) {
    return (
      <LoadingState />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data orders"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-primary" />
            Order
          </h1>
          <p className="page-description">Kelola semua order pelanggan Anda</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportClick}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push("/orders/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Order
          </Button>
        </div>
      </div>

      <OrderFilters
        filters={filters}
        onFiltersChange={setFilters}
        salesChannels={salesChannels}
        paymentMethods={paymentMethods}
        customers={customers}
        isLoadingOptions={isLoadingOptions}
      />

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

      <OrderExportDialog
        isOpen={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
      />
    </div>
  );
}
