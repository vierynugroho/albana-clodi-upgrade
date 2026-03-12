"use client";

import { use } from "react";
import ShippingOriginForm from "@/components/setting/shipping-origins/ShippingOriginForm";
import { useDeliveryPlace } from "@/hooks/useDeliveryPlaces";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditShippingOriginPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: deliveryPlace, isLoading, isError, refetch } = useDeliveryPlace(id);

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (isError || !deliveryPlace) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data asal pengiriman"
        onRetry={() => refetch()}
      />
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
