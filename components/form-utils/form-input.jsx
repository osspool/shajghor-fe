// components/form-utils/form-input.jsx
"use client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import BaseFormField from "./base-form-field";

const FormInput = ({
  control,
  name,
  label,
  placeholder,
  description,
  required,
  disabled,
  type = "text",
  className,
  labelClassName,
  inputClassName,
  IconLeft,
  IconRight,
  onValueChange,
  transform,
  // For direct usage without form
  value,
  onChange,
  ...props
}) => {
  const handleChange = (e, field) => {
    const newValue = transform?.output 
      ? transform.output(e.target.value) 
      : e.target.value;
    
    if (field) {
      field.onChange(newValue);
    } else if (onChange) {
      onChange(newValue);
    }
    
    onValueChange?.(newValue);
  };

  return (
    <BaseFormField
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      disabled={disabled}
      className={className}
      labelClassName={labelClassName}
      IconLeft={IconLeft}
      IconRight={IconRight}
      value={value}
      onChange={onChange}
    >
      {({ field, disabled: isDisabled }) => {
        const rawValue = field
          ? (transform?.input ? transform.input(field.value) : field.value)
          : (transform?.input ? transform.input(value) : value);
        const safeValue = rawValue ?? "";
        return (
          <Input
            {...(field || {})}
            type={type}
            disabled={isDisabled}
            placeholder={placeholder}
            className={cn(
              IconLeft && "pl-9",
              IconRight && "pr-9",
              inputClassName
            )}
            onChange={(e) => handleChange(e, field)}
            value={safeValue}
            {...props}
          />
        );
      }}
    </BaseFormField>
  );
};

export default FormInput;