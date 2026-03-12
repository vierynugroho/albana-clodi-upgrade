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

export async function downloadExpenseExcel(params?: ExportFilterParams): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await api.get("/expenses/export/excel", {
            headers: {
                Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            responseType: "blob",
            params: params || {},
        });

        const blob = new Blob([res.data], {
            type: res.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        const contentDisposition = res.headers["content-disposition"];
        const fileName =
            contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
            "Expenses.xlsx";

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        let message = "Terjadi kesalahan saat mengexport pengeluaran";

        const axiosError = error as { response?: { data?: Blob | unknown } };
        const responseData = axiosError?.response?.data;

        if (responseData instanceof Blob) {
            try {
                const text = await responseData.text();
                const json = JSON.parse(text);
                if (json?.message) {
                    message = json.message;
                }
            } catch {

            }
        } else if (error instanceof Error) {
            message = error.message;
        }

        throw new Error(message);
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

