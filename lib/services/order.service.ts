// lib/services/order.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiOrder,
    OrderCreatePayload,
    OrderQueryParams,
    PaginatedResponse,
    CursorPaginatedResponse,
    CursorPaginationMeta,
} from "@/types/api";

export async function fetchOrders(params?: OrderQueryParams): Promise<ApiOrder[]> {
    // Set default limit to get all data if not specified
    const queryParams = {
        limit: 99999,
        ...params,
    };
    const res = await api.get<PaginatedResponse<ApiOrder>>("/orders", { params: queryParams });
    const ro = res.data?.responseObject;
    
    // Normalize: backend may return { data, meta } object or flat array
    if (ro && typeof ro === "object" && !Array.isArray(ro) && Array.isArray((ro as any).data)) {
        return (ro as any).data;
    }

    return Array.isArray(ro) ? ro : [];
}

const ITEMS_PER_PAGE = 20;

/**
 * Fetch orders with cursor-based pagination.
 * Returns { data, meta } with nextCursor for navigation.
 */
export async function fetchOrdersPaginated(
    params?: OrderQueryParams
): Promise<{ data: ApiOrder[]; meta: CursorPaginationMeta }> {
    const queryParams = {
        limit: ITEMS_PER_PAGE,
        ...params,
    };
    const res = await api.get<CursorPaginatedResponse<ApiOrder>>("/orders", { params: queryParams });

    const ro = res.data?.responseObject;

    // Normalize: backend may return { data, meta } object or flat array
    if (ro && typeof ro === "object" && !Array.isArray(ro) && Array.isArray(ro.data)) {
        return {
            data: ro.data,
            meta: ro.meta || {},
        };
    }

    // Fallback: flat array response
    if (Array.isArray(ro)) {
        return {
            data: ro,
            meta: {
                totalItems: ro.length,
                limit: ITEMS_PER_PAGE,
                nextCursor: null,
                usedCursor: false,
            },
        };
    }

    return { data: [], meta: {} };
}

export async function getOrder(id: string): Promise<ApiOrder | null> {
    const res = await api.get<ApiResponse<ApiOrder>>(`/orders/${id}`);
    return res.data?.responseObject || null;
}

export async function getOrderById(
  id: string
): Promise<ApiOrder | null> {
  const res = await api.get<ApiResponse<ApiOrder>>(`/orders/${id}`);
  return res.data?.responseObject || null;
}

export async function createOrder(payload: OrderCreatePayload): Promise<ApiOrder> {
    const res = await api.post<ApiResponse<ApiOrder>>("/orders", payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create order");
    }
    return res.data.responseObject;
}

export async function updateOrder(id: string, payload: OrderCreatePayload): Promise<ApiOrder> {
    const res = await api.put<ApiResponse<ApiOrder>>(`/orders/${id}`, payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update order");
    }
    return res.data.responseObject;
}

export async function deleteOrder(id: string): Promise<ApiOrder | null> {
    const res = await api.delete<ApiResponse<ApiOrder>>(`/orders/${id}`);
    // Only throw error if API explicitly returns success: false
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to delete order");
    }
    return res.data?.responseObject || null;
}

export async function cancelOrder(id: string): Promise<ApiOrder | null> {
    const res = await api.post<ApiResponse<ApiOrder>>(`/orders/${id}/cancel`);
    // Only throw error if API explicitly returns success: false
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to cancel order");
    }
    return res.data?.responseObject || null;
}

export async function exportOrders(format: "excel" = "excel"): Promise<Blob> {
    const res = await api.get(`/orders/export/${format}`, { responseType: "blob" });
    return res.data;
}
