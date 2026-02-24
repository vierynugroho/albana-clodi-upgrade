"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WarehouseFormValues, warehouseSchema } from "@/schemas/zod.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/field/FormField";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateDeliveryPlace, useUpdateDeliveryPlace } from "@/hooks/useDeliveryPlaces";
import { useToast } from "@/hooks/use-toast";

/* ================= FORM PROPS ================= */

interface ShippingOriginFormProps {
  /** Data awal untuk mode edit */
  initialData?: WarehouseFormValues & { id?: string };
  /** Apakah dalam mode edit */
  isEditMode?: boolean;
  /** Callback setelah submit berhasil */
  onSuccess?: () => void;
}

/* ================= FORM ================= */

const ShippingOriginForm = ({
  initialData,
  isEditMode = false,
  onSuccess,
}: ShippingOriginFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreateDeliveryPlace();
  const updateMutation = useUpdateDeliveryPlace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: initialData || {
      name: "",
      origin: "",
      phone: "",
      address: "",
      description: "",
      status: true,
    },
  });

  // Reset form ketika initialData berubah (untuk mode edit)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: WarehouseFormValues) => {
    try {
      // Map form data to API payload
      const payload = {
        name: data.name,
        address: data.address,
        subdistrict: data.origin, // Map origin to subdistrict
        phoneNumber: data.phone,
        destinationId: 1, // Default destination ID - should be fetched from API
        email: "",
        description: data.description || "",
      };

      if (isEditMode && initialData?.id) {
        // MODE EDIT: Update data
        await updateMutation.mutateAsync({
          id: initialData.id,
          payload,
        });
        toast({
          title: "Berhasil",
          description: "Asal pengiriman berhasil diperbarui",
          variant: "success",
        });
      } else {
        // MODE ADD: Create baru
        await createMutation.mutateAsync(payload);
        toast({
          title: "Berhasil",
          description: "Asal pengiriman berhasil ditambahkan",
          variant: "success",
        });
      }

      onSuccess?.();
      router.push("/settings/shipping-origins");
    } catch (error) {
      toast({
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Asal Pengiriman" : "Tambah Asal Pengiriman"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 rounded-xl space-y-4"
        >
          <h3 className="font-bold text-base">Informasi Asal Pengiriman</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField<WarehouseFormValues>
              label="Nama Toko"
              name="name"
              placeholder="Masukan nama Toko"
              nullable={false}
              register={register}
              error={errors.name?.message}
            />

            <FormField<WarehouseFormValues>
              label="Lokasi asal pengiriman"
              name="origin"
              placeholder="Masukan Lokasi Asal Pengiriman"
              nullable={false}
              register={register}
              error={errors.origin?.message}
            />

            <FormField<WarehouseFormValues>
              type="tel"
              label="No Telepon"
              name="phone"
              placeholder="Masukan No Telepon"
              nullable={false}
              register={register}
              error={errors.phone?.message}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Status Aktif *</label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="true"
                    {...register("status", {
                      setValueAs: (v) => v === true,
                    })}
                    defaultChecked={initialData?.status === true}
                  />
                  Ya
                </label>

                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    value="false"
                    {...register("status", {
                      setValueAs: (v) => v === false,
                    })}
                    defaultChecked={initialData?.status === false}
                  />
                  Tidak
                </label>
              </div>

              {errors.status && (
                <span className="text-xs text-red-500">
                  {errors.status.message}
                </span>
              )}
            </div>
          </div>

          <FormField<WarehouseFormValues>
            label="Lokasi Destinasi"
            name="address"
            placeholder="Masukan Destinasi Pengiriman"
            nullable={false}
            register={register}
            error={errors.address?.message}
          />

          {/* TEXTAREA */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Deskripsi</label>

            <textarea
              {...register("description")}
              className="border rounded-xl p-3 resize-none h-28"
              placeholder="Masukan Deskripsi"
            />

            {errors.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShippingOriginForm;
