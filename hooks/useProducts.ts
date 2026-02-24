// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import * as productService from "@/lib/services/product.service";
import type { ProductQueryParams, ProductFullCreatePayload } from "@/types/api";

export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Hook to fetch all products
 */
export function useProducts(params?: ProductQueryParams) {
    return useQuery({
        queryKey: productKeys.list(params || {}),
        queryFn: () => productService.fetchProducts(params),
    });
}

/**
 * Hook to fetch a single product by ID (basic info)
 */
export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productService.getProduct(id),
        enabled: !!id,
    });
}

/**
 * Hook to fetch detailed product info including variants with prices
 */
export function useProductDetail(id: string) {
    return useQuery({
        queryKey: [...productKeys.detail(id), "full"],
        queryFn: () => productService.getProductDetail(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new product (simple payload)
 */
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: productService.ProductCreatePayload) =>
            productService.createProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

/**
 * Hook to create a new product with full payload (including variants and images)
 */
export function useCreateProductFull() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ProductFullCreatePayload) =>
            productService.createProductFull(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

/**
 * Hook to update an existing product (uses FormData like createProduct)
 */
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: productService.ProductCreatePayload }) =>
            productService.updateProduct(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
        },
    });
}

/**
 * Hook to update an existing product with full payload (including variants and images)
 */
export function useUpdateProductFull() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ProductFullCreatePayload }) =>
            productService.updateProductFull(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
        },
    });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

/**
 * Hook to export products to Excel
 */
export function useExportProducts() {
    return useMutation({
        mutationFn: () => productService.downloadProductExcel(),
    });
}

/**
 * Hook to fetch products with infinite scrolling
 */
export function useInfiniteProducts(params?: ProductQueryParams) {
    return useInfiniteQuery({
        queryKey: [...productKeys.lists(), "infinite", params],
        queryFn: ({ pageParam = 1 }) => productService.fetchProducts({ ...params, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            // Check if lastPage has results. If less than limit (50), no more pages.
            // Or use meta if available. ApiProductListItem[] doesn't have meta directly attached in return type.
            // fetchProducts returns ApiProductListItem[], mapping response.data.
            // We lose meta in fetchProducts simply returning array. 
            // We need to check array length. If 0 or < limit, we stop.
            // Default limit is 50.
            return lastPage.length === 0 ? undefined : allPages.length + 1;
        },
    });
}
