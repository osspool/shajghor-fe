"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function TabsWrapper({
    defaultValue,
    value,
    onValueChange,
    children,
    className,
    listClassName,
    contentClassName,
    variant = "default",
    orientation = "horizontal",
    ...props
}) {
    // Style variants for different use cases
    const variants = {
        default: "bg-secondary/10",
        primary: "bg-primary/5 border border-primary/20",
        secondary: "bg-secondary/20",
        outline: "border border-border bg-background",
        ghost: "bg-transparent",
    };

    const triggerVariants = {
        default: "data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
        primary: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        secondary: "data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
        outline: "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
        ghost: "data-[state=active]:bg-accent/50 data-[state=active]:text-accent-foreground",
    };

    return (
        <Tabs
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            orientation={orientation}
            className={cn("w-full", className)}
            {...props}
        >
            <TabsList 
                className={cn(
                    "grid w-full py-1 mb-6",
                    variants[variant],
                    listClassName
                )}
            >
                {children}
            </TabsList>
        </Tabs>
    );
}

export function TabTrigger({ value, children, className, variant = "default", ...props }) {
    const triggerVariants = {
        default: "data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
        primary: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        secondary: "data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
        outline: "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
        ghost: "data-[state=active]:bg-accent/50 data-[state=active]:text-accent-foreground",
    };

    return (
        <TabsTrigger
            value={value}
            className={cn(triggerVariants[variant], className)}
            {...props}
        >
            {children}
        </TabsTrigger>
    );
}

export function TabContent({ value, children, className, ...props }) {
    return (
        <TabsContent
            value={value}
            className={cn("space-y-4 mt-6", className)}
            {...props}
        >
            {children}
        </TabsContent>
    );
}

// Convenience component for dynamic tab layout
export function DynamicTabs({
    tabs,
    defaultValue,
    value,
    onValueChange,
    variant = "default",
    className,
    maxColumns, // Deprecated - keeping for backward compatibility
    ...props
}) {
    return (
        <Tabs
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            className={cn("w-full", className)}
            {...props}
        >
            <TabsList className={cn(
                "inline-flex min-h-10 h-auto items-center justify-start rounded-md p-1 mb-6 w-full overflow-x-auto",
                "bg-muted text-muted-foreground",
                variant === "default" && "bg-secondary/10",
                variant === "primary" && "bg-primary/5 border border-primary/20"
            )}>
                {tabs.map((tab) => (
                    <TabTrigger 
                        key={tab.value} 
                        value={tab.value} 
                        variant={variant}
                        className="flex-shrink-0 min-w-0 px-4 py-2 h-auto whitespace-normal text-center"
                    >
                        {tab.label}
                    </TabTrigger>
                ))}
            </TabsList>
            
            {tabs.map((tab) => (
                <TabContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabContent>
            ))}
        </Tabs>
    );
}

// Keep TwoColumnTabs for backward compatibility
export function TwoColumnTabs(props) {
    return <DynamicTabs {...props} maxColumns={2} />;
} 