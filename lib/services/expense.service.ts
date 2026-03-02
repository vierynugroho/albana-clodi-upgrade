// lib/services/expense.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiExpense,
    ExpenseCreatePayload,
    ExpenseQueryParams,
    ExpenseListResponse,
    ExpenseListResult,
    ExportFilterParams,
} from "@/types/api";


export async function fetchExpenses(params?: ExpenseQueryParams): Promise<ExpenseListResult> {
    // Set default limit to get all data if not specified
    const queryParams = {
        limit: 99999,
        ...params,
    };
    const res = await api.get<ExpenseListResponse>("/expenses", { params: queryParams });
    const responseObject = res.data?.responseObject;
    return {
        data: responseObject?.data || [],
        totalExpenses: responseObject?.totalExpenses || 0,
        totalData: responseObject?.totalData || 0,
        filterInfo: responseObject?.filterInfo || "",
    };
}

export async function getExpense(id: string): Promise<ApiExpense | null> {
    const res = await api.get<ApiResponse<ApiExpense>>(`/expenses/${id}`);
    return res.data?.responseObject || null;
}

export async function createExpense(payload: ExpenseCreatePayload): Promise<ApiExpense> {
    const res = await api.post<ApiResponse<ApiExpense>>("/expenses", payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create expense");
    }
    return res.data.responseObject;
}

export async function updateExpense(id: string, payload: ExpenseCreatePayload): Promise<ApiExpense> {
    const res = await api.put<ApiResponse<ApiExpense>>(`/expenses/${id}`, payload);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update expense");
    }
    return res.data.responseObject;
}

export async function deleteExpense(id: string): Promise<ApiExpense | null> {
    const res = await api.delete<ApiResponse<ApiExpense>>(`/expenses/${id}`);
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to delete expense");
    }
    return res.data?.responseObject || null;
}

// --- Old exportExpenses (tanpa query params) ---
// export async function exportExpenses(): Promise<Blob> {
//     try {
//         const res = await api.get("/expenses/export/excel", {
//             responseType: "blob",
//             headers: {
//                 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//             }
//         });
//         return res.data;
//     } catch (error) {
//         console.error("Export error:", error);
//         throw new Error("Gagal mengekspor data. Pastikan Anda sudah login.");
//     }
// }
// --- End old exportExpenses ---

export async function exportExpenses(params?: ExportFilterParams): Promise<Blob> {
    try {
        const res = await api.get("/expenses/export/excel", {
            responseType: "blob",
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            params: params || {},
        });
        return res.data;
    } catch (error) {
        console.error("Export error:", error);
        throw new Error("Gagal mengekspor data. Pastikan Anda sudah login.");
    }
}

export async function importExpenses(file: File): Promise<{ success: boolean; message: string }> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post<ApiResponse<unknown>>("/expenses/import/excel", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (!res.data?.success) {
            throw new Error(res.data?.message || "Import gagal");
        }

        return {
            success: res.data?.success || false,
            message: res.data?.message || "Import completed",
        };
    } catch (error) {
        console.error("Import error:", error);
        throw error;
    }
}

