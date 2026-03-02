"use client";

import { use } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesChannelsForm from "@/components/setting/sales-channels/SalesChannelsForm";
import { useSalesChannel } from "@/hooks/useSalesChannels";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditSalesChannelPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: channel, isLoading, isError, refetch } = useSalesChannel(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data sales channel...</p>
      </div>
    );
  }

  if (isError || !channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data sales channel
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
