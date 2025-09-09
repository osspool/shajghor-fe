// components/form-utils/form-textarea.jsx
"use client";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import BaseFormField from "./base-form-field";
import { useState, useEffect } from "react";

const FormTextarea = ({
  // BaseFormField props
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  labelClassName,
  
  // Textarea specific props
  placeholder,
  value: propValue,
  onChange: propOnChange,
  onValueChange,
  textareaClassName,
  rows = 3,
  ...props
}) => {
  // For direct usage without React Hook Form
  const [localValue, setLocalValue] = useState(propValue || "");
  
  // Update local value when prop value changes
  useEffect(() => {
    if (propValue !== undefined) {
      setLocalValue(propValue);
    }
  }, [propValue]);
  
  // Handle direct value changes (without React Hook Form)
  const handleDirectValueChange = (value) => {
    setLocalValue(value);
    if (propOnChange) {
      propOnChange(value);
    }
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const renderTextarea = ({ field, disabled: isDisabled }) => {
    // Get value from either form field or direct props
    const value = field ? field.value : localValue;
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      
      if (field) {
        field.onChange(e);
      } else {
        handleDirectValueChange(newValue);
      }
      
      if (onValueChange) {
        onValueChange(newValue);
      }
    };
    
    return (
      <Textarea
        {...(field ? { ...field, value: field.value } : {})}
        value={field ? field.value : value}
        placeholder={placeholder}
        disabled={isDisabled}
        className={cn(
          "overflow-auto resize-none",
          textareaClassName
        )}
        rows={rows}
        onChange={handleChange}
        {...props}
      />
    );
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
      value={localValue}
      onChange={handleDirectValueChange}
    >
      {renderTextarea}
    </BaseFormField>
  );
};

export default FormTextarea;