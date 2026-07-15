"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormFieldWrapper } from "@/components/ui/input";
import {useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingSchema, SettingFormValues } from "@/schemas/zod.schemas";
import {
  Save,
  Store,
  FileText,
} from "lucide-react";
import { useShop, useUpdateShop } from "@/hooks/useShops";
import { LogoUpload } from "./LogoUpload";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/shared/LoadingState";

const DEFAULT_LOGO = "https://albana-grosir.my.id/logo/albana-clodi-logo.svg";
type ImageState = { preview: string; file?: File };

export default function SettingForm() {

  const { toast } = useToast();

  const { data: shop, isLoading } = useShop();
  const { mutateAsync: updateShop } = useUpdateShop();
  const [logo, setLogo] = useState<ImageState>({ preview: DEFAULT_LOGO });
  const [banner, setBanner] = useState<ImageState>({ preview: DEFAULT_LOGO });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingFormValues>({
    resolver: zodResolver(settingSchema),
  });

  useEffect(() => {
    if (!shop) return;

    reset({
      storeName: shop.name,
      phone: shop.phoneNumber,
      address: shop.address,
      description: shop.description ?? "",
      email: shop.email ?? "",
      owner: shop.owner ?? "",
    });

    setLogo({ preview: shop.logo || DEFAULT_LOGO });
    setBanner({ preview: shop.banner || DEFAULT_LOGO });
  }, [shop, reset]);

  const onSubmit = async (values: SettingFormValues) => {
    const formData = new FormData();
    formData.append("name", values.storeName);
    formData.append("phoneNumber", values.phone);
    formData.append("address", values.address);

    if (values.description) formData.append("description", values.description);
    if (values.email) formData.append("email", values.email);
    if (values.owner) formData.append("owner", values.owner);
    if (logo.file) formData.append("logo", logo.file);
    if (banner.file) formData.append("banner", banner.file);

    await updateShop(formData);
    toast({
        title: "Success",
        description: "Berhasil memperbaharui data.",
        variant: "success",
      });
  };

  if (isLoading){ 
    return <LoadingState />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" /> Informasi Toko
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <LogoUpload
                logo={logo.preview}
                onChange={(file) => setLogo({ file, preview: URL.createObjectURL(file) })}
                onDelete={() => setLogo({ preview: DEFAULT_LOGO })}
              />
            </div>

          </div>

          <div className="space-y-4">
            <FormFieldWrapper label="Nama Toko" error={errors.storeName?.message}>
              <Input {...register("storeName")} />
            </FormFieldWrapper>

            <FormFieldWrapper label="Email" error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </FormFieldWrapper>

            <FormFieldWrapper label="Phone" error={errors.phone?.message}>
              <Input {...register("phone")} />
            </FormFieldWrapper>

            <FormFieldWrapper label="Owner" error={errors.owner?.message}>
              <Input {...register("owner")} />
            </FormFieldWrapper>

            <FormFieldWrapper label="Alamat" error={errors.address?.message}>
              <Input {...register("address")} />
            </FormFieldWrapper>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Deskripsi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea {...register("description")} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" /> Simpan
        </Button>
      </div>
    </form>
  );
}
