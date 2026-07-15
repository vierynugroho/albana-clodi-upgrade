"use client";

import { ProductTable } from "@/components/product/ProductTable";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductExportDialog } from "@/components/product/ProductExportDialog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  Loader2,
  Download,
  Folder,
  Barcode,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  useInfiniteProducts,
  useDeleteProduct,
  useExportProducts,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { mapApiProductsToProducts } from "@/lib/mappers";
import { getApiErrorMessage } from "@/lib/utils";
import type { Product } from "@/types";
import type { ProductQueryParams } from "@/types/api";
import { ProductStats } from "@/components/product/ProductStats";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

export default function ProductPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<ProductQueryParams>({});
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteProducts(filters);

  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();

  const exportMutation = useExportProducts();

  const handleExport = (exportParams: {
    startDate?: string;
    endDate?: string;
    month?: string;
    year?: string;
    week?: string;
  }) => {
    exportMutation.mutate(exportParams, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Data produk berhasil diexport",
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

  const products: Product[] = useMemo(() => {
    if (!data) return [];
    const allItems = data.pages.flatMap((page) => page);
    return mapApiProductsToProducts(allItems);
  }, [data]);

  const handleEdit = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleDelete = (productId: string) => {
    if (!confirm("Hapus produk ini?")) return;

    deleteMutation.mutate(productId, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Produk berhasil dihapus",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal menghapus produk",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });
  };

  const handleView = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  if (isError) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data produk"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Package className="h-7 w-7 text-success" />
            Products
          </h1>
          <p className="page-description">Kelola semua data produk Anda</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/products/categories")}
          >
            <Folder className="mr-2 h-4 w-4" />
            Kategori
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/products/print-barcode")}
          >
            <Barcode className="mr-2 h-4 w-4" />
            Cetak Barcode
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => router.push("/products/add")}
            variant="gradient"
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Product
          </Button>
        </div>
      </div>

      <ProductFilters
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        isLoadingOptions={isLoadingCategories}
      />

      <ProductStats isLoading={isLoading} products={products} />

      <ProductTable
        isLoading={isLoading}
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {hasNextPage && (
        <div className="flex justify-center pt-4 pb-8">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="min-w-50"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat lebih banyak...
              </>
            ) : (
              "Muat Lebih Banyak"
            )}
          </Button>
        </div>
      )}

      <ProductExportDialog
        isOpen={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
      />
    </div>
  );
}
