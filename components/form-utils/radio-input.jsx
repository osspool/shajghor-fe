"use client";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import BaseFormField from "./base-form-field";
import { useState, useEffect } from "react";

const RadioInput = ({
  // BaseFormField props
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  labelClassName,
  
  // Radio specific props
  choices = [],
  value: propValue,
  onChange: propOnChange,
  onValueChange,
  radioGroupClassName,
  radioItemClassName,
  orientation = "horizontal", // horizontal | vertical
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
  const handleDirectValueChange = (newValue) => {
    setLocalValue(newValue);
    if (propOnChange) {
      propOnChange(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const renderRadioGroup = ({ field, disabled: isDisabled }) => {
    // Get value from either form field or direct props
    const value = field ? field.value : localValue;
    
    const handleValueChange = (newValue) => {
      if (field) {
        field.onChange(newValue);
      } else {
        handleDirectValueChange(newValue);
      }
      
      if (onValueChange) {
        onValueChange(newValue);
      }
    };
    
    return (
      <RadioGroup
        value={value}
        onValueChange={handleValueChange}
        className={cn(
          orientation === "horizontal" 
            ? "flex flex-row flex-wrap gap-4" 
            : "flex flex-col space-y-2",
          radioGroupClassName
        )}
      >
        {choices.map((choice) => (
          <div 
            key={choice.value}
            className={cn(
              "flex items-center space-x-2 space-y-0",
              radioItemClassName
            )}
          >
            <RadioGroupItem 
              id={`radio-${choice.value}`}
              value={choice.value} 
              disabled={isDisabled || choice.disabled}
            />
            <label 
              htmlFor={`radio-${choice.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {choice.label}
            </label>
          </div>
        ))}
      </RadioGroup>
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
      {renderRadioGroup}
    </BaseFormField>
  );
};

export default RadioInput;