"use client";

import { useState, memo, useCallback } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import DropdownButton from "../ui/DropdownButton";
import { useCategories } from "@/hooks/useCategories";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (product: Product) => void;
}

const dropdownData = {
  title: "Actions",
  text: ["Import Product", "Export Product"],
  url: ["/products/import/excel", "/products/export/excel"],
};

type ProductType = Product["type"];
type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "info"
  | "pink"
  | "purple"
  | "cyan";

const typeConfig: Record<
  ProductType,
  { label: string; variant: BadgeVariant }
> = {
  barang_sendiri: { label: "Barang Sendiri", variant: "success" },
  suplier: { label: "Supplier", variant: "info" },
  pre_order: { label: "Pre Order", variant: "warning" },
};

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterChange: (value: string) => void;
  categories: { id: string; name: string }[];
}

const Toolbar = memo(function Toolbar({
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
  categories,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <Input
          placeholder="Cari produk atau SKU..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
          leftIcon={<Search className="h-4 w-4" />}
        />

        <select
          value={filterCategory}
          onChange={(e) => onFilterChange(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <DropdownButton data={dropdownData} />
    </div>
  );
});

const getStockConfig = (
  stock: number
): { variant: BadgeVariant; label: string } => {
  if (stock === 0)
    return { variant: "destructive" as BadgeVariant, label: "Habis" };
  if (stock < 10) return { variant: "warning", label: `${stock} pcs` };
  return { variant: "success", label: `${stock} pcs` };
};

interface ProductRowProps {
  product: Product;
  index: number;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductRow = memo(function ProductRow({
  product,
  index,
  onView,
  onEdit,
  onDelete,
}: ProductRowProps) {
  const typeConf = typeConfig[product.type];
  const stockConf = getStockConfig(product.stock);

  // Random gradient for product image placeholder
  const gradientColors = [
    "from-primary/20 to-purple/20",
    "from-success/20 to-teal/20",
    "from-info/20 to-cyan/20",
    "from-warning/20 to-orange/20",
    "from-pink/20 to-purple/20",
  ];
  const gradientIndex = index % gradientColors.length;

  return (
    <tr
      className="border-b transition-colors hover:bg-muted/50 group animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <td className="p-4">
        <div
          className={`h-12 w-12 rounded-xl bg-linear-to-br ${gradientColors[gradientIndex]} flex items-center justify-center`}
        >
          <Package className="h-6 w-6 text-foreground/60" />
        </div>
      </td>
      <td className="p-4">
        <div>
          <p className="font-semibold text-sm">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            {product.variants.length} variant
          </p>
        </div>
      </td>
      <td className="p-4">
        <code className="text-xs bg-muted px-2 py-1 rounded-md font-mono">
          {product.sku}
        </code>
      </td>
      <td className="p-4">
        <span className="text-sm">{product.category}</span>
      </td>
      <td className="p-4">
        <Badge variant={typeConf.variant} dot>
          {typeConf.label}
        </Badge>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <p className="text-sm font-bold gradient-text">
            {formatCurrency(product.prices.normal)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Agent: {formatCurrency(product.prices.agent)}
          </p>
        </div>
      </td>
      <td className="p-4">
        <Badge variant={stockConf.variant}>{stockConf.label}</Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton color="info" size="sm" onClick={() => onView(product)}>
            <Eye className="h-4 w-4" />
          </IconButton>
          <IconButton color="warning" size="sm" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4" />
          </IconButton>
          <IconButton
            color="destructive"
            size="sm"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </td>
    </tr>
  );
});

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-muted/20">
      <p className="text-sm text-muted-foreground">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">
          {startIndex + 1} - {Math.min(endIndex, totalItems)}
        </span>{" "}
        dari <span className="font-semibold text-foreground">{totalItems}</span>{" "}
        produk
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
          (page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onView,
}: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch categories for filter dropdown
  const { data: categories = [] } = useCategories();

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
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="space-y-4">
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        categories={categories}
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-16">
                  Foto
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Produk
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  SKU
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Kategori
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Jenis
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Harga
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Stock
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-32">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="py-12">
                      <div className="h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <Package className="h-8 w-8 text-success" />
                      </div>
                      <p className="text-base font-semibold">
                        Tidak ada produk
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery
                          ? "Coba ubah kata kunci pencarian"
                          : "Belum ada produk yang tersedia"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, index) => (
                  <ProductRow
                    key={index}
                    product={product}
                    index={index}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredProducts.length}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  );
}
