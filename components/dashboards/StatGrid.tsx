import { memo, useMemo } from "react";
import { StatCard, StatCardColor } from "../ui";
import { FilterType } from "./FilterButton";
import { ReportQueryParams } from "@/types/api";
import { useReportOrders } from "@/hooks/useReports";
import { useCurrentUser } from "@/hooks/useAuth";
import {
  BanknoteArrowDown,
  BanknoteX,
  DollarSign,
  PackageCheckIcon,
  Wallet,
  WalletCards,
} from "lucide-react";
import { formatDateISO } from "@/lib/utils";
import { StatCardSkeleton } from "../ui/card";

interface Stat {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: StatCardColor;
}

export const StatsGrid = memo(function StatsGrid({
  filter,
}: {
  filter: FilterType;
}) {
  const { data: userData } = useCurrentUser();
  const isSuperAdmin =
    userData?.responseObject?.role?.toLowerCase() === "superadmin";
  const queryParams: ReportQueryParams = useMemo(() => {
    const today = new Date();

    if (filter === "Today") {
      const todayStr = formatDateISO(today);
      return { startDate: todayStr, endDate: todayStr };
    }

    if (filter === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = formatDateISO(yesterday);
      return { startDate: yesterdayStr, endDate: yesterdayStr };
    }

    return {};
  }, [filter]);

  const { data, isLoading } = useReportOrders(queryParams);

  if (isLoading) {
    const skeletonCount = 6;

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const stats: Stat[] = [
    {
      title: "Amount Expenses",
      value: data?.expenses_amount ?? 0,
      description: "Jumlah Pengeluaran",
      icon: WalletCards,
      color: "pink",
    },
    {
      title: "Total Expenses",
      value: data?.total_expenses ?? 0,
      description: "Pengeluaran total",
      icon: BanknoteArrowDown,
      color: "blue",
    },
    {
      title: "Products Sold",
      value: data?.total_item_terjual ?? 0,
      description: "Jumlah produk terjual",
      icon: PackageCheckIcon,
      color: "green",
    },
    {
      title: "Transactions",
      value: data?.total_transactions ?? 0,
      description: "Jumlah transaksi",
      icon: DollarSign,
      color: "orange",
    },
    {
      title: "Payment Transactions",
      value: data?.total_transaction_success ?? 0,
      description: "Transaksi pembayaran",
      icon: Wallet,
      color: "purple",
    },
    {
      title: "Failed Transactions",
      value: data?.total_transaction_failed ?? 0,
      description: "Transaksi gagal",
      icon: BanknoteX,
      color: "cyan",
    },
  ];

  // Filter: admin hanya lihat non-keuangan
  const visibleStats = isSuperAdmin
    ? stats
    : stats.filter(
        (s) =>
          !["Amount Expenses", "Total Expenses", "Transactions"].includes(
            s.title,
          ),
      );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleStats.map(({ title, icon: Icon, ...stat }) => (
        <StatCard
          key={title}
          title={title}
          icon={<Icon />}
          {...stat}
          color={stat.color}
        />
      ))}
    </div>
  );
});
