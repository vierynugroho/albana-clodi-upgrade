"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
} from "lucide-react";
import type { ProductQueryParams } from "@/types/api";
import type { ApiCategory } from "@/types/api";
import { FilterOption, MONTH_OPTIONS, YEAR_OPTIONS, PRODUCT_TYPE_OPTIONS, ORDER_OPTIONS } from "@/lib/constants";
import { FilterSelect, FilterDateInput, FilterTag } from "@/components/shared/FilterComponents";
import { getISOWeek, formatDateID } from "@/lib/utils";

const SORT_OPTIONS: FilterOption[] = [
  { value: "", label: "Default" },
  { value: "name", label: "Nama Produk" },
  { value: "createdAt", label: "Tanggal Dibuat" },
  { value: "updatedAt", label: "Tanggal Update" },
];

//   Main ProductFilters Component
interface ProductFiltersProps {
  filters: ProductQueryParams;
  onFiltersChange: (filters: ProductQueryParams) => void;
  categories?: ApiCategory[];
  isLoadingOptions?: boolean;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories = [],
  isLoadingOptions = false,
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProductQueryParams>(filters);
  // Tracks the date the user picked (for display), week number is derived from it
  const [weekDate, setWeekDate] = useState("");

  // Convert API data to FilterOption format
  const categoryOptions: FilterOption[] = [
    { value: "", label: "Semua Kategori" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  // Update individual local filter (does not trigger fetch yet)
  const updateFilter = useCallback(
    (key: keyof ProductQueryParams, value: string | number | undefined) => {
      setLocalFilters((prev) => {
        const newFilters = { ...prev };
        if (value === "" || value === undefined) {
          delete newFilters[key];
        } else {
          (newFilters as Record<string, unknown>)[key] = value;
        }
        return newFilters;
      });
    },
    [setLocalFilters]
  );

  // Apply filters (triggers fetch)
  const applyFilters = useCallback(() => {
    onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  // Handle enter key specifically for search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  // Remove tag applies instantly
  const handleRemoveTag = (key: keyof ProductQueryParams) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setLocalFilters(newFilters);
    if (key === "week") setWeekDate("");
    onFiltersChange(newFilters);
  };

  // Reset all filters
  const resetFilters = useCallback(() => {
    setLocalFilters({});
    setWeekDate("");
    onFiltersChange({});
  }, [onFiltersChange, setLocalFilters, setWeekDate]);

  // Count active filters from actual PARENT state
  const activeFilterCount = Object.keys(filters).filter(
    (key) =>
      key !== "page" &&
      key !== "limit" &&
      key !== "order" &&
      filters[key as keyof ProductQueryParams]
  ).length;

  return (
    <Card className="p-4">
      {/* Header with toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Cari produk..."
              value={localFilters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full sm:w-64"
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Toggle Filter Button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Apply Button */}
          <Button
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={applyFilters}
          >
            Terapkan Filter
          </Button>

          {/* Reset Button */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={resetFilters}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t animate-fade-in">
          {isLoadingOptions ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Memuat opsi filter...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Product Type */}
              <FilterSelect
                label="Tipe Produk"
                value={localFilters.type || ""}
                onChange={(v) => updateFilter("type", v)}
                options={PRODUCT_TYPE_OPTIONS}
              />

              {/* Category */}
              <FilterSelect
                label="Kategori"
                value={localFilters.categoryId || ""}
                onChange={(v) => updateFilter("categoryId", v)}
                options={categoryOptions}
              />

              {/* Date Range */}
              <FilterDateInput
                label="Tanggal Mulai"
                value={localFilters.startDate || ""}
                onChange={(v) => updateFilter("startDate", v)}
              />
              <FilterDateInput
                label="Tanggal Akhir"
                value={localFilters.endDate || ""}
                onChange={(v) => updateFilter("endDate", v)}
              />

              {/* Month & Year */}
              <FilterSelect
                label="Bulan"
                value={localFilters.month || ""}
                onChange={(v) => updateFilter("month", v)}
                options={MONTH_OPTIONS}
              />
              <FilterSelect
                label="Tahun"
                value={localFilters.year?.toString() || ""}
                onChange={(v) =>
                  updateFilter("year", v ? Number(v) : undefined)
                }
                options={YEAR_OPTIONS}
              />

              {/* Week — user picks a date, week number computed automatically */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Filter Minggu
                </label>
                <input
                  type="date"
                  value={weekDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setWeekDate(val);
                    if (val) {
                      updateFilter("week", getISOWeek(val));
                    } else {
                      updateFilter("week", undefined);
                    }
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {weekDate && (() => {
                  const d = new Date(weekDate);
                  const day = d.getDay() || 7; // Mon=1 … Sun=7
                  const monday = new Date(d);
                  monday.setDate(d.getDate() - day + 1);
                  const sunday = new Date(monday);
                  sunday.setDate(monday.getDate() + 6);
                  const fmt = (dt: Date) =>
                    dt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                  return (
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p className="font-medium">
                        Minggu ke-{getISOWeek(weekDate)}
                      </p>
                      <p>
                        {fmt(monday)} — {fmt(sunday)}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Sort & Order */}
              <FilterSelect
                label="Urut Berdasarkan"
                value={localFilters.sort || ""}
                onChange={(v) => updateFilter("sort", v)}
                options={SORT_OPTIONS}
              />
              <FilterSelect
                label="Urutan"
                value={localFilters.order || "desc"}
                onChange={(v) =>
                  updateFilter("order", v as "asc" | "desc")
                }
                options={ORDER_OPTIONS}
              />
            </div>
          )}

          {/* Active Filters Tags */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Filter Aktif:
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <FilterTag
                    label={`Pencarian: "${filters.search}"`}
                    onRemove={() => handleRemoveTag("search")}
                  />
                )}
                {filters.type && (
                  <FilterTag
                    label={`Tipe: ${PRODUCT_TYPE_OPTIONS.find((t) => t.value === filters.type)?.label || filters.type}`}
                    onRemove={() => handleRemoveTag("type")}
                  />
                )}
                {filters.categoryId && (
                  <FilterTag
                    label={`Kategori: ${categories.find((c) => c.id === filters.categoryId)?.name || filters.categoryId}`}
                    onRemove={() => handleRemoveTag("categoryId")}
                  />
                )}
                {filters.startDate && (
                  <FilterTag
                    label={`Dari: ${filters.startDate}`}
                    onRemove={() => handleRemoveTag("startDate")}
                  />
                )}
                {filters.endDate && (
                  <FilterTag
                    label={`Sampai: ${filters.endDate}`}
                    onRemove={() => handleRemoveTag("endDate")}
                  />
                )}
                {filters.month && (
                  <FilterTag
                    label={`Bulan: ${MONTH_OPTIONS.find((m) => m.value === filters.month)?.label}`}
                    onRemove={() => handleRemoveTag("month")}
                  />
                )}
                {filters.year && (
                  <FilterTag
                    label={`Tahun: ${filters.year}`}
                    onRemove={() => handleRemoveTag("year")}
                  />
                )}
                {filters.week && (
                  <FilterTag
                    label={weekDate ? `Minggu: ${formatDateID(weekDate)} (ke-${filters.week})` : `Minggu ke-${filters.week}`}
                    onRemove={() => handleRemoveTag("week")}
                  />
                )}
                {filters.sort && (
                  <FilterTag
                    label={`Sort: ${SORT_OPTIONS.find((s) => s.value === filters.sort)?.label}`}
                    onRemove={() => handleRemoveTag("sort")}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
