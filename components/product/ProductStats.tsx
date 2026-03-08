import { memo, useMemo } from "react";
import { StatCard } from "../ui";
import { Product } from "@/types";
import { AlertTriangle, Layers, Package, TrendingUp } from "lucide-react";

interface ProductStatsProps {
  products: Product[];
}

export const ProductStats = memo(function ProductStats({ products }: ProductStatsProps) {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);
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