"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";

interface EditPageWrapperProps<T> {
  title: string;
  fetchData: (id: string) => Promise<T | null>;
  FormComponent: React.ComponentType<{
    initialData?: T;
    isEditMode?: boolean;
    onSuccess?: () => void;
  }>;
  redirectPath: string;
  LoadingComponent?: React.ComponentType;
  NotFoundComponent?: React.ComponentType;
}

export function EditPageWrapper<T>({
  title,
  fetchData,
  FormComponent,
  redirectPath,
  LoadingComponent,
  NotFoundComponent,
}: EditPageWrapperProps<T>) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchData(id);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id, fetchData]);

  const handleSuccess = useCallback(() => {
    router.push(redirectPath);
  }, [router, redirectPath]);

  const handleBack = useCallback(() => {
    router.push(redirectPath);
  }, [router, redirectPath]);

  if (loading) {
    if (LoadingComponent) return <LoadingComponent />;
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <LoadingState 
            className="flex-col gap-4 h-auto" 
            iconClassName="h-10 w-10 text-primary" 
            textClassName="text-base"
          />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    if (NotFoundComponent) return <NotFoundComponent />;
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center min-h-100 gap-4">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Data Tidak Ditemukan</h2>
            <p className="text-muted-foreground mb-4">
              {error ||
                "Data yang Anda cari tidak tersedia atau telah dihapus."}
            </p>
          </div>
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="shrink-0 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Edit data dan simpan perubahan
          </p>
        </div>
      </div>
      <FormComponent
        initialData={data}
        isEditMode={true}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default EditPageWrapper;
