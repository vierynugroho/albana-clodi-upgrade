"use client";

import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/product/ProductForm";
import { useProductDetail } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import type { ApiProductDetail } from "@/types/api";

function mapApiProductToFormValues(apiProduct: ApiProductDetail) {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    categoryId: apiProduct.categoryId || "",
    type: apiProduct.type,
    description: apiProduct.description || "",
    weight: apiProduct.weight,
    isPublish: apiProduct.isPublish ?? true,
    showStock: true,
    productDiscount: {
      id: apiProduct.ProductDiscount?.[0]?.id,
      type: apiProduct.ProductDiscount?.[0]?.type || "PERCENTAGE",
      value: apiProduct.ProductDiscount?.[0]?.value || 0,
    },
    productVariants: apiProduct.productVariants?.map((v) => ({
      id: v.id,
      sku: v.sku || "",
      stock: v.stock || 0,
      size: v.size || "",
      color: v.color || "",
      barcode: v.barcode || "",
      imageUrl: v.imageUrl || null,
      productPrices: {
        id: v.productPrices?.id,
        productVariantId: v.productPrices?.productVariantId,
        buy: v.productPrices?.buy || 0,
        agent: v.productPrices?.agent || 0,
        reseller: v.productPrices?.reseller || 0,
        member: v.productPrices?.member || 0,
        normal: v.productPrices?.normal || 0,
        createdAt: v.productPrices?.createdAt,
        updatedAt: v.productPrices?.updatedAt,
      },
      productWholesalers: v.productWholesalers || [],
    })) || [
      {
        sku: "",
        stock: 0,
        size: "",
        color: "",
        barcode: "",
        imageUrl: null,
        productPrices: {
          buy: 0,
          agent: 0,
          reseller: 0,
          member: 0,
          normal: 0,
        },
        productWholesalers: [],
      },
    ],
  };
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useProductDetail(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data produk...</p>
      </div>
    );
  }

  if (isError || !productData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data produk
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/products")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Coba lagi
          </Button>
        </div>
      </div>
    );
  }

  const initialData = mapApiProductToFormValues(
    productData as ApiProductDetail,
  );

  return (
    <div className="min-h-screen rounded-2xl border border-border bg-card p-5 xl:p-8">
      <ProductForm initialData={initialData} isEditMode={true} />
    </div>
  );
}
