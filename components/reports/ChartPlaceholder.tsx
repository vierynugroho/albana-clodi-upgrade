"use client";

import { memo, useCallback, useMemo, useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
} from "recharts";
import { InfoIcon } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import type { ChartDataItem } from "@/types/unions";
import { formatCompact, formatFull } from "@/lib/utils";
import { Skeleton } from "../ui/Skeleton";

interface ChartPlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  data: ChartDataItem[];
  isLoading: boolean;
}

// Tooltip Custom
function ChartTooltip({
  active,
  payload,
  label,
  colors,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  colors: {
    tooltipBg: string;
    tooltipBorder: string;
    tooltipText: string;
    tooltipMuted: string;
  };
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg px-3 py-2 shadow-lg"
      style={{
        backgroundColor: colors.tooltipBg,
        border: `1px solid ${colors.tooltipBorder}`,
      }}
    >
      <p className="text-xs font-medium" style={{ color: colors.tooltipMuted }}>
        {label}
      </p>
      <p className="text-sm font-bold" style={{ color: colors.tooltipText }}>
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading || data.length === 0 || !containerRef.current)
      return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [mounted, isLoading, data.length]);

  const hasData = data.length > 0;

  const colors = useMemo(
    () => ({
      tickText: isDark ? "#a1a1aa" : "#71717a",
      grid: isDark ? "#3f3f46" : "#e4e4e7",
      brushBg: isDark ? "#18181b" : "#ffffff",
      tooltipBg: isDark ? "#27272a" : "#ffffff",
      tooltipBorder: isDark ? "#3f3f46" : "#e4e4e7",
      tooltipText: isDark ? "#fafafa" : "#18181b",
      tooltipMuted: isDark ? "#a1a1aa" : "#71717a",
    }),
    [isDark],
  );

  const shortName = useCallback((name: string) => {
    return name.length > 3 ? name.slice(0, 3) : name;
  }, []);

  if (isLoading) {
    return (
      <ChartPlaceholderSkeleton
        title={title}
        description={description}
        icon={Icon}
        color={color}
      />
    );
  }
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
          className={`relative w-full rounded-lg border border-dashed ${color} bg-muted/10 overflow-hidden`}
        >
          {/* EMPTY */}
          {!isLoading && !hasData && (
            <div className="h-[360px] flex flex-col items-center justify-center gap-2">
              <InfoIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Data tidak tersedia
              </span>
            </div>
          )}

          {/* CHART */}
          {!isLoading && hasData && mounted && (
            <div ref={containerRef} className="h-[360px] w-full">
              {dimensions.width > 0 && dimensions.height > 0 && (
                <AreaChart
                  width={dimensions.width}
                  height={dimensions.height}
                  data={data}
                  margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id={`gradient-${title}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0.02}
                      />
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
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

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
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

const ChartPlaceholderSkeleton = memo(function ChartPlaceholderSkeleton({
  title,
  description,
  icon: Icon,
  color,
}: Pick<ChartPlaceholderProps, "title" | "description" | "icon" | "color">) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-4 sm:px-4">
        <div
          className={`h-[360px] rounded-lg border border-dashed ${color} bg-muted/10 p-6`}
        >
          <div className="flex h-full flex-col justify-between">
            {/* Fake Chart */}
            <div className="flex h-full items-end gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-md"
                  style={{
                    height: `${35 + ((i * 17) % 55)}%`,
                  }}
                />
              ))}
            </div>

            {/* Brush */}
            <Skeleton className="mt-6 h-8 w-full rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
