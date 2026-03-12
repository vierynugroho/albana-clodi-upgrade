// // reportUtils.ts
import { useCustomers } from "@/hooks/useCustomers";
import { useExpenses } from "@/hooks/useExpenses";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import type { ChartDataItem } from "@/types/unions";

export const monthOrder = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

import { mapApiOrdersToOrders } from "@/lib/mappers";

type LocalChartItem = { name: string; total: number; sortKey: string };

function getGroupingContext(date: Date, params?: import("@/types/api").ReportQueryParams) {
  const isDayView = !!(params?.month || params?.week || params?.startDate || params?.endDate);
  
  if (isDayView) {
    const name = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "UTC" });
    const sortKey = date.toISOString().split('T')[0];
    return { name, sortKey };
  } else {
    const name = date.toLocaleDateString("id-ID", { month: "long", timeZone: "UTC" });
    const sortKey = date.toISOString().substring(0, 7);
    return { name, sortKey };
  }
}


export function useOrderChartData(params?: import("@/types/api").ReportQueryParams) {
  // `useOrders` expects `OrderQueryParams` where `orderYear` is a number
  const queryParams = { 
    ...params, 
    orderYear: params?.year ? parseInt(params.year) : new Date().getFullYear(),
    month: params?.month,
    startDate: params?.startDate,
    endDate: params?.endDate
  };
  
  const { data: monthlyReport, isLoading, isError, refetch } = useOrders(queryParams);

  // Map API orders to frontend Order type to get consistent total calculations
  const rawOrders = Array.isArray(monthlyReport) ? monthlyReport : [];
  const orders = mapApiOrdersToOrders(rawOrders);
  
  const chartData: ChartDataItem[] = orders
    .reduce<LocalChartItem[]>((acc, item) => {
      const date = new Date(item.date);
      const { name, sortKey } = getGroupingContext(date, params);
      const price = item.total ?? 0;

      const existing = acc.find(d => d.sortKey === sortKey);
      if (existing) {
        existing.total += price;
      } else {
        acc.push({ name, total: price, sortKey });
      }

      return acc;
    }, [])
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(item => ({ name: item.name, value: item.total }));

  return {
    chartData,
    isLoading,
    isError,
    refetch,
  };
}


export function useCustomerChartData(params?: import("@/types/api").ReportQueryParams) {
  const queryParams = { 
    ...params, 
    year: params?.year ? parseInt(params.year) : new Date().getFullYear(),
    month: params?.month ? parseInt(params.month) : undefined,
  };

  const {
    data: customersResponse,
    isLoading,
    isError,
    refetch,
  } = useCustomers(queryParams);

  // ✅ ambil array customer dengan aman
  const customers = Array.isArray(customersResponse) ? customersResponse : [];

  const chartData: ChartDataItem[] = customers
    .reduce<LocalChartItem[]>((acc, customer) => {
      const date = new Date(customer.createdAt);
      const { name, sortKey } = getGroupingContext(date, params);

      const existing = acc.find(d => d.sortKey === sortKey);

      if (existing) {
        existing.total += 1; // ⬅️ hitung jumlah customer
      } else {
        acc.push({ name, total: 1, sortKey });
      }

      return acc;
    }, [])
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(item => ({
      name: item.name,
      value: item.total,
    }));

  return {
    chartData,
    isLoading,
    isError,
    refetch,
  };
}


export function useProductChartData(params?: import("@/types/api").ReportQueryParams) {
  const queryParams = { 
    ...params, 
    year: params?.year ? parseInt(params.year) : new Date().getFullYear(),
    month: params?.month,
  };

  const {
    data: productResponse,
    isLoading,
    isError,
    refetch,
  } = useProducts(queryParams);

  // ✅ ambil array product dengan aman
  const products = Array.isArray(productResponse) ? productResponse : [];

  const chartData: ChartDataItem[] = products
    .reduce<LocalChartItem[]>((acc, product) => {
      const date = new Date(product.product.createdAt);
      const { name, sortKey } = getGroupingContext(date, params);

      const existing = acc.find(d => d.sortKey === sortKey);

      if (existing) {
        existing.total += 1; // ⬅️ hitung jumlah product
      } else {
        acc.push({ name, total: 1, sortKey });
      }

      return acc;
    }, [])
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(item => ({
      name: item.name,
      value: item.total,
    }));

  return {
    chartData,
    isLoading,
    isError,
    refetch,
  };
}


export function useExpensesChartData(params?: import("@/types/api").ReportQueryParams) {
  const queryParams = { 
    ...params, 
    year: params?.year ? parseInt(params.year) : new Date().getFullYear(),
    month: params?.month ? parseInt(params.month) : undefined,
  };

  const {
    data: expensesResponse,
    isLoading,
    isError,
    refetch,
  } = useExpenses(queryParams);

  // ambil array expenses dengan aman
  const expensesData = expensesResponse?.data;
  const expenses = Array.isArray(expensesData) ? expensesData : [];

  const chartData: ChartDataItem[] = expenses
    .reduce<LocalChartItem[]>((acc, item) => {
      const date = new Date(item.expenseDate);
      const { name, sortKey } = getGroupingContext(date, params);
      const price = item.totalPrice ?? item.itemPrice ?? 0;

      const existing = acc.find(d => d.sortKey === sortKey);

      if (existing) {
        existing.total += price;
      } else {
        acc.push({ name, total: price, sortKey });
      }

      return acc;
    }, [])
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(item => ({
      name: item.name,
      value: item.total,
    }));

  return {
    chartData,
    isLoading,
    isError,
    refetch,
  };
}

