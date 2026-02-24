// lib/services/product.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiProduct,
    ApiProductDetail,
    ApiProductListItem,
    ApiProductListResponse,
    ProductQueryParams,
    ProductFullCreatePayload,
    ProductVariantPayload,
    ProductWholesalerPayload,
    ProductCreatePayload,
} from "@/types/api";
export type { ProductCreatePayload } from "@/types/api";


// Convert ProductCreatePayload to FormData for multipart/form-data upload, This follows the exact structure expected by the API
function convertProductToFormData(data: ProductCreatePayload): FormData {
    const formData = new FormData();

    // Product fields
    Object.entries(data.product).forEach(([key, value]) => {
        if (value == null || value === "") return;
        formData.append(`product.${key}`, String(value));
    });

    // Product discount - always send (required by API)
    if (data.productDiscount) {
        Object.entries(data.productDiscount).forEach(([key, value]) => {
            if (value == null) return;
            formData.append(`productDiscount.${key}`, String(value ?? 0));
        });
    } else {
        // Default discount values if not provided
        formData.append(`productDiscount.type`, "PERCENTAGE");
        formData.append(`productDiscount.value`, "0");
    }

    // Product variants
    data.productVariants.forEach((variant, index) => {
        if (variant.id) {
            formData.append(`productVariants[${index}].id`, variant.id);
        }
        formData.append(`productVariants[${index}].sku`, variant.sku ?? "");
        formData.append(`productVariants[${index}].stock`, String(variant.stock ?? 0));
        formData.append(`productVariants[${index}].size`, variant.size ?? "");
        formData.append(`productVariants[${index}].color`, variant.color ?? "");

        // Sanitize barcode - only send if valid non-empty string and not a URL
        if (variant.barcode && variant.barcode.trim() !== "" && !variant.barcode.startsWith('http')) {
            formData.append(`productVariants[${index}].barcode`, variant.barcode);
        }

        // Product prices for each variant
        if (variant.productPrices) {
            Object.entries(variant.productPrices).forEach(([key, value]) => {
                formData.append(
                    `productVariants[${index}].productPrices.${key}`,
                    String(value ?? 0)
                );
            });
        }

        // Product wholesalers (array)
        if (variant.productWholesalers && variant.productWholesalers.length > 0) {
            variant.productWholesalers.forEach((ws, wsIndex) => {
                Object.entries(ws).forEach(([key, value]) => {
                    formData.append(
                        `productVariants[${index}].productWholesalers[${wsIndex}].${key}`,
                        String(value)
                    );
                });
            });
        } else {
            // If empty array needs to be sent explicitly? usually not for FormData arrays but sticking to request imply behavior
            // If the API explicitly needs empty array representation it might be tricky in FormData.
            // Usually omitting it is enough for "empty". 
            // Requirement says: productVariants[0].productWholesalers:[]
            // But usually this means just not sending any `productWholesalers` keys.
        }
    });

    // Debug: log FormData contents
    if (process.env.NODE_ENV === 'development') {
        // @debug — commented for production
        // console.log('=== FormData Contents ===');
        // for (const pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }
        // console.log('=========================');
    }

    return formData;
}

//Convert ProductFullCreatePayload to FormData for multipart/form-data upload, This is needed for uploading product images
function convertToFormData(data: ProductFullCreatePayload): FormData {
    const formData = new FormData();

    // Product fields
    Object.entries(data.product).forEach(([key, value]) => {
        if (value == null || value === "") return;
        formData.append(`product.${key}`, String(value));
    });

    // Product discount
    if (data.productDiscount) {
        Object.entries(data.productDiscount).forEach(([key, value]) => {
            if (value != null) {
                formData.append(`productDiscount.${key}`, String(value));
            }
        });
    }

    // Product variants
    data.productVariants.forEach((variant: ProductVariantPayload, index: number) => {
        if (variant.id) {
            formData.append(`productVariants[${index}].id`, variant.id);
        }
        formData.append(`productVariants[${index}].sku`, variant.sku ?? "");
        formData.append(
            `productVariants[${index}].stock`,
            String(variant.stock ?? 0)
        );
        formData.append(`productVariants[${index}].size`, variant.size ?? "");
        formData.append(`productVariants[${index}].color`, variant.color ?? "");
        formData.append(`productVariants[${index}].barcode`, variant.barcode ?? "");

        // Handle image: File or string URL
        // Corrected key to match API: productVariants[0].imageUrl
        if (variant.imageUrl instanceof File) {
            formData.append(`productVariants[${index}].images`, variant.imageUrl);
        }
        // If existing URL string, append for that variant
        if (typeof variant.imageUrl === 'string' && variant.imageUrl) {
            formData.append(`productVariants[${index}].images`, variant.imageUrl);
        }

        // Product prices
        if (variant.productPrices) {
            Object.entries(variant.productPrices).forEach(([key, value]) => {
                formData.append(
                    `productVariants[${index}].productPrices.${key}`,
                    String(value ?? 0)
                );
            });
        }

        // Product wholesalers
        if (variant.productWholesalers) {
            variant.productWholesalers.forEach((ws: ProductWholesalerPayload, wsIndex: number) => {
                Object.entries(ws).forEach(([key, value]) => {
                    formData.append(
                        `productVariants[${index}].productWholesalers[${wsIndex}].${key}`,
                        String(value)
                    );
                });
            });
        }
    });

    // Debug: log FormData contents
    // if (process.env.NODE_ENV === 'development') {
    //     console.log('=== FormData (Full) Contents ===');
    //     for (const pair of formData.entries()) {
    //         console.log(pair[0], pair[1]);
    //     }
    //     console.log('================================');
    // }

    return formData;
}

//Fetch all products with optional query parameters, Returns ApiProductListItem[] which contains product, variant, and price
export async function fetchProducts(params?: ProductQueryParams): Promise<ApiProductListItem[]> {
    // Default params - using search='' and limit=20 for optimal performance
    // The API requires 'search' param to be present to work correctly
    const queryParams: Record<string, unknown> = {
        search: "",
        limit: 50, // Increased to 50 as per plan
        order: "desc",
    };

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.type) queryParams.type = params.type;
    if (params?.search) queryParams.search = params.search;
    if (params?.categoryId) queryParams.categoryId = params.categoryId;
    if (params?.productDiscountId) queryParams.productDiscountId = params.productDiscountId;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.order) queryParams.order = params.order;
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    if (params?.month) queryParams.month = params.month;
    if (params?.year) queryParams.year = params.year;
    if (params?.week) queryParams.week = params.week;

    const res = await api.get<ApiResponse<ApiProductListResponse>>("/products", { params: queryParams });

    // The response structure is: { responseObject: { data: [...], meta: {...} } }
    return res.data?.responseObject?.data || [];
}

//Get a single product by ID (basic info)
export async function getProduct(id: string): Promise<ApiProduct | null> {
    const res = await api.get<ApiResponse<ApiProduct>>(`/products/${id}`);
    return res.data?.responseObject || null;
}


//Get detailed product info including variants with prices, Maps productPrices array to single object for each variant
export async function getProductDetail(id: string): Promise<ApiProductDetail | null> {
    const res = await api.get<ApiResponse<ApiProductDetail>>(`/products/${id}`);

    if (!res.data?.responseObject) return null;

    const product = res.data.responseObject;

    // Transform productPrices from array to single object (if needed)
    if (product.productVariants) {
        product.productVariants = product.productVariants.map((variant) => ({
            ...variant,
            // If productPrices is an array, take the first item
            productPrices: Array.isArray(variant.productPrices)
                ? variant.productPrices[0]
                : variant.productPrices,
        }));
    }

    return product;
}

/**
 * Create a new product using FormData (for proper API structure)
 * Sends data as multipart/form-data with nested field names
 * Note: Do NOT set Content-Type manually - browser will add boundary automatically
 */
export async function createProduct(payload: ProductCreatePayload): Promise<ApiProduct> {
    const formData = convertProductToFormData(payload);

    // Don't set Content-Type header - let browser add multipart boundary
    const res = await api.post<ApiResponse<ApiProduct>>("/products", formData);

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create product");
    }
    return res.data.responseObject;
}

/**
 * Create a new product with full payload including variants and images
 * Uses FormData for multipart/form-data upload
 * Note: Do NOT set Content-Type manually - browser will add boundary automatically
 */
export async function createProductFull(payload: ProductFullCreatePayload): Promise<ApiProduct> {
    const formData = convertToFormData(payload);

    // Don't set Content-Type header - let browser add multipart boundary
    const res = await api.post<ApiResponse<ApiProduct>>("/products", formData);

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Gagal membuat produk");
    }
    return res.data.responseObject;
}


export async function updateProduct(
  id: string,
  payload: ProductCreatePayload
) {
  const formData = convertProductToFormData(payload);

  const res = await api.put(`/products/${id}`, formData);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to update product");
  }

  return res.data.responseObject;
}


/**
 * Update an existing product with full payload including variants and images
 * Uses FormData for multipart/form-data upload
 * Note: Do NOT set Content-Type manually - browser will add boundary automatically
 */
export async function updateProductFull(id: string, payload: ProductFullCreatePayload): Promise<ApiProduct> {
    const formData = convertToFormData(payload);

    // Don't set Content-Type header - let browser add multipart boundary
    const res = await api.put<ApiResponse<ApiProduct>>(`/products/${id}`, formData);

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Gagal mengupdate produk");
    }
    return res.data.responseObject;
}

//Delete a product by ID
export async function deleteProduct(id: string): Promise<ApiProduct | null> {
    const res = await api.delete<ApiResponse<ApiProduct>>(`/products/${id}`);
    if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to delete product");
    }
    return res.data?.responseObject || null;
}

//Export products to file format (simple version)
export async function exportProducts(format: "excel" = "excel"): Promise<Blob> {
    const res = await api.get(`/products/export/${format}`, { responseType: "blob" });
    return res.data;
}

//Download products as Excel file, Creates a download link and triggers the download
export async function downloadProductExcel(): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await api.post("/products/export/excel", "", {
            headers: {
                Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            responseType: "blob",
        });

        const blob = new Blob([res.data], {
            type: res.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        // Extract filename from content-disposition header or use default
        const contentDisposition = res.headers["content-disposition"];
        const fileName =
            contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
            "Produk.xlsx";

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        let message = "Terjadi kesalahan saat mengexport produk";

        if (error instanceof Error) {
            message = error.message;
        }

        return {
            success: false,
            message,
        };
    }
}
