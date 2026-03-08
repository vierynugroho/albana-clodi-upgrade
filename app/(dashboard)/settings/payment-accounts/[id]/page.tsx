"use client";

import { use } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentAccountForm from "@/components/setting/payment-accounts/PaymentAccountForm";
import { usePaymentMethod } from "@/hooks/usePaymentMethods";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPaymentAccountPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: paymentMethod, isLoading, isError, refetch } = usePaymentMethod(id);

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (isError || !paymentMethod) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data akun bank"
        onRetry={() => refetch()}
      />
    );
  }

  const initialData = {
    id: paymentMethod.id,
    bankName: paymentMethod.bankName,
    accountNumber: paymentMethod.accountNumber,
    accountName: paymentMethod.name,
    status: true,
  };

  return (
    <div className="space-y-6">
      <PaymentAccountForm initialData={initialData} isEditMode={true} />
    </div>
  );
}
