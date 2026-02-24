import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Percent, Package } from "lucide-react";
import { ProductSearch } from "../ProductSearch";
import type { UseOrderFormReturn } from "../../../hooks/useOrderStateForm";

type OrderProductsSectionProps = Pick<
    UseOrderFormReturn,
    | "orderProducts"
    | "editingProductIndex"
    | "setEditingProductIndex"
    | "selectedOrderer"
    | "products"
    | "loadingProducts"
    | "setProductSearch"
    | "handleAddProduct"
    | "updateProduct"
    | "removeProduct"
    | "subtotal"
    | "totalWeight"
>;

export function OrderProductsSection({
    orderProducts,
    editingProductIndex,
    setEditingProductIndex,
    selectedOrderer,
    products,
    loadingProducts,
    setProductSearch,
    handleAddProduct,
    updateProduct,
    removeProduct,
    subtotal,
    totalWeight,
}: OrderProductsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Produk<span className="text-red-500 ml-1">*</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Product Search */}
                <ProductSearch
                    onSearch={setProductSearch}
                    products={products}
                    isLoading={loadingProducts}
                    onSelectProduct={handleAddProduct}
                />

                {/* Selected Orderer Info */}
                {selectedOrderer && (
                    <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                        Harga berdasarkan kategori: <span className="font-medium">{selectedOrderer.category}</span>
                    </div>
                )}

                {/* Product List */}
                {orderProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Belum ada produk ditambahkan</p>
                        <p className="text-sm">Cari dan pilih produk di atas</p>
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left px-3 py-2">Nama Barang</th>
                                    <th className="text-right px-3 py-2">Harga</th>
                                    <th className="text-center px-3 py-2">Qty</th>
                                    <th className="text-right px-3 py-2">Subtotal</th>
                                    <th className="text-right px-3 py-2">Berat</th>
                                    <th className="text-center px-3 py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderProducts.map((product, index) => (
                                    <tr key={`${product.productId}-${product.variantId}`} className="border-t">
                                        <td className="px-3 py-2">
                                            <div className="font-medium">{product.productName}</div>
                                            <div className="text-xs text-muted-foreground">{product.variantInfo}</div>
                                            {product.discount > 0 && (
                                                <div className="text-xs text-green-600">
                                                    Diskon: {product.discount}{product.discountType === "percent" ? "%" : ""}
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-right px-3 py-2">
                                            Rp {product.price.toLocaleString("id-ID")}
                                        </td>
                                        <td className="text-center px-3 py-2">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateProduct(index, { quantity: Math.max(1, product.quantity - 1) })}
                                                    className="w-6 h-6 rounded border hover:bg-accent"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center">{product.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateProduct(index, { quantity: product.quantity + 1 })}
                                                    className="w-6 h-6 rounded border hover:bg-accent"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-right px-3 py-2 font-medium">
                                            Rp {product.subtotal.toLocaleString("id-ID")}
                                        </td>
                                        <td className="text-right px-3 py-2 text-muted-foreground">
                                            {(product.weight * product.quantity).toLocaleString("id-ID")} gr
                                        </td>
                                        <td className="text-center px-3 py-2">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingProductIndex(index)}
                                                    className="p-1 hover:bg-accent rounded"
                                                    title="Tambah diskon"
                                                >
                                                    <Percent className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeProduct(index)}
                                                    className="p-1 hover:bg-destructive/10 rounded text-destructive"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-muted/30">
                                <tr className="border-t">
                                    <td colSpan={3} className="px-3 py-2 font-medium text-right">Total</td>
                                    <td className="px-3 py-2 font-bold text-right">
                                        Rp {subtotal.toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-3 py-2 font-medium text-right">
                                        {totalWeight.toLocaleString("id-ID")} gr
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {/* Product Discount Modal */}
                {editingProductIndex !== null && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-background rounded-lg p-6 w-full max-w-sm space-y-4">
                            <h3 className="font-semibold">Edit Diskon Produk</h3>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipe Diskon</label>
                                    <select
                                        value={orderProducts[editingProductIndex].discountType}
                                        onChange={(e) => updateProduct(editingProductIndex, {
                                            discountType: e.target.value as "percent" | "nominal"
                                        })}
                                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                                    >
                                        <option value="nominal">Nominal (Rp)</option>
                                        <option value="percent">Persen (%)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nilai Diskon</label>
                                    <input
                                        type="number"
                                        value={orderProducts[editingProductIndex].discount}
                                        onChange={(e) => updateProduct(editingProductIndex, {
                                            discount: Number(e.target.value)
                                        })}
                                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                                        min={0}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingProductIndex(null)}
                                    className="flex-1"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
