"use client";


import { Button } from "../ui/button";
import { FormField } from "../field/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  LoginFormValues,
  RegisterFormValues,
} from "@/schemas/zod.schemas";
import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { saveToken } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

interface AuthFormProps {
  auth_method: "login" | "register";
}

const AuthForm = ({ auth_method }: AuthFormProps) => {
  return auth_method === "login" ? <LoginForm /> : <RegisterForm />;
};

const LoginForm = memo(function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = useCallback(async (data: LoginFormValues) => {
    setError(null);
    try {
      const res = await api.post("/auth/login", data);
      const resData = res.data || {};
      const token =
        resData?.token ||
        resData?.data?.token ||
        resData?.responseObject?.token ||
        resData?.responseObject?.accessToken;

      if (!token) {
        const msg = resData?.message || "Login gagal: token tidak diterima";
        throw new Error(msg);
      }

      saveToken(token);
      queryClient.clear();
      router.replace("/dashboard");
    } catch (err: unknown) {
      console.error("login error", err);
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosError?.response?.data?.message || axiosError?.message || "Login gagal";
      setError(msg);
    }
  }, [router, queryClient]);

  return (
    <div className="w-full max-w-md rounded-2xl border p-8 flex flex-col items-center space-y-6 bg-card shadow-lg">
      <Image src={'https://albana-grosir.my.id/images/logo/albana-clodi-logo.svg'} width={90} height={90} alt="logo" style={{ width: "90px", height: "90px", objectFit: "contain" }} priority />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Selamat Datang</h1>
        <p className="text-sm text-muted-foreground mt-1">Masuk ke akun Anda</p>
      </div>
      {error && (
        <div className="w-full p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
          {error}
        </div>
      )}
      <form
        className="w-full flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField<LoginFormValues>
          label="Email"
          name="email"
          type="email"
          register={register}
          placeholder="Masukkan email"
          error={errors.email?.message}
        />
        <FormField<LoginFormValues>
          label="Password"
          name="password"
          type="password"
          register={register}
          placeholder="Masukkan password"
          error={errors.password?.message}
        />

        <p className="text-sm text-muted-foreground text-center">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>

        <Button
          variant="gradient"
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
        >
          Login
        </Button>
      </form>
    </div>
  );
});

const RegisterForm = memo(function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "staff" },
  });

  const onSubmit = useCallback(() => { }, []);

  return (
    <div className="w-full max-w-md rounded-2xl border p-8 flex flex-col items-center space-y-6 bg-card shadow-lg">
      <Image src={'https://albana-grosir.my.id/images/logo/albana-clodi-logo.svg'} width={90} height={90} alt="logo" style={{ width: "90px", height: "90px", objectFit: "contain" }} priority />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daftar untuk mulai menggunakan aplikasi
        </p>
      </div>
      <form
        className="w-full flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField<RegisterFormValues>
          label="Nama"
          name="name"
          register={register}
          placeholder="Masukkan nama"
          error={errors.name?.message}
        />
        <FormField<RegisterFormValues>
          label="Email"
          name="email"
          type="email"
          register={register}
          placeholder="Masukkan email"
          error={errors.email?.message}
        />
        <FormField<RegisterFormValues>
          label="Password"
          name="password"
          type="password"
          register={register}
          placeholder="Masukkan password"
          error={errors.password?.message}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">
            Role <span className="text-destructive">*</span>
          </label>
          <select
            {...register("role")}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            {/* <option value="staff">Staff</option> */}
          </select>
          {errors.role && (
            <span className="text-xs text-destructive">
              {errors.role.message}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
          >
            Masuk sekarang
          </Link>
        </p>

        <Button
          variant="gradient"
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
          disabled
        >
          Fitur Belum Tersedia
        </Button>
      </form>
    </div>
  );
});

export default AuthForm;
