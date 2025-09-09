"use client";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import BaseFormField from "./base-form-field";
import { useState, useEffect } from "react";

const CheckboxInput = ({
  // BaseFormField props
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  labelClassName,
  
  // Checkbox specific props
  items = [],
  value: propValue,
  onChange: propOnChange,
  onValueChange,
  checkboxClassName,
  itemClassName,
}) => {
  // For direct usage without React Hook Form
  const [localValues, setLocalValues] = useState(propValue || []);
  
  // Update local value when prop value changes
  useEffect(() => {
    if (propValue !== undefined) {
      setLocalValues(propValue);
    }
  }, [propValue]);
  
  // Handle direct value changes (without React Hook Form)
  const handleDirectValueChange = (newValues) => {
    setLocalValues(newValues);
    if (propOnChange) {
      propOnChange(newValues);
    }
    if (onValueChange) {
      onValueChange(newValues);
    }
  };

  const renderCheckboxes = ({ field, disabled: isDisabled }) => {
    // Get values from either form field or direct props
    const values = field ? field.value || [] : localValues || [];
    
    const handleCheckedChange = (itemId, checked) => {
      const newValues = checked 
        ? [...values, itemId]
        : values.filter(value => value !== itemId);
        
      if (field) {
        field.onChange(newValues);
      } else {
        handleDirectValueChange(newValues);
      }
      
      if (onValueChange) {
        onValueChange(newValues);
      }
    };
    
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className={cn("flex items-center space-x-2", itemClassName)}>
            <Checkbox
              id={`checkbox-${item.id}`}
              className={checkboxClassName}
              checked={values.includes(item.id)}
              disabled={isDisabled || item.disabled}
              onCheckedChange={(checked) => handleCheckedChange(item.id, checked)}
            />
            <label 
              htmlFor={`checkbox-${item.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
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
      value={localValues}
      onChange={handleDirectValueChange}
    >
      {renderCheckboxes}
    </BaseFormField>
  );
};

export default CheckboxInput;
