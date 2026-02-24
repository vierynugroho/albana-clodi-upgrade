"use client";

import { Settings, Edit, Trash2 } from "lucide-react";
import type { ApiCategory } from "@/types/api";

interface CategoryTableProps {
    categories: ApiCategory[];
    onEdit: (category: ApiCategory) => void;
    onDelete: (id: string) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
    if (categories.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">Belum ada kategori</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                        <tr>
                            <th className="px-5 py-3 text-left text-sm font-semibold text-muted-foreground w-16">
                                No
                            </th>
                            <th className="px-5 py-3 text-left text-sm font-semibold text-muted-foreground">
                                Nama Kategori
                            </th>
                            <th className="px-5 py-3 text-right text-sm font-semibold text-muted-foreground w-24">
                                <div className="flex justify-end items-center">
                                    <Settings className="h-5 w-5" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {categories.map((category, index) => (
                            <tr key={category.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-5 py-4 text-sm text-foreground font-medium">
                                    {index + 1}
                                </td>
                                <td className="px-5 py-4 text-sm text-foreground">
                                    {category.name}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={() => onEdit(category)}
                                            className="text-amber-500 hover:text-amber-600 transition-colors"
                                            title="Edit kategori"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(category.id)}
                                            className="text-destructive hover:text-destructive/80 transition-colors"
                                            title="Hapus kategori"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
