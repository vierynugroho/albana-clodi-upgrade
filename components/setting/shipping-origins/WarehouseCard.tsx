import { Badge, Card, CardContent, IconButton } from "@/components/ui";
import { Warehouse } from "@/types";
import { CheckCircle, Edit, Eye, MapPin, Navigation, Phone, Trash2, WarehouseIcon, XCircle } from "lucide-react";
import { memo } from "react";

interface WarehouseCardProps {
  warehouse: Warehouse;
  index: number;
  onView: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouseId: string) => void;
}

const cardColors = [
  { bg: "bg-teal/10", text: "text-teal", accent: "border-l-teal" },
  { bg: "bg-cyan/10", text: "text-cyan", accent: "border-l-cyan" },
  { bg: "bg-purple/10", text: "text-purple", accent: "border-l-purple" },
  { bg: "bg-pink/10", text: "text-pink", accent: "border-l-pink" },
];

export const WarehouseCard = memo(function WarehouseCard({
  warehouse,
  index,
  onView,
  onEdit,
  onDelete,
}: WarehouseCardProps) {
  const colorScheme = cardColors[index % cardColors.length];

  return (
    <Card
      className={`border-l-4 ${colorScheme.accent} animate-fade-in card-hover`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`h-12 w-12 rounded-xl ${colorScheme.bg} flex items-center justify-center shrink-0`}
            >
              <WarehouseIcon className={`h-6 w-6 ${colorScheme.text}`} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{warehouse.name}</p>
                {warehouse.status ? (
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

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Navigation className="h-3.5 w-3.5 text-info" />
                  <span>{warehouse.origin}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-success" />
                  <span>{warehouse.phone}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground flex items-start gap-1">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-pink shrink-0" />
                <span>{warehouse.address}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <IconButton
              color="info"
              size="sm"
              onClick={() => onView(warehouse)}
            >
              <Eye className="h-4 w-4" />
            </IconButton>
            <IconButton
              color="warning"
              size="sm"
              onClick={() => onEdit(warehouse)}
            >
              <Edit className="h-4 w-4" />
            </IconButton>
            <IconButton
              color="destructive"
              size="sm"
              onClick={() => onDelete(warehouse.id)}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});