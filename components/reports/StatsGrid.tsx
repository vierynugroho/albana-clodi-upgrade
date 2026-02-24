import { formatCurrency } from "@/lib/utils";
import { CheckCircle, DollarSign, Loader2, Package, ShoppingCart } from "lucide-react";
import { memo } from "react";
import { Card, CardContent, StatCard } from "../ui";

interface StatsGridProps {
  expenses: number;
  itemsSold: number;
  totalOrders: number;
  successOrders: number;
  isLoading: boolean;
}

export const StatsGrid = memo(function StatsGrid({
  expenses,
  itemsSold,
  totalOrders,
  successOrders,
  isLoading,
}: StatsGridProps) {
  const stats = [
    {
      label: "Pengeluaran",
      value: formatCurrency(expenses),
      icon: DollarSign,
      color: "orange" as const,
    },
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

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 animate-pulse">
            <CardContent className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
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