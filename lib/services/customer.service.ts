// lib/services/customer.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiCustomer,
    CustomerQueryParams,
    PaginatedResponse,
    CustomerCreatePayload,
} from "@/types/api";


export async function fetchCustomers(params?: CustomerQueryParams): Promise<ApiCustomer[]> {
    // Set default limit to get all data if not specified
    const queryParams = {
        limit: 50, // Optimized from 99999 to 50
        ...params,
    };

    const res = await api.get<PaginatedResponse<ApiCustomer>>("/customers", { params: queryParams });
    // API returns { responseObject: { data: [...], meta: {...} } } or { responseObject: [...] }
    const responseObj = res.data?.responseObject;

    if (Array.isArray(responseObj)) {
        return responseObj;
    }
    // Handle nested data structure
    if (responseObj && typeof responseObj === 'object' && 'data' in responseObj) {
        return (responseObj as { data: ApiCustomer[] }).data || [];
    }
    return [];
}

export async function getCustomer(id: string): Promise<ApiCustomer | null> {
    const res = await api.get<ApiResponse<ApiCustomer>>(`/customers/${id}`);
    return res.data?.responseObject || null;
}

export async function createCustomer(payload: CustomerCreatePayload): Promise<ApiCustomer> {
    const res = await api.post<ApiResponse<ApiCustomer>>("/customers", payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create customer");
    }
    return res.data.responseObject;
}

export async function updateCustomer(id: string, payload: Partial<CustomerCreatePayload>): Promise<ApiCustomer> {
    const res = await api.put<ApiResponse<ApiCustomer>>(`/customers/${id}`, payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update customer");
    }
    return res.data.responseObject;
}

export async function deleteCustomer(id: string): Promise<ApiCustomer | null> {
    const res = await api.delete<ApiResponse<ApiCustomer>>(`/customers/${id}`);
    // Only throw error if API explicitly returns success: false
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to delete customer");
    }
    return res.data?.responseObject || null;
}

// Import customers from Excel file
// POST /customers/import/excel with multipart/form-data
export async function importCustomers(file: File): Promise<{ success: boolean; message: string; totalImported?: number }> {
    try {
        const formData = new FormData();
        formData.append("customers_data", file);

        const res = await api.post<ApiResponse<{ totalImported: number }>>("/customers/import/excel", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        if (!res.data?.success) {
            throw new Error(res.data?.message || "Import gagal");
        }

        return {
            success: res.data?.success || false,
            message: res.data?.message || "Import berhasil",
            totalImported: res.data?.responseObject?.totalImported,
        };
    } catch (error) {
        console.error("Import error:", error);
        throw error;
    }
}

// Export customers to Excel file
// POST /customers/export/excel with multipart/form-data (empty body)
export async function exportCustomers(): Promise<Blob> {
    try {
        const formData = new FormData();
        // API expects customers_data field but can be empty for export
        formData.append("customers_data", "");

        const res = await api.post("/customers/export/excel", formData, {
            responseType: "blob",
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        });
        return res.data;
    } catch (error) {
        console.error("Export error:", error);
        throw new Error("Gagal mengekspor data. Pastikan Anda sudah login.");
    }
}

