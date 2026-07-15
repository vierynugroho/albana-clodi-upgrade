import { formatCurrency } from "@/lib/utils";
import { CheckCircle, DollarSign, Package, ShoppingCart } from "lucide-react";
import { memo } from "react";
import { StatCard } from "../ui";
import { LoadingState } from "../shared/LoadingState";
import { Skeleton } from "../ui/Skeleton";

interface StatsGridProps {
  expenses: number;
  itemsSold: number;
  totalOrders: number;
  successOrders: number;
  isLoading: boolean;
  hideExpenses?: boolean;
}

export const StatsGrid = memo(function StatsGrid({
  expenses,
  itemsSold,
  totalOrders,
  successOrders,
  isLoading,
  hideExpenses = false,
}: StatsGridProps) {
  const allStats = [
    ...(!hideExpenses
      ? [
          {
            label: "Pengeluaran",
            value: formatCurrency(expenses),
            icon: DollarSign,
            color: "orange" as const,
          },
        ]
      : []),
    {
      label: "Total Item Terjual",
      value: itemsSold.toLocaleString(),
      icon: Package,
      color: "green" as const,
    },
    {
      label: "Total Order",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "blue" as const,
    },
    {
      label: "Transaksi Lunas",
      value: successOrders.toLocaleString(),
      icon: CheckCircle,
      color: "teal" as const,
    },
  ];

  const gridCols = hideExpenses ? "lg:grid-cols-3" : "lg:grid-cols-4";

  if (isLoading) {
    return <StatsGridSkeleton hideExpenses={hideExpenses} />;
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${gridCols}`}>
      {allStats.map((item) => {
        const Icon = item.icon;
        return (
          <StatCard
            key={item.label}
            title={item.label}
            value={item.value}
            icon={<Icon className="h-5 w-5" />}
            color={item.color}
          />
        );
      })}
    </div>
  );
});

const StatsGridSkeleton = memo(function StatsGridSkeleton({
  hideExpenses = false,
}: {
  hideExpenses?: boolean;
}) {
  const cardCount = hideExpenses ? 3 : 4;
  const gridCols = hideExpenses ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${gridCols}`}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border bg-card p-6 shadow-xs space-y-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>

            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>

          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
});
