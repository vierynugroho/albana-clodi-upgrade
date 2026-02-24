"use client";

import { useCurrentUser } from "@/hooks/useAuth";
import UserProfileForm from "@/components/setting/UserProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, User, Mail, Phone, Shield, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { data, isLoading, error, refetch } = useCurrentUser();
  const user = data?.responseObject;

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2">
        <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground">Memuat data…</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Gagal Memuat Profil</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Terjadi kesalahan saat memuat data profil. Silakan coba lagi.
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get user initials for avatar
  const initials = user?.fullname
    ? user.fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan pengaturan keamanan Anda
        </p>
      </div>

      {/* <Card className="overflow-hidden">
        <div className="h-24 gradient-primary" />
        <CardContent className="relative pb-6">
          <div className="absolute -top-12 left-6">
            <div className="h-24 w-24 rounded-2xl gradient-primary border-4 border-card flex items-center justify-center shadow-xl">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
          </div>

          <div className="pt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{user?.fullname || "User"}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>{user?.phoneNumber}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="px-3 py-1 text-xs font-medium rounded-full gradient-primary text-white capitalize">
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 space-y-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold capitalize">{user?.role || "-"}</p>
            <p className="text-xs text-muted-foreground">Role Akun</p>
          </div>
        </Card>
        <Card className="p-4 space-y-2">
          <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">Aktif</p>
            <p className="text-xs text-muted-foreground">Status Akun</p>
          </div>
        </Card>
      </div>

      {/* Profile Edit Form */}
      {user && (
        <UserProfileForm
          initialData={{
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
          }}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
