import api from "@/lib/api";
import type {
    ApiResponse,
    ReportQueryParams,
    ReportExpenses,
    ReportOrders,
    ReportProducts,
    ReportTransactions,
    ReportProductsSold,
    ReportPaymentTransactions,
} from "@/types/api";

export async function fetchReportExpenses(params?: ReportQueryParams): Promise<ReportExpenses> {
    const res = await api.get<ApiResponse<ReportExpenses>>("/reports/expenses", { params });
    return res.data?.responseObject || {
        filterInfo: "",
        totalExpenses: 0,
        totalData: 0,
    };
}

export async function fetchReportOrders(params?: ReportQueryParams): Promise<ReportOrders> {
    const res = await api.get<ApiResponse<ReportOrders>>("/reports/orders", { params });
    return res.data?.responseObject || {
        filterInfo: "",
        total_transactions: 0,
        total_item_terjual: 0,
        total_transaction_pending: 0,
        total_transaction_success: 0,
        total_transaction_failed: 0,
        total_transaction_installments: 0,
        total_expenses: 0,
        expenses_amount: 0,
        penjualan_kotor: 0,
        penjualan_bersih: 0,
        laba_kotor: 0,
        laba_bersih: 0,
    };
}

export async function fetchReportProducts(params?: ReportQueryParams): Promise<ReportProducts> {
    const res = await api.get<ApiResponse<ReportProducts>>("/reports/products", { params });
    return res.data?.responseObject || {
        filterInfo: "",
        total_normal_price: 0,
        total_buy_price: 0,
        total_reseller_price: 0,
        total_member_price: 0,
        total_agent_price: 0,
        totalData: 0,
    };
}

export async function fetchReportTransactions(params?: ReportQueryParams): Promise<ReportTransactions> {
    const res = await api.get<ApiResponse<ReportTransactions>>("/reports/transactions", { params });
    return res.data?.responseObject || {
        filterInfo: "",
        keuntungan: 0,
        keuntungan_per_hari: {},
    };
}

export async function fetchReportPaymentTransactions(params?: ReportQueryParams): Promise<ReportPaymentTransactions> {
    const res = await api.get<ApiResponse<ReportPaymentTransactions>>("/reports/payment-transactions", { params });
    return res.data?.responseObject || {
        filterInfo: "",
        keuntungan: 0,
        keuntungan_per_hari: {},
    };
}

export async function fetchReportProductsSold(params?: ReportQueryParams): Promise<ReportProductsSold> {
    const res = await api.get<ApiResponse<ReportProductsSold>>("/reports/products-sold", { params });
    return res.data?.responseObject || {
        filterInfo: "",
        totalProductsSold: 0,
        produk_terjual_per_hari: {},
    };
}
