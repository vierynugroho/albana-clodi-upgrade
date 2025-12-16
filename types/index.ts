export interface User {
  id: string;
  name: string;
  email: string;
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
  subtotal: number;
  total: number;
  paymentStatus: "lunas" | "cicilan" | "belum_dibayar" | "dibatalkan";
  orderStatus: "pending" | "diproses" | "dikirim" | "selesai" | "dibatalkan";
  note?: string;
  rekeningPenerima?: string;
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
  name: string;
  date: string;
  cost: number;
  quantity: number;
  responsible: string;
  description?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: boolean;
}

export interface DashboardStats {
  itemTerjual: number;
  itemBelumDiproses: number;
  orderHariIni: number;
  orderBelumLunas: number;
  orderBelumDiproses: number;
  cartPenjualanHariIni: number;
}
