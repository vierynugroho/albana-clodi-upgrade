import { Badge, Card, CardContent, IconButton } from "@/components/ui";
import { BankAccount } from "@/types";
import { Building2, CheckCircle, Edit, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface BankAccountCardProps {
  bank: BankAccount;
  index: number;
  onDelete: (id: string) => void;
}

const bankColors = [
  { bg: "bg-info/10", text: "text-info", border: "border-info/20" },
  { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
  { bg: "bg-orange/10", text: "text-orange", border: "border-orange/20" },
  { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
];

export const BankAccountCard = memo(function BankAccountCard({
  bank,
  index,
  onDelete,
}: BankAccountCardProps) {
  const colorScheme = bankColors[index % bankColors.length];

  return (
    <Card
      className={`border ${colorScheme.border} animate-fade-in`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-xl ${colorScheme.bg} flex items-center justify-center`}
          >
            <Building2 className={`h-6 w-6 ${colorScheme.text}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{bank.bankName}</p>
              {bank.status ? (
                <Badge variant="success" className="text-[10px]">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aktif
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  <XCircle className="h-3 w-3 mr-1" />
                  Nonaktif
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {bank.accountNumber} • {bank.accountName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link href={`/settings/payment-accounts/${bank.id}`}>
            <IconButton color="warning" size="sm">
              <Edit className="h-4 w-4" />
            </IconButton>
          </Link>
          <IconButton color="destructive" size="sm" onClick={() => onDelete(bank.id)}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
});