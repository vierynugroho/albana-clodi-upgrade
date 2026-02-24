// lib/services/sales-channel.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiSalesChannel,
    PaginatedResponse,
    SalesChannelCreatePayload,
    SalesChannelQueryParams,
} from "@/types/api";
export type { SalesChannelCreatePayload, SalesChannelQueryParams } from "@/types/api";


export async function fetchSalesChannels(params?: SalesChannelQueryParams): Promise<ApiSalesChannel[]> {
    const queryParams = { limit: 99999, ...params };
    const res = await api.get<PaginatedResponse<ApiSalesChannel>>("/sales-channels", { params: queryParams });
    return res.data?.responseObject || [];
}

export async function getSalesChannel(id: string): Promise<ApiSalesChannel | null> {
    const res = await api.get<ApiResponse<ApiSalesChannel>>(`/sales-channels/${id}`);
    return res.data?.responseObject || null;
}

export async function createSalesChannel(payload: SalesChannelCreatePayload): Promise<ApiSalesChannel> {
    const res = await api.post<ApiResponse<ApiSalesChannel>>("/sales-channels", payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create sales channel");
    }
    return res.data.responseObject;
}

export async function updateSalesChannel(id: string, payload: Partial<SalesChannelCreatePayload>): Promise<ApiSalesChannel> {
    const res = await api.put<ApiResponse<ApiSalesChannel>>(`/sales-channels/${id}`, payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update sales channel");
    }
    return res.data.responseObject;
}

export async function deleteSalesChannel(id: string): Promise<ApiSalesChannel | null> {
    const res = await api.delete<ApiResponse<ApiSalesChannel>>(`/sales-channels/${id}`);
    // Only throw error if API explicitly returns success: false
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to delete sales channel");
    }
    return res.data?.responseObject || null;
}
