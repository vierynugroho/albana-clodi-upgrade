import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

// Searchable Dropdown Component
export function SearchableSelect<T extends { id: string }>({
    label,
    placeholder,
    searchPlaceholder,
    items,
    selectedId,
    onSelect,
    isLoading,
    displayField,
    secondaryField,
    onSearch, // New prop for server-side search
    required
}: {
    label: string;
    placeholder: string;
    searchPlaceholder: string;
    items: T[];
    selectedId: string;
    onSelect: (item: T | null) => void;
    isLoading: boolean;
    displayField: keyof T;
    secondaryField?: keyof T;
    onSearch?: (query: string) => void;
    required?:  boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selectedItem = items.find((item) => item.id === selectedId);

    // Client-side filtering if onSearch is NOT provided, otherwise show matching items
    const filteredItems = onSearch
        ? items
        : items.filter((item) =>
            String(item[displayField]).toLowerCase().includes(search.toLowerCase())
        );

    useEffect(() => {
        if (isOpen && onSearch) {
            const timeoutId = setTimeout(() => {
                onSearch(search);
            }, 500); // 500ms debounce
            return () => clearTimeout(timeoutId);
        }
    }, [search, isOpen, onSearch]);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm flex items-center justify-between cursor-pointer hover:bg-accent/50"
                >
                    {selectedItem ? (
                        <div className="flex items-center justify-between w-full">
                            <span>{String(selectedItem[displayField])}</span>
                            {secondaryField && (
                                <span className="text-xs text-muted-foreground">
                                    {String(selectedItem[secondaryField])}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-muted-foreground">
                            {isLoading ? "Memuat..." : placeholder}
                        </span>
                    )}
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg">
                        <div className="p-2 border-b">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full h-9 pl-8 pr-3 rounded-md border border-input bg-background text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {selectedId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(null);
                                        setIsOpen(false);
                                        setSearch("");
                                        if (onSearch) onSearch(""); // Reset search
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" /> Hapus Pilihan
                                </button>
                            )}
                            {isLoading ? (
                                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                                    Mencari...
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                    Tidak ada data ditemukan
                                </div>
                            ) : (
                                filteredItems.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            onSelect(item);
                                            setIsOpen(false);
                                            setSearch("");
                                            if (onSearch) onSearch("");
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center justify-between ${item.id === selectedId ? "bg-accent" : ""
                                            }`}
                                    >
                                        <span>{String(item[displayField])}</span>
                                        {secondaryField && (
                                            <span className="text-xs text-muted-foreground">
                                                {String(item[secondaryField])}
                                            </span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}