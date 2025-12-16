"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Edit, Trash2, Eye, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (product: Product) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onView,
}: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("all");
  const itemsPerPage = 10;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStockBadge = (stock: number) => {
    if (stock === 0) return "destructive";
    if (stock < 10) return "warning";
    return "success";
  };

  const getTypeBadge = (type: Product["type"]) => {
    const variants = {
      barang_sendiri: "default",
      suplier: "secondary",
      pre_order: "outline",
    } as const;
    return variants[type];
  };

  const getTypeText = (type: Product["type"]) => {
    const texts = {
      barang_sendiri: "Barang Sendiri",
      suplier: "Suplier",
      pre_order: "Pre Order",
    };
    return texts[type];
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari produk atau SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">Semua Kategori</option>
            <option value="Pakaian">Pakaian</option>
            <option value="Aksesoris">Aksesoris</option>
            <option value="Elektronik">Elektronik</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Gambar</th>
                <th className="p-4 text-left text-sm font-medium">
                  Nama Produk
                </th>
                <th className="p-4 text-left text-sm font-medium">SKU</th>
                <th className="p-4 text-left text-sm font-medium">Kategori</th>
                <th className="p-4 text-left text-sm font-medium">Jenis</th>
                <th className="p-4 text-left text-sm font-medium">Harga</th>
                <th className="p-4 text-left text-sm font-medium">Stock</th>
                <th className="p-4 text-left text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.variants.length} variant
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono">{product.sku}</td>
                  <td className="p-4 text-sm">{product.category}</td>
                  <td className="p-4">
                    <Badge variant={getTypeBadge(product.type)}>
                      {getTypeText(product.type)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {formatCurrency(product.prices.normal)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Agent: {formatCurrency(product.prices.agent)}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={getStockBadge(product.stock)}>
                      {product.stock} pcs
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
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
            {Math.min(startIndex + itemsPerPage, filteredProducts.length)} dari{" "}
            {filteredProducts.length} produk
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
