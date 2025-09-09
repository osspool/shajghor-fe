"use client";
import { cn } from "@/lib/utils";

/**
 * RetroEmpty - A reusable component for displaying empty state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - The icon to display
 * @param {string} props.message - The message to display
 * @param {string} props.iconBgColor - Background color for the icon container (default: 'bg-retro-yellow')
 * @param {string} props.className - Additional classes for the main container
 */
export function RetroEmpty({
  icon,
  message,
  iconBgColor = "bg-retro-yellow",
  className,
}) {
  return (
    <div className={cn("border-2 bg-background rounded-md p-5 shadow-retro-black-sm", className)}>
      <div className="flex flex-col items-center gap-3 py-4">
        <div className={cn(`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center border-2 shadow-retro-black-sm`)}>
          {icon}
        </div>
        <p className="text-center font-medium">
          {message}
        </p>
      </div>
    </div>
  );
} 