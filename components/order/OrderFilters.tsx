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
import type { OrderQueryParams } from "@/types/api";
import type { ApiSalesChannel, ApiPaymentMethod, ApiCustomer } from "@/types/api";

/* ===============================
   Filter Option Types
================================ */
interface FilterOption {
  value: string;
  label: string;
}

const PAYMENT_STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Status Pembayaran" },
  { value: "PENDING", label: "Pending" },
  { value: "SETTLEMENT", label: "Settlement" },
  { value: "CANCEL", label: "Dibatalkan" },
];

const CUSTOMER_CATEGORY_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Kategori" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "RESELLER", label: "Reseller" },
  { value: "AGENT", label: "Agent" },
  { value: "MEMBER", label: "Member" },
  { value: "DROPSHIPPER", label: "Dropshipper" },
];

const SORT_OPTIONS: FilterOption[] = [
  { value: "", label: "Default" },
  { value: "orderDate", label: "Tanggal Order" },
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

// Generate year options (current year and 2 years back)
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
   Main OrderFilters Component
================================ */
interface OrderFiltersProps {
  filters: OrderQueryParams;
  onFiltersChange: (filters: OrderQueryParams) => void;
  salesChannels?: ApiSalesChannel[];
  paymentMethods?: ApiPaymentMethod[];
  customers?: ApiCustomer[];
  isLoadingOptions?: boolean;
}

export function OrderFilters({
  filters,
  onFiltersChange,
  salesChannels = [],
  paymentMethods = [],
  customers = [],
  isLoadingOptions = false,
}: OrderFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert API data to FilterOption format
  const salesChannelOptions: FilterOption[] = [
    { value: "", label: "Semua Sales Channel" },
    ...salesChannels.map((sc) => ({ value: sc.id, label: sc.name })),
  ];

  const paymentMethodOptions: FilterOption[] = [
    { value: "", label: "Semua Metode Pembayaran" },
    ...paymentMethods.map((pm) => ({
      value: pm.id,
      label: `${pm.name} - ${pm.bankName}`,
    })),
  ];

  const customerOptions: FilterOption[] = [
    { value: "", label: "Semua Customer" },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
  ];

  // Update individual filter
  const updateFilter = useCallback(
    (key: keyof OrderQueryParams, value: string | number | undefined) => {
      const newFilters: Record<string, string | number | undefined> = { ...filters };

      if (value === "" || value === undefined) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }

      onFiltersChange(newFilters as OrderQueryParams);
    },
    [filters, onFiltersChange]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  // Count active filters
  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== "page" && key !== "limit" && filters[key as keyof OrderQueryParams]
  ).length;

  return (
    <Card className="p-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Cari order..."
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
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

        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={resetFilters}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filter
          </Button>
        )}
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
              {/* Date Range */}
              <FilterDateInput
                label="Tanggal Mulai"
                value={filters.startDate || ""}
                onChange={(v) => updateFilter("startDate", v)}
              />
              <FilterDateInput
                label="Tanggal Akhir"
                value={filters.endDate || ""}
                onChange={(v) => updateFilter("endDate", v)}
              />

              {/* Month & Year */}
              <FilterSelect
                label="Bulan"
                value={filters.orderMonth?.toString() || ""}
                onChange={(v) =>
                  updateFilter("orderMonth", v ? Number(v) : undefined)
                }
                options={MONTH_OPTIONS}
              />
              <FilterSelect
                label="Tahun"
                value={filters.orderYear?.toString() || ""}
                onChange={(v) =>
                  updateFilter("orderYear", v ? Number(v) : undefined)
                }
                options={YEAR_OPTIONS}
              />

              {/* Sales Channel */}
              <FilterSelect
                label="Sales Channel"
                value={filters.salesChannelId || ""}
                onChange={(v) => updateFilter("salesChannelId", v)}
                options={salesChannelOptions}
              />

              {/* Customer Pemesan */}
              <FilterSelect
                label="Customer Pemesan"
                value={filters.ordererCustomerId || ""}
                onChange={(v) => updateFilter("ordererCustomerId", v)}
                options={customerOptions}
              />

              {/* Payment Status */}
              <FilterSelect
                label="Status Pembayaran"
                value={filters.paymentStatus || ""}
                onChange={(v) => updateFilter("paymentStatus", v)}
                options={PAYMENT_STATUS_OPTIONS}
              />

              {/* Customer Category */}
              <FilterSelect
                label="Kategori Customer"
                value={filters.customerCategory || ""}
                onChange={(v) => updateFilter("customerCategory", v)}
                options={CUSTOMER_CATEGORY_OPTIONS}
              />

              {/* Payment Method */}
              <FilterSelect
                label="Metode Pembayaran"
                value={filters.paymentMethodId || ""}
                onChange={(v) => updateFilter("paymentMethodId", v)}
                options={paymentMethodOptions}
              />

              {/* Sort & Order */}
              <FilterSelect
                label="Urut Berdasarkan"
                value={filters.sort || ""}
                onChange={(v) => updateFilter("sort", v)}
                options={SORT_OPTIONS}
              />
              <FilterSelect
                label="Urutan"
                value={filters.order || "desc"}
                onChange={(v) => updateFilter("order", v as "asc" | "desc")}
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
                    onRemove={() => updateFilter("search", "")}
                  />
                )}
                {filters.startDate && (
                  <FilterTag
                    label={`Dari: ${filters.startDate}`}
                    onRemove={() => updateFilter("startDate", "")}
                  />
                )}
                {filters.endDate && (
                  <FilterTag
                    label={`Sampai: ${filters.endDate}`}
                    onRemove={() => updateFilter("endDate", "")}
                  />
                )}
                {filters.orderMonth && (
                  <FilterTag
                    label={`Bulan: ${MONTH_OPTIONS.find((m) => m.value === String(filters.orderMonth))?.label}`}
                    onRemove={() => updateFilter("orderMonth", undefined)}
                  />
                )}
                {filters.orderYear && (
                  <FilterTag
                    label={`Tahun: ${filters.orderYear}`}
                    onRemove={() => updateFilter("orderYear", undefined)}
                  />
                )}
                {filters.salesChannelId && (
                  <FilterTag
                    label={`Channel: ${salesChannels.find((s) => s.id === filters.salesChannelId)?.name || filters.salesChannelId}`}
                    onRemove={() => updateFilter("salesChannelId", "")}
                  />
                )}
                {filters.paymentStatus && (
                  <FilterTag
                    label={`Status: ${PAYMENT_STATUS_OPTIONS.find((p) => p.value === filters.paymentStatus)?.label}`}
                    onRemove={() => updateFilter("paymentStatus", "")}
                  />
                )}
                {filters.customerCategory && (
                  <FilterTag
                    label={`Kategori: ${filters.customerCategory}`}
                    onRemove={() => updateFilter("customerCategory", "")}
                  />
                )}
                {filters.paymentMethodId && (
                  <FilterTag
                    label={`Pembayaran: ${paymentMethods.find((p) => p.id === filters.paymentMethodId)?.name || filters.paymentMethodId}`}
                    onRemove={() => updateFilter("paymentMethodId", "")}
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
