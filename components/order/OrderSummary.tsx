import { calculateOrderDiscount } from "@/lib/utils";

interface OrderSummaryProps {
    grossSubtotal: number;
    totalProductDiscount: number;
    subtotal: number;
    orderDiscount: number;
    orderDiscountType: "percent" | "nominal";
    insurance: number;
    shippingMode: "none" | "free" | "calculate" | "manual";
    grossShippingCost: number;
    totalShippingDiscount: number;
    effectiveShippingCost: number;
    grandTotal: number;
}

export function OrderSummary({
    grossSubtotal,
    totalProductDiscount,
    subtotal,
    orderDiscount,
    orderDiscountType,
    insurance,
    shippingMode,
    grossShippingCost,
    totalShippingDiscount,
    effectiveShippingCost,
    grandTotal,
}: OrderSummaryProps) {
    return (
        <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
                <span>Subtotal Produk</span>
                <span>Rp {grossSubtotal.toLocaleString("id-ID")}</span>
            </div>
            {totalProductDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon Produk</span>
                    <span>- Rp {totalProductDiscount.toLocaleString("id-ID")}</span>
                </div>
            )}
            {orderDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon Order ({orderDiscountType === "percent" ? `${orderDiscount}%` : `Rp ${orderDiscount.toLocaleString("id-ID")}`})</span>
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
                <>
                    <div className="flex justify-between text-sm">
                        <span>Ongkir {shippingMode === "free" ? "(Ambil di Toko)" : ""}</span>
                        <span>Rp {grossShippingCost.toLocaleString("id-ID")}</span>
                    </div>
                    {totalShippingDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Diskon Ongkir</span>
                            <span>- Rp {totalShippingDiscount.toLocaleString("id-ID")}</span>
                        </div>
                    )}
                </>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Grand Total</span>
                <span className="text-primary">Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>
        </div>
    );
}
