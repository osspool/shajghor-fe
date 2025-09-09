"use client";

import { Badge } from "@/components/ui/badge";
import { Scissors, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProviderTypeBadge({ type = "salon", className = "", variant = "default" }) {
  const isArtist = type === "artist";
  const Icon = isArtist ? Home : Scissors;
  const badgeVariant = variant === "hero" ? "secondary" : "outline";
  return (
    <Badge
      variant={badgeVariant}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        variant === "hero" && "bg-primary/80 text-primary-foreground border-white/10",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {isArtist ? "Artist" : "Salon"}
    </Badge>
  );
}


