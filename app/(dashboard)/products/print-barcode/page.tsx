"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Barcode, Loader2, Info, Printer, X, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { mapApiProductsToProducts } from "@/lib/mappers";
import type { Product, ProductVariant } from "@/types";
import { fetchProducts } from "@/lib/services/product.service";

interface BarcodeSettings {
    labelHeight: string;
    columns: string;
    showSku: boolean;
    showPrice: boolean;
}

interface SelectedBarcodeItem {
    productName: string;
    variantSku: string;
    price: number;
    barcodeUrl: string;
    quantity: number;
}

export default function PrintBarcodePage() {
    const { toast } = useToast();

    // Barcode settings
    const [settings, setSettings] = useState<BarcodeSettings>({
        labelHeight: "15",
        columns: "1",
        showSku: true,
        showPrice: true,
    });

    // Product search
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Selected products for barcode
    const [selectedItems, setSelectedItems] = useState<SelectedBarcodeItem[]>([]);

    // Initial products load
    const { data: initialProducts = [] } = useProducts();
    const products = mapApiProductsToProducts(initialProducts);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                try {
                    const result = await fetchProducts({ search: searchQuery });
                    setSearchResults(mapApiProductsToProducts(result));
                } catch {
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Handle product selection
    const handleSelectProduct = useCallback((product: Product) => {
        const newItems: SelectedBarcodeItem[] = (product.variants || []).map((variant: ProductVariant) => ({
            productName: product.name,
            variantSku: variant.sku,
            price: product.prices.normal,
            barcodeUrl: `https://barcodeapi.org/api/128/${variant.sku}`,
            quantity: 1,
        }));

        setSelectedItems((prev) => {
            const existingSkus = prev.map((p) => p.variantSku);
            const filteredNew = newItems.filter((item) => !existingSkus.includes(item.variantSku));
            return [...prev, ...filteredNew];
        });

        setSearchQuery("");
        setIsDropdownOpen(false);

        toast({
            title: "Produk ditambahkan",
            description: `${product.name} berhasil ditambahkan`,
            variant: "success",
        });
    }, [toast]);

    // Update quantity
    const updateQuantity = (index: number, qty: number) => {
        setSelectedItems((prev) => {
            const updated = [...prev];
            updated[index].quantity = Math.max(1, qty);
            return updated;
        });
    };

    // Remove item
    const removeItem = (index: number) => {
        setSelectedItems((prev) => prev.filter((_, i) => i !== index));
    };

    // Print barcodes
    const handlePrint = () => {
        if (selectedItems.length === 0) {
            toast({
                title: "Tidak ada produk",
                description: "Pilih produk terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        const { columns, labelHeight, showSku, showPrice } = settings;
        const colCount = parseInt(columns);
        const height = parseInt(labelHeight);

        const printContent = selectedItems
            .flatMap((item) =>
                Array.from({ length: item.quantity }).map(
                    () => `
          <div class="barcode-item">
            <div class="price">${showPrice ? `Rp ${item.price.toLocaleString("id-ID")}` : ""}</div>
            <img src="${item.barcodeUrl}" alt="${item.variantSku}" />
            <div class="sku">${showSku ? item.variantSku : ""}</div>
          </div>
        `
                )
            )
            .join("");

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Barcode</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; padding: 5mm; }
              .barcode-container {
                display: grid;
                grid-template-columns: repeat(${colCount}, 33mm);
                gap: 2mm;
                justify-content: start;
              }
              .barcode-item {
                width: 33mm;
                height: ${height}mm;
                border: 1px solid #ccc;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 1mm;
                page-break-inside: avoid;
              }
              .price, .sku {
                font-size: 8pt;
                font-weight: bold;
                margin: 1mm 0;
                line-height: 1;
              }
              .barcode-item img {
                width: 100%;
                height: auto;
                max-height: calc(${height}mm - 10mm);
                object-fit: contain;
              }
              @media print {
                body { padding: 0; }
                .barcode-item { border: 1px solid #000; }
                @page { margin: 5mm; size: A4; }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="barcode-container">
              ${printContent}
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    const displayProducts = searchQuery.trim() ? searchResults : products.slice(0, 10);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="page-title flex items-center gap-2">
                        <Barcode className="h-7 w-7 text-success" />
                        Cetak Barcode
                    </h1>
                    <p className="page-description">Cetak barcode produk untuk label</p>
                </div>
            </div>

            {/* Main Content - Two Columns */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Settings */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Pengaturan Label Barcode</h2>

                    {/* Info Box */}
                    <div className="flex gap-3 bg-primary/10 rounded-xl p-4 mb-6">
                        <Info className="h-10 w-10 text-primary flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            Dengan barcode, kamu bisa menyimpan data spesifik produk seperti
                            harga dan nama, untuk dicetak dan ditempelkan ke produk.
                        </p>
                    </div>

                    {/* Label Size */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Ukuran Label</label>
                            <select
                                value={settings.labelHeight}
                                onChange={(e) => setSettings({ ...settings, labelHeight: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            >
                                <option value="15">33 x 15 mm</option>
                                <option value="19">33 x 19 mm</option>
                                <option value="25">33 x 25 mm</option>
                            </select>
                        </div>

                        {/* Column Count */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Jumlah Kolom</label>
                            <select
                                value={settings.columns}
                                onChange={(e) => setSettings({ ...settings, columns: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            >
                                <option value="1">1 Kolom</option>
                                <option value="2">2 Kolom</option>
                                <option value="3">3 Kolom</option>
                                <option value="4">4 Kolom</option>
                            </select>
                        </div>

                        {/* Data to Print */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Data Yang Dicetak</label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.showSku}
                                        onChange={(e) => setSettings({ ...settings, showSku: e.target.checked })}
                                        className="rounded border-border"
                                    />
                                    <span className="text-sm">SKU</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.showPrice}
                                        onChange={(e) => setSettings({ ...settings, showPrice: e.target.checked })}
                                        className="rounded border-border"
                                    />
                                    <span className="text-sm">Harga</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Product Search */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Pilih Produk</h2>

                    {/* Search Input */}
                    <div className="relative" ref={wrapperRef}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onClick={() => setIsDropdownOpen(true)}
                                placeholder="Cari nama produk..."
                                className="pl-10"
                            />
                        </div>

                        {/* Search Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-background shadow-lg">
                                {isSearching ? (
                                    <div className="p-4 text-center text-muted-foreground flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mencari produk...
                                    </div>
                                ) : displayProducts.length > 0 ? (
                                    displayProducts.map((product, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectProduct(product)}
                                            className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                                        >
                                            {product.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-muted-foreground">
                                        Tidak ada hasil
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selected Products */}
                    <div className="mt-6 space-y-3">
                        <h3 className="text-sm font-medium">Produk Terpilih ({selectedItems.length})</h3>

                        {selectedItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                Belum ada produk terpilih
                            </p>
                        ) : (
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {selectedItems.map((item, index) => (
                                    <div
                                        key={`${item.variantSku}-${index}`}
                                        className="flex items-center justify-between border rounded-lg p-3 bg-muted/30"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.productName}</p>
                                            <p className="text-xs text-muted-foreground">SKU: {item.variantSku}</p>
                                            <p className="text-xs">Rp {item.price.toLocaleString("id-ID")}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                                className="w-16 px-2 py-1 text-right text-sm rounded border border-border bg-background"
                                            />
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="text-destructive hover:text-destructive/80 p-1"
                                                title="Hapus"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Print Button */}
                    <Button
                        onClick={handlePrint}
                        variant="gradient"
                        className="w-full mt-6"
                        disabled={selectedItems.length === 0}
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak Barcode
                    </Button>
                </div>
            </div>
        </div>
    );
}
