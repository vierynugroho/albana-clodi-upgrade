// lib/services/payment-method.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiPaymentMethod,
    PaginatedResponse,
    PaymentMethodCreatePayload,
    PaymentMethodQueryParams,
} from "@/types/api";
export type { PaymentMethodCreatePayload, PaymentMethodQueryParams } from "@/types/api";


export async function fetchPaymentMethods(params?: PaymentMethodQueryParams): Promise<ApiPaymentMethod[]> {
    const queryParams = { limit: 99999, ...params };
    const res = await api.get<PaginatedResponse<ApiPaymentMethod>>("/payment-methods", { params: queryParams });
    return res.data?.responseObject || [];
}

export async function getPaymentMethod(id: string): Promise<ApiPaymentMethod | null> {
    const res = await api.get<ApiResponse<ApiPaymentMethod>>(`/payment-methods/${id}`);
    return res.data?.responseObject || null;
}

export async function createPaymentMethod(payload: PaymentMethodCreatePayload): Promise<ApiPaymentMethod> {
    const res = await api.post<ApiResponse<ApiPaymentMethod>>("/payment-methods", payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create payment method");
    }
    return res.data.responseObject;
}

export async function updatePaymentMethod(id: string, payload: Partial<PaymentMethodCreatePayload>): Promise<ApiPaymentMethod> {
    const res = await api.put<ApiResponse<ApiPaymentMethod>>(`/payment-methods/${id}`, payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update payment method");
    }
    return res.data.responseObject;
}

export async function deletePaymentMethod(id: string): Promise<ApiPaymentMethod | null> {
    const res = await api.delete<ApiResponse<ApiPaymentMethod>>(`/payment-methods/${id}`);
    // Only throw error if API explicitly returns success: false
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to delete payment method");
    }
    return res.data?.responseObject || null;
}
