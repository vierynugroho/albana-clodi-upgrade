"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankAccount } from "@/types";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Building2,
} from "lucide-react";
import { usePaymentMethods, useDeletePaymentMethod } from "@/hooks/usePaymentMethods";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { mapApiPaymentMethodsToBankAccounts } from "@/lib/mappers";
import { BankAccountCard } from "@/components/setting/payment-accounts/PaymentAccountCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

export default function PaymentAccountsPage() {
  const { data: apiMethods = [], isLoading, isError, refetch } = usePaymentMethods();
  const deleteMutation = useDeletePaymentMethod();
  const { toast } = useToast();

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
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data rekening"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <CreditCard className="h-7 w-7 text-info" />
          Pembayaran
        </h1>
        <p className="page-description">
          Kelola metode pembayaran untuk menerima transaksi
        </p>
      </div>

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
