"use client";

import { ProductTable } from "@/components/product/ProductTable";
import { Button } from "@/components/ui/button";
import { Plus, Package, Loader2, RefreshCw, Download, Folder, Barcode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useInfiniteProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { mapApiProductsToProducts } from "@/lib/mappers";
import { exportProducts } from "@/lib/services/product.service";
import type { Product } from "@/types";
import { ProductStats } from "@/components/product/ProdukStats";

export default function ProductPage() {
  const router = useRouter();

  // Use infinite query for products
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteProducts();

  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportProducts("excel");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast({
        title: "Berhasil",
        description: "Data produk berhasil diexport",
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

  // Flatten all pages into a single array of products
  // Each page is ApiProductListItem[], we need to map each item to frontend Product type
  // useInfiniteQuery data.pages is Array<ApiProductListItem[]>
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

  // Loading state (initial load only)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data produk...</p>
      </div>
    );
  }

  // Error state
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
      {/* Page Header */}
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
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
          <Button onClick={() => router.push("/products/add")} variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ProductStats products={products} />

      {/* Table */}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Load More Button */}
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
