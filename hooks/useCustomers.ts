// hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as customerService from "@/lib/services/customer.service";
import type { CustomerQueryParams } from "@/types/api";

export const customerKeys = {
    all: ["customers"] as const,
    lists: () => [...customerKeys.all, "list"] as const,
    list: (params: CustomerQueryParams) => [...customerKeys.lists(), params] as const,
    details: () => [...customerKeys.all, "detail"] as const,
    detail: (id: string) => [...customerKeys.details(), id] as const,
};

export function useCustomers(params?: CustomerQueryParams) {
    return useQuery({
        queryKey: customerKeys.list(params || {}),
        queryFn: () => customerService.fetchCustomers(params),
    });
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: () => customerService.getCustomer(id),
        enabled: !!id,
    });
}

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: customerService.CustomerCreatePayload) =>
            customerService.createCustomer(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
    });
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<customerService.CustomerCreatePayload> }) =>
            customerService.updateCustomer(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
        },
    });
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => customerService.deleteCustomer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
    });
}

export function useImportCustomers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => customerService.importCustomers(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
    });
}

export function useExportCustomers() {
    return useMutation({
        mutationFn: () => customerService.exportCustomers(),
        onSuccess: (blob) => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `customers_${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
}

