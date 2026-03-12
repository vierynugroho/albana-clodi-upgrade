// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import * as orderService from "@/lib/services/order.service";
import type { OrderQueryParams, OrderCreatePayload, ApiOrder, ExportFilterParams } from "@/types/api";
import { Order } from "@/types";
import { mapApiOrderToOrder } from "@/lib/mappers";

export const orderKeys = {
    all: ["orders"] as const,
    lists: () => [...orderKeys.all, "list"] as const,
    list: (params: OrderQueryParams) => [...orderKeys.lists(), params] as const,
    details: () => [...orderKeys.all, "detail"] as const,
    detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrders(params?: OrderQueryParams) {
    return useQuery({
        queryKey: orderKeys.list(params || {}),
        queryFn: () => orderService.fetchOrders(params),
    });
}

export function useOrdersPaginated(params?: OrderQueryParams) {
    return useQuery({
        queryKey: [...orderKeys.lists(), "paginated", params] as const,
        queryFn: () => orderService.fetchOrdersPaginated(params),
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => orderService.getOrder(id),
        enabled: !!id,
    });
}

// khusus untuk print ambil uuid dalam tipe array
export function useOrdersByIds(orderIds: string[]) {
    const queries = useQueries({
        queries: orderIds.map((id) => ({
            queryKey: ["order", id],
            queryFn: () => orderService.getOrderById(id),
            enabled: !!id,
        })),
    });

    const orders: Order[] = queries
        .map((q) => q.data)
        .filter((data): data is ApiOrder => data != null)
        .map(mapApiOrderToOrder);

    return {
        orders,
        isLoading: queries.some((q) => q.isLoading),
        isError: queries.some((q) => q.isError),
    };
}


export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: OrderCreatePayload) => orderService.createOrder(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: OrderCreatePayload }) =>
            orderService.updateOrder(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
        },
    });
}

export function useDeleteOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => orderService.deleteOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => orderService.cancelOrder(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
        },
    });
}

//Hook to export orders to Excel
export function useExportOrders() {
    return useMutation({
        mutationFn: (params?: ExportFilterParams) =>
            orderService.downloadOrderExcel(params),
    });
}
