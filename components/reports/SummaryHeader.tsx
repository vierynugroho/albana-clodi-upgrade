import { memo } from "react";
import { GradientCard } from "../ui";
import { BarChart3, Loader2, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { LoadingState } from "@/components/shared/LoadingState";

interface SummaryHeaderProps {
  totalPendapatan: number;
  labaBersih: number;
  filterInfo: string;
  isLoading: boolean;
}

export const SummaryHeader = memo(function SummaryHeader({
  totalPendapatan,
  labaBersih,
  filterInfo,
  isLoading,
}: SummaryHeaderProps) {
  return (
    <GradientCard gradient="info" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm font-medium text-white/80">
              Ringkasan Laporan
            </span>
          </div>
          {isLoading ? (
            <LoadingState 
              className="flex-row justify-start py-2" 
              iconClassName="text-white"
              textClassName="text-xl text-white" 
            />
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold">
                Penjualan Bersih: {formatCurrency(totalPendapatan)}
              </h2>
              <p className="text-white/80 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Laba Bersih: {formatCurrency(labaBersih)} • {filterInfo || "Semua data"}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </GradientCard>
  );
});