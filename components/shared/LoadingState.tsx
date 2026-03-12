import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn is available based on typical shadcn/ui setups

interface LoadingStateProps {
  message?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function LoadingState({
  message = "Memuat data...",
  className,
  iconClassName,
  textClassName,
}: LoadingStateProps) {
  return (
    <div className={cn("h-full flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("h-6 w-6 animate-spin text-primary", iconClassName)} />
      {message && <span className={cn("text-xs text-muted-foreground", textClassName)}>{message}</span>}
    </div>
  );
}
