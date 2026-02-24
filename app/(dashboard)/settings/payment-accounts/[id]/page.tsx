"use client";

import { use } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentAccountForm from "@/components/setting/payment-accounts/PaymentAccountForm";
import { usePaymentMethod } from "@/hooks/usePaymentMethods";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPaymentAccountPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: paymentMethod, isLoading, isError, refetch } = usePaymentMethod(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data akun bank...</p>
      </div>
    );
  }

  if (isError || !paymentMethod) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data akun bank
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Coba lagi
        </Button>
      </div>
    );
  }

  // Map API data to form values
  const initialData = {
    id: paymentMethod.id,
    bankName: paymentMethod.bankName,
    accountNumber: paymentMethod.accountNumber,
    accountName: paymentMethod.name, // name is used as account holder name
    status: true, // API doesn't have status field
  };

  return (
    <div className="space-y-6">
      <PaymentAccountForm initialData={initialData} isEditMode={true} />
    </div>
  );
}
