"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DialogWrapper({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    trigger,
    size = "default",
    className,
    headerClassName,
    contentClassName,
    footerClassName,
    hideHeader = false,
    hideTitle = false,
    hideDescription = false,
    ...props
}) {
    // Size variants for common use cases
    const sizeVariants = {
        sm: "max-w-md",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-6xl",
        full: "max-w-[95vw] h-[95vh]",
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...props}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent
                className={cn(
                    sizeVariants[size],
                    contentClassName,
                    className
                )}
            >
                {!hideHeader && (
                    <DialogHeader className={cn("space-y-2", headerClassName)}>
                        <DialogTitle className={hideTitle ? "sr-only" : ""}>
                            {title || "Dialog"}
                        </DialogTitle>
                        <DialogDescription className={hideDescription ? "sr-only" : ""}>
                            {description || "Dialog content"}
                        </DialogDescription>
                    </DialogHeader>
                )}

                <div className="py-4">
                    {children}
                </div>

                {footer && (
                    <DialogFooter className={cn("gap-2", footerClassName)}>
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

// Convenience components for common patterns
export function ConfirmDialog({
    open,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "destructive",
    isLoading = false,
    ...props
}) {
    const { Button } = require("@/components/ui/button");
    
    const footer = (
        <>
            <Button
                variant="outline"
                onClick={onCancel || (() => onOpenChange(false))}
                disabled={isLoading}
            >
                {cancelText}
            </Button>
            <Button
                variant={variant}
                onClick={onConfirm}
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : confirmText}
            </Button>
        </>
    );

    return (
        <DialogWrapper
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            size="sm"
            footer={footer}
            {...props}
        />
    );
}

export function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    onSubmit,
    onCancel,
    submitText = "Save",
    cancelText = "Cancel",
    isLoading = false,
    submitDisabled = false,
    ...props
}) {
    const { Button } = require("@/components/ui/button");
    
    const footer = (
        <>
            <Button
                variant="outline"
                onClick={onCancel || (() => onOpenChange(false))}
                disabled={isLoading}
            >
                {cancelText}
            </Button>
            <Button
                onClick={onSubmit}
                disabled={isLoading || submitDisabled}
            >
                {isLoading ? "Loading..." : submitText}
            </Button>
        </>
    );

    return (
        <DialogWrapper
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            footer={footer}
            {...props}
        >
            {children}
        </DialogWrapper>
    );
} 