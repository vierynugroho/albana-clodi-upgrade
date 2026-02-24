import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info"
    | "pink"
    | "purple"
    | "orange"
    | "cyan"
    | "teal";
  size?: "default" | "sm" | "lg";
  dot?: boolean;
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-secondary",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  outline: "bg-transparent text-foreground border-border",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-info/10 text-info border-info/20",
  pink: "bg-pink/10 text-pink border-pink/20",
  purple: "bg-purple/10 text-purple border-purple/20",
  orange: "bg-orange/10 text-orange border-orange/20",
  cyan: "bg-cyan/10 text-cyan border-cyan/20",
  teal: "bg-teal/10 text-teal border-teal/20",
};

const dotColors: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary",
  secondary: "bg-secondary-foreground",
  destructive: "bg-destructive",
  outline: "bg-foreground",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  pink: "bg-pink",
  purple: "bg-purple",
  orange: "bg-orange",
  cyan: "bg-cyan",
  teal: "bg-teal",
};

const badgeSizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-2 py-0.5 text-[10px]",
  lg: "px-3 py-1 text-sm",
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      dot = false,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors duration-200",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse-subtle",
            dotColors[variant]
          )}
        />
      )}
      {children}
    </div>
  )
);
Badge.displayName = "Badge";

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "completed"
  | "cancelled"
  | "paid"
  | "unpaid"
  | "partial"
  | "processing"
  | "shipped"
  | "delivered";

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showDot?: boolean;
}

const statusConfig: Record<
  StatusType,
  { label: string; variant: BadgeProps["variant"] }
> = {
  active: { label: "Aktif", variant: "success" },
  inactive: { label: "Nonaktif", variant: "secondary" },
  pending: { label: "Pending", variant: "warning" },
  completed: { label: "Selesai", variant: "success" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
  paid: { label: "Lunas", variant: "success" },
  unpaid: { label: "Belum Bayar", variant: "outline" },
  partial: { label: "Sebagian", variant: "warning" },
  processing: { label: "Diproses", variant: "info" },
  shipped: { label: "Dikirim", variant: "cyan" },
  delivered: { label: "Terkirim", variant: "teal" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={className} dot={showDot}>
      {config.label}
    </Badge>
  );
};
StatusBadge.displayName = "StatusBadge";

export interface CountBadgeProps {
  count: number;
  max?: number;
  color?: BadgeProps["variant"];
  className?: string;
}

const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  color = "destructive",
  className,
}) => {
  if (count === 0) return null;
  const displayCount = count > max ? `${max}+` : count.toString();
  return (
    <Badge
      variant={color}
      size="sm"
      className={cn("min-w-[18px] h-[18px] p-0 justify-center", className)}
    >
      {displayCount}
    </Badge>
  );
};
CountBadge.displayName = "CountBadge";

export { Badge, badgeVariants, StatusBadge, CountBadge };
