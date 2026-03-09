"use client";

import { useParams, useRouter } from "next/navigation";
import CustomerForm from "@/components/customer/CustomerForm";
import { useCustomer } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { CustomerFormValues } from "@/schemas/zod.schemas";
import type { ApiCustomer } from "@/types/api";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";

function mapApiCustomerToFormValues(
  apiCustomer: ApiCustomer,
): CustomerFormValues & { id: string } {
  const categoryMap: Record<string, string> = {
    CUSTOMER: "customer",
    RESELLER: "reseller",
    AGENT: "agen",
    MEMBER: "member",
    DROPSHIPPER: "dropshipper",
  };

  return {
    id: apiCustomer.id,
    kategori: categoryMap[apiCustomer.category] || "customer",
    namaLengkap: apiCustomer.name,
    provinsiId: "",
    kotaId: "",
    kecamatanId: "",
    desaId: "",
    provinsi: apiCustomer.province || "",
    kota: apiCustomer.city || "",
    kecamatan: apiCustomer.district || apiCustomer.subdistrict || "",
    desa: apiCustomer.village || "",
    kodePos: apiCustomer.postalCode || "",
    email: apiCustomer.email || "",
    noTelepon: apiCustomer.phoneNumber || "",
    alamat: apiCustomer.address || "",
    destinationId: apiCustomer.destinationId || undefined,
  };
}

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: customerData, isLoading, isError, refetch } = useCustomer(id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !customerData) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data customer"
        onRetry={() => refetch()}
        onBack={() => router.push("/customers")}
      />
    );
  }

  const initialData = mapApiCustomerToFormValues(customerData);

  return (
    <Card className="space-y-6 border-0">
      <div className="flex items-center gap-4 p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/customers")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <CardTitle className="text-2xl font-bold">Edit Customer</CardTitle>
      </div>

      <CustomerForm initialData={initialData} isEditMode={true} />
    </Card>
  );
}
