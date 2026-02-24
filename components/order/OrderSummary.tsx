import { calculateOrderDiscount } from "@/lib/utils";

interface OrderSummaryProps {
    subtotal: number;
    orderDiscount: number;
    orderDiscountType: "percent" | "nominal";
    insurance: number;
    shippingMode: "none" | "free" | "calculate" | "manual";
    effectiveShippingCost: number;
    grandTotal: number;
}

export function OrderSummary({
    subtotal,
    orderDiscount,
    orderDiscountType,
    insurance,
    shippingMode,
    effectiveShippingCost,
    grandTotal,
}: OrderSummaryProps) {
    return (
        <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
                <span>Subtotal Produk</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            {orderDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon Order ({orderDiscountType === "percent" ? `${orderDiscount}%` : ""})</span>
                    <span>- Rp {calculateOrderDiscount(orderDiscount, subtotal, orderDiscountType).toLocaleString("id-ID")}</span>
                </div>
            )}
            {insurance > 0 && (
                <div className="flex justify-between text-sm">
                    <span>Asuransi</span>
                    <span>Rp {insurance.toLocaleString("id-ID")}</span>
                </div>
            )}
            {shippingMode !== "none" && (
                <div className="flex justify-between text-sm">
                    <span>Ongkir {shippingMode === "free" ? "(Ambil di Toko)" : ""}</span>
                    <span>Rp {effectiveShippingCost.toLocaleString("id-ID")}</span>
                </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Grand Total</span>
                <span className="text-primary">Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>
        </div>
    );
}
