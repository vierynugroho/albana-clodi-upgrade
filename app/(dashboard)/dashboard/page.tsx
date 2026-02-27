"use client";

import { useState } from "react";
import { WelcomeCard } from "@/components/dashboards/WelcomeCard";
import { FilterButtons, FilterType } from "@/components/dashboards/FilterButton";
import { QuickActions } from "@/components/dashboards/QuickActions";
import { StatsGrid } from "@/components/dashboards/StatGrid";
import { useCurrentUser } from "@/hooks/useAuth";

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>("Today");

  return (
    <div className="space-y-6">
      <WelcomeCard />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Statistik Penjualan</h2>
          <p className="text-sm text-muted-foreground">
            {filter === "Today"
              ? "Statistik Penjualan Hari Ini"
              : "Statistik Penjualan Kemarin"}
          </p>
        </div>

        <FilterButtons
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {/* ⬇️ PASS FILTER KE STATSGRID */}
      <StatsGrid filter={filter} />

      <div className="space-y-6">
        <QuickActions />
      </div>
    </div>
  );
}
