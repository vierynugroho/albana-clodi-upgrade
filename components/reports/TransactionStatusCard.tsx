import { Clock, Loader2, XCircle } from "lucide-react";
import { memo } from "react";
import { Card, CardContent } from "../ui";

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
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-24 animate-pulse">
            <CardContent className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.color === "cyan"
                      ? "bg-cyan/10"
                      : item.color === "purple"
                        ? "bg-purple/10"
                        : "bg-pink/10"
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${item.color === "cyan"
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
