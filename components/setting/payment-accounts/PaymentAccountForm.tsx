"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankAccFormValues, bankAccountSchema } from "@/schemas/zod.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField, RadioBtnField } from "@/components/field/FormField";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreatePaymentMethod, useUpdatePaymentMethod } from "@/hooks/usePaymentMethods";
import { useToast } from "@/hooks/use-toast";

/* ================= FORM PROPS ================= */

interface PaymentAccountFormProps {
  /** Data awal untuk mode edit */
  initialData?: BankAccFormValues & { id?: string };
  /** Apakah dalam mode edit */
  isEditMode?: boolean;
  /** Callback setelah submit berhasil */
  onSuccess?: () => void;
}

/* ================= FORM ================= */

const PaymentAccountForm = ({
  initialData,
  isEditMode = false,
  onSuccess,
}: PaymentAccountFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankAccFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: initialData || {
      bankName: "",
      accountNumber: "",
      accountName: "",
      status: true,
    },
  });

  // Reset form ketika initialData berubah (untuk mode edit)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: BankAccFormValues) => {
    try {
      // Map form data to API payload
      const payload = {
        name: data.accountName, // Account holder name as method name
        bankName: data.bankName,
        bankBranch: "", // Default empty
        accountNumber: data.accountNumber,
      };

      if (isEditMode && initialData?.id) {
        // MODE EDIT: Update data
        await updateMutation.mutateAsync({
          id: initialData.id,
          payload,
        });
        toast({
          title: "Berhasil",
          description: "Akun bank berhasil diperbarui",
          variant: "success",
        });
      } else {
        // MODE ADD: Create baru
        await createMutation.mutateAsync(payload);
        toast({
          title: "Berhasil",
          description: "Akun bank berhasil ditambahkan",
          variant: "success",
        });
      }

      onSuccess?.();
      router.push("/settings/payment-accounts");
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
          {isEditMode ? "Edit Akun Bank" : "Tambah Akun Bank"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 rounded-xl space-y-4"
        >
          <h3 className="font-bold text-base">Informasi Bank Account</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField<BankAccFormValues>
              label="Bank Name"
              name="bankName"
              placeholder="Masukan nama Bank"
              nullable={false}
              register={register}
              error={errors.bankName?.message}
            />

            <FormField<BankAccFormValues>
              type="text"
              label="No Rekening"
              name="accountNumber"
              placeholder="Masukan No Rekening"
              nullable={false}
              register={register}
              error={errors.accountNumber?.message}
            />

            <FormField<BankAccFormValues>
              label="Nama rekening"
              name="accountName"
              placeholder="Masukan Nama Rekening"
              nullable={false}
              register={register}
              error={errors.accountName?.message}
            />

            {/* Radio boolean */}
            <div className="flex flex-col gap-1">
              <RadioBtnField<BankAccFormValues>
                label="Status Aktif"
                name="status"
                control={control}
                error={errors.status?.message}
              />

              {errors.status && (
                <span className="text-xs text-red-500">
                  {errors.status.message}
                </span>
              )}
            </div>
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

export default PaymentAccountForm;
