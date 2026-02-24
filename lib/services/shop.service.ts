// lib/services/shop.service.ts
import api from "@/lib/api";
import type { ApiResponse, ApiShop } from "@/types/api";


/**
 * Ambil shop pertama / default
 */
export async function getDefaultShop(): Promise<ApiShop | null> {
  const res = await api.get<ApiResponse<ApiShop>>("/shop");
  // Ambil item pertama dari responseObject
  const shop = res.data.responseObject;
  return shop;
}

/**
 * Update single shop
 */
export async function updateDefaultShop(formData: FormData): Promise<ApiShop> {
  // Ambil ID shop pertama
  const shop = await getDefaultShop();
  if (!shop) throw new Error("Shop not found");

  const res = await api.patch<ApiResponse<ApiShop>>(`/shop`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to update shop");
  }

  return res.data.responseObject;
}
