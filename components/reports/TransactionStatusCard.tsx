import { Clock, XCircle } from "lucide-react";
import { memo } from "react";
import { Card, CardContent } from "../ui";
import { LoadingState } from "../shared/LoadingState";
import { Skeleton } from "../ui/Skeleton";

interface TransactionStatusCardsProps {
  pending: number;
  installments: number;
  failed: number;
  isLoading: boolean;
}

export const TransactionStatusCards = memo(function TransactionStatusCards({
  pending,
  installments,
  failed,
  isLoading,
}: TransactionStatusCardsProps) {
  const items = [
    {
      label: "Transaksi Tertunda",
      value: pending,
      icon: Clock,
      color: "cyan",
    },
    {
      label: "Transaksi Cicilan",
      value: installments,
      icon: Clock,
      color: "purple",
    },
    {
      label: "Transaksi Dibatalkan",
      value: failed,
      icon: XCircle,
      color: "pink",
    },
  ];

  if (isLoading) {
    return <TransactionStatusCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      item.color === "cyan"
                        ? "bg-cyan/10"
                        : item.color === "purple"
                          ? "bg-purple/10"
                          : "bg-pink/10"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        item.color === "cyan"
                          ? "text-cyan"
                          : item.color === "purple"
                            ? "text-purple"
                            : "text-pink"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

const TransactionStatusCardsSkeleton = memo(
  function TransactionStatusCardsSkeleton() {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  },
);
