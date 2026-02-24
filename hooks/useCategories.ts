// hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "@/lib/services/category.service";
import type { CategoryQueryParams, CategoryCreatePayload } from "@/types/api";

export const categoryKeys = {
    all: ["categories"] as const,
    lists: () => [...categoryKeys.all, "list"] as const,
    list: (params: CategoryQueryParams) => [...categoryKeys.lists(), params] as const,
    details: () => [...categoryKeys.all, "detail"] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook to fetch all categories
 */
export function useCategories(params?: CategoryQueryParams) {
    return useQuery({
        queryKey: categoryKeys.list(params || {}),
        queryFn: () => categoryService.fetchCategories(params),
    });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: string) {
    return useQuery({
        queryKey: categoryKeys.detail(id),
        queryFn: () => categoryService.getCategory(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new category
 */
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CategoryCreatePayload) =>
            categoryService.createCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
}

/**
 * Hook to update an existing category
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CategoryCreatePayload }) =>
            categoryService.updateCategory(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
        },
    });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => categoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
}
