import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Loader2, Edit2, Store } from "lucide-react";
import type { ShippingOption } from "@/types/api";
import type { UseOrderFormReturn } from "../../../hooks/useOrderStateForm";
import { OrderSummary } from "../OrderSummary";

type ShippingSectionProps = Pick<
    UseOrderFormReturn,
    | "selectedReceiver"
    | "selectedDeliveryPlace"
    | "selectedShipping"
    | "setSelectedShipping"
    | "shippingOptions"
    | "selectedShippingType"
    | "setSelectedShippingType"
    | "shippingMode"
    | "setShippingMode"
    | "manualShippingCourier"
    | "setManualShippingCourier"
    | "manualShippingCost"
    | "setManualShippingCost"
    | "showDiscount"
    | "setShowDiscount"
    | "showInsurance"
    | "setShowInsurance"
    | "showShippingDiscount"
    | "setShowShippingDiscount"
    | "orderDiscount"
    | "setOrderDiscount"
    | "orderDiscountType"
    | "setOrderDiscountType"
    | "insurance"
    | "setInsurance"
    | "shippingDiscount"
    | "setShippingDiscount"
    | "totalWeight"
    | "subtotal"
    | "effectiveShippingCost"
    | "grandTotal"
    | "receiverId"
    | "deliveryPlaceId"
    | "calculateShipping"
    | "handleCalculateShipping"
>;

export function ShippingSection({
    selectedReceiver,
    selectedDeliveryPlace,
    selectedShipping,
    setSelectedShipping,
    shippingOptions,
    selectedShippingType,
    setSelectedShippingType,
    shippingMode,
    setShippingMode,
    manualShippingCourier,
    setManualShippingCourier,
    manualShippingCost,
    setManualShippingCost,
    showDiscount,
    setShowDiscount,
    showInsurance,
    setShowInsurance,
    showShippingDiscount,
    setShowShippingDiscount,
    orderDiscount,
    setOrderDiscount,
    orderDiscountType,
    setOrderDiscountType,
    insurance,
    setInsurance,
    shippingDiscount,
    setShippingDiscount,
    totalWeight,
    subtotal,
    effectiveShippingCost,
    grandTotal,
    receiverId,
    deliveryPlaceId,
    calculateShipping,
    handleCalculateShipping,
}: ShippingSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Perhitungan & Ongkir
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Optional Fees Toggles */}
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setShowDiscount(!showDiscount)}
                        className={`px-3 py-1.5 text-sm rounded-full border ${showDiscount ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                            }`}
                    >
                        + Diskon Order
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowInsurance(!showInsurance)}
                        className={`px-3 py-1.5 text-sm rounded-full border ${showInsurance ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                            }`}
                    >
                        + Asuransi
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowShippingDiscount(!showShippingDiscount)}
                        className={`px-3 py-1.5 text-sm rounded-full border ${showShippingDiscount ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                            }`}
                    >
                        + Diskon Ongkir (per kg)
                    </button>
                </div>

                {/* Optional Fees Inputs */}
                {(showDiscount || showInsurance || showShippingDiscount) && (
                    <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted/30 rounded-lg">
                        {showDiscount && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Diskon Order</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={orderDiscount}
                                        onChange={(e) => setOrderDiscount(Number(e.target.value))}
                                        className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm"
                                        min={0}
                                    />
                                    <select
                                        value={orderDiscountType}
                                        onChange={(e) => setOrderDiscountType(e.target.value as "percent" | "nominal")}
                                        className="w-20 h-10 rounded-lg border border-input bg-background px-2 text-sm"
                                    >
                                        <option value="nominal">Rp</option>
                                        <option value="percent">%</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {showInsurance && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Asuransi</label>
                                <input
                                    type="number"
                                    value={insurance}
                                    onChange={(e) => setInsurance(Number(e.target.value))}
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                                    min={0}
                                />
                            </div>
                        )}
                        {showShippingDiscount && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Diskon Ongkir (per 1kg)</label>
                                <input
                                    type="number"
                                    value={shippingDiscount}
                                    onChange={(e) => setShippingDiscount(Number(e.target.value))}
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                                    min={0}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Shipping Options */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Pilih Metode Pengiriman</label>

                    {/* Shipping Info Display */}
                    <div className="text-sm p-3 bg-muted/30 rounded-lg space-y-2">
                        {!selectedReceiver && (
                            <div className="text-amber-600 font-medium">
                                ⚠️ Pilih penerima di field &quot;Dikirim Kepada&quot; untuk hitung ongkir
                            </div>
                        )}

                        {/* Receiver Info */}
                        <div className="border-b pb-2">
                            <div className="font-medium text-xs uppercase text-muted-foreground mb-1">Data Penerima (Dikirim Kepada)</div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nama:</span>
                                <span className={`font-medium ${selectedReceiver ? "" : "text-muted-foreground"}`}>
                                    {selectedReceiver?.name || "Belum dipilih"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Alamat:</span>
                                <span className="text-right max-w-50 truncate">{selectedReceiver?.address || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Provinsi:</span>
                                <span>{selectedReceiver?.province || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kota/Kab:</span>
                                <span>{selectedReceiver?.city || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kecamatan:</span>
                                <span>{selectedReceiver?.district || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kelurahan:</span>
                                <span>{selectedReceiver?.subdistrict || selectedReceiver?.village || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kode Pos:</span>
                                <span>{selectedReceiver?.postalCode || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Destination ID:</span>
                                <span className={`font-mono ${selectedReceiver?.destinationId ? "text-green-600 font-bold" : "text-red-500"}`}>
                                    {selectedReceiver?.destinationId || "⚠️ Belum diset!"}
                                </span>
                            </div>
                        </div>

                        {/* Shipper Info */}
                        <div className="border-b pb-2">
                            <div className="font-medium text-xs uppercase text-muted-foreground mb-1">Asal Pengiriman</div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nama:</span>
                                <span className="font-medium">{selectedDeliveryPlace?.name || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Alamat:</span>
                                <span className="text-right max-w-50 truncate">{selectedDeliveryPlace?.address || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Destination ID:</span>
                                <span className={`font-mono ${selectedDeliveryPlace?.destinationId ? "text-green-600 font-bold" : "text-red-500"}`}>
                                    {selectedDeliveryPlace?.destinationId || "⚠️ Belum diset!"}
                                </span>
                            </div>
                        </div>

                        {/* Weight Info */}
                        <div className="flex justify-between pt-1">
                            <span className="text-muted-foreground">Total Berat:</span>
                            <span className="font-medium">{totalWeight.toLocaleString("id-ID")} gr ({(totalWeight / 1000).toFixed(2)} kg)</span>
                        </div>
                    </div>

                    {/* Quick Options */}
                    <div className="grid gap-2 md:grid-cols-3">
                        {/* Free / Ambil di Toko */}
                        <button
                            type="button"
                            onClick={() => {
                                setShippingMode("free");
                                setSelectedShipping(null);
                            }}
                            className={`p-4 rounded-lg border text-left ${shippingMode === "free" ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Store className="h-5 w-5" />
                                <div>
                                    <div className="font-medium">Free Ongkir</div>
                                    <div className="text-xs text-muted-foreground">Ambil di Toko</div>
                                </div>
                            </div>
                            <div className="text-lg font-bold text-green-600 mt-2">Rp 0</div>
                        </button>

                        {/* Manual Input */}
                        <button
                            type="button"
                            onClick={() => {
                                setShippingMode("manual");
                                setSelectedShipping(null);
                            }}
                            className={`p-4 rounded-lg border text-left ${shippingMode === "manual" ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Edit2 className="h-5 w-5" />
                                <div>
                                    <div className="font-medium">Input Manual</div>
                                    <div className="text-xs text-muted-foreground">Kurir & tarif manual</div>
                                </div>
                            </div>
                        </button>

                        {/* Calculate from RajaOngkir */}
                        <button
                            type="button"
                            onClick={() => {
                                setShippingMode("calculate");
                                handleCalculateShipping();
                            }}
                            disabled={calculateShipping.isPending || !receiverId || !deliveryPlaceId}
                            className={`p-4 rounded-lg border text-left ${shippingMode === "calculate" ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <div className="flex items-center gap-2">
                                {calculateShipping.isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Truck className="h-5 w-5" />
                                )}
                                <div>
                                    <div className="font-medium">Hitung Ongkir</div>
                                    <div className="text-xs text-muted-foreground">Via Raja Ongkir</div>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Manual Input Fields */}
                    {shippingMode === "manual" && (
                        <div className="grid gap-4 md:grid-cols-2 p-4 bg-muted/30 rounded-lg">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Kurir</label>
                                <input
                                    type="text"
                                    value={manualShippingCourier}
                                    onChange={(e) => setManualShippingCourier(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                                    placeholder="Contoh: JNE, J&T, SiCepat"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tarif Ongkir</label>
                                <input
                                    type="number"
                                    value={manualShippingCost}
                                    onChange={(e) => setManualShippingCost(Number(e.target.value))}
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                                    placeholder="0"
                                    min={0}
                                />
                            </div>
                        </div>
                    )}

                    {/* Shipping Options from Raja Ongkir */}
                    {shippingMode === "calculate" && shippingOptions.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="text-sm font-medium">Tipe:</label>
                                <select
                                    value={selectedShippingType}
                                    onChange={(e) => {
                                        setSelectedShippingType(e.target.value as "reguler" | "cargo" | "instant");
                                        handleCalculateShipping();
                                    }}
                                    className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                                >
                                    <option value="reguler">Reguler</option>
                                    <option value="cargo">Cargo</option>
                                    <option value="instant">Instant</option>
                                </select>
                            </div>
                            <div className="grid gap-2 max-h-48 overflow-y-auto">
                                {shippingOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSelectedShipping(option)}
                                        className={`p-3 rounded-lg border text-left flex justify-between items-center ${selectedShipping === option ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                                            }`}
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {option.shipping_name} - {option.service_name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                ETD: {option.etd} • {option.is_cod ? "COD" : "Non-COD"}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary">
                                                Rp {option.shipping_cost.toLocaleString("id-ID")}
                                            </div>
                                            {shippingDiscount > 0 && (
                                                <div className="text-xs text-green-600">
                                                    Net: Rp {Math.max(0, option.shipping_cost - (shippingDiscount * totalWeight / 1000)).toLocaleString("id-ID")}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <OrderSummary
                    subtotal={subtotal}
                    orderDiscount={orderDiscount}
                    orderDiscountType={orderDiscountType}
                    insurance={insurance}
                    shippingMode={shippingMode}
                    effectiveShippingCost={effectiveShippingCost}
                    grandTotal={grandTotal}
                />
            </CardContent>
        </Card>
    );
}
