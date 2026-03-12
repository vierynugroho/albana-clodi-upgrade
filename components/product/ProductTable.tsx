"use client";

import { useState, memo, useCallback } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { useCurrentUser } from "@/hooks/useAuth";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (product: Product) => void;
}

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

  const { data } = useCurrentUser()
  const role = data?.responseObject.role

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
        <div className="flex items-center gap-1 transition-opacity">
          <IconButton color="info" size="sm" onClick={() => onView(product)}>
            <Eye className="h-4 w-4" />
          </IconButton>
          <IconButton color="warning" size="sm" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4" />
          </IconButton>

          {
            role?.toLocaleLowerCase() === "superadmin" ?
              <IconButton
                color="destructive"
                size="sm"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
              : <></>
          }
        </div>
      </td>
    </tr>
  );
});

// Mobile card view for products
const ProductMobileCard = memo(function ProductMobileCard({
  product,
  index,
  onView,
  onEdit,
  onDelete,
}: ProductRowProps) {
  const typeConf = typeConfig[product.type];
  const stockConf = getStockConfig(product.stock);
  const gradientColors = [
    "from-primary/20 to-purple/20",
    "from-success/20 to-teal/20",
    "from-info/20 to-cyan/20",
    "from-warning/20 to-orange/20",
    "from-pink/20 to-purple/20",
  ];
  const gradientIndex = index % gradientColors.length;

  const { data } = useCurrentUser();
  const role = data?.responseObject.role;

  return (
    <div
      className="p-4 border-b last:border-b-0 animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-12 w-12 shrink-0 rounded-xl bg-linear-to-br ${gradientColors[gradientIndex]} flex items-center justify-center`}
        >
          <Package className="h-6 w-6 text-foreground/60" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.variants.length} variant</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <IconButton color="info" size="sm" onClick={() => onView(product)}>
                <Eye className="h-4 w-4" />
              </IconButton>
              <IconButton color="warning" size="sm" onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4" />
              </IconButton>
              {role?.toLocaleLowerCase() === "superadmin" && (
                <IconButton color="destructive" size="sm" onClick={() => onDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <code className="text-xs bg-muted px-2 py-0.5 rounded-md font-mono">{product.sku}</code>
            <span className="text-xs text-muted-foreground">{product.category}</span>
            <Badge variant={typeConf.variant} dot>{typeConf.label}</Badge>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-sm font-bold gradient-text">{formatCurrency(product.prices.normal)}</p>
              <p className="text-[11px] text-muted-foreground">Agent: {formatCurrency(product.prices.agent)}</p>
            </div>
            <Badge variant={stockConf.variant}>{stockConf.label}</Badge>
          </div>
        </div>
      </div>
    </div>
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="md:hidden">
          {paginatedProducts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="py-12">
                <div className="h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-success" />
                </div>
                <p className="text-base font-semibold">Tidak ada produk</p>
                <p className="text-sm text-muted-foreground mt-1">Belum ada produk yang tersedia</p>
              </div>
            </div>
          ) : (
            paginatedProducts.map((product, index) => (
              <ProductMobileCard
                key={index}
                product={product}
                index={index}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
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
                      <p className="text-base font-semibold">Tidak ada produk</p>
                      <p className="text-sm text-muted-foreground mt-1">Belum ada produk yang tersedia</p>
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

        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={products.length}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  );
}
