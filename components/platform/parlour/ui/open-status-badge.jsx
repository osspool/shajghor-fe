"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OpenStatusBadge({ isOpen, className = "" }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        isOpen
          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100"
          : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isOpen ? "bg-green-500" : "bg-red-500"
        )}
      />
      {isOpen ? "Open" : "Closed"}
    </Badge>
  );
}


