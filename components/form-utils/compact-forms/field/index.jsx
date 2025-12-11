"use client";
import React, { createContext, useContext, useId, useMemo, useState, useEffect, forwardRef, memo } from "react";
import { cn } from "@/lib/utils";

const FieldContext = createContext(null);

export const Root = memo(function FieldRoot({
  children,
  className,
  size = "sm",
  disabled = false,
  invalid = false,
}) {
  const id = useId();
  const [hasPrefix, setHasPrefix] = useState(false);
  const [hasSuffix, setHasSuffix] = useState(false);

  const value = useMemo(() => ({
    id,
    size,
    disabled,
    invalid,
    hasPrefix,
    hasSuffix,
    setHasPrefix,
    setHasSuffix
  }), [id, size, disabled, invalid, hasPrefix, hasSuffix]);

  return (
    <FieldContext.Provider value={value}>
      <div className={cn("relative group", className)}>
        {children}
      </div>
    </FieldContext.Provider>
  );
});

export const Label = memo(function FieldLabel({ children, className }) {
  const ctx = useContext(FieldContext);
  return (
    <label
      htmlFor={ctx?.id}
      className={cn(
        "absolute left-3 top-0 -translate-y-1/2 bg-background px-1",
        "text-xs text-muted-foreground z-10",
        "transition-colors duration-200",
        "group-focus-within:text-primary",
        ctx?.disabled && "opacity-50",
        ctx?.invalid && "text-destructive",
        className
      )}
    >
      {children}
    </label>
  );
});

export const Description = memo(function FieldDescription({ children, className }) {
  if (!children) return null;
  return (
    <p className={cn("text-[11px] text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
});

export const Error = memo(function FieldError({ children, className }) {
  if (!children) return null;
  return (
    <p className={cn("text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1", className)}>
      {children}
    </p>
  );
});

export const Prefix = memo(function FieldPrefix({ children, className }) {
  const ctx = useContext(FieldContext);
  useEffect(() => {
    ctx?.setHasPrefix?.(true);
    return () => ctx?.setHasPrefix?.(false);
  }, [ctx]);
  return (
    <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10", className)}>
      {typeof children === 'string' ? (
        <span className="text-xs">{children}</span>
      ) : children}
    </div>
  );
});

export const Suffix = memo(function FieldSuffix({ children, className }) {
  const ctx = useContext(FieldContext);
  useEffect(() => {
    ctx?.setHasSuffix?.(true);
    return () => ctx?.setHasSuffix?.(false);
  }, [ctx]);
  return (
    <div className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10", className)}>
      {typeof children === 'string' ? (
        <span className="text-xs">{children}</span>
      ) : children}
    </div>
  );
});

export const Control = forwardRef(function FieldControl({
  asChild = false,
  className,
  children,
  ...props
}, ref) {
  const ctx = useContext(FieldContext);
  const paddingClasses = cn(
    ctx?.hasPrefix && "pl-7",
    ctx?.hasSuffix && "pr-7"
  );

  if (asChild && children) {
    const child = React.Children.only(children);
    return React.cloneElement(child, {
      ref,
      id: ctx?.id,
      disabled: ctx?.disabled || child.props.disabled,
      'aria-invalid': ctx?.invalid || undefined,
      className: cn(child.props.className, paddingClasses, className),
      ...props
    });
  }

  return (
    <input
      ref={ref}
      id={ctx?.id}
      aria-invalid={ctx?.invalid || undefined}
      disabled={ctx?.disabled}
      className={cn(paddingClasses, className)}
      {...props}
    />
  );
});

export const Field = {
  Root,
  Label,
  Description,
  Error,
  Prefix,
  Suffix,
  Control
};

export default Field;


