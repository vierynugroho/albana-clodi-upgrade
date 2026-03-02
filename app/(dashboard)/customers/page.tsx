"use client";

import { CustomerTable } from "@/components/customer/CustomerTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, Loader2, RefreshCw, Download, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCustomers, useDeleteCustomer, useImportCustomers, useExportCustomers } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { mapApiCustomersToCustomers } from "@/lib/mappers";
import type { Customer } from "@/types";
import { CustomerStats } from "@/components/customer/CustomerStats";
import { useRef } from "react";
import { LoadingState } from "@/components/shared/LoadingState";

export default function CustomersPage() {
  const router = useRouter();
  const { data: apiCustomers = [], isLoading, isError, refetch } = useCustomers();
  const deleteMutation = useDeleteCustomer();
  const importMutation = useImportCustomers();
  const exportMutation = useExportCustomers();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map API customers to frontend Customer type
  const customers: Customer[] = mapApiCustomersToCustomers(apiCustomers);

  const handleDelete = (customerId: string) => {
    if (!confirm("Hapus customer ini?")) return;

    deleteMutation.mutate(customerId, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Customer berhasil dihapus",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal menghapus customer",
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      },
    });
  };

  // --- Old handleExport (inline download) ---
  // const handleExport = async () => {
  //   try {
  //     await exportMutation.mutateAsync({});
  //     toast({ title: "Berhasil", description: "Data customer berhasil diexport", variant: "success" });
  //   } catch (error) {
  //     toast({ title: "Gagal mengexport", description: error instanceof Error ? error.message : "Terjadi kesalahan", variant: "destructive" });
  //   }
  // };
  // --- End old handleExport ---

  const handleExport = () => {
    const params = new URLSearchParams();
    params.set("type", "customers");
    window.open(`/export?${params.toString()}`, "_blank");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      toast({
        title: "Error",
        description: "File harus berformat Excel (.xlsx atau .xls)",
        variant: "destructive",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      const result = await importMutation.mutateAsync(file);
      toast({
        title: "Berhasil",
        description: result.totalImported
          ? `${result.totalImported} data customer berhasil diimport`
          : result.message || "Data customer berhasil diimport",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Gagal mengimport",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Users className="h-7 w-7 text-pink" />
              Customers
            </h1>
            <p className="page-description">Kelola semua data customer Anda</p>
          </div>
        </div>

        {/* Stats Loading */}
        <CustomerStats customers={[]} isLoading={true} />

        {/* Table Loading */}
        <LoadingState  />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data customers
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
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Users className="h-7 w-7 text-pink" />
            Customers
          </h1>
          <p className="page-description">
            Kelola semua data customer Anda
            {customers.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({customers.length} total data)
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Hidden file input for import */}
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImport}
          />
          <Button
            variant="outline"
            onClick={handleImportClick}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Import
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
          <Button
            onClick={() => router.push("/customers/add")}
            variant="gradient"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Customer
          </Button>
        </div>
      </div>

      {/* Stats - Now integrated with real data */}
      <CustomerStats customers={customers} />

      {/* Table */}
      <CustomerTable
        customers={customers}
        onEdit={(c) => router.push(`/customers/${c.id}`)}
        onView={(c) => router.push(`/customers/${c.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
