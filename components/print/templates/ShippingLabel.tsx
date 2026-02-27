import { formatCurrency, formatDate } from "@/lib/utils";
import { Order, PrintSetting } from "@/types";
import Image from "next/image";
import { BarcodeDisplay } from "@/components/print/BarcodeDisplay";

interface Props {
  order: Order;
  setting: PrintSetting;
  adminName?: string;
}

export function ShippingLabel({ order, setting, adminName }: Props) {
  const { customer, products, warehouse, orderStatus, paymentStatus } = order;

  return (
    <div className="mb-4 page-break bg-white text-black" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div className="border border-gray-400 rounded-sm overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 bg-gray-50">
          <div className="flex flex-col gap-0.5">
            {setting.showLogo && (
              <Image
                src="https://albana-grosir.my.id/images/logo/albana-clodi-logo.svg"
                width={100}
                height={44}
                alt="Albana Grosir"
                style={{ width: "auto", height: "auto", maxWidth: "100px", maxHeight: "44px" }}
              />
            )}
            {setting.showShopInfo && (
              <p className="text-[9px] text-gray-500 tracking-wide">
                Toko perlengkapan di Blitar, Jawa Timur
              </p>
            )}
          </div>

          <div className="text-right text-[10px] space-y-0.5">
            {setting.showNoOrder && (
              <p className="font-bold text-[11px] tracking-wide">
                #{order.orderNumber}
              </p>
            )}
            {setting.showDate && (
              <p className="text-gray-600">{formatDate(order.date)}</p>
            )}
            {setting.showSalesChannel && (
              <p className="text-gray-600 uppercase text-[9px] tracking-wider">
                {order.salesChannel}
              </p>
            )}
            {/* {setting.showOrderStatus && (
              <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider border border-gray-400 rounded-sm">
                {orderStatus}
              </span>
            )} */}
            {setting.showPaymentStatus && (
              <span className="inline-block ml-1 mt-0.5 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider border border-gray-400 rounded-sm">
                {paymentStatus}
              </span>
            )}
          </div>
        </div>

        {/* ================= KEPADA DAN PENGIRIM ================= */}
        <div className="flex border-b border-dashed border-gray-300">
          {/* ===== LEFT: CUSTOMER ===== */}
          {setting.showCustomerAddress && (
            <div className="flex-1 px-4 py-3 text-[10px]">
              <p className="font-bold text-[9px] uppercase tracking-widest text-gray-500 mb-1">Kepada</p>
              <p className="font-semibold text-[11px] leading-tight">
                {customer?.name}
                {customer?.category && (
                  <span className="ml-1 font-normal text-[9px] text-gray-500">({customer.category})</span>
                )}
              </p>
              <p className="leading-relaxed text-gray-700 mt-0.5">
                {customer?.address}, {customer?.village}, {customer?.district},{" "}
                {customer?.city}, {customer?.province} {customer?.postalCode}
              </p>
              <div className="mt-1 space-y-0.5 text-gray-600">
                <p>📞 {customer?.phone}</p>
                {customer?.email && <p>✉️ {customer.email}</p>}
              </div>
            </div>
          )}

          {/* ===== RIGHT: WAREHOUSE / PENGIRIM ===== */}
          {setting.showWarehouse && warehouse && (
            <div className="flex-1 px-4 py-3 text-[10px] border-l border-dashed border-gray-300">
              <p className="font-bold text-[9px] uppercase tracking-widest text-gray-500 mb-1">Pengirim</p>
              <p className="font-semibold text-[11px] leading-tight">{warehouse.name}</p>
              {warehouse.address && (
                <p className="leading-relaxed text-gray-700 mt-0.5">{warehouse.address}</p>
              )}
              {warehouse.phone && (
                <p className="mt-1 text-gray-600">📞 {warehouse.phone}</p>
              )}
            </div>
          )}
        </div>

        {/* ================= FRAGILE ================= */}
        {setting.showFragile && (
          <div className="px-4 py-2 border-b border-dashed border-gray-300">
            <Image src="/fragile.png" width={120} height={120} alt="fragile logo" />
          </div>
        )}

        {/* ================= ORDER ITEMS ================= */}
        <div className="px-4 py-3 border-b border-dashed border-gray-300">
          <p className="font-bold text-[9px] uppercase tracking-widest text-gray-500 mb-2">Detail Order</p>
          <div className="space-y-0">
            {products?.map((item, idx) => (
              <div key={idx} className={`flex justify-between items-center py-1.5 text-[10px] ${idx < products.length - 1 ? "border-b border-dotted border-gray-200" : ""}`}>
                <div>
                  <p className="font-medium text-[10px] leading-tight">{item.name}</p>
                  <p className="text-[9px] text-gray-500">Qty: {item.quantity} &middot; Berat: {item.weight * item.quantity} g</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RINGKASAN ================= */}
        <div className="px-4 py-3 border-b border-dashed border-gray-300">
          <div className="space-y-1 text-[10px]">
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
            <div className="flex justify-between font-bold text-[11px] border-t border-gray-300 pt-1.5 mt-1.5">
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
        </div>

        {/* ================= ADMIN NAME ================= */}
        {setting.showAdminName && adminName && (
          <div className="px-4 py-2 border-b border-dashed border-gray-300 text-[10px]">
            <span className="text-gray-600">Admin: </span>
            <span className="font-semibold">{adminName}</span>
          </div>
        )}

        {/* ================= META ================= */}
        {setting.showWeight && (
          <div className="px-4 py-2 border-b border-dashed border-gray-300 text-[10px]">
            <span className="text-gray-600">Total Berat: </span>
            <span className="font-semibold">{order.weight} g</span>
          </div>
        )}

        {/* ================= BARCODE RESI ================= */}
        {setting.showBarcodeResi && (
          <div className="px-4 py-3 border-b border-dashed border-gray-300 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Barcode Nota</p>
            <BarcodeDisplay value={order.orderNumber} height={40} />
          </div>
        )}

        {/* ================= NOTE ================= */}
        {setting.showNote && order.note && (
          <div className="px-4 py-2.5 text-[10px] bg-gray-50">
            <span className="font-semibold text-gray-600">Catatan: </span>
            <span className="text-gray-700">{order.note}</span>
          </div>
        )}

      </div>
    </div>
  );
}
