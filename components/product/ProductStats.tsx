import { memo, useMemo } from "react";
import { StatCard } from "../ui";
import { Product } from "@/types";
import { AlertTriangle, Layers, Package, TrendingUp } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";

interface ProductStatsProps {
  products: Product[];
  isLoading: boolean;
}

export const ProductStats = memo(function ProductStats({
  products,
  isLoading,
}: ProductStatsProps) {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalVariants = products.reduce(
      (sum, p) => sum + (p.variants?.length || 0),
      0,
    );
    const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;
    const bestSellers = products.filter((p) => p.stock > 50).length;

    return [
      {
        title: "Total Produk",
        value: totalProducts.toLocaleString(),
        icon: Package,
        color: "green" as const,
        trend: "+23",
      },
      {
        title: "Total Variant",
        value: totalVariants.toLocaleString(),
        icon: Layers,
        color: "cyan" as const,
        trend: "+89",
      },
      {
        title: "Stock Menipis",
        value: lowStock.toLocaleString(),
        icon: AlertTriangle,
        color: "orange" as const,
        trend: "-3",
      },
      {
        title: "Produk Terlaris",
        value: bestSellers.toLocaleString(),
        icon: TrendingUp,
        color: "purple" as const,
        trend: "+15%",
      },
    ];
  }, [products]);

  if (isLoading) {
    return <ProductStatsSkeleton />;
  }
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
            trend={{
              value: stat.trend,
              isPositive: !stat.trend.startsWith("-"),
            }}
            description="bulan ini"
          />
        );
      })}
    </div>
  );
});

const ProductStatsSkeleton = memo(function ProductStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border bg-card p-6 shadow-xs space-y-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>

            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
});
