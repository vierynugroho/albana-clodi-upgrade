// hooks/useDeliveryPlaces.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as deliveryPlaceService from "@/lib/services/delivery-place.service";

export const deliveryPlaceKeys = {
    all: ["deliveryPlaces"] as const,
    lists: () => [...deliveryPlaceKeys.all, "list"] as const,
    list: (params: deliveryPlaceService.DeliveryPlaceQueryParams) => [...deliveryPlaceKeys.lists(), params] as const,
    details: () => [...deliveryPlaceKeys.all, "detail"] as const,
    detail: (id: string) => [...deliveryPlaceKeys.details(), id] as const,
};

export function useDeliveryPlaces(params?: deliveryPlaceService.DeliveryPlaceQueryParams) {
    return useQuery({
        queryKey: deliveryPlaceKeys.list(params || {}),
        queryFn: () => deliveryPlaceService.fetchDeliveryPlaces(params),
    });
}

export function useDeliveryPlace(id: string) {
    return useQuery({
        queryKey: deliveryPlaceKeys.detail(id),
        queryFn: () => deliveryPlaceService.getDeliveryPlace(id),
        enabled: !!id,
    });
}

export function useCreateDeliveryPlace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: deliveryPlaceService.DeliveryPlaceCreatePayload) =>
            deliveryPlaceService.createDeliveryPlace(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: deliveryPlaceKeys.lists() });
        },
    });
}

export function useUpdateDeliveryPlace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<deliveryPlaceService.DeliveryPlaceCreatePayload> }) =>
            deliveryPlaceService.updateDeliveryPlace(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: deliveryPlaceKeys.lists() });
            queryClient.invalidateQueries({ queryKey: deliveryPlaceKeys.detail(id) });
        },
    });
}

export function useDeleteDeliveryPlace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deliveryPlaceService.deleteDeliveryPlace(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: deliveryPlaceKeys.lists() });
        },
    });
}
