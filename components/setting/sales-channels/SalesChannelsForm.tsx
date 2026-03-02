"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesFormValues, salesSchema } from "@/schemas/zod.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField, RadioBtnField } from "@/components/field/FormField";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateSalesChannel, useUpdateSalesChannel } from "@/hooks/useSalesChannels";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/utils";

/* ================= FORM PROPS ================= */

interface SalesChannelsFormProps {
  /** Data awal untuk mode edit */
  initialData?: SalesFormValues & { id?: string };
  /** Apakah dalam mode edit */
  isEditMode?: boolean;
  /** Callback setelah submit berhasil */
  onSuccess?: () => void;
}

/* ================= FORM ================= */

const SalesChannelsForm = ({
  initialData,
  isEditMode = false,
  onSuccess,
}: SalesChannelsFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreateSalesChannel();
  const updateMutation = useUpdateSalesChannel();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalesFormValues>({
    resolver: zodResolver(salesSchema),
    defaultValues: initialData || {
      name: "",
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

  const onSubmit = async (data: SalesFormValues) => {
    try {
      if (isEditMode && initialData?.id) {
        // MODE EDIT: Update data
        await updateMutation.mutateAsync({
          id: initialData.id,
          payload: {
            name: data.name,
            isActive: data.status,
          },
        });
        toast({
          title: "Berhasil",
          description: "Sales channel berhasil diperbarui",
          variant: "success",
        });
      } else {
        // MODE ADD: Create baru
        await createMutation.mutateAsync({
          name: data.name,
          isActive: data.status,
        });
        toast({
          title: "Berhasil",
          description: "Sales channel berhasil ditambahkan",
          variant: "success",
        });
      }

      onSuccess?.();
      router.push("/settings/sales-channels");
    } catch (error) {
      toast({
        title: "Gagal",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Informasi Sales" : "Tambah Informasi Sales"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 rounded-xl space-y-4"
        >
          <h3 className="font-bold text-base">Informasi Sales</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField<SalesFormValues>
              label="Nama"
              name="name"
              placeholder="Masukan nama Sales"
              nullable={false}
              register={register}
              error={errors.name?.message}
            />

            <div className="flex flex-col gap-1">
              <RadioBtnField
                label="Status Aktif"
                name="status"
                control={control}
                error={errors.status?.message}
              />
            </div>
          </div>

          {/* TEXTAREA */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Deskripsi</label>

            <textarea
              {...register("description")}
              className="border rounded-xl p-3 resize-none h-28"
              placeholder="Masukan deskripsi sales channel"
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

export default SalesChannelsForm;
