"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SalesChannel } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Plus,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useSalesChannels, useDeleteSalesChannel } from "@/hooks/useSalesChannels";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { mapApiSalesChannelsToSalesChannels } from "@/lib/mappers";
import { ChannelCard } from "@/components/setting/sales-channels/ChannelCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

export default function SalesChannelPage() {
  const router = useRouter();
  const { data: apiChannels = [], isLoading, isError, refetch } = useSalesChannels();
  const deleteMutation = useDeleteSalesChannel();
  const { toast } = useToast();

  const channels: SalesChannel[] = mapApiSalesChannelsToSalesChannels(apiChannels);

  const handleEdit = (channel: SalesChannel) => {
    router.push(`/settings/sales-channels/${channel.id}`);
  };

  const handleDelete = (channelId: string) => {
    if (!confirm("Hapus sales channel ini?")) return;

    deleteMutation.mutate(channelId, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Sales channel berhasil dihapus",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal menghapus sales channel",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });
  };

  const handleView = (channel: SalesChannel) => {
    router.push(`/settings/sales-channels/${channel.id}`);
  };

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Terjadi kesalahan saat memuat data sales channels"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Store className="h-7 w-7 text-cyan" />
            Sales Channels
          </h1>
          <p className="page-description">
            Kelola semua channel penjualan Anda
          </p>
        </div>

        <Link href="/settings/sales-channels/add">
          <Button variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Channel
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {channels.length === 0 ? (
          <Card className="sm:col-span-2 p-8">
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-2xl bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-cyan" />
              </div>
              <p className="text-base font-semibold">Belum ada sales channel</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tambahkan channel penjualan untuk mengelola order
              </p>
            </div>
          </Card>
        ) : (
          channels.map((channel, index) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              index={index}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
