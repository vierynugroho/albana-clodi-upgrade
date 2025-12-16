"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Printer,
  Eye,
  Edit,
  Trash2,
  CheckSquare,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onView: (order: Order) => void;
  onPrint: (orderIds: string[]) => void;
}

export function OrderTable({
  orders,
  onEdit,
  onDelete,
  onView,
  onPrint,
}: OrderTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map((order) => order.id));
    }
  };

  const getStatusBadge = (status: Order["paymentStatus"]) => {
    const variants = {
      lunas: "success",
      cicilan: "warning",
      belum_dibayar: "outline",
      dibatalkan: "destructive",
    } as const;
    return variants[status];
  };

  const getStatusText = (status: Order["paymentStatus"]) => {
    const texts = {
      lunas: "Lunas",
      cicilan: "Cicilan",
      belum_dibayar: "Belum Dibayar",
      dibatalkan: "Dibatalkan",
    };
    return texts[status];
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        {selectedOrders.length > 0 && (
          <Button onClick={() => onPrint(selectedOrders)} size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Cetak ({selectedOrders.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === paginatedOrders.length}
                    onChange={toggleSelectAll}
                    className="rounded border-input"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium">No Order</th>
                <th className="p-4 text-left text-sm font-medium">Tanggal</th>
                <th className="p-4 text-left text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-sm font-medium">
                  Sales Channel
                </th>
                <th className="p-4 text-left text-sm font-medium">Total</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                      className="rounded border-input"
                    />
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {order.orderNumber}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatDate(order.date)}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.city}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{order.salesChannel}</td>
                  <td className="p-4 text-sm font-medium">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusBadge(order.paymentStatus)}>
                      {getStatusText(order.paymentStatus)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPrint([order.id])}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t p-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredOrders.length)} dari{" "}
            {filteredOrders.length} order
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
