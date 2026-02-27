import { formatCurrency, formatDate } from "@/lib/utils";
import { Order, PrintSetting } from "@/types";
import Image from "next/image";
import { BarcodeDisplay } from "@/components/print/BarcodeDisplay";

interface Props {
  order: Order;
  setting: PrintSetting;
  adminName?: string;
}

export function InvoiceThermal58({ order, setting, adminName }: Props) {
  const { customer, products, warehouse } = order;

  return (
    <div
      className="mb-4 page-break bg-white text-black"
      style={{ width: "58mm", fontFamily: "'Segoe UI', Arial, sans-serif" }}
    >
      <div className="border border-gray-400 overflow-hidden" style={{ fontSize: "9px" }}>

        {/* ================= HEADER ================= */}
        <div className="text-center px-2 pt-2 pb-1.5">
          {setting.showLogo && (
            <Image
              src="https://albana-grosir.my.id/images/logo/albana-clodi-logo.svg"
              width={75}
              height={32}
              alt="Albana Grosir"
              className="mx-auto"
              style={{ width: "auto", height: "auto", maxWidth: "75px", maxHeight: "32px" }}
            />
          )}
          {setting.showShopInfo && (
            <p className="text-[8px] text-gray-500 mt-0.5">Blitar, Jawa Timur</p>
          )}
        </div>

        {/* ================= META ================= */}
        <div className="border-t border-dashed border-gray-400 px-2 py-1.5" style={{ fontSize: "9px" }}>
          <div className="flex justify-between">
            <span className="text-gray-500">No</span>
            <span className="font-bold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold uppercase">{order.paymentStatus}</span>
          </div>
          {setting.showDate && (
            <div className="flex justify-between">
              <span className="text-gray-500">Tanggal</span>
              <span>{formatDate(order.date)}</span>
            </div>
          )}
          {setting.showSalesChannel && (
            <div className="flex justify-between">
              <span className="text-gray-500">Channel</span>
              <span>{order.salesChannel}</span>
            </div>
          )}
        </div>

        {/* ================= CUSTOMER ================= */}
        {setting.showCustomerAddress && customer && (
          <div className="border-t border-dashed border-gray-400 px-2 py-1.5" style={{ fontSize: "9px" }}>
            <p className="font-bold text-[8px] uppercase tracking-wider text-gray-500 mb-0.5">Kepada</p>
            <p className="font-semibold leading-tight">
              {customer.name}
              {customer.category && (
                <span className="font-normal text-gray-500 ml-0.5">({customer.category})</span>
              )}
            </p>
            <p className="leading-snug text-gray-700 mt-0.5">
              {customer.address}, {customer.village}, {customer.district}
            </p>
            <p className="text-gray-700">
              {customer.city}, {customer.province} {customer.postalCode}
            </p>
            <p className="text-gray-600 mt-0.5">📞 {customer.phone}</p>
            {customer.email && <p className="text-gray-600">✉️ {customer.email}</p>}
          </div>
        )}

        {/* ================= ITEMS ================= */}
        <div className="border-t border-dashed border-gray-400 px-2 py-1.5" style={{ fontSize: "9px" }}>
          {products.map((item, i) => (
            <div
              key={i}
              className={`py-1 ${i < products.length - 1 ? "border-b border-dotted border-gray-300" : ""}`}
            >
              <p className="font-medium leading-tight">{item.name}</p>
              <div className="flex justify-between text-gray-600">
                <span>Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="border-t border-dashed border-gray-400 px-2 py-1.5 space-y-0.5" style={{ fontSize: "9px" }}>
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ongkir</span>
            <span>{formatCurrency(order.shippingCost)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Diskon</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          {order.insurance > 0 && setting.showInsurance && (
            <div className="flex justify-between">
              <span className="text-gray-600">Asuransi</span>
              <span>{formatCurrency(order.insurance)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-gray-400 pt-1 mt-1" style={{ fontSize: "10px" }}>
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          {setting.showInstallmentAmount && order.installmentAmount != null && order.installmentAmount > 0 && (
            <div className="flex justify-between text-gray-600 mt-0.5">
              <span>Cicilan</span>
              <span>{formatCurrency(order.installmentAmount)}</span>
            </div>
          )}
        </div>

        {/* ================= PENGIRIM ================= */}
        {setting.showWarehouse && warehouse && (
          <div className="border-t border-dashed border-gray-400 px-2 py-1.5" style={{ fontSize: "9px" }}>
            <p className="font-bold text-[8px] uppercase tracking-wider text-gray-500 mb-0.5">Pengirim</p>
            <p className="font-semibold leading-tight">{warehouse.name}</p>
            {warehouse.address && <p className="leading-snug text-gray-700 mt-0.5">{warehouse.address}</p>}
            {warehouse.phone && <p className="text-gray-600 mt-0.5">📞 {warehouse.phone}</p>}
          </div>
        )}

        {/* ================= ADMIN NAME ================= */}
        {setting.showAdminName && adminName && (
          <div className="border-t border-dashed border-gray-400 px-2 py-1.5" style={{ fontSize: "9px" }}>
            <span className="text-gray-500">Admin: </span>
            <span className="font-semibold">{adminName}</span>
          </div>
        )}

        {/* ================= BARCODE ================= */}
        {setting.showBarcodeResi && (
          <div className="border-t border-dashed border-gray-400 px-2 py-1.5 text-center">
            <BarcodeDisplay value={order.orderNumber} height={28} width={1} />
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="border-t border-dashed border-gray-400 px-2 py-2 text-center" style={{ fontSize: "9px" }}>
          <p>Terima kasih 🙏</p>
        </div>

      </div>
    </div>
  );
}
