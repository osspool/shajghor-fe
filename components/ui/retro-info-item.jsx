"use client";
import { cn } from "@/lib/utils";
import React from "react";

export function RetroInfoItem({
  icon,
  label,
  value,
  bgColor = "bg-retro-blue/20",
  borderColor = "border-retro-blue",
  iconColor = "text-retro-blue",
  className,
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(`w-8 h-8 ${bgColor} rounded-md border-2 ${borderColor} flex items-center justify-center`)}>
        {icon && React.cloneElement(icon, { className: cn(`h-4 w-4 ${iconColor}`, icon.props.className) })}
      </div>
      <div>
        <div className="text-retro-foreground/70">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
} 