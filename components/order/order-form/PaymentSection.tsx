import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UseOrderFormReturn } from "@/hooks/useOrderStateForm";

type PaymentSectionProps = Pick<
    UseOrderFormReturn,
    | "paymentStatus"
    | "setPaymentStatus"
    | "receiptNumber"
    | "setReceiptNumber"
    | "installmentAmount"
    | "setInstallmentAmount"
>;

export function PaymentSection({
    paymentStatus,
    setPaymentStatus,
    receiptNumber,
    setReceiptNumber,
    installmentAmount,
    setInstallmentAmount,
}: PaymentSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Status Pembayaran & Resi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status Pembayaran</label>
                        <select
                            value={paymentStatus}
                            onChange={(e) => {
                                const newStatus = e.target.value as typeof paymentStatus;
                                setPaymentStatus(newStatus);
                                // Reset installment amount when switching away from "cicilan"
                                if (newStatus !== "cicilan") {
                                    setInstallmentAmount(0);
                                }
                            }}
                            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                        >
                            <option value="belum_dibayar">Belum Dibayar</option>
                            <option value="cicilan">Cicilan</option>
                            <option value="lunas">Lunas</option>
                            <option value="dibatalkan">Dibatalkan</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nomor Resi (Opsional)</label>
                        <input
                            type="text"
                            value={receiptNumber}
                            onChange={(e) => setReceiptNumber(e.target.value)}
                            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                            placeholder="Diisi setelah paket dikirim..."
                        />
                    </div>

                    {/* 👇 MUNCUL JIKA CICILAN */}
                    {paymentStatus === "cicilan" && (
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">
                                Jumlah Cicilan
                            </label>
                            <input
                                type="text"
                                value={installmentAmount > 0 ? "Rp " + installmentAmount.toLocaleString("id-ID") : ""}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, "");
                                    setInstallmentAmount(val ? Number(val) : 0);
                                }}
                                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                                placeholder="Masukkan jumlah cicilan"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
