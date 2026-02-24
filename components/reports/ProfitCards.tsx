import { memo } from "react";
import { Card, CardContent } from "../ui";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProfitCardsProps {
  penjualanKotor: number;
  penjualanBersih: number;
  labaKotor: number;
  labaBersih: number;
  isLoading: boolean;
}

export const ProfitCards = memo(function ProfitCards({
  penjualanKotor,
  penjualanBersih,
  labaKotor,
  labaBersih,
  isLoading,
}: ProfitCardsProps) {
  const items = [
    { label: "Penjualan Kotor", value: penjualanKotor, color: "blue" },
    { label: "Penjualan Bersih", value: penjualanBersih, color: "teal" },
    { label: "Laba Kotor", value: labaKotor, color: "green" },
    { label: "Laba Bersih", value: labaBersih, color: "primary" },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="card-hover">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-xl font-bold mt-1">{formatCurrency(item.value)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
