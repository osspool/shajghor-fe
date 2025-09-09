"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * RetroWindow - A reusable window-like container with retro styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The main content of the window
 * @param {string} props.title - Title text for the window header
 * @param {React.ReactNode} props.titleIcon - Optional icon to display in the title bar
 * @param {string} props.titleBarColor - Color class for the title bar (e.g. 'bg-retro-blue')
 * @param {boolean} props.showButtons - Whether to show the retro window buttons
 * @param {React.ReactNode} props.toolbar - Optional toolbar content
 * @param {React.ReactNode} props.footer - Optional footer/status bar content
 * @param {string} props.className - Additional classes for the main container
 * @param {string} props.contentClassName - Additional classes for the content area
 * @param {string} props.headerClassName - Additional classes for the header
 * @param {string} props.toolbarClassName - Additional classes for the toolbar
 * @param {string} props.footerClassName - Additional classes for the footer
 */
export function RetroWindow({
  children,
  title,
  titleIcon,
  titleBarColor = "bg-retro-primary",
  showButtons = true,
  toolbar,
  footer,
  className,
  contentClassName,
  headerClassName,
  toolbarClassName,
  footerClassName,
}) {
  return (
    <div 
      className={cn(
        "border-2 border-primary bg-background rounded-md overflow-hidden shadow-retro-black-md",
        className
      )}
    >
      {/* Window title bar */}
      <div 
        className={cn(
          `${titleBarColor} border-b-2 px-3 py-2 flex items-center justify-between`,
          headerClassName
        )}
      >
        <div className="text-sm font-bold">
          {titleIcon && <span className="mr-2">{titleIcon}</span>}
          {title}
        </div>
        {showButtons && (
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-retro-yellow border"></div>
            <div className="w-3 h-3 rounded-full bg-retro-red border"></div>
          </div>
        )}
      </div>

      {/* Optional toolbar */}
      {toolbar && (
        <div className={cn("px-4 py-2 bg-secondary border-b-2 flex items-center", toolbarClassName)}>
          {toolbar}
        </div>
      )}

      {/* Content area */}
      <div className={cn("p-4 sm:p-6 bg-background", contentClassName)}>
        {children}
      </div>

      {/* Optional status bar/footer */}
      {footer && (
        <div className={cn("px-3 py-1.5 bg-secondary border-t-2 flex justify-between items-center text-xs", footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
}

/**
 * RetroCard - A simpler card-like container with retro styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The main content of the card
 * @param {string} props.title - Title text for the card header
 * @param {React.ReactNode} props.titleIcon - Optional icon to display in the title bar
 * @param {string} props.titleBarColor - Color class for the title bar (e.g. 'bg-retro-yellow')
 * @param {boolean} props.showButtons - Whether to show the retro window buttons
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {string} props.className - Additional classes for the main container
 * @param {Array} props.items - Optional array of data items to render with itemRenderer
 * @param {Function} props.renderItem - Function to render each data item
 * @param {string} props.contentClassName - Additional classes for the content area
 */
export function RetroCard({
  children,
  title,
  titleIcon,
  titleBarColor = "bg-retro-yellow",
  showButtons = false,
  footer,
  className,
  items,
  renderItem,
  contentClassName,
}) {
  return (
    <div className={cn("retro-card-plain shadow-retro-black-sm bg-white dark:bg-black", className)}>
      {/* Header with title strip */}
      <div className={`${titleBarColor} border-b-2 border-black px-3 py-2 flex items-center justify-between`}>
        <h3 className="text-sm font-bold uppercase text-black">
          {title}
        </h3>
        {titleIcon && (
          <div className="text-black">{titleIcon}</div>
        )}
        {showButtons && (
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-retro-yellow border"></div>
            <div className="w-3 h-3 rounded-full bg-retro-red border"></div>
          </div>
        )}
      </div>
      
      <div className={cn("p-4 space-y-3 text-sm", contentClassName)}>
        {/* If there's data items, render using the renderItem function */}
        {items && renderItem && items.map((item, index) => (
          renderItem(item, index)
        ))}
        
        {/* Render children as normal if provided */}
        {children}
      </div>
      
      {footer && (
        <div className="border-t-2 border-black p-3">
          {footer}
        </div>
      )}
    </div>
  );
} 