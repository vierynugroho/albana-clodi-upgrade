// schemas/customer.schema.ts
import { z } from "zod"

// skema customer
export const customerSchema = z.object({
  kategori: z.string().min(1, "Kategori tidak boleh kosong"),
  namaLengkap: z.string().min(1, "Nama Lengkap tidak boleh kosong"),
  // Region IDs for API
  provinsiId: z.string().min(1, "Provinsi tidak boleh kosong"),
  kotaId: z.string().min(1, "Kota / Kabupaten tidak boleh kosong"),
  kecamatanId: z.string().min(1, "Kecamatan tidak boleh kosong"),
  desaId: z.string().optional(),
  // Region names for display
  provinsi: z.string().min(1, "Provinsi tidak boleh kosong"),
  kota: z.string().min(1, "Kota / Kabupaten tidak boleh kosong"),
  kecamatan: z.string().min(1, "Kecamatan tidak boleh kosong"),
  desa: z.string().optional(),
  kodePos: z.string().optional(),
  email: z.string().email("Email tidak valid"),
  noTelepon: z.string().min(1, "No Telepon tidak boleh kosong"),
  alamat: z.string().min(1, "Alamat tidak boleh kosong"),
  // Destination ID for shipping calculation (from district/kecamatan)
  destinationId: z.number().optional(),
})
export type CustomerFormValues = z.infer<typeof customerSchema>

// skema login
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})
export type LoginFormValues = z.infer<typeof loginSchema>

// skema register
export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["superadmin", "admin", "staff"]),
})
export type RegisterFormValues = z.infer<typeof registerSchema>

// skema setting
export const settingSchema = z.object({
  storeName: z.string().min(1, "Nama toko tidak boleh kosong"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^\d+$/, "Nomor telepon harus berupa angka"),
  address: z.string().min(1, "Alamat tidak boleh kosong"),
  description: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  owner: z.string().optional(),
});
export type SettingFormValues = z.infer<typeof settingSchema>;

// skema orderProduct
export const orderProductSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  name: z.string().optional(),
  variant: z.string().optional(),
  quantity: z.number().min(1, "Qty minimal 1"),
  price: z.number().min(0, "Harga harus >= 0"),
  weight: z.number().min(0, "Berat harus >= 0").optional(),
  total: z.number().min(0, "Total harus >= 0").optional(),
});
export type OrderProductFormValues = z.infer<typeof orderProductSchema>;

// skema order
export const orderSchema = z.object({
  orderNumber: z.string().optional(),
  date: z.string().min(1, "Tanggal harus diisi"),
  salesChannel: z.string().min(1, "Sales channel harus dipilih"),
  customerId: z.string().optional(),
  deliveryPlaceId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  paymentStatus: z.enum(["belum_dibayar", "cicilan", "lunas", "dibatalkan"]),
  discount: z.number().min(0).optional(),
  discountType: z.enum(["percent", "nominal"]).optional(),
  insurance: z.number().min(0).optional(),
  packaging: z.number().min(0).optional(),
  shippingCost: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  receiptNumber: z.string().optional(),
  note: z.string().optional(),
  products: z.array(orderProductSchema).min(1, "Harus ada minimal 1 produk"),
  subtotal: z.number().optional(),
  total: z.number().optional(),
  // Installment fields
  useInstallment: z.boolean().optional(),
  installmentDate: z.string().optional(),
  installmentAmount: z.number().min(0).optional(),
  installmentPaymentMethodId: z.string().optional(),
});
export type OrderFormValues = z.infer<typeof orderSchema>;

// skema pengeluaran/expenses - matching API fields
export const expensesSchema = z.object({
  itemName: z.string().min(1, "Nama pengeluaran tidak boleh kosong"),
  itemPrice: z.coerce.number().min(0, "Harga harus >= 0"),
  expenseDate: z.string().min(1, "Tanggal harus diisi"),
  qty: z.coerce.number().min(1, "Jumlah harus >= 1"),
  personResponsible: z.string().optional(),
  note: z.string().optional(),
});
export type ExpensesFormValues = z.infer<typeof expensesSchema>;

// Form schema matching the API structure
const variantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1, "SKU wajib diisi"),
  stock: z.number().min(0, "Stock minimal 0"),
  size: z.string().optional(),
  color: z.string().optional(),
  barcode: z.string().optional(),
  imageUrl: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  productPrices: z.object({
    id: z.string().optional(),
    productVariantId: z.string().optional(),
    buy: z.number().min(0),
    agent: z.number().min(0),
    reseller: z.number().min(0),
    member: z.number().min(0),
    normal: z.number().min(0),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }).superRefine((prices, ctx) => {

    const { buy, agent, reseller, member, normal } = prices;
    
    const tooHigh = [
      { key: "reseller", value: reseller },
      { key: "normal", value: normal },
    ].filter((p) => buy > p.value);

    tooHigh.forEach((p) => {
      ctx.addIssue({
        path: ["buy"],
        code: z.ZodIssueCode.custom,
        message: `Harga beli tidak boleh lebih besar dari harga ${p.key}`,
      });
    });

  }),
  productWholesalers: z.array(z.object({
    lowerLimitItem: z.number(),
    upperLimitItem: z.number(),
    unitPrice: z.number(),
    wholesalerPrice: z.number(),
  })).optional().default([]),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  type: z.string().min(1, "Jenis produk wajib dipilih"),
  description: z.string().optional(),
  weight: z.number().min(0, "Berat minimal 0"),
  isPublish: z.boolean().optional().default(true),
  showStock: z.boolean().optional().default(true),
  productDiscount: z
    .object({
      id: z.string().optional(),
      type: z.string().optional().default("PERCENTAGE"),
      value: z.coerce.number().min(0).optional().default(0),
    })
    .optional(),
  productVariants: z.array(variantSchema).min(1, "Minimal 1 variant"),
});

export type ProductFormValues = z.input<typeof productFormSchema>;

// bankAccount Schemas
export const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Nama bank tidak boleh kosong"),
  accountNumber: z.string().min(1, "Nomor rekening tidak boleh kosong"),
  accountName: z.string().min(1, "Nama pemilik rekening tidak boleh kosong"),
  status: z.boolean(),
});
export type BankAccFormValues = z.infer<typeof bankAccountSchema>;

// warehouse schemas
export const warehouseSchema = z.object({
  name: z.string().min(1, "Nama gudang tidak boleh kosong"),
  origin: z.string().min(1, "Asal gudang tidak boleh kosong"),
  phone: z.string().min(1, "Nomor telepon tidak boleh kosong"),
  address: z.string().min(1, "Alamat tidak boleh kosong"),
  description: z.string().optional(),
  status: z.boolean(),
});
export type WarehouseFormValues = z.infer<typeof warehouseSchema>;

// sales schemas
export const salesSchema = z.object({
  name: z.string().min(1, "Nama sales tidak boleh kosong"),
  description: z.string().optional(),
  status: z.boolean(),
});
export type SalesFormValues = z.infer<typeof salesSchema>;

// user profile schemas - sesuai dengan API Swagger
export const userProfileSchema = z.object({
  fullname: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
  // Jika password diisi, confirmPassword harus sama
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});
export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
