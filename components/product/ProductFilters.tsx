"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
} from "lucide-react";
import type { ProductQueryParams } from "@/types/api";
import type { ApiCategory } from "@/types/api";

/* ===============================
   Filter Option Types
================================ */
interface FilterOption {
  value: string;
  label: string;
}

const PRODUCT_TYPE_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Tipe" },
  { value: "BARANG_STOK_SENDIRI", label: "Barang Stok Sendiri" },
  { value: "BARANG_SUPPLIER_LAIN", label: "Barang Supplier Lain" },
  { value: "BARANG_PRE_ORDER", label: "Barang Pre Order" },
];

const SORT_OPTIONS: FilterOption[] = [
  { value: "", label: "Default" },
  { value: "name", label: "Nama Produk" },
  { value: "createdAt", label: "Tanggal Dibuat" },
  { value: "updatedAt", label: "Tanggal Update" },
];

const ORDER_OPTIONS: FilterOption[] = [
  { value: "desc", label: "Terbaru" },
  { value: "asc", label: "Terlama" },
];

// Generate month options
const MONTH_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Bulan" },
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

// Generate year options
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Tahun" },
  { value: String(currentYear), label: String(currentYear) },
  { value: String(currentYear - 1), label: String(currentYear - 1) },
  { value: String(currentYear - 2), label: String(currentYear - 2) },
];

/* ===============================
   Filter Select Component
================================ */
interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  className = "",
}: FilterSelectProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ===============================
   Filter Date Input Component
================================ */
interface FilterDateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function FilterDateInput({
  label,
  value,
  onChange,
  className = "",
}: FilterDateInputProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

/* ===============================
   Main ProductFilters Component
================================ */
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
    []
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
    onFiltersChange(newFilters);
  };

  // Reset all filters
  const resetFilters = useCallback(() => {
    setLocalFilters({});
    onFiltersChange({});
  }, [onFiltersChange]);

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Cari produk..."
              value={localFilters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-64"
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

/* ===============================
   Filter Tag Component
================================ */
interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
