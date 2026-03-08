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
import type { OrderQueryParams } from "@/types/api";
import type { ApiSalesChannel, ApiPaymentMethod, ApiCustomer } from "@/types/api";
import { LoadingState } from "../shared/LoadingState";
import type { FilterOption } from "@/lib/constants";
import { FilterSelect, FilterDateInput, FilterTag } from "@/components/shared/FilterComponents";

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

//   Main OrderFilters Component
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
  const [localFilters, setLocalFilters] = useState<OrderQueryParams>(filters);

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

  // Update individual local filter (does not trigger fetch yet)
  const updateFilter = useCallback(
    (key: keyof OrderQueryParams, value: string | number | undefined) => {
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
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  // Remove tag applies instantly for immediate UX or require submit? Let's make it instant.
  const handleRemoveTag = (key: keyof OrderQueryParams) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setLocalFilters(newFilters); // sync local
    onFiltersChange(newFilters); // sync parent instantly
  };

  // Reset all filters
  const resetFilters = useCallback(() => {
    setLocalFilters({});
    onFiltersChange({});
  }, [onFiltersChange, setLocalFilters]);

  // Count active filters from actual PARENT state so the badge reflects what's actively loaded
  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== "page" && key !== "limit" && filters[key as keyof OrderQueryParams]
  ).length;

  return (
    <Card className="p-4">
      {/* Header with toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Cari order..."
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
            <LoadingState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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



              {/* Sales Channel */}
              <FilterSelect
                label="Sales Channel"
                value={localFilters.salesChannelId || ""}
                onChange={(v) => updateFilter("salesChannelId", v)}
                options={salesChannelOptions}
              />

              {/* Customer Pemesan */}
              <FilterSelect
                label="Customer Pemesan"
                value={localFilters.ordererCustomerId || ""}
                onChange={(v) => updateFilter("ordererCustomerId", v)}
                options={customerOptions}
              />

              {/* Payment Status */}
              <FilterSelect
                label="Status Pembayaran"
                value={localFilters.paymentStatus || ""}
                onChange={(v) => updateFilter("paymentStatus", v)}
                options={PAYMENT_STATUS_OPTIONS}
              />

              {/* Customer Category */}
              <FilterSelect
                label="Kategori Customer"
                value={localFilters.customerCategory || ""}
                onChange={(v) => updateFilter("customerCategory", v)}
                options={CUSTOMER_CATEGORY_OPTIONS}
              />

              {/* Payment Method */}
              <FilterSelect
                label="Metode Pembayaran"
                value={localFilters.paymentMethodId || ""}
                onChange={(v) => updateFilter("paymentMethodId", v)}
                options={paymentMethodOptions}
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
                    onRemove={() => handleRemoveTag("search")}
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

                {filters.salesChannelId && (
                  <FilterTag
                    label={`Channel: ${salesChannels.find((s) => s.id === filters.salesChannelId)?.name || filters.salesChannelId}`}
                    onRemove={() => handleRemoveTag("salesChannelId")}
                  />
                )}
                {filters.paymentStatus && (
                  <FilterTag
                    label={`Status: ${PAYMENT_STATUS_OPTIONS.find((p) => p.value === filters.paymentStatus)?.label}`}
                    onRemove={() => handleRemoveTag("paymentStatus")}
                  />
                )}
                {filters.customerCategory && (
                  <FilterTag
                    label={`Kategori: ${filters.customerCategory}`}
                    onRemove={() => handleRemoveTag("customerCategory")}
                  />
                )}
                {filters.paymentMethodId && (
                  <FilterTag
                    label={`Pembayaran: ${paymentMethods.find((p) => p.id === filters.paymentMethodId)?.name || filters.paymentMethodId}`}
                    onRemove={() => handleRemoveTag("paymentMethodId")}
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
