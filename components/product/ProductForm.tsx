'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { Product, ProductVariant } from '@/types';

interface ProdukFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

export function ProdukForm({ product, onSubmit, onCancel }: ProdukFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || '',
    type: product?.type || 'barang_sendiri',
    description: product?.description || '',
    weight: product?.weight || 0,
    prices: product?.prices || {
      beli: 0,
      agent: 0,
      reseller: 0,
      member: 0,
      normal: 0,
    },
    stock: product?.stock || 0,
  });

  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [
      { id: '1', color: '', size: '', stock: 0, sku: '' },
    ]
  );

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now().toString(),
        color: '',
        size: '',
        stock: 0,
        sku: '',
      },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      variants,
      stock: variants.reduce((sum, v) => sum + v.stock, 0),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informasi Dasar */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Produk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Produk</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama produk"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <Input
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="SKU-001"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="Pakaian">Pakaian</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Sepatu">Sepatu</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Produk</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Product['type'],
                  })
                }
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="barang_sendiri">Barang Sendiri</option>
                <option value="suplier">Suplier Lain</option>
                <option value="pre_order">Pre Order</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="Deskripsi produk..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Berat (gram)</label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: parseFloat(e.target.value),
                  })
                }
                placeholder="0"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Harga */}
      <Card>
        <CardHeader>
          <CardTitle>Harga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Beli</label>
              <Input
                type="number"
                value={formData.prices?.beli}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prices: {
                      ...formData.prices!,
                      beli: parseFloat(e.target.value),
                    },
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Agent</label>
              <Input
                type="number"
                value={formData.prices?.agent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prices: {
                      ...formData.prices!,
                      agent: parseFloat(e.target.value),
                    },
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Reseller</label>
              <Input
                type="number"
                value={formData.prices?.reseller}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prices: {
                      ...formData.prices!,
                      reseller: parseFloat(e.target.value),
                    },
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Member</label>
              <Input
                type="number"
                value={formData.prices?.member}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prices: {
                      ...formData.prices!,
                      member: parseFloat(e.target.value),
                    },
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Normal</label>
              <Input
                type="number"
                value={formData.prices?.normal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prices: {
                      ...formData.prices!,
                      normal: parseFloat(e.target.value),
                    },
                  })
                }
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Variant Produk</CardTitle>
          <Button type="button" onClick={addVariant} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((variant) => (
            <div key={variant.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Variant</span>
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(variant.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Warna</label>
                  <Input
                    value={variant.color}
                    onChange={(e) =>
                      updateVariant(variant.id, 'color', e.target.value)
                    }
                    placeholder="Merah"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ukuran</label>
                  <Input
                    value={variant.size}
                    onChange={(e) =>
                      updateVariant(variant.id, 'size', e.target.value)
                    }
                    placeholder="L"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(
                        variant.id,
                        'stock',
                        parseInt(e.target.value)
                      )
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU Variant</label>
                  <Input
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(variant.id, 'sku', e.target.value)
                    }
                    placeholder="SKU-001-RED-L"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan Produk</Button>
      </div>
    </form>
  );
}