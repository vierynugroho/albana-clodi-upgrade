"use client";

import { memo, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { InfoIcon } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import type { ChartDataItem } from "@/types/unions";


interface ChartPlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  data: ChartDataItem[];
  isLoading: boolean;
}

// Format angka ke format Indonesia ringkas (1.5jt, 500rb, dll)
function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return value.toString();
}

// Format angka ke format Indonesia lengkap
function formatFull(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

// Custom tooltip
function ChartTooltip({
  active,
  payload,
  label,
  colors,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  colors?: { tooltipBg: string; tooltipBorder: string; tooltipText: string; tooltipMuted: string };
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg px-3 py-2 shadow-lg"
      style={{
        backgroundColor: colors?.tooltipBg ?? "#fff",
        border: `1px solid ${colors?.tooltipBorder ?? "#e4e4e7"}`,
      }}
    >
      <p className="text-xs font-medium" style={{ color: colors?.tooltipMuted ?? "#71717a" }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: colors?.tooltipText ?? "#18181b" }}>
        {formatFull(payload[0].value)}
      </p>
    </div>
  );
}

export const ChartPlaceholder = memo(function ChartPlaceholder({
  title,
  description,
  icon: Icon,
  color,
  data,
  isLoading,
}: ChartPlaceholderProps) {
  const hasData = data.length > 0;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme-aware colors for recharts SVG elements
  const colors = useMemo(() => ({
    tickText: isDark ? "#a1a1aa" : "#71717a",
    grid: isDark ? "#3f3f46" : "#e4e4e7",
    brushBg: isDark ? "#18181b" : "#ffffff",
    tooltipBg: isDark ? "#27272a" : "#ffffff",
    tooltipBorder: isDark ? "#3f3f46" : "#e4e4e7",
    tooltipText: isDark ? "#fafafa" : "#18181b",
    tooltipMuted: isDark ? "#a1a1aa" : "#71717a",
  }), [isDark]);

  // Shorten month names for XAxis (e.g. "Januari" -> "Jan")
  const shortName = useCallback((name: string) => {
    return name.length > 3 ? name.slice(0, 3) : name;
  }, []);

  return (
    <Card className="overflow-hidden">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="px-2 pb-4 sm:px-4">
        <div
          className={`w-full rounded-lg border border-dashed ${color} bg-muted/10 overflow-hidden`}
          style={{ height: 360 }}
        >
          {/* LOADING */}
          {isLoading && <LoadingState />}

          {/* EMPTY */}
          {!isLoading && !hasData && (
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <InfoIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Data tidak tersedia
              </span>
            </div>
          )}

          {/* CHART */}
          {!isLoading && hasData && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={colors.grid}
                  opacity={0.5}
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tickFormatter={shortName}
                  tick={{ fontSize: 11, fill: colors.tickText }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />

                <YAxis
                  tickFormatter={formatCompact}
                  tick={{ fontSize: 11, fill: colors.tickText }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />

                <Tooltip content={<ChartTooltip colors={colors} />} />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill={`url(#gradient-${title})`}
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                />

                {/* Brush for zoom/scroll — visible when data has many points */}
                {data.length > 4 && (
                  <Brush
                    dataKey="name"
                    height={28}
                    stroke="#6366f1"
                    fill={colors.brushBg}
                    tickFormatter={shortName}
                    travellerWidth={10}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
