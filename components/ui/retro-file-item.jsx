"use client";
import { cn } from "@/lib/utils";

/**
 * RetroFileItem - A reusable component for displaying file information
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - The icon to display
 * @param {string} props.title - The title of the file
 * @param {string} props.description - Optional description of the file
 * @param {Array} props.badges - Array of badge objects with text and variant
 * @param {string} props.className - Additional classes for the main container
 */
export function RetroFileItem({
  icon,
  title,
  description,
  badges = [],
  className,
}) {
  return (
    <div className={cn("p-3 border-2 border-dashed border-retro-border rounded-md bg-background/50", className)}>
      <div className="flex items-start gap-3 text-sm">
        <div className="w-8 h-8 bg-retro-blue rounded-md border-2 border-black flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-bold">{title || "Untitled File"}</div>
          {description && (
            <div className="text-retro-foreground/70 text-xs mt-1">{description}</div>
          )}
          {badges.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {badges.map((badge, index) => (
                <span 
                  key={index} 
                  className={cn(
                    "retro-badge-bordered text-black",
                    {
                      "bg-retro-blue/20 border-retro-blue": badge.variant === "blue",
                      "bg-retro-green/20 border-retro-green": badge.variant === "green",
                      "bg-retro-yellow/20 border-retro-yellow": badge.variant === "yellow",
                      "bg-retro-red/20 border-retro-red": badge.variant === "red",
                      "bg-retro-orange/20 border-retro-orange": badge.variant === "orange",
                    }
                  )}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 