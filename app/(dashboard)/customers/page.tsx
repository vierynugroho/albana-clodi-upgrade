"use client";

import { CustomerTable } from "@/components/customer/CustomerTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, Loader2, RefreshCw, Download, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCustomers, useDeleteCustomer, useImportCustomers, useExportCustomers } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { mapApiCustomersToCustomers } from "@/lib/mappers";
import { getApiErrorMessage } from "@/lib/utils";
import type { Customer } from "@/types";
import type { ExportFilterParams } from "@/types/api";
import { CustomerStats } from "@/components/customer/CustomerStats";
import { CustomerExportDialog } from "@/components/customer/CustomerExportDialog";
import { useRef, useState } from "react";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

export default function CustomersPage() {
  const router = useRouter();
  const { data: apiCustomers = [], isLoading, isError, refetch } = useCustomers();
  const deleteMutation = useDeleteCustomer();
  const importMutation = useImportCustomers();
  const exportMutation = useExportCustomers();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

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
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });
  };

  const handleExport = (params: ExportFilterParams) => {
    exportMutation.mutate(params, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Data customer berhasil diexport",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal mengexport",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Users className="h-7 w-7 text-pink" />
              Customers
            </h1>
            <p className="page-description">Kelola semua data customer Anda</p>
          </div>
        </div>

        <CustomerStats customers={[]} isLoading={true} />

        <LoadingState />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data customers"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
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

        <div className="flex flex-wrap gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImport}
          />
          <Button
            variant="outline"
            size="sm"
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
            size="sm"
            onClick={() => setIsExportDialogOpen(true)}
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
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Customer
          </Button>
        </div>
      </div>

      <CustomerStats customers={customers} />

      <CustomerTable
        customers={customers}
        onEdit={(c) => router.push(`/customers/${c.id}`)}
        onView={(c) => router.push(`/customers/${c.id}`)}
        onDelete={handleDelete}
      />

      <CustomerExportDialog
        isOpen={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
      />
    </div>
  );
}
