// components/form-utils/compact-forms/compact-display.jsx
"use client";
import { cn } from "@/lib/utils";

/**
 * InfoDisplay - A compact read-only display component for showing key-value pairs
 * 
 * @example
 * <InfoDisplay label="Subtotal" value={150} prefix="$" />
 * <InfoDisplay label="Tax Rate" value={8.5} suffix="%" />
 */
export const InfoDisplay = ({ 
  label, 
  value, 
  prefix, 
  suffix, 
  className,
  labelClassName,
  valueClassName 
}) => {
  return (
    <div className={cn("flex items-center justify-between py-1", className)}>
      <span className={cn("text-xs text-muted-foreground", labelClassName)}>
        {label}
      </span>
      <span className={cn("text-sm font-medium", valueClassName)}>
        {prefix}{value}{suffix}
      </span>
    </div>
  );
};

/**
 * CompactItemCard - A compact card for displaying items with quantity controls
 * 
 * @example
 * <CompactItemCard
 *   title="Product Name"
 *   subtitle="Category"
 *   quantity={2}
 *   price={100}
 *   unitPrice={50}
 *   onQuantityChange={(qty) => updateQuantity(qty)}
 *   onRemove={() => removeItem()}
 * />
 */
export const CompactItemCard = ({ 
  title,
  subtitle,
  description,
  quantity,
  price,
  unitPrice,
  image,
  onQuantityChange,
  onRemove,
  showQuantityControls = true,
  className,
  actions
}) => {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border",
      "bg-card/50 hover:bg-card/70 transition-colors",
      className
    )}>
      {/* Image */}
      {image && (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
          {typeof image === 'string' ? (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            image
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        {(subtitle || description) && (
          <div className="flex items-center gap-2 mt-0.5">
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
            {subtitle && description && (
              <span className="text-xs text-muted-foreground">•</span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground truncate">
                {description}
              </span>
            )}
          </div>
        )}
        {unitPrice !== undefined && quantity !== undefined && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {formatCurrency(unitPrice)} × {quantity}
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {showQuantityControls && onQuantityChange && (
          <QuantityControl
            value={quantity}
            onChange={onQuantityChange}
            min={1}
            size="sm"
          />
        )}
        
        {price !== undefined && (
          <div className="text-sm font-semibold min-w-[60px] text-right">
            {formatCurrency(price)}
          </div>
        )}
        
        {/* Actions */}
        {actions || (onRemove && (
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * QuantityControl - Compact quantity input with increment/decrement buttons
 */
const QuantityControl = ({ 
  value = 1, 
  onChange, 
  min = 0, 
  max, 
  size = "md",
  className 
}) => {
  const handleIncrement = () => {
    if (max === undefined || value < max) {
      onChange?.(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange?.(value - 1);
    }
  };

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base"
  };

  const inputSizeClasses = {
    sm: "h-7 w-12 text-xs",
    md: "h-8 w-16 text-sm",
    lg: "h-10 w-20 text-base"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        className={cn(
          "rounded-l-md border border-r-0 hover:bg-accent transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size]
        )}
        onClick={handleDecrement}
        disabled={value <= min}
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value) || min;
          if (val >= min && (max === undefined || val <= max)) {
            onChange?.(val);
          }
        }}
        min={min}
        max={max}
        className={cn(
          "border-y text-center focus:outline-none focus:ring-1 focus:ring-primary/20",
          inputSizeClasses[size]
        )}
      />
      <button
        type="button"
        className={cn(
          "rounded-r-md border border-l-0 hover:bg-accent transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size]
        )}
        onClick={handleIncrement}
        disabled={max !== undefined && value >= max}
      >
        +
      </button>
    </div>
  );
};

/**
 * CompactSection - A section wrapper with optional icon and collapsible behavior
 */
export const CompactSection = ({ 
  title, 
  icon: Icon, 
  children, 
  className,
  badge,
  collapsible = false,
  defaultOpen = true,
  actions
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <div className={cn("bg-card rounded-lg border", className)}>
      {title && (
        <div 
          className={cn(
            "flex items-center justify-between px-4 py-3 border-b",
            collapsible && "cursor-pointer hover:bg-accent/50 transition-colors"
          )}
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <h3 className="text-sm font-medium">{title}</h3>
            {badge && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {collapsible && (
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                !isOpen && "-rotate-90"
              )} />
            )}
          </div>
        </div>
      )}
      {(!collapsible || isOpen) && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Helper function for currency formatting
const formatCurrency = (amount, currency = "৳") => {
  if (typeof amount === 'number') {
    return `${currency}${amount.toFixed(2)}`;
  }
  return `${currency}${amount}`;
};

// Import necessary icons
import * as React from "react";
import { X, ChevronDown } from "lucide-react";

// Export the QuantityControl component
export { QuantityControl };

export default {
  InfoDisplay,
  CompactItemCard,
  CompactSection,
  QuantityControl
};
