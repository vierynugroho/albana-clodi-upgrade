"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserProfileFormValues,
  userProfileSchema,
} from "@/schemas/zod.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/field/FormField";
import { Loader2, User, Lock, Eye, EyeOff } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

/* ================= FORM PROPS ================= */

interface UserProfileFormProps {
  /** Data awal untuk form */
  initialData?: {
    id?: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    role?: string;
  };
  /** Callback setelah submit berhasil */
  onSuccess?: () => void;
}

/* ================= FORM ================= */

const UserProfileForm = ({
  initialData,
  onSuccess,
}: UserProfileFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullname: initialData?.fullname || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password untuk conditional validation message
  const passwordValue = watch("password");

  // Reset form ketika initialData berubah
  useEffect(() => {
    if (initialData) {
      reset({
        fullname: initialData.fullname || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: UserProfileFormValues) => {
    try {
      // Prepare payload - only include password if it's filled
      const payload: {
        fullname: string;
        email: string;
        phoneNumber: string;
        password?: string;
        confirmPassword?: string;
      } = {
        fullname: data.fullname,
        email: data.email,
        phoneNumber: data.phoneNumber,
      };

      // Only include password fields if password is provided
      if (data.password && data.password.length > 0) {
        payload.password = data.password;
        payload.confirmPassword = data.confirmPassword;
      }

      await updateProfileMutation.mutateAsync(payload);

      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui",
        variant: "success",
      });

      // Reset password fields after successful update
      reset({
        ...data,
        password: "",
        confirmPassword: "",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui profil. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Informasi Pribadi</CardTitle>
              <p className="text-sm text-muted-foreground">
                Perbarui informasi akun Anda
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Role Badge - Read Only */}
            {initialData?.role && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-sm text-muted-foreground">Role:</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full gradient-primary text-white capitalize">
                  {initialData.role}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField<UserProfileFormValues>
                label="Nama Lengkap"
                name="fullname"
                placeholder="Masukan nama lengkap"
                nullable={false}
                register={register}
                error={errors.fullname?.message}
              />

              <FormField<UserProfileFormValues>
                label="Alamat Email"
                name="email"
                type="email"
                placeholder="Masukan alamat email"
                nullable={false}
                register={register}
                error={errors.email?.message}
              />

              <FormField<UserProfileFormValues>
                label="Nomor Telepon"
                name="phoneNumber"
                placeholder="Masukan nomor telepon"
                nullable={false}
                register={register}
                error={errors.phoneNumber?.message}
              />
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Ubah Password</h3>
                  <p className="text-xs text-muted-foreground">
                    Kosongkan jika tidak ingin mengubah password
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Password Baru</label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukan password baru"
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-xs text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi password baru"
                      disabled={!passwordValue}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={!passwordValue}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="gradient-primary text-white px-8"
                disabled={updateProfileMutation.isPending || !isDirty}
              >
                {updateProfileMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileForm;
