// hooks/useSalesChannels.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as salesChannelService from "@/lib/services/sales-channel.service";

export const salesChannelKeys = {
    all: ["salesChannels"] as const,
    lists: () => [...salesChannelKeys.all, "list"] as const,
    list: (params: salesChannelService.SalesChannelQueryParams) => [...salesChannelKeys.lists(), params] as const,
    details: () => [...salesChannelKeys.all, "detail"] as const,
    detail: (id: string) => [...salesChannelKeys.details(), id] as const,
};

export function useSalesChannels(params?: salesChannelService.SalesChannelQueryParams) {
    return useQuery({
        queryKey: salesChannelKeys.list(params || {}),
        queryFn: () => salesChannelService.fetchSalesChannels(params),
    });
}

export function useSalesChannel(id: string) {
    return useQuery({
        queryKey: salesChannelKeys.detail(id),
        queryFn: () => salesChannelService.getSalesChannel(id),
        enabled: !!id,
    });
}

export function useCreateSalesChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: salesChannelService.SalesChannelCreatePayload) =>
            salesChannelService.createSalesChannel(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: salesChannelKeys.lists() });
        },
    });
}

export function useUpdateSalesChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<salesChannelService.SalesChannelCreatePayload> }) =>
            salesChannelService.updateSalesChannel(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: salesChannelKeys.lists() });
            queryClient.invalidateQueries({ queryKey: salesChannelKeys.detail(id) });
        },
    });
}

export function useDeleteSalesChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => salesChannelService.deleteSalesChannel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: salesChannelKeys.lists() });
        },
    });
}
