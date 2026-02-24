"use client";

import { useParams, useRouter } from "next/navigation";
import CustomerForm from "@/components/customer/CustomerForm";
import { useCustomer } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import type { CustomerFormValues } from "@/schemas/zod.schemas";
import type { ApiCustomer } from "@/types/api";

/**
 * Maps ApiCustomer to CustomerFormValues for the edit form
 */
function mapApiCustomerToFormValues(
  apiCustomer: ApiCustomer,
): CustomerFormValues & { id: string } {
  // Map category from API to form format
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data customer...</p>
      </div>
    );
  }

  // Error state
  if (isError || !customerData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data customer
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/customers")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Coba lagi
          </Button>
        </div>
      </div>
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
