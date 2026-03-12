import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as paymentMethodService from "@/lib/services/payment-method.service";

export const paymentMethodKeys = {
    all: ["paymentMethods"] as const,
    lists: () => [...paymentMethodKeys.all, "list"] as const,
    list: (params: paymentMethodService.PaymentMethodQueryParams) => [...paymentMethodKeys.lists(), params] as const,
    details: () => [...paymentMethodKeys.all, "detail"] as const,
    detail: (id: string) => [...paymentMethodKeys.details(), id] as const,
};

export function usePaymentMethods(params?: paymentMethodService.PaymentMethodQueryParams) {
    return useQuery({
        queryKey: paymentMethodKeys.list(params || {}),
        queryFn: () => paymentMethodService.fetchPaymentMethods(params),
    });
}

export function usePaymentMethod(id: string) {
    return useQuery({
        queryKey: paymentMethodKeys.detail(id),
        queryFn: () => paymentMethodService.getPaymentMethod(id),
        enabled: !!id,
    });
}

export function useCreatePaymentMethod() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: paymentMethodService.PaymentMethodCreatePayload) =>
            paymentMethodService.createPaymentMethod(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: paymentMethodKeys.lists() });
        },
    });
}

export function useUpdatePaymentMethod() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<paymentMethodService.PaymentMethodCreatePayload> }) =>
            paymentMethodService.updatePaymentMethod(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: paymentMethodKeys.lists() });
            queryClient.invalidateQueries({ queryKey: paymentMethodKeys.detail(id) });
        },
    });
}

export function useDeletePaymentMethod() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => paymentMethodService.deletePaymentMethod(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: paymentMethodKeys.lists() });
        },
    });
}
