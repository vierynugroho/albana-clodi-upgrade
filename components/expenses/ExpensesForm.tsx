"use client";

import { useEffect, useState } from "react";
import { useForm, UseFormRegister, FieldValues, Resolver, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { expensesSchema } from "@/schemas/zod.schemas";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCreateExpense, useUpdateExpense } from "@/hooks/useExpenses";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { formatCurrency, parseRupiah } from "@/lib/utils";

type ExpensesFormValues = z.infer<typeof expensesSchema>;

type FormFieldProps<T extends FieldValues> = {
  label: string;
  name: keyof T;
  type?: string;
  placeholder?: string;
  nullable: boolean;
  register: UseFormRegister<T>;
  error?: string;
};

const FormField = <T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  nullable,
  register,
  error,
}: FormFieldProps<T>) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">
      {label} {!nullable && <span className="text-destructive">*</span>}
    </label>

    <Input type={type} placeholder={placeholder} {...register(name as never)} />

    {error && (
      <span className="text-xs text-red-500">{error}</span>
    )}
  </div>
);

/* ================= FORM PROPS ================= */

interface ExpensesFormProps {
  /** Data awal untuk mode edit */
  initialData?: ExpensesFormValues & { id?: string };
  /** Apakah dalam mode edit */
  isEditMode?: boolean;
  /** Callback setelah submit berhasil */
  onSuccess?: () => void;
}

/* ================= FORM ================= */

const ExpensesForm = ({
  initialData,
  isEditMode = false,
  onSuccess,
}: ExpensesFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExpensesFormValues>({
    resolver: zodResolver(expensesSchema) as Resolver<ExpensesFormValues>,
    defaultValues: initialData || {
      itemName: "",
      expenseDate: new Date().toISOString().split("T")[0],
      itemPrice: 0,
      qty: 1,
      personResponsible: "",
      note: "",
    },
  });

  // Reset form ketika initialData berubah (untuk mode edit)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ExpensesFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        itemName: data.itemName,
        itemPrice: Number(data.itemPrice),
        expenseDate: data.expenseDate,
        qty: Number(data.qty),
        personResponsible: data.personResponsible || "",
        note: data.note || "",
      };

      if (isEditMode && initialData?.id) {
        // MODE EDIT: Update data
        await updateExpense.mutateAsync({
          id: initialData.id,
          payload,
        });

        toast({
          title: "Berhasil!",
          description: "Data pengeluaran berhasil diperbarui",
          variant: "success",
        });
      } else {
        // MODE ADD: Create baru
        await createExpense.mutateAsync(payload);

        toast({
          title: "Berhasil!",
          description: "Data pengeluaran berhasil ditambahkan",
          variant: "success",
        });
      }

      onSuccess?.();
      router.push("/expenses");
    } catch (error) {
      console.error("Error submitting expenses:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menyimpan data pengeluaran",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0">
      <CardHeader className="px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg md:text-xl">
            {isEditMode ? "Edit Data Pengeluaran" : "Tambah Data Pengeluaran"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-4 md:px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="
            space-y-6
            rounded-xl
            border
            p-4
            md:p-6
          "
        >
          {/* GRID INPUT */}
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-2
            "
          >
            <FormField
              label="Nama Item"
              name="itemName"
              placeholder="Masukan nama pengeluaran"
              nullable={false}
              register={register}
              error={errors.itemName?.message}
            />

            <FormField
              type="date"
              label="Tanggal"
              name="expenseDate"
              nullable={false}
              register={register}
              error={errors.expenseDate?.message}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Harga per Item <span className="text-destructive">*</span>
              </label>

              <Controller
                name="itemPrice"
                control={control}
                rules={{ required: "Harga per item wajib diisi" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Rp 0"
                    {...field}
                    value={field.value ? formatCurrency(field.value) : ""}
                    onChange={(e) => field.onChange(parseRupiah(e.target.value))}
                  />
                )}
              />

              {errors.itemPrice && (
                <span className="text-xs text-red-500">{errors.itemPrice.message}</span>
              )}
            </div>

            <FormField
              label="Jumlah (Qty)"
              name="qty"
              type="number"
              placeholder="Masukan jumlah"
              nullable={false}
              register={register}
              error={errors.qty?.message}
            />
          </div>

          {/* TOTAL PENGELUARAN (Read-only) */}
          <div className="w-full">
            <div className="flex flex-col gap-1 bg-muted/20 p-4 rounded-xl border border-muted-foreground/20">
              <label className="text-sm font-medium text-muted-foreground">
                Total Biaya Pengeluaran
              </label>
              <p className="text-2xl font-bold">
                <span className="text-xs text-muted-foreground font-normal align-top mr-1">Rp</span>
                {new Intl.NumberFormat("id-ID").format(
                  parseRupiah(String(watch("itemPrice") || 0)) * Number(watch("qty") || 1)
                )}
              </p>
            </div>
          </div>

          {/* RESPONSIBLE */}
          <div className="w-full">
            <FormField
              label="Penanggung Jawab"
              name="personResponsible"
              placeholder="Masukan penanggung jawab (opsional)"
              nullable={true}
              register={register}
              error={errors.personResponsible?.message}
            />
          </div>

          {/* TEXTAREA */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Catatan</label>

            <textarea
              {...register("note")}
              placeholder="Masukan catatan (opsional)"
              className="
                h-32
                resize-none
                rounded-xl
                border
                p-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-primary
              "
            />

            {errors.note && (
              <span className="text-xs text-red-500">
                {errors.note.message}
              </span>
            )}
          </div>

          {/* BUTTON */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="
                flex-1
                h-11
                text-sm
                md:text-base
              "
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpensesForm;
