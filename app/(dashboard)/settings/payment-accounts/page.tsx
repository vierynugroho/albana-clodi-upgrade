 "use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankAccount } from "@/types";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Building2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { usePaymentMethods, useDeletePaymentMethod } from "@/hooks/usePaymentMethods";
import { useToast } from "@/hooks/use-toast";
import { mapApiPaymentMethodsToBankAccounts } from "@/lib/mappers";
import { BankAccountCard } from "@/components/setting/payment-accounts/PaymentAccountCard";

export default function PaymentAccountsPage() {
  const { data: apiMethods = [], isLoading, isError, refetch } = usePaymentMethods();
  const deleteMutation = useDeletePaymentMethod();
  const { toast } = useToast();

  // Map API data to frontend type
  const bankAccounts: BankAccount[] = mapApiPaymentMethodsToBankAccounts(apiMethods);

  const handleDelete = (methodId: string) => {
    if (!confirm("Hapus metode pembayaran ini?")) return;

    deleteMutation.mutate(methodId, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Metode pembayaran berhasil dihapus",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal menghapus metode pembayaran",
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data rekening...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data rekening
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
      <div>
        <h1 className="page-title flex items-center gap-2">
          <CreditCard className="h-7 w-7 text-info" />
          Pembayaran
        </h1>
        <p className="page-description">
          Kelola metode pembayaran untuk menerima transaksi
        </p>
      </div>

      {/* Payment Accounts */}
      <Card accent="info">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Rekening Bank</CardTitle>
            <p className="text-sm text-muted-foreground">
              Daftar rekening bank untuk menerima pembayaran
            </p>
          </div>
          <Link href="/settings/payment-accounts/add">
            <Button size="sm" variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Rekening
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {bankAccounts.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-2xl bg-info/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-info" />
              </div>
              <p className="text-base font-semibold">Belum ada rekening</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tambahkan rekening bank untuk menerima pembayaran
              </p>
            </div>
          ) : (
            bankAccounts.map((bank, index) => (
              <BankAccountCard
                key={bank.id}
                bank={bank}
                index={index}
                onDelete={handleDelete}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
