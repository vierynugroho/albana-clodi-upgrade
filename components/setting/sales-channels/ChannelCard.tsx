import { Badge, Card, CardContent, IconButton } from "@/components/ui";
import { SalesChannel } from "@/types";
import { CheckCircle, Edit, Eye, Globe, Instagram, MessageCircle, ShoppingBag, Store, Trash2, XCircle } from "lucide-react";
import { memo } from "react";

interface ChannelCardProps {
  channel: SalesChannel;
  index: number;
  onView: (channel: SalesChannel) => void;
  onEdit: (channel: SalesChannel) => void;
  onDelete: (channelId: string) => void;
}

const channelColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  shopee: {
    bg: "bg-orange/10",
    text: "text-orange",
    border: "border-l-orange",
  },
  tokopedia: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-l-success",
  },
  whatsapp: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-l-success",
  },
  instagram: { bg: "bg-pink/10", text: "text-pink", border: "border-l-pink" },
  lazada: { bg: "bg-info/10", text: "text-info", border: "border-l-info" },
  website: {
    bg: "bg-purple/10",
    text: "text-purple",
    border: "border-l-purple",
  },
  default: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-l-primary",
  },
};

const getChannelColor = (name: string) => {
  const lower = name.toLowerCase();
  for (const key of Object.keys(channelColors)) {
    if (lower.includes(key)) return channelColors[key];
  }
  return channelColors.default;
};

export const ChannelCard = memo(function ChannelCard({
  channel,
  index,
  onView,
  onEdit,
  onDelete,
}: ChannelCardProps) {
  const colorScheme = getChannelColor(channel.name);

  const renderIcon = () => {
    const lower = channel.name.toLowerCase();
    const iconClass = `h-6 w-6 ${colorScheme.text}`;

    if (
      lower.includes("shopee") ||
      lower.includes("tokopedia") ||
      lower.includes("lazada")
    ) {
      return <ShoppingBag className={iconClass} />;
    }
    if (lower.includes("whatsapp"))
      return <MessageCircle className={iconClass} />;
    if (lower.includes("instagram")) return <Instagram className={iconClass} />;
    if (lower.includes("website")) return <Globe className={iconClass} />;
    return <Store className={iconClass} />;
  };

  return (
    <Card
      className={`border-l-4 ${colorScheme.border} animate-fade-in card-hover`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-xl ${colorScheme.bg} flex items-center justify-center`}
            >
              {renderIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{channel.name}</p>
                {channel.status ? (
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
              <p className="text-sm text-muted-foreground mt-1">
                {channel.description || "Tidak ada deskripsi"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <IconButton color="info" size="sm" onClick={() => onView(channel)}>
              <Eye className="h-4 w-4" />
            </IconButton>
            <IconButton
              color="warning"
              size="sm"
              onClick={() => onEdit(channel)}
            >
              <Edit className="h-4 w-4" />
            </IconButton>
            <IconButton
              color="destructive"
              size="sm"
              onClick={() => onDelete(channel.id)}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});