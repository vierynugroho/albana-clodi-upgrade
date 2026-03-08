import { useQuery } from "@tanstack/react-query";
import * as reportService from "@/lib/services/report.service";
import type { ReportQueryParams } from "@/types/api";

export const reportKeys = {
    all: ["reports"] as const,
    expenses: (params?: ReportQueryParams) => [...reportKeys.all, "expenses", params] as const,
    orders: (params?: ReportQueryParams) => [...reportKeys.all, "orders", params] as const,
    products: (params?: ReportQueryParams) => [...reportKeys.all, "products", params] as const,
    transactions: (params?: ReportQueryParams) => [...reportKeys.all, "transactions", params] as const,
    productsSold: (params?: ReportQueryParams) => [...reportKeys.all, "productsSold", params] as const,
};

export function useReportExpenses(params?: ReportQueryParams) {
    return useQuery({
        queryKey: reportKeys.expenses(params),
        queryFn: () => reportService.fetchReportExpenses(params),
    });
}

export function useReportOrders(params?: ReportQueryParams) {
    return useQuery({
        queryKey: reportKeys.orders(params),
        queryFn: () => reportService.fetchReportOrders(params),
    });
}

export function useReportProducts(params?: ReportQueryParams) {
    return useQuery({
        queryKey: reportKeys.products(params),
        queryFn: () => reportService.fetchReportProducts(params),
    });
}

export function useReportTransactions(params?: ReportQueryParams) {
    return useQuery({
        queryKey: reportKeys.transactions(params),
        queryFn: () => reportService.fetchReportTransactions(params),
    });
}

export function useReportPaymentTransactions(params?: ReportQueryParams) {
    return useQuery({
        queryKey: reportKeys.transactions(params),
        queryFn: () => reportService.fetchReportPaymentTransactions(params),
    });
}

export function useReportProductsSold(params?: ReportQueryParams) {
    return useQuery({
        queryKey: reportKeys.productsSold(params),
        queryFn: () => reportService.fetchReportProductsSold(params),
    });
}
