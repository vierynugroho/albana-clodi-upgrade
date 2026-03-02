// hooks/useExpenses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as expenseService from "@/lib/services/expense.service";
import type { ExpenseQueryParams, ExpenseCreatePayload, ExportFilterParams } from "@/types/api";

export const expenseKeys = {
    all: ["expenses"] as const,
    lists: () => [...expenseKeys.all, "list"] as const,
    list: (params: ExpenseQueryParams) => [...expenseKeys.lists(), params] as const,
    details: () => [...expenseKeys.all, "detail"] as const,
    detail: (id: string) => [...expenseKeys.details(), id] as const,
    stats: () => [...expenseKeys.all, "stats"] as const,
};

export function useExpenses(params?: ExpenseQueryParams) {
    return useQuery({
        queryKey: expenseKeys.list(params || {}),
        queryFn: () => expenseService.fetchExpenses(params),
    });
}

export function useExpense(id: string) {
    return useQuery({
        queryKey: expenseKeys.detail(id),
        queryFn: () => expenseService.getExpense(id),
        enabled: !!id,
    });
}

export function useExpenseStats() {
    return useQuery({
        queryKey: expenseKeys.stats(),
        queryFn: async () => {
            // Fetch all expenses to calculate stats
            const result = await expenseService.fetchExpenses();

            // Calculate current month expenses
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const thisMonthExpenses = result.data.filter((expense) => {
                const expenseDate = new Date(expense.expenseDate);
                return (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                );
            });

            const thisMonthTotal = thisMonthExpenses.reduce(
                (sum, expense) => sum + expense.totalPrice,
                0
            );

            // Calculate last month expenses for comparison
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

            const lastMonthExpenses = result.data.filter((expense) => {
                const expenseDate = new Date(expense.expenseDate);
                return (
                    expenseDate.getMonth() === lastMonth &&
                    expenseDate.getFullYear() === lastMonthYear
                );
            });

            const lastMonthTotal = lastMonthExpenses.reduce(
                (sum, expense) => sum + expense.totalPrice,
                0
            );

            // Calculate trend percentage
            const monthTrend = lastMonthTotal > 0
                ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
                : 0;

            // Calculate average per month (using available data)
            const months = new Set(
                result.data.map((expense) => {
                    const date = new Date(expense.expenseDate);
                    return `${date.getFullYear()}-${date.getMonth()}`;
                })
            );
            const averagePerMonth = months.size > 0
                ? result.totalExpenses / months.size
                : 0;

            // Find largest expense category (by item name)
            const expenseByItem = result.data.reduce((acc, expense) => {
                const name = expense.itemName.toLowerCase();
                acc[name] = (acc[name] || 0) + expense.totalPrice;
                return acc;
            }, {} as Record<string, number>);

            const largestCategory = Object.entries(expenseByItem).sort(
                (a, b) => b[1] - a[1]
            )[0];

            const largestPercentage = result.totalExpenses > 0 && largestCategory
                ? ((largestCategory[1] / result.totalExpenses) * 100).toFixed(0)
                : 0;

            return {
                totalExpenses: result.totalExpenses,
                totalData: result.totalData,
                thisMonthTotal,
                thisMonthCount: thisMonthExpenses.length,
                lastMonthTotal,
                monthTrend: Math.round(monthTrend),
                averagePerMonth: Math.round(averagePerMonth),
                largestCategory: largestCategory?.[0] || "-",
                largestPercentage: `${largestPercentage}%`,
            };
        },
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ExpenseCreatePayload) => expenseService.createExpense(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
            queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
        },
    });
}

export function useUpdateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ExpenseCreatePayload }) =>
            expenseService.updateExpense(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
            queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
        },
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => expenseService.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
            queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
        },
    });
}

// --- Old useExportExpenses (tanpa query params) ---
// export function useExportExpenses() {
//     return useMutation({
//         mutationFn: () => expenseService.exportExpenses(),
//         ...
//     });
// }
// --- End old useExportExpenses ---

export function useExportExpenses() {
    return useMutation({
        mutationFn: (params?: ExportFilterParams) => expenseService.exportExpenses(params),
        onSuccess: (blob) => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `expenses_${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
}

export function useImportExpenses() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => expenseService.importExpenses(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
            queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
        },
    });
}
