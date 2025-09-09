"use client";

import { Badge } from "@/components/ui/badge";
import { Home, Store } from "lucide-react";
import { cn } from "@/lib/utils";

// Accepts: "in-salon" | "at-home" | "both"
export default function LocationModeBadge({ mode, className = "" }) {
  if (!mode) return null;
  const normalized = String(mode).toLowerCase();
  const isSalon = normalized === "in-salon";
  const isHome = normalized === "at-home";
  const isBoth = normalized === "both";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        className
      )}
    >
      {isBoth ? (
        <>
          <Store className="h-3 w-3" />
          <Home className="h-3 w-3" />
          <span>Salon & Home</span>
        </>
      ) : isSalon ? (
        <>
          <Store className="h-3 w-3" />
          <span>In Salon</span>
        </>
      ) : (
        <>
          <Home className="h-3 w-3" />
          <span>At Home</span>
        </>
      )}
    </Badge>
  );
}


