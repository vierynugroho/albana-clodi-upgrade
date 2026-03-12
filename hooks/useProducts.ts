import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import * as productService from "@/lib/services/product.service";
import type { ProductQueryParams, ProductFullCreatePayload, ExportFilterParams } from "@/types/api";

export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts(params?: ProductQueryParams) {
    return useQuery({
        queryKey: productKeys.list(params || {}),
        queryFn: () => productService.fetchProducts(params),
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productService.getProduct(id),
        enabled: !!id,
    });
}

export function useProductDetail(id: string) {
    return useQuery({
        queryKey: [...productKeys.detail(id), "full"],
        queryFn: () => productService.getProductDetail(id),
        enabled: !!id,
    });
}

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

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

export function useExportProducts() {
    return useMutation({
        mutationFn: (params?: ExportFilterParams) =>
            productService.downloadProductExcel(params),
    });
}

export function useInfiniteProducts(params?: ProductQueryParams) {
    return useInfiniteQuery({
        queryKey: [...productKeys.lists(), "infinite", params],
        queryFn: ({ pageParam = 1 }) => productService.fetchProducts({ ...params, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {

            return lastPage.length === 0 ? undefined : allPages.length + 1;
        },
    });
}
