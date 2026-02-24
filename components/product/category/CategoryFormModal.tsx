"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check } from "lucide-react";
import type { ApiCategory } from "@/types/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/confirm-dialog";

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    category: ApiCategory | null;
    isLoading: boolean;
}

export function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    category,
    isLoading,
}: CategoryFormModalProps) {
    const [name, setName] = useState("");

    // Reset form when modal opens/closes or category changes
    useEffect(() => {
        if (isOpen && category) {
            setName(category.name);
        } else if (!isOpen) {
            setName("");
        }
    }, [isOpen, category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await onSubmit(name.trim());
    };

    const isEdit = !!category;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/20 mb-2">
                        <Check className="h-6 w-6 text-success" />
                    </div>
                    <DialogTitle className="text-center">
                        {isEdit ? "Edit Kategori" : "Tambah Kategori"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="py-4">
                        <label className="text-sm font-medium text-foreground mb-2 block">
                            Nama Kategori Produk
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masukkan nama kategori"
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="gradient"
                            disabled={!name.trim() || isLoading}
                        >
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isEdit ? "Simpan" : "Tambah"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
