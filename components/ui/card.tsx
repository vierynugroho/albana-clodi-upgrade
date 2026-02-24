import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "ghost" | "elevated" | "gradient";
  hover?: boolean;
  accent?:
    | "none"
    | "primary"
    | "success"
    | "warning"
    | "info"
    | "pink"
    | "purple"
    | "orange"
    | "cyan"
    | "teal";
}

const cardVariants: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "border bg-card shadow-sm",
  outline: "border-2 bg-transparent",
  ghost: "border-0 bg-transparent",
  elevated: "border bg-card shadow-md",
  gradient: "border bg-gradient-to-br from-card to-muted/30 shadow-sm",
};

const accentStyles: Record<NonNullable<CardProps["accent"]>, string> = {
  none: "",
  primary: "border-l-4 border-l-primary",
  success: "border-l-4 border-l-success",
  warning: "border-l-4 border-l-warning",
  info: "border-l-4 border-l-info",
  pink: "border-l-4 border-l-pink",
  purple: "border-l-4 border-l-purple",
  orange: "border-l-4 border-l-orange",
  cyan: "border-l-4 border-l-cyan",
  teal: "border-l-4 border-l-teal",
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      hover = false,
      accent = "none",
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl text-card-foreground transition-all duration-200",
        cardVariants[variant],
        accentStyles[accent],
        hover && "cursor-pointer hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export type StatCardColor =
  | "blue"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "cyan"
  | "teal"
  | "default";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: string; isPositive: boolean };
  color?: StatCardColor;
  className?: string;
}

const iconColorStyles: Record<StatCardColor, string> = {
  blue: "bg-info/10 text-info",
  green: "bg-success/10 text-success",
  orange: "bg-orange/10 text-orange",
  pink: "bg-pink/10 text-pink",
  purple: "bg-purple/10 text-purple",
  cyan: "bg-cyan/10 text-cyan",
  teal: "bg-teal/10 text-teal",
  default: "bg-primary/10 text-primary",
};

const statCardGradient: Record<StatCardColor, string> = {
  blue: "stat-card-blue",
  green: "stat-card-green",
  orange: "stat-card-orange",
  pink: "stat-card-pink",
  purple: "stat-card-purple",
  cyan: "stat-card-cyan",
  teal: "stat-card-cyan",
  default: "stat-card-blue",
};

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { title, value, description, icon, color = "default", className },
    ref
  ) => (
    <Card
      ref={ref}
      className={cn(
        "relative overflow-hidden stat-card card-hover",
        statCardGradient[color],
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center",
              iconColorStyles[color]
            )}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {/* {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  trend.isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )} */}
        <span className="text-xs text-muted-foreground">
          {description}
        </span>
      </CardContent>
    </Card>
  )
);
StatCard.displayName = "StatCard";

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  gradient?:
    | "primary"
    | "success"
    | "warning"
    | "info"
    | "pink"
    | "sunset"
    | "ocean"
    | "aurora";
}

const gradientStyles: Record<
  NonNullable<GradientCardProps["gradient"]>,
  string
> = {
  primary: "gradient-primary",
  success: "gradient-success",
  warning: "gradient-warning",
  info: "gradient-info",
  pink: "gradient-pink",
  sunset: "gradient-sunset",
  ocean: "gradient-ocean",
  aurora: "gradient-aurora",
};

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient = "primary", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-6 text-white shadow-lg",
        gradientStyles[gradient],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
GradientCard.displayName = "GradientCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  GradientCard,
};
