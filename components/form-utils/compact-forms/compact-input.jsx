// components/form-utils/compact-forms/compact-input.jsx
"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "./field";
import BaseFormField from "../base-form-field";

/**
 * CompactInput - A space-efficient form input with floating label
 * 
 * Features:
 * - Floating label that moves to top border
 * - Support for prefix/suffix icons or text
 * - Form integration via control prop
 * - Direct usage without form via value/onChange
 * - Error state handling
 * 
 * @example
 * // With react-hook-form
 * <CompactInput
 *   control={control}
 *   name="email"
 *   label="Email"
 *   placeholder="Enter email"
 *   prefix={<Mail className="h-4 w-4" />}
 * />
 * 
 * // Direct usage
 * <CompactInput
 *   label="Phone"
 *   value={phone}
 *   onChange={(e) => setPhone(e.target.value)}
 *   prefix="+880"
 * />
 */
const CompactInput = forwardRef(({
  // Form integration props
  control,
  name,
  
  // Label and display props
  label,
  placeholder,
  description,
  required,
  disabled,
  
  // Input configuration
  type = "text",
  
  // Styling props
  className,
  labelClassName,
  inputClassName,
  containerClassName,
  
  // Prefix/Suffix
  prefix,
  suffix,
  
  // Event handlers
  onValueChange,
  transform,
  
  // Direct usage props (without form)
  value,
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
          <CompactInputInternal
            ref={ref}
            label={label}
            placeholder={placeholder}
            type={type}
            disabled={isDisabled}
            className={className}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
            prefix={prefix}
            suffix={suffix}
            error={fieldState?.error?.message}
            value={field.value}
            onChange={(e) => {
              const newValue = transform?.output 
                ? transform.output(e.target.value) 
                : e.target.value;
              
              field.onChange(newValue);
              onValueChange?.(newValue);
            }}
            {...props}
          />
        )}
      </BaseFormField>
    );
  }
  
  // Direct usage without form
  return (
    <CompactInputInternal
      ref={ref}
      label={label}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      className={className}
      inputClassName={inputClassName}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
      prefix={prefix}
      suffix={suffix}
      error={error}
      value={value}
      onChange={(e) => {
        const newValue = transform?.output 
          ? transform.output(e.target.value) 
          : e.target.value;
        
        onChange?.(e);
        onValueChange?.(newValue);
      }}
      {...props}
    />
  );
});

// Internal component that handles the actual rendering
const CompactInputInternal = forwardRef(({
  label,
  error,
  className,
  inputClassName,
  labelClassName,
  containerClassName,
  prefix,
  suffix,
  disabled,
  ...props
}, ref) => {
  return (
    <Field.Root className={containerClassName} disabled={disabled} invalid={!!error}>
      {label && (
        <Field.Label className={labelClassName}>{label}</Field.Label>
      )}
      {prefix && (
        <Field.Prefix>
          {typeof prefix === 'string' ? <span className="text-xs">{prefix}</span> : prefix}
        </Field.Prefix>
      )}
      <Field.Control asChild>
        <Input
          ref={ref}
          disabled={disabled}
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
      {error && (
        <Field.Error>{error}</Field.Error>
      )}
    </Field.Root>
  );
});

CompactInput.displayName = "CompactInput";
CompactInputInternal.displayName = "CompactInputInternal";

export default CompactInput;
