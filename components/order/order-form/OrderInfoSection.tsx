import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableSelect } from "../SearchableSelect";
import type { ApiCustomer, ApiDeliveryPlace } from "@/types/api";
import type { UseOrderFormReturn } from "../../../hooks/useOrderStateForm";

type OrderInfoSectionProps = Pick<
    UseOrderFormReturn,
    | "customers"
    | "deliveryPlaces"
    | "salesChannels"
    | "paymentMethods"
    | "ordererId"
    | "setOrdererId"
    | "receiverId"
    | "setReceiverId"
    | "deliveryPlaceId"
    | "setDeliveryPlaceId"
    | "orderDate"
    | "setOrderDate"
    | "salesChannelId"
    | "setSalesChannelId"
    | "paymentMethodId"
    | "setPaymentMethodId"
    | "note"
    | "setNote"
    | "loadingCustomers"
    | "loadingSalesChannels"
    | "loadingPaymentMethods"
    | "loadingDeliveryPlaces"
    | "setCustomerSearch"
>;

export function OrderInfoSection({
    customers,
    deliveryPlaces,
    salesChannels,
    paymentMethods,
    ordererId,
    setOrdererId,
    receiverId,
    setReceiverId,
    deliveryPlaceId,
    setDeliveryPlaceId,
    orderDate,
    setOrderDate,
    salesChannelId,
    setSalesChannelId,
    paymentMethodId,
    setPaymentMethodId,
    note,
    setNote,
    loadingCustomers,
    loadingSalesChannels,
    loadingPaymentMethods,
    loadingDeliveryPlaces,
    setCustomerSearch,
}: OrderInfoSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Nama Pemesan */}
                    <SearchableSelect<ApiCustomer>
                        label="Nama Pemesan"
                        placeholder="Cari Pemesan"
                        searchPlaceholder="Ketik nama pemesan..."
                        items={customers}
                        selectedId={ordererId}
                        onSelect={(c) => setOrdererId(c?.id || "")}
                        isLoading={loadingCustomers}
                        displayField="name"
                        secondaryField="category"
                        onSearch={setCustomerSearch}
                        required
                    />

                    {/* Dikirim Kepada */}
                    <SearchableSelect<ApiCustomer>
                        label="Dikirim Kepada"
                        placeholder="Cari Penerima"
                        searchPlaceholder="Ketik nama penerima..."
                        items={customers}
                        selectedId={receiverId}
                        onSelect={(c) => setReceiverId(c?.id || "")}
                        isLoading={loadingCustomers}
                        displayField="name"
                        secondaryField="category"
                        onSearch={setCustomerSearch}
                        required
                    />

                    {/* Pengiriman Dari */}
                    <SearchableSelect<ApiDeliveryPlace>
                        label="Pengiriman Dari"
                        placeholder="Cari Lokasi Pengiriman"
                        searchPlaceholder="Ketik lokasi..."
                        items={deliveryPlaces}
                        selectedId={deliveryPlaceId}
                        onSelect={(dp) => setDeliveryPlaceId(dp?.id || "")}
                        isLoading={loadingDeliveryPlaces}
                        displayField="name"
                        secondaryField="address"
                        required
                    />

                    {/* Tanggal Order */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pilih Tanggal</label>
                        <input
                            type="date"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                        />
                    </div>

                    {/* Sales Channel */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sales Channels <span className="text-red-500 ml-1">*</span></label>
                        <select
                            value={salesChannelId}
                            onChange={(e) => setSalesChannelId(e.target.value)}
                            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                            disabled={loadingSalesChannels}
                        >
                            <option value="">
                                {loadingSalesChannels ? "Memuat..." : "Pilih sales channels"}
                            </option>
                            {salesChannels.map((sc) => (
                                <option key={sc.id} value={sc.id}>
                                    {sc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Metode Pembayaran</label>
                        <select
                            value={paymentMethodId}
                            onChange={(e) => setPaymentMethodId(e.target.value)}
                            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                            disabled={loadingPaymentMethods}
                        >
                            <option value="">
                                {loadingPaymentMethods ? "Memuat..." : "Pilih metode pembayaran"}
                            </option>
                            {paymentMethods.map((pm) => (
                                <option key={pm.id} value={pm.id}>
                                    {pm.name} - {pm.bankName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Catatan */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Catatan</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full min-h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Catatan tambahan..."
                    />
                </div>
            </CardContent>
        </Card>
    );
}
