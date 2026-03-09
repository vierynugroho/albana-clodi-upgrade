import { formatCurrency } from "@/lib/utils";
import { CheckCircle, DollarSign, Package, ShoppingCart } from "lucide-react";
import { memo } from "react";
import { StatCard } from "../ui";
import { LoadingState } from "../shared/LoadingState";

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
    ...(!hideExpenses ? [{
      label: "Pengeluaran",
      value: formatCurrency(expenses),
      icon: DollarSign,
      color: "orange" as const,
    }] : []),
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
    return (
      <div className={`grid gap-4 sm:grid-cols-2 ${gridCols}`}>
        {allStats.map((_, i) => (
          <LoadingState key={i}/>
        ))}
      </div>
    );
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