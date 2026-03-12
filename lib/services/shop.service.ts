import api from "@/lib/api";
import type { ApiResponse, ApiShop } from "@/types/api";


export async function getDefaultShop(): Promise<ApiShop | null> {
  const res = await api.get<ApiResponse<ApiShop>>("/shop");
  return res.data.responseObject;
}

export async function updateDefaultShop(formData: FormData): Promise<ApiShop> {
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
