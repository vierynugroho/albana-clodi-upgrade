import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "success"
    | "warning"
    | "info"
    | "gradient";
  size?: "default" | "sm" | "lg" | "icon" | "xs";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/95 hover:shadow-md hover:shadow-primary/25",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95",
  outline:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 active:bg-accent/80",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/90",
  ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
  link: "text-primary underline-offset-4 hover:underline",
  success:
    "bg-success text-success-foreground shadow-sm hover:bg-success/90 active:bg-success/95 hover:shadow-md hover:shadow-success/25",
  warning:
    "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 active:bg-warning/95 hover:shadow-md hover:shadow-warning/25",
  info: "bg-info text-info-foreground shadow-sm hover:bg-info/90 active:bg-info/95 hover:shadow-md hover:shadow-info/25",
  gradient:
    "gradient-primary text-white shadow-md hover:shadow-lg hover:shadow-primary/30 active:shadow-sm hover:-translate-y-0.5",
};

const buttonSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-6 text-base",
  xs: "h-7 px-2 text-xs",
  icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        isLoading && "cursor-wait",
        className
      )}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
);
Button.displayName = "Button";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?:
    | "primary"
    | "success"
    | "warning"
    | "info"
    | "pink"
    | "purple"
    | "orange"
    | "cyan"
    | "teal"
    | "destructive";
  size?: "sm" | "default" | "lg";
}

const iconButtonColors: Record<
  NonNullable<IconButtonProps["color"]>,
  string
> = {
  primary: "bg-primary/10 text-primary hover:bg-primary/20",
  success: "bg-success/10 text-success hover:bg-success/20",
  warning: "bg-warning/10 text-warning hover:bg-warning/20",
  info: "bg-info/10 text-info hover:bg-info/20",
  pink: "bg-pink/10 text-pink hover:bg-pink/20",
  purple: "bg-purple/10 text-purple hover:bg-purple/20",
  orange: "bg-orange/10 text-orange hover:bg-orange/20",
  cyan: "bg-cyan/10 text-cyan hover:bg-cyan/20",
  teal: "bg-teal/10 text-teal hover:bg-teal/20",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
};

const iconButtonSizes: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "h-8 w-8",
  default: "h-10 w-10",
  lg: "h-12 w-12",
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, color = "primary", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        iconButtonColors[color],
        iconButtonSizes[size],
        className
      )}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";

export { Button, buttonVariants, buttonSizes, IconButton };
