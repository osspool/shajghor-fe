"use client"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import BaseFormField from "./base-form-field"

const SelectInput = ({
  control,
  items = [],
  name,
  label,
  placeholder = "Select option",
  allOption,
  description,
  required,
  disabled,
  className,
  labelClassName,
  triggerClassName,
  contentClassName,
  itemClassName,
  Icon,
  valueKey = "value",
  displayKey = "label",
  onValueChange,
  value: propValue,
  defaultOpen,
  position,
}) => {
  // Create a new array with the "All" option if provided
  const displayItems = allOption ? [allOption, ...items] : items
  
  // For direct usage without React Hook Form
  const [localValue, setLocalValue] = useState(propValue || "")
  
  // Update local value when prop value changes
  useEffect(() => {
    if (propValue !== undefined) {
      setLocalValue(propValue)
    }
  }, [propValue])
  
  // Handle direct value changes (without React Hook Form)
  const handleDirectValueChange = (newValue) => {
    setLocalValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  const renderSelect = ({ field }) => {
    // Use field value if React Hook Form is used, otherwise use local state
    const value = field ? field.value?.toString() : localValue?.toString()
    
    // Debug the value to ensure it's being set correctly
    // console.log(`SelectInput ${name} field value:`, value)
    // console.log(`SelectInput ${name} options:`, displayItems.map(i => i[valueKey]?.toString()))
    
    const handleChange = (newValue) => {
      if (field) {
        field.onChange(newValue)
      } else {
        setLocalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    return (
      <Select
        onValueChange={handleChange}
        value={(value || "").toString()}
        disabled={disabled}
        defaultOpen={defaultOpen}
      >
        <SelectTrigger className={cn("w-full", triggerClassName)}>
          {Icon && <Icon className="mr-2 h-4 w-4 text-primary" />}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName} position={position}>
          {displayItems.length === 0 ? (
            <div className="py-2 px-2 text-sm text-muted-foreground">No options available</div>
          ) : (
            displayItems.map((item, idx) => {
              const itemValue = item[valueKey]?.toString() || `item-${idx}`
              return (
                <SelectItem
                  key={itemValue}
                  value={itemValue}
                  className={cn("cursor-pointer", itemClassName)}
                  disabled={item.disabled}
                >
                  {item[displayKey]}
                </SelectItem>
              )
            })
          )}
        </SelectContent>
      </Select>
    )
  }

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
      {renderSelect}
    </BaseFormField>
  )
}

export default SelectInput

