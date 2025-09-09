"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export function QuantityControl({
  value,
  onChange,
  onAsyncChange,
  min = 0,
  max,
  disabled = false,
  size = "default",
  variant = "default",
  debounceMs = 500,
  className,
  inputClassName,
  buttonClassName,
  ...props
}) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, debounceMs);

  // Sync local state when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle debounced async updates
  useEffect(() => {
    if (onAsyncChange && debouncedValue !== value) {
      onAsyncChange(debouncedValue);
    }
  }, [debouncedValue, onAsyncChange, value]);

  const handleIncrement = useCallback((e) => {
    e?.stopPropagation();
    const newValue = localValue + 1;
    if (max === undefined || newValue <= max) {
      setLocalValue(newValue);
      // For immediate updates (non-async)
      if (onChange && !onAsyncChange) {
        onChange(newValue);
      }
    }
  }, [localValue, max, onChange, onAsyncChange]);

  const handleDecrement = useCallback((e) => {
    e?.stopPropagation();
    const newValue = localValue - 1;
    if (newValue >= min) {
      setLocalValue(newValue);
      // For immediate updates (non-async)
      if (onChange && !onAsyncChange) {
        onChange(newValue);
      }
    }
  }, [localValue, min, onChange, onAsyncChange]);

  const handleInputChange = useCallback((e) => {
    e?.stopPropagation();
    const inputValue = e.target.value;
    
    if (inputValue === "") {
      setLocalValue(min);
      if (onChange && !onAsyncChange) {
        onChange(min);
      }
      return;
    }

    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= min && (max === undefined || numValue <= max)) {
      setLocalValue(numValue);
      // For immediate updates (non-async)
      if (onChange && !onAsyncChange) {
        onChange(numValue);
      }
    }
  }, [min, max, onChange, onAsyncChange]);

  // Size variants
  const sizeClasses = {
    sm: {
      container: "h-7 w-24",
      button: "h-full aspect-square",
      input: "h-full text-xs",
      icon: "h-3 w-3"
    },
    default: {
      container: "h-8 w-32",
      button: "h-full aspect-square",
      input: "h-full text-sm",
      icon: "h-3 w-3"
    },
    lg: {
      container: "h-9 w-36",
      button: "h-full aspect-square",
      input: "h-full text-base",
      icon: "h-4 w-4"
    }
  };

  // Variant styles
  const variantClasses = {
    default: "rounded-md border border-input bg-background",
    outline: "rounded-md border-2 border-input bg-background",
    ghost: "rounded-md bg-transparent border border-border",
    compact: "rounded border border-input bg-background"
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  return (
    <div
      className={cn(
        "flex items-center",
        currentSize.container,
        currentVariant,
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          currentSize.button,
          "rounded-none border-none",
          buttonClassName
        )}
        onClick={handleDecrement}
        disabled={disabled || localValue <= min}
      >
        <Minus className={currentSize.icon} />
        <span className="sr-only">Decrease</span>
      </Button>
      
      <Input
        type="text"
        inputMode="numeric"
        min={min}
        max={max}
        value={localValue}
        onChange={handleInputChange}
        className={cn(
          currentSize.input,
          "border-none text-center focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent",
          inputClassName
        )}
        disabled={disabled}
      />
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          currentSize.button,
          "rounded-none border-none",
          buttonClassName
        )}
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && localValue >= max)}
      >
        <Plus className={currentSize.icon} />
        <span className="sr-only">Increase</span>
      </Button>
    </div>
  );
} 