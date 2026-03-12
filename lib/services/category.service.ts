// lib/services/category.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiCategory,
    CategoryQueryParams,
    CategoryCreatePayload,
    PaginatedResponse
} from "@/types/api";

// Fetch all categories with optional query parameters
export async function fetchCategories(params?: CategoryQueryParams): Promise<ApiCategory[]> {
    const queryParams: Record<string, unknown> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.order) queryParams.order = params.order;

    const res = await api.get<PaginatedResponse<ApiCategory>>("/categories", { params: queryParams });
    return res.data?.responseObject || [];
}

// Get a single category by ID
export async function getCategory(id: string): Promise<ApiCategory | null> {
    const res = await api.get<ApiResponse<ApiCategory>>(`/categories/${id}`);
    return res.data?.responseObject || null;
}

// Create a new category
export async function createCategory(payload: CategoryCreatePayload): Promise<ApiCategory> {
    const res = await api.post<ApiResponse<ApiCategory>>("/categories", payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Gagal membuat kategori");
    }
    return res.data.responseObject;
}

// Update an existing category
export async function updateCategory(id: string, payload: CategoryCreatePayload): Promise<ApiCategory> {
    const res = await api.put<ApiResponse<ApiCategory>>(`/categories/${id}`, payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Gagal mengupdate kategori");
    }
    return res.data.responseObject;
}

// Delete a category by ID
export async function deleteCategory(id: string): Promise<ApiCategory | null> {
    const res = await api.delete<ApiResponse<ApiCategory>>(`/categories/${id}`);
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Gagal menghapus kategori");
    }
    return res.data?.responseObject || null;
}
