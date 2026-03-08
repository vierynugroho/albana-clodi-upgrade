
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorStateProps {
  /** Deskripsi error, e.g. "Terjadi kesalahan saat memuat data customers" */
  message?: string;
  /** Callback untuk tombol "Coba lagi" */
  onRetry?: () => void;
  /** Callback untuk tombol "Kembali" (optional — hanya untuk detail/edit pages) */
  onBack?: () => void;
}

export function ErrorState({
  message = "Terjadi kesalahan saat memuat data",
  onRetry,
  onBack,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="text-center">
        <p className="font-semibold text-destructive">Gagal memuat data</p>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      <div className="flex gap-2">
        {onBack && (
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Coba lagi
          </Button>
        )}
      </div>
    </div>
  );
}
