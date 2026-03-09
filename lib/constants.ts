// lib/constants.ts
// Shared constants used across filter components, export dialogs, etc.

export interface FilterOption {
  value: string;
  label: string;
}

export const MONTH_OPTIONS: FilterOption[] = [
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

const currentYear = new Date().getFullYear();
export const YEAR_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Tahun" },
  { value: String(currentYear), label: String(currentYear) },
  { value: String(currentYear - 1), label: String(currentYear - 1) },
  { value: String(currentYear - 2), label: String(currentYear - 2) },
];

export const PRODUCT_TYPE_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Tipe" },
  { value: "BARANG_STOK_SENDIRI", label: "Barang Stok Sendiri" },
  { value: "BARANG_SUPPLIER_LAIN", label: "Barang Supplier Lain" },
  { value: "BARANG_PRE_ORDER", label: "Barang Pre Order" },
];

export const ORDER_OPTIONS: FilterOption[] = [
  { value: "desc", label: "Terbaru" },
  { value: "asc", label: "Terlama" },
];

export const PAYMENT_STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Status Pembayaran" },
  { value: "PENDING", label: "Pending" },
  { value: "SETTLEMENT", label: "Settlement" },
  { value: "CANCEL", label: "Dibatalkan" },
];

export const CUSTOMER_CATEGORY_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua Kategori" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "RESELLER", label: "Reseller" },
  { value: "AGENT", label: "Agent" },
  { value: "MEMBER", label: "Member" },
  { value: "DROPSHIPPER", label: "Dropshipper" },
];
