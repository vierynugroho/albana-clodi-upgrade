
"use client";

import { useState, memo, useCallback } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  Printer,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

//   Toolbar
interface TableToolbarProps {
  selectedCount: number;
  onPrintSelected: () => void;
}

const TableToolbar = memo(function TableToolbar({
  selectedCount,
  onPrintSelected,
}: TableToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-end">
      <Button
        size="sm"
        variant="info"
        className="gap-2"
        onClick={onPrintSelected}
      >
        <Printer className="h-4 w-4" />
        Cetak ({selectedCount})
      </Button>
    </div>
  );
});

//   Payment Status
type PaymentStatus = Order["paymentStatus"];
type BadgeVariant = "success" | "warning" | "outline" | "destructive";

const getPaymentStatusConfig = (
  status: PaymentStatus
): { variant: BadgeVariant; label: string } => {
  const configs: Record<
    PaymentStatus,
    { variant: BadgeVariant; label: string }
  > = {
    lunas: { variant: "success", label: "Settlement" },
    cicilan: { variant: "warning", label: "Cicilan" },
    belum_dibayar: { variant: "outline", label: "Belum Dibayar" },
    dibatalkan: { variant: "destructive", label: "Dibatalkan" },
  };
  return configs[status];
};

//   Order Card
interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  index: number;
  onToggleSelect: (orderId: string) => void;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onPrint: (orderIds: string[]) => void;
  onDelete: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
}

const OrderCard = memo(function OrderCard({
  order,
  isSelected,
  index,
  onToggleSelect,
  onView,
  onEdit,
  onPrint,
  onDelete,
}: OrderCardProps) {
  const statusConfig = getPaymentStatusConfig(order.paymentStatus);

  return (
    <Card
      className="p-4 hover:bg-muted/30 transition group animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* ================= Header ================= */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(order.id)}
            className="mt-1 h-4 w-4 accent-primary"
          />

          <div>
            <p className="font-semibold text-sm text-primary">
              #{order.orderNumber}
            </p>
            <p className="text-xs text-muted-foreground">
              dari {order.salesChannel} (
              {formatDate(order.date)})
            </p>
            <p className="text-xs text-muted-foreground">
              ⚖️ {order.weight ?? 0} gram
            </p>
          </div>
        </div>

        <Badge variant={statusConfig.variant}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* ================= Content ================= */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ===== Customer Info ===== */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            Pemesan
          </p>
          <p className="text-sm font-medium">
            {order.customer?.name ?? "-"}
          </p>

          <span className="inline-block mt-1 text-xs font-semibold uppercase text-primary">
            {order.customer?.category ?? "-"}
          </span>

          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {order.customer?.address},{" "}
            {order.customer?.village},{" "}
            {order.customer?.district},{" "}
            {order.customer?.city},{" "}
            {order.customer?.province}{" "}
            {order.customer?.postalCode}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            📞 {order.customer?.phone ?? "-"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            ✉️ {order.customer?.email ?? "-"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            🧾 {order.note || "Catatan tidak tersedia"}
          </p>
        </div>

        {/* ===== Cost Summary ===== */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            Ringkasan Biaya
          </p>

          <ul className="text-xs space-y-1">
            <li className="flex justify-between">
              <span>Subtotal Produk</span>
              <span>{formatCurrency(order.subtotal ?? 0)}</span>
            </li>
            
            {(order.productDiscount ?? 0) > 0 && (
              <li className="flex justify-between text-green-600">
                <span>Diskon Produk</span>
                <span>-{formatCurrency(order.productDiscount ?? 0)}</span>
              </li>
            )}
            
            {(order.orderDiscount ?? 0) > 0 && (
              <li className="flex justify-between text-green-600">
                <span>Diskon Order {order.orderDiscountType === "percent" ? `(${order.orderDiscountValue}%)` : ""}</span>
                <span>-{formatCurrency(order.orderDiscount ?? 0)}</span>
              </li>
            )}

            {(order.insurance ?? 0) > 0 && (
              <li className="flex justify-between">
                <span>Asuransi</span>
                <span>{formatCurrency(order.insurance ?? 0)}</span>
              </li>
            )}

            <li className="flex justify-between">
              <span>Ongkir</span>
              <span>{formatCurrency(order.shippingCost ?? 0)}</span>
            </li>

            {(order.shippingDiscount ?? 0) > 0 && (
              <li className="flex justify-between text-green-600">
                <span>Diskon Ongkir</span>
                <span>-{formatCurrency(order.shippingDiscount ?? 0)}</span>
              </li>
            )}
          </ul>

          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between font-bold text-sm">
              <span>Grand Total</span>
              <span className="text-primary">{formatCurrency(order.total ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* ===== Products ===== */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            Produk ({order.products?.length ?? 0})
          </p>

          <div className="max-h-32 overflow-y-auto pr-2 space-y-1">
            {!order.products || order.products.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                Tidak ada produk
              </p>
            ) : (
              order.products.map((product, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2 rounded bg-muted/50"
                >
                  <p className="font-medium truncate">
                    {product.name}
                  </p>
                  <p className="text-muted-foreground">
                    {product.quantity}x
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="flex lg:justify-end items-start gap-1  transition">
          <IconButton size="sm" color="info" onClick={() => onView(order)}>
            <Eye className="h-4 w-4" />
          </IconButton>

          <IconButton size="sm" color="warning" onClick={() => onEdit(order)}>
            <Edit className="h-4 w-4" />
          </IconButton>

          <IconButton
            size="sm"
            color="purple"
            onClick={() => onPrint([order.id])}
          >
            <Printer className="h-4 w-4" />
          </IconButton>

          <IconButton
            size="sm"
            color="destructive"
            onClick={() => onDelete(order.id)}
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </Card>
  );
});

export default OrderCard;

//   Pagination
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  hasNext,
  hasPrev,
}: PaginationProps) {
  const prevDisabled = typeof hasPrev === "boolean" ? !hasPrev : currentPage === 1;
  const nextDisabled = typeof hasNext === "boolean" ? !hasNext : currentPage === totalPages;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-muted/20">
      <p className="text-sm text-muted-foreground">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">
          {startIndex + 1} – {Math.min(endIndex, totalItems)}
        </span>{" "}
        dari <span className="font-semibold">{totalItems}</span> order
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={prevDisabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="px-3 text-sm font-medium">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={nextDisabled}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

//Main Component
interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onView: (order: Order) => void;
  onPrint: (orderIds: string[]) => void;
  onCancel?: (orderId: string) => void;
  // Cursor-based pagination props (optional, for server-side pagination)
  serverPagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    onPageChange: (page: number) => void;
  };
}

export function OrderTable({
  orders,
  onEdit,
  onDelete,
  onView,
  onPrint,
  onCancel,
  serverPagination,
}: OrderTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);


  const [clientPage, setClientPage] = useState(1);
  const clientItemsPerPage = 10;

  const useServerPagination = !!serverPagination;
  const displayOrders = useServerPagination
    ? orders
    : orders.slice((clientPage - 1) * clientItemsPerPage, clientPage * clientItemsPerPage);

  const paginationProps = useServerPagination
    ? {
        currentPage: serverPagination.currentPage,
        totalPages: serverPagination.totalPages,
        startIndex: (serverPagination.currentPage - 1) * serverPagination.itemsPerPage,
        endIndex: (serverPagination.currentPage - 1) * serverPagination.itemsPerPage + orders.length,
        totalItems: serverPagination.totalItems,
        onPageChange: serverPagination.onPageChange,
        hasNext: serverPagination.hasNext,
        hasPrev: serverPagination.hasPrev,
      }
    : {
        currentPage: clientPage,
        totalPages: Math.ceil(orders.length / clientItemsPerPage),
        startIndex: (clientPage - 1) * clientItemsPerPage,
        endIndex: clientPage * clientItemsPerPage,
        totalItems: orders.length,
        onPageChange: setClientPage,
      };

  const toggleSelectOrder = useCallback((orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  return (
    <div className="space-y-4">
      <TableToolbar
        selectedCount={selectedOrders.length}
        onPrintSelected={() => onPrint(selectedOrders)}
      />

      <div className="space-y-3">
        {displayOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold">Tidak ada order</p>
            <p className="text-sm text-muted-foreground">
              Tidak ditemukan data yang sesuai
            </p>
          </Card>
        ) : (
          displayOrders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              isSelected={selectedOrders.includes(order.id)}
              onToggleSelect={toggleSelectOrder}
              onView={onView}
              onEdit={onEdit}
              onPrint={onPrint}
              onDelete={onDelete}
              onCancel={onCancel}
            />
          ))
        )}
      </div>

      {(useServerPagination ? serverPagination.totalItems > 0 : orders.length > 0) && (
        <Pagination {...paginationProps} />
      )}
    </div>
  );
}
