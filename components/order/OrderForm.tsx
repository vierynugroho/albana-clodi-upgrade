"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Calculator } from "lucide-react";
import type { Order, OrderProduct } from "@/types";

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: Partial<Order>) => void;
  onCancel: () => void;
}

export function OrderForm({ order, onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState<Partial<Order>>({
    orderNumber: order?.orderNumber || "",
    date: order?.date || new Date().toISOString(),
    salesChannel: order?.salesChannel || "",
    note: order?.note || "",
    discount: order?.discount || 0,
    insurance: order?.insurance || 0,
    shippingCost: order?.shippingCost || 0,
    weight: order?.weight || 0,
    paymentStatus: order?.paymentStatus || "belum_dibayar",
    products: order?.products || [],
  });

  const [products, setProducts] = useState<OrderProduct[]>(
    order?.products || [
      {
        productId: "",
        name: "",
        variant: "",
        quantity: 1,
        price: 0,
        weight: 0,
        total: 0,
      },
    ]
  );

  const addProduct = () => {
    setProducts([
      ...products,
      {
        productId: "",
        name: "",
        variant: "",
        quantity: 1,
        price: 0,
        weight: 0,
        total: 0,
      },
    ]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (
    index: number,
    field: keyof OrderProduct,
    value: any
  ) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "quantity" || field === "price") {
      updated[index].total = updated[index].quantity * updated[index].price;
    }

    setProducts(updated);
  };

  const calculateSubtotal = () => {
    return products.reduce((sum, product) => sum + product.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return (
      subtotal -
      formData.discount! +
      formData.insurance! +
      formData.shippingCost!
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      products,
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informasi Order */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">No Order</label>
              <Input
                value={formData.orderNumber}
                onChange={(e) =>
                  setFormData({ ...formData, orderNumber: e.target.value })
                }
                placeholder="AUTO-GENERATE"
                disabled
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal</label>
              <Input
                type="date"
                value={formData.date?.split("T")[0]}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sales Channel</label>
              <select
                value={formData.salesChannel}
                onChange={(e) =>
                  setFormData({ ...formData, salesChannel: e.target.value })
                }
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Pilih Sales Channel</option>
                <option value="Shopee">Shopee</option>
                <option value="Tokopedia">Tokopedia</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status Pembayaran</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentStatus: e.target.value as Order["paymentStatus"],
                  })
                }
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="belum_dibayar">Belum Dibayar</option>
                <option value="cicilan">Cicilan</option>
                <option value="lunas">Lunas</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produk */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Produk</CardTitle>
          <Button type="button" onClick={addProduct} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Produk {index + 1}</span>
                {products.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Nama Produk</label>
                  <Input
                    value={product.name}
                    onChange={(e) =>
                      updateProduct(index, "name", e.target.value)
                    }
                    placeholder="Pilih produk"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Variant</label>
                  <Input
                    value={product.variant}
                    onChange={(e) =>
                      updateProduct(index, "variant", e.target.value)
                    }
                    placeholder="Variant"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Qty</label>
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      updateProduct(index, "quantity", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Harga</label>
                  <Input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      updateProduct(index, "price", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total</label>
                  <Input value={product.total} disabled />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Biaya & Total */}
      <Card>
        <CardHeader>
          <CardTitle>Perhitungan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ongkir (Rp/Kg)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Berat (Kg)"
                />
                <Button type="button" variant="outline" size="icon">
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Ongkir</label>
              <Input
                type="number"
                value={formData.shippingCost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shippingCost: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Diskon</label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Asuransi</label>
              <Input
                type="number"
                value={formData.insurance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    insurance: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">
                Rp {calculateSubtotal().toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Ongkir:</span>
              <span className="font-medium">
                Rp {formData.shippingCost?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Diskon:</span>
              <span className="font-medium text-red-600">
                -Rp {formData.discount?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Asuransi:</span>
              <span className="font-medium">
                Rp {formData.insurance?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-primary">
                Rp {calculateTotal().toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catatan */}
      <Card>
        <CardHeader>
          <CardTitle>Catatan</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
            placeholder="Catatan tambahan..."
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan Order</Button>
      </div>
    </form>
  );
}
