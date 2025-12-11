// components/form-utils/compact-forms/compact-tag-choice.jsx
"use client";

import { useState, useRef, forwardRef } from "react";
import { X, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BaseFormField from "../base-form-field";

/**
 * CompactTagChoice
 * A compact, floating-label variant of tag-choice input built for dense forms.
 *
 * Supports react-hook-form via control/name, or direct usage via value/onChange.
 */
const CompactTagChoice = forwardRef(({
  // Form integration
  control,
  name,

  // Display
  label,
  description,
  placeholder = "Select options...",
  required,
  disabled,

  // Data
  choices = [], // [{ value, label }]
  maxSelections,

  // Styling
  className,
  containerClassName,
  labelClassName,
  inputClassName,

  // Direct usage
  value: propValue = [],
  onChange: propOnChange,
  onValueChange,
}, ref) => {
  if (control && name) {
    return (
      <BaseFormField
        control={control}
        name={name}
        label="" // floating label handled internally
        description={description}
        required={required}
        disabled={disabled}
        className={className}
      >
        {({ field, disabled: isDisabled, fieldState }) => (
          <CompactTagChoiceInternal
            ref={ref}
            label={label}
            placeholder={placeholder}
            disabled={isDisabled}
            error={fieldState?.error?.message}
            value={field.value || []}
            onChange={(vals) => {
              field.onChange(vals);
              onValueChange?.(vals);
            }}
            choices={choices}
            maxSelections={maxSelections}
            containerClassName={containerClassName}
            labelClassName={labelClassName}
            inputClassName={inputClassName}
          />
        )}
      </BaseFormField>
    );
  }

  return (
    <CompactTagChoiceInternal
      ref={ref}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      value={propValue}
      onChange={(vals) => {
        propOnChange?.(vals);
        onValueChange?.(vals);
      }}
      choices={choices}
      maxSelections={maxSelections}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
      inputClassName={inputClassName}
      className={className}
    />
  );
});

const CompactTagChoiceInternal = forwardRef(({
  label,
  placeholder,
  disabled,
  value = [],
  onChange,
  choices,
  maxSelections,
  error,
  className,
  containerClassName,
  labelClassName,
  inputClassName,
}, ref) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const availableChoices = choices.filter((c) => !value.includes(c.value));

  const addChoice = (choiceValue) => {
    if (value.includes(choiceValue)) return;
    if (maxSelections && value.length >= maxSelections) return;
    const updated = [...value, choiceValue];
    onChange?.(updated);
  };

  const removeChoice = (choiceValue) => {
    const updated = value.filter((v) => v !== choiceValue);
    onChange?.(updated);
  };

  return (
    <div className={cn("relative group", containerClassName)}>
      {label && (
        <Label
          className={cn(
            "absolute left-3 top-0 -translate-y-1/2 bg-background px-1",
            "text-xs text-muted-foreground z-10 transition-colors duration-200",
            "group-focus-within:text-primary",
            disabled && "opacity-50",
            error && "text-destructive",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}

      <div
        className={cn(
          "min-h-[2.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background focus-within:ring-1 focus-within:ring-primary/20",
          "hover:border-primary/50 transition-all duration-200",
          error && "border-destructive focus-within:ring-destructive/20",
          disabled && "opacity-50 cursor-not-allowed",
          inputClassName
        )}
        ref={ref}
      >
        <div className="flex flex-wrap gap-1 mb-2">
          {value.map((val) => {
            const choice = choices.find((c) => c.value === val);
            return (
              <Badge key={val} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                <span>{choice?.label ?? val}</span>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeChoice(val);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            );
          })}
        </div>

        {!disabled && availableChoices.length > 0 && (!maxSelections || value.length < maxSelections) && (
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                ref={triggerRef}
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                {value.length === 0 ? placeholder : "Add more..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" align="start">
              <div className="p-1">
                {availableChoices.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">No options available</div>
                ) : (
                  <div className="space-y-1">
                    {availableChoices.map((choice) => (
                      <div
                        key={choice.value}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addChoice(choice.value);
                        }}
                        className="flex items-center justify-between px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        <span>{choice.label}</span>
                        {value.includes(choice.value) && <Check className="h-4 w-4" />}
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t px-2 py-2 text-xs text-muted-foreground">Click to select • Click outside to close</div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {maxSelections && (
          <div className="text-xs text-muted-foreground mt-1">{value.length}/{maxSelections} selected</div>
        )}
      </div>
    </div>
  );
});

CompactTagChoice.displayName = "CompactTagChoice";
CompactTagChoiceInternal.displayName = "CompactTagChoiceInternal";

export default CompactTagChoice;


