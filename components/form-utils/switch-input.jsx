// components/form-utils/switch-input.jsx
"use client";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import BaseFormField from "./base-form-field";
import { useState, useEffect } from "react";

const SwitchInput = ({
  // BaseFormField props
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  labelClassName,
  
  // Switch specific props
  labelPosition = "right", // 'right' or 'top'
  value: propValue,
  onChange: propOnChange,
  onValueChange,
  switchClassName,
  Icon,
}) => {
  // For direct usage without React Hook Form
  const [localValue, setLocalValue] = useState(propValue || false);
  
  // Update local value when prop value changes
  useEffect(() => {
    if (propValue !== undefined) {
      setLocalValue(propValue);
    }
  }, [propValue]);
  
  // Handle direct value changes (without React Hook Form)
  const handleDirectValueChange = (newValue) => {
    setLocalValue(newValue);
    if (propOnChange) {
      propOnChange(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const renderSwitch = ({ field, disabled: isDisabled }) => {
    // Get value from either form field or direct props
    const value = field ? (field.value ?? false) : (localValue ?? false);
    
    const handleCheckedChange = (checked) => {
      if (field) {
        field.onChange(checked);
      } else {
        handleDirectValueChange(checked);
      }
      
      if (onValueChange) {
        onValueChange(checked);
      }
    };
    
    if (labelPosition === "right") {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value}
            onCheckedChange={handleCheckedChange}
            disabled={isDisabled}
            className={switchClassName}
          />
          {/* Label is rendered by BaseFormField when labelPosition is top */}
          {label && labelPosition === "right" && (
            <label className="text-sm font-normal cursor-pointer">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
      );
    }
    
    return (
      <Switch
        checked={value}
        onCheckedChange={handleCheckedChange}
        disabled={isDisabled}
        className={switchClassName}
      />
    );
  };

  // Only show label in BaseFormField if it's positioned at the top
  const showLabelInBaseField = labelPosition === "top";

  return (
    <BaseFormField
      control={control}
      name={name}
      label={showLabelInBaseField ? label : null}
      description={description}
      required={required}
      disabled={disabled}
      className={className}
      labelClassName={labelClassName}
      IconRight={Icon}
      value={localValue}
      onChange={handleDirectValueChange}
    >
      {renderSwitch}
    </BaseFormField>
  );
};

export default SwitchInput;