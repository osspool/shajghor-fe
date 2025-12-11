// components/form-utils/compact-forms/compact-select.jsx
"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import BaseFormField from "../base-form-field";

/**
 * CompactSelect - A space-efficient select dropdown with floating label
 * 
 * Features:
 * - Floating label design
 * - Support for grouped items
 * - Form integration via control prop
 * - Direct usage without form
 * - Error state handling
 * - Custom placeholder
 * 
 * @example
 * // With react-hook-form
 * <CompactSelect
 *   control={control}
 *   name="status"
 *   label="Status"
 *   items={[
 *     { value: "active", label: "Active" },
 *     { value: "inactive", label: "Inactive" }
 *   ]}
 * />
 * 
 * // Direct usage
 * <CompactSelect
 *   label="Payment Method"
 *   value={method}
 *   onValueChange={setMethod}
 *   items={paymentMethods}
 * />
 */
const CompactSelect = forwardRef(({
  // Form integration props
  control,
  name,
  
  // Label and display props
  label,
  placeholder = "Select an option",
  description,
  required,
  disabled,
  
  // Data props
  items = [],
  
  // Styling props
  className,
  labelClassName,
  triggerClassName,
  containerClassName,
  
  // Event handlers
  onValueChange,
  
  // Direct usage props (without form)
  value,
  defaultValue,
  error,
  
  // Rest props passed to Select
  ...props
}, ref) => {
  // If using with form control, wrap with BaseFormField
  if (control && name) {
    return (
      <BaseFormField
        control={control}
        name={name}
        label=""  // We handle label internally
        description={description}
        required={required}
        disabled={disabled}
        className={containerClassName}
      >
        {({ field, fieldState, disabled: isDisabled }) => (
          <CompactSelectInternal
            ref={ref}
            label={label}
            placeholder={placeholder}
            disabled={isDisabled}
            className={className}
            triggerClassName={triggerClassName}
            labelClassName={labelClassName}
            items={items}
            error={fieldState?.error?.message}
            value={field.value}
            onValueChange={(val) => {
              field.onChange(val);
              onValueChange?.(val);
            }}
            {...props}
          />
        )}
      </BaseFormField>
    );
  }
  
  // Direct usage without form
  return (
    <CompactSelectInternal
      ref={ref}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      triggerClassName={triggerClassName}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
      items={items}
      error={error}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      {...props}
    />
  );
});

// Internal component that handles the actual rendering
const CompactSelectInternal = forwardRef(({
  label,
  placeholder,
  items,
  error,
  className,
  triggerClassName,
  labelClassName,
  containerClassName,
  disabled,
  value,
  defaultValue,
  onValueChange,
  ...props
}, ref) => {
  // Process items to handle groups
  const renderItems = () => {
    return items.map((item) => {
      // Handle grouped items
      if (item.group && Array.isArray(item.items)) {
        return (
          <div key={item.group}>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {item.group}
            </div>
            {item.items.map((subItem) => (
              <SelectItem 
                key={subItem.value} 
                value={subItem.value}
                disabled={subItem.disabled}
              >
                <div className="flex items-center gap-2">
                  {subItem.icon && <span className="text-muted-foreground">{subItem.icon}</span>}
                  <span>{subItem.label}</span>
                </div>
              </SelectItem>
            ))}
          </div>
        );
      }
      
      // Handle regular items
      return (
        <SelectItem 
          key={item.value} 
          value={item.value}
          disabled={item.disabled}
        >
          <div className="flex items-center gap-2">
            {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        </SelectItem>
      );
    });
  };
  
  return (
    <div className={cn("relative group", containerClassName)}>
      {label && (
        <Label 
          className={cn(
            "absolute left-3 top-0 -translate-y-1/2 bg-background px-1",
            "text-xs text-muted-foreground z-10",
            "transition-colors duration-200",
            "group-focus-within:text-primary",
            disabled && "opacity-50",
            error && "text-destructive",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        {...props}
      >
        <SelectTrigger 
          ref={ref}
          className={cn(
            "h-10 pt-2 transition-all duration-200",
            "border-input",
            "focus:border-primary focus:ring-1 focus:ring-primary/20",
            "hover:border-primary/50",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            disabled && "opacity-50 cursor-not-allowed",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {items.length === 0 ? (
            <div className="py-2 px-3 text-sm text-muted-foreground text-center">
              No options available
            </div>
          ) : (
            renderItems()
          )}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

CompactSelect.displayName = "CompactSelect";
CompactSelectInternal.displayName = "CompactSelectInternal";

export default CompactSelect;
