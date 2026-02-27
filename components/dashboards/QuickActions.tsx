import { BarChart3, Package, ShoppingCart, Users } from "lucide-react";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import Link from "next/link";

export const QuickActions = memo(function QuickActions() {
  const actions = [
    {
      icon: ShoppingCart,
      label: "Order Baru",
      color: "bg-info/10 text-info hover:bg-info/20",
      link: "/orders/add",
    },
    {
      icon: Package,
      label: "Produk Baru",
      color: "bg-success/10 text-success hover:bg-success/20",
      link: "/products/add",
    },
    {
      icon: Users,
      label: "Customer Baru",
      color: "bg-pink/10 text-pink hover:bg-pink/20",
      link: "/customers/add",
    },
    {
      icon: BarChart3,
      label: "Laporan",
      color: "bg-purple/10 text-purple hover:bg-purple/20",
      link: "/report",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.link}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all ${action.color}`}
              >
                <div className="h-10 w-10 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
