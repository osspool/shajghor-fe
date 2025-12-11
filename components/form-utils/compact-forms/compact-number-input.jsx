// components/form-utils/compact-forms/compact-number-input.jsx
"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import BaseFormField from "../base-form-field";
import { Field } from "./field";

/**
 * CompactNumberInput - A space-efficient number input with optional increment/decrement buttons
 * 
 * Features:
 * - Floating label design
 * - Optional increment/decrement buttons
 * - Support for min/max/step values
 * - Currency prefix support
 * - Form integration via control prop
 * - Direct usage without form
 * 
 * @example
 * // With react-hook-form
 * <CompactNumberInput
 *   control={control}
 *   name="quantity"
 *   label="Quantity"
 *   min={1}
 *   max={100}
 *   showButtons
 * />
 * 
 * // Direct usage with currency
 * <CompactNumberInput
 *   label="Price"
 *   value={price}
 *   onChange={setPrice}
 *   prefix="$"
 *   min={0}
 *   step={0.01}
 * />
 */
const CompactNumberInput = forwardRef(({
  // Form integration props
  control,
  name,
  
  // Label and display props
  label,
  placeholder,
  description,
  required,
  disabled,
  
  // Number input configuration
  min = 0,
  max,
  step = 1,
  
  // Display options
  prefix,
  suffix,
  showButtons = false,
  buttonVariant = "ghost",
  
  // Styling props
  className,
  labelClassName,
  inputClassName,
  containerClassName,
  
  // Event handlers
  onValueChange,
  
  // Direct usage props (without form)
  value,
  defaultValue,
  onChange,
  error,
  
  // Rest props passed to input
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
          <CompactNumberInputInternal
            ref={ref}
            label={label}
            placeholder={placeholder}
            disabled={isDisabled}
            min={min}
            max={max}
            step={step}
            prefix={prefix}
            suffix={suffix}
            showButtons={showButtons}
            buttonVariant={buttonVariant}
            className={className}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
            error={fieldState?.error?.message}
            value={field.value ?? ""}
            onChange={(val) => {
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
    <CompactNumberInputInternal
      ref={ref}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      prefix={prefix}
      suffix={suffix}
      showButtons={showButtons}
      buttonVariant={buttonVariant}
      className={className}
      inputClassName={inputClassName}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
      error={error}
      value={value ?? ""}
      defaultValue={defaultValue}
      onChange={onChange}
      onValueChange={onValueChange}
      {...props}
    />
  );
});

// Internal component that handles the actual rendering
const CompactNumberInputInternal = forwardRef(({
  label,
  placeholder,
  min,
  max,
  step,
  prefix,
  suffix,
  showButtons,
  buttonVariant,
  error,
  className,
  inputClassName,
  labelClassName,
  containerClassName,
  disabled,
  value,
  defaultValue,
  onChange,
  onValueChange,
  ...props
}, ref) => {
  const handleIncrement = () => {
    const currentValue = Number(value) || 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      const finalValue = Number(newValue.toFixed(10)); // Handle floating point precision
      onChange?.(finalValue);
      onValueChange?.(finalValue);
    }
  };

  const handleDecrement = () => {
    const currentValue = Number(value) || 0;
    const newValue = currentValue - step;
    if (newValue >= min) {
      const finalValue = Number(newValue.toFixed(10)); // Handle floating point precision
      onChange?.(finalValue);
      onValueChange?.(finalValue);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    // Allow empty string for clearing
    if (val === '') {
      onChange?.('');
      onValueChange?.('');
      return;
    }
    
    const numVal = Number(val);
    if (!isNaN(numVal)) {
      // Check bounds
      if ((min !== undefined && numVal < min) || (max !== undefined && numVal > max)) {
        return; // Don't update if out of bounds
      }
      onChange?.(numVal);
      onValueChange?.(numVal);
    }
  };

  // Render with increment/decrement buttons
  if (showButtons) {
    return (
      <Field.Root className={containerClassName} disabled={disabled} invalid={!!error}>
        {label && <Field.Label className={labelClassName}>{label}</Field.Label>}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={buttonVariant}
            size="icon"
            className="h-10 w-10 rounded-r-none"
            onClick={handleDecrement}
            disabled={disabled || (Number(value) <= min)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
            {prefix && (
              <Field.Prefix>{typeof prefix === 'string' ? <span className="text-xs">{prefix}</span> : prefix}</Field.Prefix>
            )}
            <Field.Control asChild>
              <Input
                ref={ref}
                type="number"
                value={value}
                defaultValue={defaultValue}
                onChange={handleInputChange}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  "h-10 pt-2 text-center rounded-none",
                  "border-x-0 focus:z-10",
                  "focus:border-primary focus:ring-1 focus:ring-primary/20",
                  error && "border-destructive focus:border-destructive focus:ring-destructive/20",
                  disabled && "opacity-50 cursor-not-allowed",
                  inputClassName,
                  className
                )}
                {...props}
              />
            </Field.Control>
            {suffix && (
              <Field.Suffix>{typeof suffix === 'string' ? <span className="text-xs">{suffix}</span> : suffix}</Field.Suffix>
            )}
          </div>
          <Button
            type="button"
            variant={buttonVariant}
            size="icon"
            className="h-10 w-10 rounded-l-none"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && Number(value) >= max)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {error && <Field.Error>{error}</Field.Error>}
      </Field.Root>
    );
  }

  // Default: Clean input without buttons
  return (
    <Field.Root className={containerClassName} disabled={disabled} invalid={!!error}>
      {label && <Field.Label className={labelClassName}>{label}</Field.Label>}
      {prefix && (
        <Field.Prefix>
          {typeof prefix === 'string' ? <span className="text-xs">{prefix}</span> : prefix}
        </Field.Prefix>
      )}
      <Field.Control asChild>
        <Input
          ref={ref}
          type="number"
          value={value}
          defaultValue={defaultValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "h-10 pt-2 transition-all duration-200",
            "border-input",
            "focus:border-primary focus:ring-1 focus:ring-primary/20",
            "hover:border-primary/50",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            disabled && "opacity-50 cursor-not-allowed",
            inputClassName,
            className
          )}
          {...props}
        />
      </Field.Control>
      {suffix && (
        <Field.Suffix>
          {typeof suffix === 'string' ? <span className="text-xs">{suffix}</span> : suffix}
        </Field.Suffix>
      )}
      {error && <Field.Error>{error}</Field.Error>}
    </Field.Root>
  );
});

CompactNumberInput.displayName = "CompactNumberInput";
CompactNumberInputInternal.displayName = "CompactNumberInputInternal";

export default CompactNumberInput;
