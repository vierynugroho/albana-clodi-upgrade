// lib/services/shipping.service.ts
import api from "@/lib/api";
import type { ApiResponse, ShippingCostParams, ShippingCostResponse } from "@/types/api";


export async function calculateShippingCost(params: ShippingCostParams): Promise<ShippingCostResponse> {
    const res = await api.get<ApiResponse<ShippingCostResponse>>("/shipping-cost/calculate", { params });
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to calculate shipping cost");
    }
    return res.data.responseObject;
}
