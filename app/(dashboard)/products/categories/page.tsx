"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Folder, Loader2, RefreshCw } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import type { ApiCategory } from "@/types/api";
import { CategoryTable } from "@/components/product/category/CategoryTable";
import { CategoryFormModal } from "@/components/product/category/CategoryFormModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/confirm-dialog";

export default function CategoriesPage() {
    const { data: categories = [], isLoading, isError, refetch } = useCategories();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<ApiCategory | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAddClick = () => {
        setEditCategory(null);
        setIsFormOpen(true);
    };

    const handleEdit = (category: ApiCategory) => {
        setEditCategory(category);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (name: string) => {
        try {
            if (editCategory) {
                await updateMutation.mutateAsync({
                    id: editCategory.id,
                    payload: { name },
                });
                toast({
                    title: "Berhasil",
                    description: "Kategori berhasil diperbarui",
                    variant: "success",
                });
            } else {
                await createMutation.mutateAsync({ name });
                toast({
                    title: "Berhasil",
                    description: "Kategori berhasil ditambahkan",
                    variant: "success",
                });
            }
            setIsFormOpen(false);
            setEditCategory(null);
        } catch (error) {
            toast({
                title: "Gagal",
                description: error instanceof Error ? error.message : "Terjadi kesalahan",
                variant: "destructive",
            });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await deleteMutation.mutateAsync(deleteId);
            toast({
                title: "Berhasil",
                description: "Kategori berhasil dihapus",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Gagal menghapus",
                description: error instanceof Error ? error.message : "Terjadi kesalahan",
                variant: "destructive",
            });
        } finally {
            setIsDeleteOpen(false);
            setDeleteId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Memuat data kategori...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 gap-4">
                <div className="text-center">
                    <p className="font-semibold text-destructive">Gagal memuat data</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Terjadi kesalahan saat memuat data kategori
                    </p>
                </div>
                <Button onClick={() => refetch()} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Coba lagi
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="page-title flex items-center gap-2">
                        <Folder className="h-7 w-7 text-success" />
                        Kategori Produk
                    </h1>
                    <p className="page-description">Kelola kategori produk Anda</p>
                </div>

                <Button onClick={handleAddClick} variant="gradient">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kategori
                </Button>
            </div>

            <CategoryTable
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <CategoryFormModal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditCategory(null);
                }}
                onSubmit={handleFormSubmit}
                category={editCategory}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Yakin ingin menghapus kategori ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteOpen(false)}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
