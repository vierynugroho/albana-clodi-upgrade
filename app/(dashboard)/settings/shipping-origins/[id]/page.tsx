"use client";

import { use } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShippingOriginForm from "@/components/setting/shipping-origins/ShippingOriginForm";
import { useDeliveryPlace } from "@/hooks/useDeliveryPlaces";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditShippingOriginPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: deliveryPlace, isLoading, isError, refetch } = useDeliveryPlace(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data asal pengiriman...</p>
      </div>
    );
  }

  if (isError || !deliveryPlace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data asal pengiriman
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Coba lagi
        </Button>
      </div>
    );
  }

  const initialData = {
    id: deliveryPlace.id,
    name: deliveryPlace.name,
    origin: deliveryPlace.subdistrict,
    phone: deliveryPlace.phoneNumber,
    address: deliveryPlace.address,
    description: deliveryPlace.description || "",
    status: true,
  };

  return (
    <div className="space-y-6">
      <ShippingOriginForm initialData={initialData} isEditMode={true} />
    </div>
  );
}
