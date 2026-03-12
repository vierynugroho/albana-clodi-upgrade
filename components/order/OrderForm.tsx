"use client";

import { useOrderForm } from "../../hooks/useOrderStateForm";
import { OrderInfoSection } from "./order-form/OrderInfoSection";
import { OrderProductsSection } from "./order-form/OrderProductsSection";
import { ShippingSection } from "./order-form/ShippingSection";
import { PaymentSection } from "./order-form/PaymentSection";
import { OrderFormActions } from "./order-form/OrderFormActions";
import type { OrderFormProps } from "../../types/index";

export function OrderForm({ mode = "create", orderId }: OrderFormProps) {
    const orderForm = useOrderForm({ mode, orderId });

    return (
        <div className="space-y-6">
            {/* Informasi Order */}
            <OrderInfoSection {...orderForm} />

            {/* Produk */}
            <OrderProductsSection {...orderForm} />

            {/* Perhitungan & Ongkir (includes OrderSummary) */}
            <ShippingSection {...orderForm} />

            {/* Status Pembayaran & Resi */}
            <PaymentSection {...orderForm} />

            {/* Actions */}
            <OrderFormActions {...orderForm} />
        </div>
    );
}
