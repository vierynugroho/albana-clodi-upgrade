"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useReportOrders, useReportExpenses} from "@/hooks/useReports";
import type { ReportQueryParams } from "@/types/api";
import { StatsGrid } from "@/components/reports/StatsGrid";
import { ProfitCards } from "@/components/reports/ProfitCards";
import { SummaryHeader } from "@/components/reports/SummaryHeader";
import { TransactionStatusCards } from "@/components/reports/TransactionStatusCard";
import { FilterSection } from "@/components/reports/FilterSection";
import { FileText, RefreshCw, TrendingUp } from "lucide-react";
import { ChartPlaceholder } from "@/components/reports/ChartPlaceholder";
import { useCustomerChartData, useExpensesChartData, useOrderChartData, useProductChartData } from "@/hooks/useCharts";
import { useCurrentUser } from "@/hooks/useAuth";

export default function ReportPage() {
  const [filterPreset, setFilterPreset] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [appliedQueryParams, setAppliedQueryParams] = useState<ReportQueryParams>({});

  const draftQueryParams: ReportQueryParams = useMemo(() => {
    const today = new Date();

    switch (filterPreset) {
      case "today": {
        const dateStr = today.toISOString().split("T")[0];
        return { startDate: dateStr, endDate: dateStr };
      }
      case "week": {
        return { week: "1", year: today.getFullYear().toString() };
      }
      case "month": {
        return {
          month: (today.getMonth() + 1).toString(),
          year: today.getFullYear().toString()
        };
      }
      case "year": {
        return { year: today.getFullYear().toString() };
      }
      case "custom": {
        if (startDate && endDate) {
          return { startDate, endDate };
        }
        return {};
      }
      default: {
        const params: ReportQueryParams = {};
        if (selectedMonth) params.month = selectedMonth;
        if (selectedYear) params.year = selectedYear;
        return params;
      }
    }
  }, [filterPreset, selectedMonth, selectedYear, startDate, endDate]);

  const handleApplyFilter = () => {
    setAppliedQueryParams(draftQueryParams);
  };

  const {
    data: ordersReport,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    refetch: refetchOrders,
  } = useReportOrders(appliedQueryParams);

  const {
    data: expensesReport,
    isLoading: isLoadingExpenses,
  } = useReportExpenses(appliedQueryParams);

  const {chartData: orderData, isLoading: isLoadingOrderChart } = useOrderChartData(appliedQueryParams);

  const {chartData: expensesData, isLoading: isLoadingExpensesChart} = useExpensesChartData(appliedQueryParams);

  const {chartData: customerData, isLoading: isLoadingCustomerChart} = useCustomerChartData(appliedQueryParams);

  const {chartData: productData, isLoading: isLoadingProductChart} = useProductChartData(appliedQueryParams);

  const {data} = useCurrentUser();
  const isSuperAdmin = data?.responseObject?.role?.toLowerCase() === "superadmin";

  const isLoading = isLoadingOrders || isLoadingExpenses;

  const handleFilterPresetChange = (preset: string) => {
    setFilterPreset(preset);
    if (preset !== "custom") {
      setStartDate("");
      setEndDate("");
    }
    if (preset !== "month" && preset !== "all") {
      setSelectedMonth("");
    }
  };
  if (isErrorOrders) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="h-7 w-7 text-purple" />
            Laporan
          </h1>
          <p className="page-description">Semua data laporan penjualan</p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-100 gap-4">
          <div className="text-center">
            <p className="font-semibold text-destructive">Gagal memuat data</p>
            <p className="text-sm text-muted-foreground mt-1">
              Terjadi kesalahan saat memuat data laporan
            </p>
          </div>
          <Button onClick={() => refetchOrders()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Coba lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <FileText className="h-7 w-7 text-purple" />
          Laporan
        </h1>
        <p className="page-description">Semua data laporan penjualan</p>
      </div>

      {isSuperAdmin && (
        <SummaryHeader
          totalPendapatan={ordersReport?.penjualan_bersih || 0}
          labaBersih={ordersReport?.laba_bersih || 0}
          filterInfo={ordersReport?.filterInfo || ""}
          isLoading={isLoading}
        />
      )}

      <FilterSection
        filterPreset={filterPreset}
        onFilterPresetChange={handleFilterPresetChange}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        filterInfo={ordersReport?.filterInfo || ""}
        onApplyFilter={handleApplyFilter}
      />

      {isSuperAdmin && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Ringkasan Keuangan</h3>
          <ProfitCards
            penjualanKotor={ordersReport?.penjualan_kotor || 0}
            penjualanBersih={ordersReport?.penjualan_bersih || 0}
            labaKotor={ordersReport?.laba_kotor || 0}
            labaBersih={ordersReport?.laba_bersih || 0}
            isLoading={isLoading}
          />
        </div>
      )}

      <StatsGrid
        expenses={expensesReport?.totalExpenses || ordersReport?.expenses_amount || 0}
        itemsSold={ordersReport?.total_item_terjual || 0}
        totalOrders={ordersReport?.total_transactions || 0}
        successOrders={ordersReport?.total_transaction_success || 0}
        isLoading={isLoading}
        hideExpenses={!isSuperAdmin}
      />

      <TransactionStatusCards
        pending={ordersReport?.total_transaction_pending || 0}
        installments={ordersReport?.total_transaction_installments || 0}
        failed={ordersReport?.total_transaction_failed || 0}
        isLoading={isLoading}
      />

      {isSuperAdmin && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartPlaceholder
            title="Grafik Order"
            description="Tren Jumlah Data Order"
            icon={TrendingUp}
            color="border-primary/20"
            data={orderData}
            isLoading={isLoadingOrderChart}
          />
          <ChartPlaceholder
            title="Grafik Pengeluaran"
            description="Tren Jumlah Data Pengeluaran"
            icon={TrendingUp}
            color="border-primary/20"
            data={expensesData}
            isLoading={isLoadingExpensesChart}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder
          title="Grafik Customer"
          description="Tren Jumlah Data Customer"
          icon={TrendingUp}
          color="border-primary/20"
          data={customerData}
          isLoading={isLoadingCustomerChart}
        />
        <ChartPlaceholder
          title="Grafik Product"
          description="Tren Jumlah Data Product"
          icon={TrendingUp}
          color="border-primary/20"
          data={productData}
          isLoading={isLoadingProductChart}
        />
      </div>

     
      
    </div>
  );
}
