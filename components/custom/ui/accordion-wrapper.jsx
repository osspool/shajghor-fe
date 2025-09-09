"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccordionWrapper({
    children,
    trigger,
    defaultOpen = false,
    className,
    triggerClassName,
    contentClassName,
    headerClassName,
    onOpenChange,
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        onOpenChange?.(newState);
    };

    return (
        <div className={cn("border rounded-lg overflow-hidden", className)}>
            {/* Header/Trigger Area */}
            <div
                className={cn(
                    "flex items-center justify-between w-full px-4 py-3 cursor-pointer transition-colors",
                    "hover:bg-secondary/5",
                    headerClassName
                )}
                onClick={toggleOpen}
            >
                {trigger}
                
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180",
                        triggerClassName
                    )}
                />
            </div>

            {/* Content Area */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-200 ease-in-out",
                    isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className={cn("border-t bg-background/50", contentClassName)}>
                    {children}
                </div>
            </div>
        </div>
    );
}

// Compound components for better structure
export function AccordionWrapperTrigger({ children, className }) {
    return (
        <div className={cn("flex items-center justify-between flex-1", className)}>
            {children}
        </div>
    );
}

export function AccordionWrapperContent({ children, className }) {
    return (
        <div className={cn("px-6 py-4", className)}>
            {children}
        </div>
    );
} 