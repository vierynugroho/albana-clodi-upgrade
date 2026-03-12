import { Customer } from "@/types";
import { Briefcase, Crown, UserCheck, Users } from "lucide-react";
import { memo, useMemo } from "react";
import { StatCard } from "../ui";
import { LoadingState } from "../shared/LoadingState";

interface CustomerStatsProps {
  customers: Customer[];
  isLoading?: boolean;
}

export const CustomerStats = memo(function CustomerStats({ customers, isLoading }: CustomerStatsProps) {
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const resellers = customers.filter((c) => c.category === "reseller").length;
    const agents = customers.filter((c) => c.category === "agen").length;
    const members = customers.filter((c) => c.category === "member").length;
    const dropshippers = customers.filter((c) => c.category === "dropshipper").length;

    // Calculate percentages
    const resellerPercentage = totalCustomers > 0 ? Math.round((resellers / totalCustomers) * 100) : 0;
    const agentPercentage = totalCustomers > 0 ? Math.round((agents / totalCustomers) * 100) : 0;
    const memberPercentage = totalCustomers > 0 ? Math.round((members / totalCustomers) * 100) : 0;

    return [
      {
        title: "Total Customer",
        value: totalCustomers.toLocaleString(),
        icon: Users,
        color: "blue" as const,
        trend: undefined,
        description: `${dropshippers} dropshipper`,
      },
      {
        title: "Reseller Aktif",
        value: resellers.toLocaleString(),
        icon: UserCheck,
        color: "cyan" as const,
        trend: `${resellerPercentage}%`,
        description: "dari total customer",
      },
      {
        title: "Agen",
        value: agents.toLocaleString(),
        icon: Crown,
        color: "purple" as const,
        trend: `${agentPercentage}%`,
        description: "dari total customer",
      },
      {
        title: "Member VIP",
        value: members.toLocaleString(),
        icon: Briefcase,
        color: "pink" as const,
        trend: `${memberPercentage}%`,
        description: "dari total customer",
      },
    ];
  }, [customers]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <LoadingState key={i} />
        ))}
      </div>
    );
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
            trend={stat.trend ? { value: stat.trend, isPositive: true } : undefined}
            description={stat.description}
          />
        );
      })}
    </div>
  );
});