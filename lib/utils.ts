import { OrderProductItem } from "@/types/index";
import { ApiProductListItem } from "@/types/api";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function parseRupiah(rupiahString: string): number {
  return Number(rupiahString.replace(/[^0-9]/g, "")) || 0;
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export const generateSKU = (prefix = 'SKU') => `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

// Generate unique SKU from product name
export function generateSKUFromName(
  baseName: string,
  count: number,
  existingSkus: Set<string>,
): string[] {
  const prefix = baseName
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const skus: string[] = [];
  let index = 1;

  while (skus.length < count) {
    const num = String(index).padStart(3, "0");
    const sku = `${prefix}${num}`;
    if (!existingSkus.has(sku)) {
      skus.push(sku);
      existingSkus.add(sku);
    }
    index++;
    if (index > 999) break;
  }
  return skus;
}

export function printDocument() {
  const content = document.getElementById("print-area");
  if (!content) return;

  const win = window.open("", "", "width=800,height=600");
  
  if (!win) {
    alert("Popup terblokir oleh browser. Harap izinkan popup untuk mencetak.");
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Dokumen</title>
        <!-- Gunakan Tailwind CDN agar class styling Tailwind terbaca di tab baru -->
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page-break {
              page-break-after: always;
            }
            /* Menghitamkan semua border saat dicetak karena warna browser bawaan tidak solid */
            * {
              border-color: #000 !important;
            }
            @page {
              margin: 0;
            }
          }
          /* Tambahan css reset dasar untuk formating di popup window */
          body {
            font-family: ui-sans-serif, system-ui, sans-serif;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          // Timeout agar tailwind CDN sempat di render dulu sebelum dialog print muncul
          setTimeout(() => {
            window.print();
            window.close();
          }, 800);
        </script>
      </body>
    </html>
  `);

  win.document.close();
}

export const calculateOrderDiscount = (orderDiscount: number, subtotal: number, orderDiscountType: "percent" | "nominal") => {
    if (orderDiscount <= 0) return 0;
    if (orderDiscountType === "percent") {
        return subtotal * orderDiscount / 100;
    }
    return orderDiscount;
};

// Get price based on customer category
export const getPriceForCustomer = (priceData: ApiProductListItem["price"], customerCategory?: string) => {
    if (!priceData) return 0;
    switch (customerCategory) {
        case "RESELLER":
            return priceData.reseller;
        case "AGENT":
            return priceData.agent;
        case "MEMBER":
            return priceData.member;
        default:
            return priceData.normal;
    }
};

// Calculate product subtotal
export const calculateProductSubtotal = (product: OrderProductItem) => {
    const baseTotal = product.price * product.quantity;
    if (product.discount <= 0) return baseTotal;

    if (product.discountType === "percent") {
        return baseTotal - (baseTotal * product.discount / 100);
    }
    return baseTotal - product.discount;
};

/**
 * Extract error message from API response (Axios error), standard Error, or fallback.
 * Prioritizes `error.response.data.message` from API responses.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan"
): string {
  // Check for Axios-style error with response data
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
    const apiMessage = axiosError.response?.data?.message;
    if (apiMessage) return apiMessage;
    if (axiosError.message) return axiosError.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
