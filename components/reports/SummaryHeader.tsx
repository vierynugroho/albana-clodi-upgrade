import { memo } from "react";
import { GradientCard } from "../ui";
import { BarChart3, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { LoadingState } from "@/components/shared/LoadingState";
import { Skeleton } from "../ui/Skeleton";

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
  if (isLoading) {
    return <SummaryHeaderSkeleton />;
  }
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

          <h2 className="text-2xl md:text-3xl font-bold">
            Penjualan Bersih: {formatCurrency(totalPendapatan)}
          </h2>
          <p className="text-white/80 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>
              Laba Bersih: {formatCurrency(labaBersih)} •{" "}
              {filterInfo || "Semua data"}
            </span>
          </p>
        </div>
      </div>
    </GradientCard>
  );
});

const SummaryHeaderSkeleton = memo(function SummaryHeaderSkeleton() {
  return (
    <GradientCard gradient="info" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm font-medium text-white/80">
            Ringkasan Laporan
          </span>
        </div>

        <Skeleton className="h-8 w-72 bg-white/20" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
          <Skeleton className="h-4 w-64 bg-white/20" />
        </div>
      </div>
    </GradientCard>
  );
});
