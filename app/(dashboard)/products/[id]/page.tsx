"use client";

import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/product/ProductForm";
import { useProductDetail } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import type { ApiProductDetail } from "@/types/api";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

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
      <LoadingState />
    );
  }

  if (isError || !productData) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data produk"
        onRetry={() => refetch()}
        onBack={() => router.push("/products")}
      />
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
