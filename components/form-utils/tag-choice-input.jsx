"use client";
import { useState, useRef } from "react";
import { X, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BaseFormField from "./base-form-field";

const TagChoiceInput = ({
  control,
  name,
  label,
  description,
  placeholder = "Select options...",
  required,
  disabled,
  className,
  labelClassName,
  inputClassName,
  choices = [],
  maxSelections,
  // For direct usage without form
  value: propValue = [],
  onChange: propOnChange,
  onValueChange,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const handleAddChoice = (selectedValues, newChoice, field) => {
    if (selectedValues.includes(newChoice)) {
      return selectedValues;
    }
    
    // Check max selections limit
    if (maxSelections && selectedValues.length >= maxSelections) {
      return selectedValues;
    }
    
    const updatedValues = [...selectedValues, newChoice];
    
    if (field) {
      field.onChange(updatedValues);
    } else if (propOnChange) {
      propOnChange(updatedValues);
    }
    
    onValueChange?.(updatedValues);
    
    return updatedValues;
  };

  const handleRemoveChoice = (selectedValues, valueToRemove, field) => {
    const updatedValues = selectedValues.filter(value => value !== valueToRemove);
    
    if (field) {
      field.onChange(updatedValues);
    } else if (propOnChange) {
      propOnChange(updatedValues);
    }
    
    onValueChange?.(updatedValues);
    
    return updatedValues;
  };

  const renderTagChoiceInput = ({ field, disabled: isDisabled }) => {
    const selectedValues = field ? field.value || [] : propValue || [];
    const availableChoices = choices.filter(choice => !selectedValues.includes(choice.value));
    
    return (
      <div className={cn("min-h-[2.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", inputClassName)}>
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedValues.map((value) => {
            const choice = choices.find(c => c.value === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span>{choice?.label || value}</span>
                {!isDisabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveChoice(selectedValues, value, field);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            );
          })}
        </div>
        
        {!isDisabled && availableChoices.length > 0 && (!maxSelections || selectedValues.length < maxSelections) && (
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                ref={triggerRef}
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                disabled={isDisabled}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                {selectedValues.length === 0 ? placeholder : "Add more..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[200px] p-0" 
              align="start"
            >
              <div className="p-1">
                {availableChoices.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    No options available
                  </div>
                ) : (
                  <div className="space-y-1">
                    {availableChoices.map((choice) => (
                      <div
                        key={choice.value}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddChoice(selectedValues, choice.value, field);
                        }}
                        className="flex items-center justify-between px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        <span>{choice.label}</span>
                        {selectedValues.includes(choice.value) && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t px-2 py-2 text-xs text-muted-foreground">
                  Click to select • Click outside to close
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {maxSelections && (
          <div className="text-xs text-muted-foreground mt-1">
            {selectedValues.length}/{maxSelections} selected
          </div>
        )}
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
      value={propValue}
      onChange={propOnChange}
    >
      {renderTagChoiceInput}
    </BaseFormField>
  );
};

export default TagChoiceInput; 