// lib/services/delivery-place.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiDeliveryPlace,
    PaginatedResponse,
    DeliveryPlaceCreatePayload,
    DeliveryPlaceQueryParams,
} from "@/types/api";


export async function fetchDeliveryPlaces(params?: DeliveryPlaceQueryParams): Promise<ApiDeliveryPlace[]> {
    const queryParams = { limit: 99999, ...params };
    const res = await api.get<PaginatedResponse<ApiDeliveryPlace>>("/delivery-places", { params: queryParams });
    return res.data?.responseObject || [];
}

export async function getDeliveryPlace(id: string): Promise<ApiDeliveryPlace | null> {
    const res = await api.get<ApiResponse<ApiDeliveryPlace>>(`/delivery-places/${id}`);
    return res.data?.responseObject || null;
}

export async function createDeliveryPlace(payload: DeliveryPlaceCreatePayload): Promise<ApiDeliveryPlace> {
    const res = await api.post<ApiResponse<ApiDeliveryPlace>>("/delivery-places", payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create delivery place");
    }
    return res.data.responseObject;
}

export async function updateDeliveryPlace(id: string, payload: Partial<DeliveryPlaceCreatePayload>): Promise<ApiDeliveryPlace> {
    const res = await api.put<ApiResponse<ApiDeliveryPlace>>(`/delivery-places/${id}`, payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update delivery place");
    }
    return res.data.responseObject;
}

export async function deleteDeliveryPlace(id: string): Promise<ApiDeliveryPlace | null> {
    const res = await api.delete<ApiResponse<ApiDeliveryPlace>>(`/delivery-places/${id}`);
    // Only throw error if API explicitly returns success: false
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to delete delivery place");
    }
    return res.data?.responseObject || null;
}
