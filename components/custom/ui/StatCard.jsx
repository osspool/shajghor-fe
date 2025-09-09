"use client";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  caption,
  Icon,
  variant = "default",
  className,
  iconClassName,
}) {
  // Variant styles using design tokens so they adapt to light/dark
  const variantStyles = {
    default: {
      iconWrap: "bg-muted border border-border",
      icon: "text-muted-foreground",
    },
    success: {
      iconWrap: "bg-accent/15 border-accent",
      icon: "text-accent-foreground",
    },
    danger: {
      iconWrap: "bg-destructive/15 border-destructive",
      icon: "text-destructive",
    },
    info: {
      iconWrap: "bg-primary/15 border-primary",
      icon: "text-primary",
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <div className={cn("rounded-lg border bg-card p-3 flex items-center justify-between", className)}>
      <div>
        {title && <div className="text-xs text-muted-foreground">{title}</div>}
        <div className="text-lg font-semibold">{value}</div>
        {caption && <div className="text-xs text-muted-foreground">{caption}</div>}
      </div>
      {Icon && (
        <div className={cn("p-2 rounded-md", styles.iconWrap)}>
          <Icon className={cn("h-5 w-5", styles.icon, iconClassName)} />
        </div>
      )}
    </div>
  );
}


