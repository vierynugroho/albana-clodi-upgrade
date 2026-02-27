// // reportUtils.ts
import { useCustomers } from "@/hooks/useCustomers";
import { useExpenses } from "@/hooks/useExpenses";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import type { ChartItem, ChartDataItem } from "@/types/unions";

export const monthOrder = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];


import { mapApiOrdersToOrders } from "@/lib/mappers";

export function useOrderChartData(orderYear?: number) {
  const year = orderYear ?? new Date().getFullYear();
  const { data: monthlyReport, isLoading, isError, refetch } = useOrders({ orderYear: year });

  // Map API orders to frontend Order type to get consistent total calculations
  const rawOrders = Array.isArray(monthlyReport) ? monthlyReport : [];
  const orders = mapApiOrdersToOrders(rawOrders);
  
  const chartData: ChartDataItem[] = orders
    .reduce<ChartItem[]>((acc, item) => {
      const date = new Date(item.date);
      const month = date.toLocaleDateString("id-ID", { month: "long", timeZone: "UTC" });
      const price = item.total ?? 0;

      const existing = acc.find(d => d.month === month);
      if (existing) {
        existing.total += price;
      } else {
        acc.push({ month, total: price });
      }

      return acc;
    }, [])
    .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month))
    .map(item => ({ name: item.month, value: item.total }));

  return {
    chartData,
    isLoading,
    isError,
    refetch,
  };
}

export function useCustomerChartData(customerYear?: number) {
  const year = customerYear ?? new Date().getFullYear();

  const {
    data: customersResponse,
    isLoading,
    isError,
    refetch,
  } = useCustomers({ year });

  // ✅ ambil array customer dengan aman
  const customers = Array.isArray(customersResponse) ? customersResponse : [];

  const chartData: ChartDataItem[] = customers
    .reduce<ChartItem[]>((acc, customer) => {
      const date = new Date(customer.createdAt);

      const month = date.toLocaleDateString("id-ID", {
        month: "long",
        timeZone: "UTC",
      });

      const existing = acc.find(d => d.month === month);

      if (existing) {
        existing.total += 1; // ⬅️ hitung jumlah customer
      } else {
        acc.push({ month, total: 1 });
      }

      return acc;
    }, [])
    .sort(
      (a, b) =>
        monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    )
    .map(item => ({
      name: item.month,
      value: item.total,
    }));

  return {
    chartData,
    isLoading,
    isError,
    refetch,
  };
}

export function useProductChartData(productYear?: number) {
  const year = productYear ?? new Date().getFullYear();

  const {
    data: productResponse,
    isLoading,
    isError,
    refetch,
  } = useProducts({ year: year });

  // ✅ ambil array product dengan aman
  const products = Array.isArray(productResponse) ? productResponse : [];

  const chartData: ChartDataItem[] = products
    .reduce<ChartItem[]>((acc, product) => {
      const date = new Date(product.product.createdAt);

      const month = date.toLocaleDateString("id-ID", {
        month: "long",
        timeZone: "UTC",
      });

      const existing = acc.find(d => d.month === month);

      if (existing) {
        existing.total += 1; // ⬅️ hitung jumlah customer
      } else {
        acc.push({ month, total: 1 });
      }

      return acc;
    }, [])
    .sort(
      (a, b) =>
        monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    )
    .map(item => ({
      name: item.month,
      value: item.total,
    }));

  return {
    chartData,
    isLoading,
    isError,
    refetch,
  };
}

export function useExpensesChartData(expensesYear?: number) {
  const year = expensesYear ?? new Date().getFullYear();

  const {
    data: expensesResponse,
    isLoading,
    isError,
    refetch,
  } = useExpenses({ year });

  // ambil array expenses dengan aman
  const expensesData = expensesResponse?.data;
  const expenses = Array.isArray(expensesData) ? expensesData : [];

  const chartData: ChartDataItem[] = expenses
    .reduce<ChartItem[]>((acc, item) => {
      const date = new Date(item.expenseDate);

      const month = date.toLocaleDateString("id-ID", {
        month: "long",
        timeZone: "UTC",
      });

      const price = item.totalPrice ?? item.itemPrice ?? 0;

      const existing = acc.find(d => d.month === month);

      if (existing) {
        existing.total += price;
      } else {
        acc.push({ month, total: price });
      }

      return acc;
    }, [])
    .sort(
      (a, b) =>
        monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    )
    .map(item => ({
      name: item.month,
      value: item.total,
    }));

  return {
    chartData,
    isLoading,
    isError,
    refetch,
  };
}

