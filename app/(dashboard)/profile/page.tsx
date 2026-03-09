"use client";

import { useCurrentUser } from "@/hooks/useAuth";
import UserProfileForm from "@/components/setting/user-profile/UserProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";

export default function ProfilePage() {
  const { data, isLoading, error, refetch } = useCurrentUser();
  const user = data?.responseObject;

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

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

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan pengaturan keamanan Anda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
