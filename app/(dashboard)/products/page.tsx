"use client";

import { ProductTable } from "@/components/product/ProductTable";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Button } from "@/components/ui/button";
import { Plus, Package, Loader2, RefreshCw, Download, Folder, Barcode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useInfiniteProducts, useDeleteProduct, useExportProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { mapApiProductsToProducts } from "@/lib/mappers";
import type { Product } from "@/types";
import type { ProductQueryParams } from "@/types/api";
import { ProductStats } from "@/components/product/ProdukStats";

export default function ProductPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<ProductQueryParams>({});

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteProducts(filters);

  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();

  const exportMutation = useExportProducts();

  const handleExport = () => {
    const exportParams = {
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.month && { month: filters.month }),
      ...(filters.year && { year: String(filters.year) }),
      ...(filters.week && { week: filters.week }),
    };

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
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
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
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      },
    });
  };

  const handleView = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data produk...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data produk
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Package className="h-7 w-7 text-success" />
            Products
          </h1>
          <p className="page-description">Kelola semua data produk Anda</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => router.push("/products/categories")}>
            <Folder className="mr-2 h-4 w-4" />
            Kategori
          </Button>
          <Button variant="outline" onClick={() => router.push("/products/print-barcode")}>
            <Barcode className="mr-2 h-4 w-4" />
            Cetak Barcode
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exportMutation.isPending}>
            {exportMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {exportMutation.isPending ? "Mengexport..." : "Export"}
          </Button>
          <Button onClick={() => router.push("/products/add")} variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Product
          </Button>
        </div>
      </div>

      <ProductFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        isLoadingOptions={isLoadingCategories}
      />

      <ProductStats products={products} />

      <ProductTable
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
    </div>
  );
}
