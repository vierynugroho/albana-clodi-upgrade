// types/api.ts
// Common API Response types based on actual backend response structure

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    responseObject: T;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    responseObject: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    statusCode: number;
}

// Cursor-based pagination response (used by orders)
export interface CursorPaginationMeta {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    limit?: number;
    nextCursor?: string | null;
    usedCursor?: boolean;
}

export interface CursorPaginatedResponse<T> {
    success: boolean;
    message: string;
    responseObject: {
        data: T[];
        meta: CursorPaginationMeta;
    } | T[];
    statusCode: number;
}

// Order types matching actual API structure
export interface ApiCustomer {
    id: string;
    name: string;
    category: "CUSTOMER" | "RESELLER" | "AGENT" | "MEMBER" | "DROPSHIPPER";
    address: string;
    province?: string;
    city?: string;
    district?: string;
    village?: string;
    subdistrict?: string;
    addressDetail?: string | null;
    postalCode: string;
    phoneNumber: string;
    destinationId: number | null;
    email: string;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
    updatedAt: string;
}

export interface ApiSalesChannel {
    id: string;
    name: string;
    isActive: boolean | null;
    createdAt: string;
    updatedAt: string;
}

export interface ApiDeliveryPlace {
    id: string;
    name: string;
    address: string;
    subdistrict: string;
    phoneNumber: string;
    destinationId: number;
    email: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiPaymentMethod {
    id: string;
    name: string;
    bankName: string;
    bankBranch: string;
    accountNumber: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiProductVariant {
    id: string;
    productId: string;
    sku: string;
    stock: number;
    size: string;
    color: string;
    imageUrl: string;
    barcode: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ApiProduct {
    id: string;
    categoryId: string;
    name: string;
    type: "BARANG_STOK_SENDIRI" | "BARANG_SUPPLIER_LAIN" | "BARANG_PRE_ORDER";
    price: string | number;
    description: string;
    weight: number;
    isPublish: boolean;
    createdAt: string;
    updatedAt: string;
    productVariants?: ApiProductVariant[];
}

export interface ApiProductListItem {
    product: {
        id: string;
        categoryId: string;
        name: string;
        type: "BARANG_STOK_SENDIRI" | "BARANG_SUPPLIER_LAIN" | "BARANG_PRE_ORDER";
        description: string;
        weight: number;
        isPublish: boolean;
        createdAt: string;
        updatedAt: string;
        category?: {
            id: string;
            name: string;
            createdAt: string;
            updatedAt: string;
        } | null;
    };
    variant: ApiProductVariant[];
    price: {
        id: string;
        productVariantId: string;
        normal: number;
        buy: number;
        reseller: number;
        agent: number;
        member: number;
        createdAt: string;
        updatedAt: string;
    } | null;
}

export interface ApiProductListResponse {
    data: ApiProductListItem[];
    meta: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

export interface ApiOrderProduct {
    id: string;
    orderId: string;
    orderDetailId: string;
    productId: string;
    productVariantId?: string;
    productQty: number;
    createdAt: string;
    updatedAt: string;
    Product?: ApiProduct;
}

export interface ApiShippingService {
    id: string;
    orderId: string;
    shippingName: string;
    serviceName: string;
    weight: number;
    isCod: boolean;
    shippingCost: number;
    shippingCashback: number;
    shippingCostNet: number;
    grandtotal: number;
    serviceFee: number;
    netIncome: number;
    etd: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiOrderDetail {
    id: string;
    orderId: string;
    paymentMethodId: string;
    code: string;
    otherFees: {
        weight?: number;
        discount?: { type: "percent" | "nominal"; value: number };
        insurance?: number;
        packaging?: number;
        shippingCost?: { cost: number; type: string; shippingService: string };
        shippingDiscountPerKg?: number;
        productDiscount?: { produkVariantId: string; discountType: string; discountAmount: number }[];
        installments?: { amount: number; paymentDate: string; paymentMethodId: string };
    };
    finalPrice: number;
    originalFinalPrice?: number;
    paymentStatus: "PENDING" | "SETTLEMENT" | "CANCEL";
    paymentDate: string;
    receiptNumber: string;
    createdAt: string;
    updatedAt: string;
    OrderProducts?: ApiOrderProduct[];
    PaymentMethod?: ApiPaymentMethod;
}

export interface ApiOrder {
    id: string;
    ordererCustomerId: string;
    deliveryTargetCustomerId: string;
    deliveryPlaceId: string;
    salesChannelId: string;
    orderDate: string;
    note: string;
    createdAt: string;
    updatedAt: string;
    SalesChannel?: ApiSalesChannel;
    DeliveryPlace?: ApiDeliveryPlace;
    OrdererCustomer?: ApiCustomer;
    DeliveryTargetCustomer?: ApiCustomer;
    OrderDetail?: ApiOrderDetail;
    ShippingServices?: ApiShippingService[];
}


export interface OrderCreatePayload {
    order: {
        ordererCustomerId: string;
        deliveryTargetCustomerId: string;
        deliveryPlaceId: string;
        salesChannelId: string;
        orderDate: string;
        note?: string;
    };
    orderDetail: {
        detail: {
            originalFinalPrice: number;

            otherFees: {
                packaging: number;
                insurance: number;
                weight: number;

                productDiscount?: {
                    produkVariantId: string;
                    discountAmount: number;
                    discountType: "percent" | "nominal";
                }[];

                shippingCost: {
                    shippingService: string;
                    cost: number;
                    type: "reguler" | "manual" | "free";
                };

                shippingDiscountPerKg?: number;

                discount?: {
                    value: number;
                    type: "percent" | "nominal";
                };

                installments?: {
                    paymentMethodId: string;
                    paymentDate: string;
                    amount: number;
                };
            };

            receiptNumber?: string;
        };

        paymentMethod: {
            id: string;
            status: "PENDING" | "SETTLEMENT" | "CANCEL";
            date: string;
        };

        orderProducts: {
            productId: string;
            productVariantId: string;
            productQty: number;
        }[];

        shippingServices: {
            shippingName: string;
            serviceName: string;
            weight: number;
            isCod: boolean;
            shippingCost: number;
            shippingCashback: number;
            shippingCostNet: number;
            grandtotal: number;
            serviceFee: number;
            netIncome: number;
            etd: string;
            type: string;
        }[];
    };
}

export interface OrderQueryParams {
    page?: number;
    limit?: number;
    cursor?: string;
    ordererCustomerId?: string;
    deliveryTargetCustomerId?: string;
    salesChannelId?: string;
    deliveryPlaceId?: string;
    orderDate?: string;
    orderStatus?: string;
    orderMonth?: number;
    orderYear?: number;
    startDate?: string;
    endDate?: string;
    customerCategory?: string;
    paymentStatus?: string;
    productId?: string;
    paymentMethodId?: string;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    customerName?: string;
    orderId?: string;
    code?: string;
    productName?: string;
    sku?: string;
    receiptNumber?: string;
    phoneNumber?: string;
    shipperTrackingId?: string;
}

export interface CustomerQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sort?: string;
    order?: "asc" | "desc";
    year?: number;
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
    categoryId?: string;
    productDiscountId?: string;
    sort?: string;
    order?: "asc" | "desc";
    startDate?: string;
    endDate?: string;
    month?: string;
    year?: number;
    week?: string;
}

export interface ApiCategory {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
}

export interface CategoryCreatePayload {
    name: string;
}

export interface ApiProductPrice {
    id?: string;
    productVariantId?: string;
    normal: number;
    buy: number;
    reseller: number;
    agent: number;
    member: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiProductWholesaler {
    id?: string;
    lowerLimitItem: number;
    upperLimitItem: number;
    unitPrice: number;
    wholesalerPrice: number;
}

export interface ApiProductDiscount {
    id?: string;
    type: "PERCENT" | "NOMINAL";
    value: number;
    startDate?: string;
    endDate?: string;
}

export interface ApiProductVariantDetail {
    id: string;
    productId: string;
    sku: string;
    stock: number;
    size: string;
    color: string;
    imageUrl: string;
    barcode: string | null;
    createdAt: string;
    updatedAt: string;
    productPrices: ApiProductPrice;
    productWholesalers?: ApiProductWholesaler[];
}

export interface ApiProductDetail {
    id: string;
    categoryId: string | null;
    name: string;
    type: "BARANG_STOK_SENDIRI" | "BARANG_SUPPLIER_LAIN" | "BARANG_PRE_ORDER";
    description: string;
    weight: number;
    isPublish: boolean;
    createdAt: string;
    updatedAt: string;
    category: ApiCategory | null;
    ProductDiscount: ApiProductDiscount[];
    productVariants: ApiProductVariantDetail[];
}

export interface ProductPricePayload {
    normal: number;
    buy: number;
    reseller: number;
    agent: number;
    member: number;
}

export interface ProductWholesalerPayload {
    lowerLimitItem: number;
    upperLimitItem: number;
    unitPrice: number;
    wholesalerPrice: number;
}

export interface ProductVariantPayload {
    id?: string;
    imageUrl?: File | string | null;
    sku: string;
    productPrices: ProductPricePayload;
    productWholesalers?: ProductWholesalerPayload[];
    barcode?: string;
    size?: string;
    color?: string;
    stock: number;
}

export interface ProductDiscountPayload {
    id?: string;
    type: "PERCENT" | "NOMINAL";
    value: number;
    startDate?: string;
    endDate?: string;
}

export interface ProductFullCreatePayload {
    product: {
        categoryId?: string;
        name: string;
        type: "BARANG_STOK_SENDIRI" | "BARANG_SUPPLIER_LAIN" | "BARANG_PRE_ORDER";
        description: string;
        weight: number;
        isPublish: boolean;
    };
    productDiscount: ProductDiscountPayload;
    productVariants: ProductVariantPayload[];
}

// Expense types matching actual API structure
export interface ApiExpense {
    id: string;
    itemName: string;
    itemPrice: number;
    expenseDate: string;
    qty: number;
    totalPrice: number;
    personResponsible: string;
    note: string;
    createdAt: string;
    updatedAt: string;
}

export interface ExpenseListResponse {
    success: boolean;
    message: string;
    responseObject: {
        filterInfo: string;
        totalExpenses: number;
        totalData: number;
        data: ApiExpense[];
    };
}

export interface ExpenseQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
    sort?: string;
    order?: "asc" | "desc";
}

export interface ExpenseCreatePayload {
    itemName: string;
    itemPrice: number;
    expenseDate: string;
    qty: number;
    personResponsible?: string;
    note?: string;
}

// Export filter params — shared by all export functions
export interface ExportFilterParams {
    startDate?: string; // Format: YYYY-MM-DD
    endDate?: string;   // Format: YYYY-MM-DD
    month?: string;     // Month number 1-12
    year?: string;      // Year in YYYY format
    week?: string;      // Week number 1-52
}

// Report types
export interface ReportQueryParams {
    startDate?: string; // Format: YYYY-MM-DD
    endDate?: string;   // Format: YYYY-MM-DD
    month?: string;     // Month number 1-12
    year?: string;      // Year in YYYY format
    week?: string;      // Week number 1-52
}

export interface ReportExpenses {
    filterInfo: string;
    totalExpenses: number;
    totalData: number;
}

export interface ReportOrders {
    filterInfo: string;
    total_transactions: number;
    total_item_terjual: number;
    total_transaction_pending: number;
    total_transaction_success: number;
    total_transaction_failed: number;
    total_transaction_installments: number;
    total_expenses: number;
    expenses_amount: number;
    penjualan_kotor: number;
    penjualan_bersih: number;
    laba_kotor: number;
    laba_bersih: number;
}

export interface ReportProducts {
    filterInfo: string;
    total_normal_price: number;
    total_buy_price: number;
    total_reseller_price: number;
    total_member_price: number;
    total_agent_price: number;
    totalData: number;
}

export interface ReportTransactions {
    filterInfo: string;
    keuntungan: number;
    keuntungan_per_hari: Record<string, number>;
}

export interface ReportPaymentTransactions {
    filterInfo: string;
    keuntungan: number;
    keuntungan_per_hari: Record<string, number>;
}

export interface ReportProductsSold {
    filterInfo: string;
    totalProductsSold: number;
    produk_terjual_per_hari: Record<string, number>;
}

// Region types for address selection
export interface ApiProvince {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiCity {
    id: string;
    provinceId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiDistrict {
    id: string;
    cityId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiVillage {
    id: string;
    districtId: string;
    name: string;
    postalCode: number;
}

// ============================================================
// Shop types
// ============================================================
export interface ApiShop {
    id: string;
    name: string;
    description: string;
    phoneNumber: string;
    email?: string;
    address: string;
    owner?: string;
    logo?: string;
    banner?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// Shipping types
// ============================================================
export interface ShippingCostParams {
    shipper_destination_id: number;
    receiver_destination_id: number;
    weight: number; // dalam gram
    item_value: number;
    cod: "yes" | "no";
}

export interface ShippingOption {
    shipping_name: string;
    service_name: string;
    weight: number;
    is_cod: boolean;
    shipping_cost: number;
    shipping_cashback: number;
    shipping_cost_net: number;
    grandtotal: number;
    service_fee: number;
    net_income: number;
    etd: string;
}

export interface ShippingCostResponse {
    calculate_reguler: ShippingOption[];
    calculate_cargo: ShippingOption[];
    calculate_instant: ShippingOption[];
}

// ============================================================
// Sales Channel payload & query types
// ============================================================
export interface SalesChannelCreatePayload {
    name: string;
    isActive?: boolean;
}

export interface SalesChannelQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

// ============================================================
// Payment Method payload & query types
// ============================================================
export interface PaymentMethodCreatePayload {
    name: string;
    bankName: string;
    bankBranch: string;
    accountNumber: string;
}

export interface PaymentMethodQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

// ============================================================
// Delivery Place payload & query types
// ============================================================
export interface DeliveryPlaceCreatePayload {
    name: string;
    address: string;
    subdistrict: string;
    phoneNumber: string;
    destinationId: number;
    email?: string;
    description?: string;
}

export interface DeliveryPlaceQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

// ============================================================
// Customer payload types
// ============================================================
export interface CustomerCreatePayload {
    name: string;
    category: "CUSTOMER" | "RESELLER" | "AGENT" | "MEMBER" | "DROPSHIPPER";
    address: string;
    province?: string;
    city?: string;
    district?: string;
    village?: string;
    subdistrict?: string;
    postalCode: string;
    phoneNumber: string;
    destinationId?: number | null;
    email: string;
    status?: "ACTIVE" | "INACTIVE";
}

// ============================================================
// Product service payload types
// ============================================================
export interface ProductCreatePayload {
    product: {
        categoryId: string;
        name: string;
        type: "BARANG_STOK_SENDIRI" | "BARANG_SUPPLIER_LAIN" | "BARANG_PRE_ORDER";
        description: string;
        weight: number;
        isPublish?: boolean;
    };
    productDiscount?: {
        id?: string;
        type?: string;
        value?: number;
        startDate?: string;
        endDate?: string;
    };
    productVariants: {
        id?: string;
        sku: string;
        stock: number;
        size: string;
        color: string;
        barcode?: string;
        imageUrl?: File | string | null;
        productPrices: {
            id?: string;
            productVariantId?: string;
            buy: number;
            agent: number;
            reseller: number;
            member: number;
            normal: number;
            createdAt?: string;
            updatedAt?: string;
        };
        productWholesalers?: ProductWholesalerPayload[];
    }[];
}

// ============================================================
// Expense result types
// ============================================================
export interface ExpenseListResult {
    data: ApiExpense[];
    totalExpenses: number;
    totalData: number;
    filterInfo: string;
}

// ============================================================
// Auth types
// ============================================================
export interface CurrentUserResponse {
    success: boolean;
    message: string;
    responseObject: {
        id: string;
        email: string;
        fullname: string;
        phoneNumber: string;
        role: string;
    };
    statusCode: number;
}

export interface UpdateProfilePayload {
    fullname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string;
}

export interface UpdateProfileResponse {
    success: boolean;
    message: string;
    responseObject?: {
        id: string;
        email: string;
        fullname: string;
        phoneNumber: string;
        role: string;
    };
    statusCode: number;
}

