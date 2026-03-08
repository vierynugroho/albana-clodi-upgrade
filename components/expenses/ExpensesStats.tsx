import { formatCurrency } from "@/lib/utils";
import { Calendar, Loader2, PieChart, TrendingDown, Wallet } from "lucide-react";
import { memo } from "react";
import { StatCard } from "../ui";
import { useCurrentUser } from "@/hooks/useAuth";
import { LoadingState } from "../shared/LoadingState";

interface ExpenseStatsProps {
  totalExpenses: number;
  thisMonthTotal: number;
  monthTrend: number;
  averagePerMonth: number;
  largestCategory: string;
  largestPercentage: string;
  isLoading: boolean;
}

export const ExpenseStats = memo(function ExpenseStats({
  totalExpenses,
  thisMonthTotal,
  monthTrend,
  averagePerMonth,
  largestCategory,
  largestPercentage,
  isLoading,
}: ExpenseStatsProps) {
  const { data: userData } = useCurrentUser();
  const isSuperAdmin = userData?.responseObject?.role?.toLowerCase() === "superadmin";

  // Hide financial metrics if not superadmin
  if (!isSuperAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <LoadingState key={i} />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Pengeluaran",
      value: formatCurrency(totalExpenses),
      icon: Wallet,
      color: "orange" as const,
      trend: undefined,
      isPositive: false,
    },
    {
      title: "Bulan Ini",
      value: formatCurrency(thisMonthTotal),
      icon: Calendar,
      color: "pink" as const,
      trend: monthTrend !== 0 ? `${monthTrend > 0 ? "+" : ""}${monthTrend}%` : undefined,
      isPositive: monthTrend < 0,
    },
    {
      title: "Rata-rata/Bulan",
      value: formatCurrency(averagePerMonth),
      icon: PieChart,
      color: "purple" as const,
      trend: undefined,
      isPositive: false,
    },
    {
      title: "Pembelian Terbesar",
      value: largestCategory.length > 12
        ? largestCategory.slice(0, 12) + "..."
        : largestCategory,
      icon: TrendingDown,
      color: "cyan" as const,
      trend: largestPercentage,
      isPositive: false,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={<Icon className="h-5 w-5" />}
            color={stat.color}
            trend={stat.trend ? { value: stat.trend, isPositive: stat.isPositive } : undefined}
            description={stat.trend ? "dari bulan lalu" : undefined}
          />
        );
      })}
    </div>
  );
});
