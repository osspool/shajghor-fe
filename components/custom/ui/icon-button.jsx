"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IconButton({
  Icon,
  children,
  variant = "default", // default | success | danger | info | outline | secondary
  size = "default",
  fullWidth = false,
  className,
  iconClassName,
  ...props
}) {
  const variantClasses = {
    default: "",
    success: "bg-accent text-accent-foreground hover:bg-accent/90",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    info: "bg-sky-600 text-white hover:bg-sky-700",
    outline: "",
    secondary: "",
  };

  // Map to shadcn variant; custom color handled via className
  const buttonVariant = ["outline", "secondary"].includes(variant)
    ? variant
    : "default";

  return (
    <Button
      variant={buttonVariant}
      size={size}
      className={cn(fullWidth && "w-full", variantClasses[variant], className)}
      {...props}
   >
      {Icon && <Icon className={cn("h-4 w-4 mr-2", iconClassName)} />}
      {children}
    </Button>
  );
}


