"use client";

import { use } from "react";
import SalesChannelsForm from "@/components/setting/sales-channels/SalesChannelsForm";
import { useSalesChannel } from "@/hooks/useSalesChannels";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditSalesChannelPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: channel, isLoading, isError, refetch } = useSalesChannel(id);

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (isError || !channel) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data sales channel"
        onRetry={() => refetch()}
      />
    );
  }

  const initialData = {
    id: channel.id,
    name: channel.name,
    description: "",
    status: channel.isActive ?? true,
  };

  return (
    <div className="space-y-6">
      <SalesChannelsForm initialData={initialData} isEditMode={true} />
    </div>
  );
}
