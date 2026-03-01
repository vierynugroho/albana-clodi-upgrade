// @unused — type ini tidak digunakan di file manapun, dipertahankan untuk referensi
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "staff";
  avatar?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: Customer;
  products: OrderProduct[];
  warehouse: Warehouse;
  salesChannel: string;
  shippingCost: number;
  weight: number;
  insurance: number;
  discount: number;
  productDiscount?: number;
  orderDiscount?: number;
  shippingDiscount?: number;
  subtotal: number;
  total: number;
  paymentStatus: "lunas" | "cicilan" | "belum_dibayar" | "dibatalkan";
  orderStatus: "pending" | "diproses" | "dikirim" | "selesai" | "dibatalkan";
  note?: string;
  rekeningPenerima?: string;
  installmentAmount?: number;
}

export interface OrderProduct {
  productId: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  weight: number;
  total: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: "barang_sendiri" | "suplier" | "pre_order";
  description: string;
  variants: ProductVariant[];
  weight: number;
  prices: {
    beli: number;
    agent: number;
    reseller: number;
    member: number;
    normal: number;
  };
  stock: number;
  image?: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  stock: number;
  sku: string;
}

export interface OrderProductItem {
    productId: string;
    variantId: string;
    productName: string;
    variantInfo: string;
    price: number;
    quantity: number;
    weight: number;
    discount: number;
    discountType: "percent" | "nominal";
    subtotal: number;
}

export interface OrderFormProps {
    mode?: "create" | "edit";
    orderId?: string;
}

export interface Customer {
  id: string;
  name: string;
  category: "customer" | "reseller" | "agen" | "member" | "dropshipper";
  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
  email: string;
  phone: string;
  address: string;
}

export interface Warehouse {
  id: string;
  name: string;
  origin: string;
  phone: string;
  address: string;
  description?: string;
  status: boolean;
}

export interface SalesChannel {
  id: string;
  name: string;
  description?: string;
  status: boolean;
}

export interface Expense {
  id: string;
  itemName: string;
  itemPrice: number;
  expenseDate: string;
  qty: number;
  totalPrice: number;
  personResponsible: string;
  note: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: boolean;
}

// @unused — type ini tidak digunakan di file manapun, dipertahankan untuk referensi
export interface DashboardStats {
  itemTerjual: number;
  itemBelumDiproses: number;
  orderHariIni: number;
  orderBelumLunas: number;
  orderBelumDiproses: number;
  cartPenjualanHariIni: number;
}

// tambahan untuk print — PrintType dipindahkan ke types/unions.ts
import type { PrintType } from "./unions";
export type { PrintType };

export interface PrintSetting {
  showLogo: boolean;
  showShopInfo: boolean;
  showCustomerAddress: boolean;
  showWarehouse: boolean;
  showSKU: boolean;
  showBarcodeResi: boolean;
  showDiscount: boolean;
  showWeight: boolean;
  showInsurance: boolean;
  showAdminName: boolean;
  showNote: boolean;
  showSalesChannel: boolean;
  showNoOrder: boolean;
  showDate: boolean;
  showFragile: boolean;
  // showOrderStatus: boolean;
  showPaymentStatus: boolean;
  showInstallmentAmount: boolean;
}

export interface PrintPayload {
  orders: Order[];
  type: PrintType;
  setting: PrintSetting;
  adminName?: string;
}

// Re-export union types
export type { ChartItem, ChartDataItem } from "./unions";
