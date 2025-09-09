"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SheetWrapper({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    side = "right",
    size = "default",
    className,
    headerClassName,
    contentClassName,
    footerClassName,
    innerClassName,
    hideHeader = false,
    hideTitle = false,
    hideDescription = false,
    disableContentPadding = false,
    ...props
}) {
    // Size variants for common use cases
    const sizeVariants = {
        sm: "sm:max-w-md",
        default: "w-full sm:max-w-md md:max-w-lg",
        lg: "w-full sm:max-w-md md:max-w-lg lg:max-w-4xl",
        xl: "w-full sm:max-w-4xl",
        full: "w-full sm:max-w-6xl lg:max-w-7xl",
        mobile: "w-[85%] max-w-sm",
        "mobile-nav": "w-[300px] sm:w-[350px]",
    };

    // Default overflow handling based on size
    const defaultOverflow = size === "lg" || size === "xl" || size === "full" ? "overflow-y-hidden" : "overflow-y-auto";

    return (
        <Sheet open={open} onOpenChange={onOpenChange} modal={true} {...props}>
            <SheetContent
                side={side}
                className={cn(
                    sizeVariants[size],
                    defaultOverflow,
                    size === "full" && "gap-0",
                    contentClassName,
                    className
                )}
            >
                {!hideHeader && (
                    <SheetHeader className={cn("border-b pb-4 px-4 pt-4", headerClassName)}>
                        <SheetTitle className={hideTitle ? "sr-only" : ""}>
                            {title || "Sheet"}
                        </SheetTitle>
                        <SheetDescription className={hideDescription ? "sr-only" : ""}>
                            {description || "Sheet content"}
                        </SheetDescription>
                    </SheetHeader>
                )}

                <div className={cn(
                    "flex-1",
                    !disableContentPadding && "p-4", 
                    !hideHeader && "overflow-y-auto",
                    innerClassName
                )}>
                    {children}
                </div>

                {footer && (
                    <SheetFooter className={cn("border-t pt-4 px-4 pb-4", footerClassName)}>
                        {footer}
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
} 