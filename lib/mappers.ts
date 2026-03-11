// lib/mappers.ts

import type {
    ApiOrder,
    ApiCustomer,
    ApiProduct,
    ApiProductListItem,
    ApiSalesChannel,
    ApiDeliveryPlace,
    ApiPaymentMethod,
} from "@/types/api";
import type { Order, Customer, Product, ProductVariant, SalesChannel, Warehouse, BankAccount } from "@/types";

//  * Maps payment status from API format to frontend format
function mapPaymentStatus(
    status?: "PENDING" | "SETTLEMENT" | "CANCEL"
): Order["paymentStatus"] {
    switch (status) {
        case "SETTLEMENT":
            return "lunas";
        case "CANCEL":
            return "dibatalkan";
        case "PENDING":
        default:
            return "belum_dibayar";
    }
}

//  * Maps customer category from API format to frontend format
function mapCustomerCategory(
    category: ApiCustomer["category"]
): Customer["category"] {
    const mapping: Record<ApiCustomer["category"], Customer["category"]> = {
        CUSTOMER: "customer",
        RESELLER: "reseller",
        AGENT: "agen",
        MEMBER: "member",
        DROPSHIPPER: "dropshipper",
    };
    return mapping[category] || "customer";
}

//  * Maps product type from API format to frontend format
function mapProductType(
    type: ApiProduct["type"]
): Product["type"] {
    const mapping: Record<ApiProduct["type"], Product["type"]> = {
        BARANG_STOK_SENDIRI: "barang_sendiri",
        BARANG_SUPPLIER_LAIN: "suplier",
        BARANG_PRE_ORDER: "pre_order",
    };
    return mapping[type] || "barang_sendiri";
}

//  * Maps ApiCustomer to frontend Customer type
export function mapApiCustomerToCustomer(apiCustomer: ApiCustomer): Customer {
    return {
        id: apiCustomer.id,
        name: apiCustomer.name,
        category: mapCustomerCategory(apiCustomer.category),
        province: apiCustomer.province || "",
        city: apiCustomer.city || "",
        district: apiCustomer.district || "",
        village: apiCustomer.village || apiCustomer.subdistrict || "",
        postalCode: apiCustomer.postalCode || "",
        email: apiCustomer.email || "",
        phone: apiCustomer.phoneNumber || "",
        address: apiCustomer.address || "",
    };
}

//  * Maps ApiOrder to frontend Order type
export function mapApiOrderToOrder(apiOrder: ApiOrder): Order {
    const orderDetail = apiOrder.OrderDetail;
    const shippingService = apiOrder.ShippingServices?.[0];

    // Map customer data
    const customer: Customer = apiOrder.OrdererCustomer
        ? mapApiCustomerToCustomer(apiOrder.OrdererCustomer)
        : {
            id: apiOrder.ordererCustomerId,
            name: "Unknown",
            category: "customer",
            province: "",
            city: "",
            district: "",
            village: "",
            postalCode: "",
            email: "",
            phone: "",
            address: "",
        };

    // Map order products
    const products = orderDetail?.OrderProducts?.map((op) => ({
        productId: op.productId,
        name: op.Product?.name || "Unknown Product",
        variant: op.productVariantId || "",
        quantity: op.productQty,
        price: 0, // Price would need to be calculated from product prices
        weight: op.Product?.weight || 0,
        total: 0,
    })) || [];
    
    // RUMUS PERHITUNGAN SUBTOTAL, DISKON & TOTAL

    // 1. Subtotal: Diambil dari originalFinalPrice (harga sebelum diskon).
    // Jika originalFinalPrice tidak tersedia, fallback ke finalPrice.
    const subtotal = orderDetail?.originalFinalPrice ?? orderDetail?.finalPrice ?? 0;
    const shippingCost = shippingService?.shippingCost || 0;
    const insurance = orderDetail?.otherFees?.insurance || 0;
    
    let discount = 0;
    const finalPrice = orderDetail?.finalPrice || 0;

    // 2. Menghitung Diskon (Prioritas Pertama = Selisih Harga):
    // Jika originalFinalPrice lebih besar dari finalPrice, maka dipastikan ada potongan diskon,
    // Rumus: Diskon = originalFinalPrice - finalPrice
    if (orderDetail?.originalFinalPrice !== undefined && orderDetail.originalFinalPrice > finalPrice) {
        discount = orderDetail.originalFinalPrice - finalPrice;
    } 
    // 3. Menghitung Diskon (Prioritas Kedua = Diskon Nominal Teks):
    // Jika tidak mendapat selisih di atas, cek apakah ada nilai discount berupa nominal di dalam otherFees.
    else if (orderDetail?.otherFees?.discount?.type === "nominal") {
        discount = orderDetail.otherFees.discount.value || 0;
    }

    // 4. Extract specific discounts for UI breakdown
    let productDiscountTotal = 0;
    if (orderDetail?.otherFees?.productDiscount && Array.isArray(orderDetail.otherFees.productDiscount)) {
        orderDetail.otherFees.productDiscount.forEach(pd => {
            const qty = products.find(p => p.variant === pd.produkVariantId)?.quantity || 1;
            if (pd.discountType === "percent") {
                // something
            } else {
                productDiscountTotal += (pd.discountAmount * qty);
            }
        });
    }

    let orderDiscountVal = 0;
    let netSubtotal = finalPrice;

    if (orderDetail?.otherFees?.discount) {
        if (orderDetail.otherFees.discount.type === "nominal") {
            orderDiscountVal = orderDetail.otherFees.discount.value;
            netSubtotal = finalPrice + orderDiscountVal;
        } else if (orderDetail.otherFees.discount.type === "percent") {
            const pct = orderDetail.otherFees.discount.value / 100;
            // Reverse-engineer netSubtotal (Subtotal after Product Discount)
            if (pct < 1 && pct >= 0) {
                netSubtotal = finalPrice / (1 - pct);
                orderDiscountVal = netSubtotal - finalPrice;
            }
        }
    }

    let shippingDiscountVal = 0;
    if (orderDetail?.otherFees?.shippingDiscountPerKg) {
        // Kalkulasi diubah menjadi per gram agar selaras dengan Backend:
        // Diskon per Kg dibagi 1000 untuk mendapat Diskon per Gram, lalu dikali total berat gram.
        const weightInGrams = orderDetail.otherFees.weight || 0;
        shippingDiscountVal = (orderDetail.otherFees.shippingDiscountPerKg / 1000) * weightInGrams;
    }

    // 5. Reconstruct TRUE Subtotal (Gross Subtotal)
    const trueSubtotal = netSubtotal + productDiscountTotal;

    return {
        id: apiOrder.id,
        orderNumber: orderDetail?.code || apiOrder.id.slice(0, 8).toUpperCase(),
        date: apiOrder.orderDate,
        customer,
        products,
        warehouse: {
            id: apiOrder.deliveryPlaceId,
            name: apiOrder.DeliveryPlace?.name || "Unknown",
            origin: "",
            phone: apiOrder.DeliveryPlace?.phoneNumber || "",
            address: apiOrder.DeliveryPlace?.address || "",
            status: true,
        },
        salesChannel: apiOrder.SalesChannel?.name || "Unknown",
        shippingCost,
        weight: orderDetail?.otherFees?.weight || 0,
        insurance,
        discount,
        productDiscount: productDiscountTotal,
        orderDiscount: orderDiscountVal,
        orderDiscountType: orderDetail?.otherFees?.discount?.type as "percent" | "nominal" | undefined,
        orderDiscountValue: orderDetail?.otherFees?.discount?.value,
        shippingDiscount: shippingDiscountVal,
        subtotal: trueSubtotal,
        // 4. Perhitungan Total Pembayaran Akhir:
        // Rumus: Total = Subtotal + Ongkir + Asuransi - Diskon - Diskon Ongkir
        total: subtotal + shippingCost + insurance - discount - shippingDiscountVal,
        paymentStatus: mapPaymentStatus(orderDetail?.paymentStatus),
        orderStatus: "pending" as Order["orderStatus"],
        note: apiOrder.note,
        installmentAmount: orderDetail?.otherFees?.installments?.amount || 0,
    };
}

//  * Maps ApiProduct to frontend Product type
export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
    const variants: ProductVariant[] = apiProduct.productVariants?.map((v) => ({
        id: v.id,
        color: v.color,
        size: v.size,
        stock: v.stock,
        sku: v.sku,
    })) || [];

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    return {
        id: apiProduct.id,
        name: apiProduct.name,
        sku: variants[0]?.sku || "",
        category: apiProduct.categoryId,
        type: mapProductType(apiProduct.type),
        description: apiProduct.description,
        variants,
        weight: apiProduct.weight,
        prices: {
            beli: 0,
            agent: 0,
            reseller: 0,
            member: 0,
            normal: 0,
        },
        stock: totalStock,
    };
}

//  * Maps ApiProductListItem (from /products endpoint) to frontend Product type
//  * This handles the nested structure: { product, variant, price }
export function mapApiProductListItemToProduct(item: ApiProductListItem): Product {
    const variants: ProductVariant[] = item.variant?.map((v) => ({
        id: v.id,
        color: v.color,
        size: v.size,
        stock: v.stock,
        sku: v.sku,
    })) || [];

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    return {
        id: item.product.id,
        name: item.product.name,
        sku: variants[0]?.sku || "",
        // Use category name if available, fallback to ID
        category: item.product.category?.name || item.product.categoryId || "",
        type: mapProductType(item.product.type),
        description: item.product.description,
        variants,
        weight: item.product.weight,
        prices: {
            beli: item.price?.buy || 0,
            agent: item.price?.agent || 0,
            reseller: item.price?.reseller || 0,
            member: item.price?.member || 0,
            normal: item.price?.normal || 0,
        },
        stock: totalStock,
    };
}

//  * Batch mappers for arrays (with defensive checks)
export function mapApiOrdersToOrders(apiOrders: ApiOrder[] | undefined | null): Order[] {
    if (!Array.isArray(apiOrders)) return [];
    return apiOrders.map(mapApiOrderToOrder);
}

export function mapApiCustomersToCustomers(apiCustomers: ApiCustomer[] | undefined | null): Customer[] {
    if (!Array.isArray(apiCustomers)) return [];
    return apiCustomers.map(mapApiCustomerToCustomer);
}

//  * Maps ApiProductListItem[] (from /products endpoint) to Product[]
//  * This handles the nested structure from the API
export function mapApiProductsToProducts(apiProducts: ApiProductListItem[] | undefined | null): Product[] {
    if (!Array.isArray(apiProducts)) return [];
    return apiProducts.map(mapApiProductListItemToProduct);
}

//  * Maps ApiSalesChannel to frontend SalesChannel type
export function mapApiSalesChannelToSalesChannel(apiChannel: ApiSalesChannel): SalesChannel {
    return {
        id: apiChannel.id,
        name: apiChannel.name,
        description: undefined,
        status: apiChannel.isActive ?? true,
    };
}

export function mapApiSalesChannelsToSalesChannels(apiChannels: ApiSalesChannel[] | undefined | null): SalesChannel[] {
    if (!Array.isArray(apiChannels)) return [];
    return apiChannels.map(mapApiSalesChannelToSalesChannel);
}

//  * Maps ApiDeliveryPlace to frontend Warehouse type
export function mapApiDeliveryPlaceToWarehouse(apiPlace: ApiDeliveryPlace): Warehouse {
    return {
        id: apiPlace.id,
        name: apiPlace.name,
        origin: apiPlace.subdistrict,
        phone: apiPlace.phoneNumber,
        address: apiPlace.address,
        description: apiPlace.description,
        status: true, // API doesn't have status field, default to true
    };
}

export function mapApiDeliveryPlacesToWarehouses(apiPlaces: ApiDeliveryPlace[] | undefined | null): Warehouse[] {
    if (!Array.isArray(apiPlaces)) return [];
    return apiPlaces.map(mapApiDeliveryPlaceToWarehouse);
}

//  * Maps ApiPaymentMethod to frontend BankAccount type
export function mapApiPaymentMethodToBankAccount(apiMethod: ApiPaymentMethod): BankAccount {
    return {
        id: apiMethod.id,
        bankName: apiMethod.bankName,
        accountNumber: apiMethod.accountNumber,
        accountName: apiMethod.name, // Using name as account name
        status: true, // API doesn't have status field, default to true
    };
}

export function mapApiPaymentMethodsToBankAccounts(apiMethods: ApiPaymentMethod[] | undefined | null): BankAccount[] {
    if (!Array.isArray(apiMethods)) return [];
    return apiMethods.map(mapApiPaymentMethodToBankAccount);
}
