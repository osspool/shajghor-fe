"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SimpleSearch({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  buttonText = "Search",
  className = "",
}) {
  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="pl-9 h-11 sm:h-12"
          />
        </div>
        <Button type="submit" className="h-11 sm:h-12">
          {buttonText}
        </Button>
      </div>
    </form>
  );
}


