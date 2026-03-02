"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Warehouse } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Plus,
  Warehouse as WarehouseIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useDeliveryPlaces, useDeleteDeliveryPlace } from "@/hooks/useDeliveryPlaces";
import { useToast } from "@/hooks/use-toast";
import { mapApiDeliveryPlacesToWarehouses } from "@/lib/mappers";
import { WarehouseCard } from "@/components/setting/shipping-origins/WarehouseCard";

export default function ShippingOriginPage() {
  const router = useRouter();
  const { data: apiPlaces = [], isLoading, isError, refetch } = useDeliveryPlaces();
  const deleteMutation = useDeleteDeliveryPlace();
  const { toast } = useToast();

  const warehouses: Warehouse[] = mapApiDeliveryPlacesToWarehouses(apiPlaces);

  const handleEdit = (warehouse: Warehouse) => {
    router.push(`/settings/shipping-origins/${warehouse.id}`);
  };

  const handleDelete = (warehouseId: string) => {
    if (!confirm("Hapus lokasi pengiriman ini?")) return;

    deleteMutation.mutate(warehouseId, {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Lokasi pengiriman berhasil dihapus",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Gagal menghapus lokasi pengiriman",
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      },
    });
  };

  const handleView = (warehouse: Warehouse) => {
    router.push(`/settings/shipping-origins/${warehouse.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat data lokasi pengiriman...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <div className="text-center">
          <p className="font-semibold text-destructive">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kesalahan saat memuat data lokasi pengiriman
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <MapPin className="h-7 w-7 text-teal" />
            Shipping Origins
          </h1>
          <p className="page-description">
            Kelola semua lokasi asal pengiriman
          </p>
        </div>

        <Link href="/settings/shipping-origins/add">
          <Button variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Gudang
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {warehouses.length === 0 ? (
          <Card className="p-8">
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
                <WarehouseIcon className="h-8 w-8 text-teal" />
              </div>
              <p className="text-base font-semibold">Belum ada gudang</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tambahkan gudang untuk mengatur lokasi pengiriman
              </p>
            </div>
          </Card>
        ) : (
          warehouses.map((warehouse, index) => (
            <WarehouseCard
              key={warehouse.id}
              warehouse={warehouse}
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
