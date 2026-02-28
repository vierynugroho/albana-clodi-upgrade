import { formatCurrency, formatDate } from "@/lib/utils";
import { Order, PrintSetting } from "@/types";
import Image from "next/image";
import { BarcodeDisplay } from "@/components/print/BarcodeDisplay";

interface Props {
  order: Order;
  setting: PrintSetting;
  adminName?: string;
}

export function InvoiceA4({ order, setting, adminName }: Props) {
  return (
    <div className="mb-6 page-break bg-white text-black" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div className="border border-gray-300 rounded-sm overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start px-6 py-4 border-b-2 border-gray-800">
          <div className="flex flex-col gap-1">
            {setting.showLogo && (
              <Image
                src="https://albana-grosir.my.id/images/logo/albana-clodi-logo.svg"
                width={130}
                height={55}
                alt="Albana Grosir"
                // style={{ width: "auto", height: "auto", maxWidth: "130px", maxHeight: "55px" }}
              />
            )}
            {setting.showShopInfo && (
              <p className="text-[9px] text-gray-500 tracking-wide mt-0.5">
                Toko perlengkapan di Blitar, Jawa Timur
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-[16px] font-bold tracking-wider text-gray-800">INVOICE</p>
            <div className="text-[10px] text-gray-600 mt-1 space-y-0.5">
              <p className="font-semibold text-gray-800">#{order.orderNumber}</p>
              <p>{formatDate(order.date)}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-gray-500 rounded-sm">
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ================= CUSTOMER ================= */}
        <div className="px-6 py-3 border-b border-dashed border-gray-300 text-[10px]">
          <p className="font-bold text-[9px] uppercase tracking-widest text-gray-500 mb-1">Kepada</p>
          <p className="font-semibold text-[11px] leading-tight">
            {order.customer.name}
            {order.customer.category && (
              <span className="ml-1 font-normal text-[9px] text-gray-500">({order.customer.category})</span>
            )}
          </p>
          <p className="leading-relaxed text-gray-700 mt-0.5">
            {order.customer.address}, {order.customer.village},{" "}
            {order.customer.district}, {order.customer.city},{" "}
            {order.customer.province} {order.customer.postalCode}
          </p>
          <div className="mt-1 text-gray-600 space-y-0.5">
            <p>📞 {order.customer.phone}</p>
            {order.customer.email && <p>✉️ {order.customer.email}</p>}
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="px-6 py-3">
          <table className="w-full text-[10px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left py-2 pr-2 font-bold text-[9px] uppercase tracking-wider text-gray-600">Produk</th>
                <th className="text-center py-2 px-2 font-bold text-[9px] uppercase tracking-wider text-gray-600">Qty</th>
                <th className="text-right py-2 px-2 font-bold text-[9px] uppercase tracking-wider text-gray-600">Harga</th>
                <th className="text-right py-2 pl-2 font-bold text-[9px] uppercase tracking-wider text-gray-600">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-2 pr-2">
                    <p className="font-medium leading-tight">{item.name}</p>
                    {setting.showSKU && (
                      <p className="text-[8px] text-gray-500 mt-0.5">SKU: {item.variant}</p>
                    )}
                  </td>
                  <td className="text-center py-2 px-2 text-gray-700">{item.quantity}</td>
                  <td className="text-right py-2 px-2 text-gray-700">{formatCurrency(item.price)}</td>
                  <td className="text-right py-2 pl-2 font-medium">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="px-6 py-3 border-t border-dashed border-gray-300">
          <div className="flex justify-end">
            <div className="w-60 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {setting.showDiscount && order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Diskon</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Ongkir</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              {setting.showInsurance && order.insurance > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Asuransi</span>
                  <span>{formatCurrency(order.insurance)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[12px] border-t-2 border-gray-800 pt-2 mt-2">
                <span>TOTAL</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              {setting.showInstallmentAmount && order.installmentAmount != null && order.installmentAmount > 0 && (
                <div className="flex justify-between text-gray-600 mt-0.5">
                  <span>Cicilan</span>
                  <span>{formatCurrency(order.installmentAmount)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= ADMIN NAME ================= */}
        {setting.showAdminName && adminName && (
          <div className="px-6 py-2 border-t border-dashed border-gray-300 text-[10px]">
            <span className="text-gray-600">Admin: </span>
            <span className="font-semibold">{adminName}</span>
          </div>
        )}

        {/* ================= BARCODE ================= */}
        {setting.showBarcodeResi && (
          <div className="px-6 py-3 border-t border-dashed border-gray-300 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Barcode Nota</p>
            <BarcodeDisplay value={order.orderNumber} height={50} />
          </div>
        )}

        {/* ================= NOTE ================= */}
        {setting.showNote && order.note && (
          <div className="px-6 py-3 border-t border-dashed border-gray-300 text-[10px] bg-gray-50">
            <span className="font-semibold text-gray-600">Catatan: </span>
            <span className="text-gray-700">{order.note}</span>
          </div>
        )}

      </div>
    </div>
  );
}
