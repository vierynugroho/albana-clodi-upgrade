import { ApiProductListItem } from "@/types/api";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui";
import { LoadingState } from "../shared/LoadingState";

// Product Search Component
export function ProductSearch({
    products,
    isLoading,
    onSelectProduct,
    onSearch, // Destructure onSearch
}: {
    products: ApiProductListItem[];
    isLoading: boolean;
    onSelectProduct: (product: ApiProductListItem, variantId: string) => void;
    onSearch: (query: string) => void; // New prop for server-side search
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Use products directly as they are now server-side filtered
    const filteredProducts = products;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isOpen) {
                onSearch(search);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, isOpen, onSearch]);

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-input bg-background text-sm"
                />
            </div>

            {isOpen && search && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {isLoading ? (
                        <LoadingState />
                    ) : filteredProducts.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                            Produk tidak ditemukan
                        </div>
                    ) : (
                        filteredProducts.map((p, index) => (
                            <div key={index} className="border-b last:border-b-0">
                                <div className="px-3 py-2 bg-muted/30">
                                    <span className="font-medium text-sm">{p.product.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                        Berat: {p.product.weight}gr
                                    </span>
                                </div>
                                {p.variant.map((v) => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectProduct(p, v.id);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex justify-between items-center"
                                    >
                                        <div>
                                            <span className="text-muted-foreground">
                                                {v.size} - {v.color}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-2">
                                                (Stok: {v.stock})
                                            </span>
                                        </div>
                                        {p.price && (
                                            <span className="font-medium">
                                                Rp {p.price.normal.toLocaleString("id-ID")}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}