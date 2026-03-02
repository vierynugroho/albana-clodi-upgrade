"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportProducts } from "@/lib/services/product.service";
import { exportOrders } from "@/lib/services/order.service";
import { exportCustomers } from "@/lib/services/customer.service";
import { exportExpenses } from "@/lib/services/expense.service";
import type { ExportFilterParams } from "@/types/api";

type ExportType = "products" | "orders" | "customers" | "expenses";

const EXPORT_LABELS: Record<ExportType, string> = {
  products: "Produk",
  orders: "Order",
  customers: "Customer",
  expenses: "Pengeluaran",
};

function ExportPageContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasStarted = useRef(false);

  const exportType = (searchParams.get("type") || "") as ExportType;

  useEffect(() => {
    if (hasStarted.current) return;
    if (!exportType || !EXPORT_LABELS[exportType]) {
      setStatus("error");
      setErrorMessage("Tipe export tidak valid.");
      return;
    }

    hasStarted.current = true;

    // Extract filter params from URL
    const params: ExportFilterParams = {};
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const week = searchParams.get("week");

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (month) params.month = month;
    if (year) params.year = year;
    if (week) params.week = week;

    async function doExport() {
      try {
        let blob: Blob;

        switch (exportType) {
          case "products":
            blob = await exportProducts("excel", params);
            break;
          case "orders":
            blob = await exportOrders("excel", params);
            break;
          case "customers":
            blob = await exportCustomers(params);
            break;
          case "expenses":
            blob = await exportExpenses(params);
            break;
          default:
            throw new Error("Tipe export tidak valid");
        }

        // Trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${exportType}_${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Terjadi kesalahan saat mengexport data."
        );
      }
    }

    doExport();
  }, [exportType, searchParams]);

  const label = EXPORT_LABELS[exportType] || "Data";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Mengexport {label}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sedang memproses data, mohon tunggu...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Export Berhasil!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Data {label.toLowerCase()} berhasil diexport. File seharusnya sudah terdownload otomatis.
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => window.close()}
              >
                Tutup Halaman
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Export Gagal</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {errorMessage || "Terjadi kesalahan saat mengexport data."}
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  hasStarted.current = false;
                  setStatus("loading");
                  // Re-trigger by forcing re-render
                  window.location.reload();
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Coba Lagi
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.close()}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Memuat...</p>
            </div>
          </Card>
        </div>
      }
    >
      <ExportPageContent />
    </Suspense>
  );
}
