// components/form-utils/date-input.jsx
"use client";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import BaseFormField from "./base-form-field";

const DateInput = ({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date",
  required,
  disabled,
  className,
  labelClassName,
  inputClassName,
  minDate,
  maxDate,
  onValueChange,
  // For direct usage without form
  value: propValue,
  onChange: propOnChange,
  Icon = CalendarIcon,
  allowClear = false,
}) => {
  const toDate = (val) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [y, m, d] = val.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      return isNaN(dt.getTime()) ? undefined : dt;
    }
    const dt = new Date(val);
    return isNaN(dt.getTime()) ? undefined : dt;
  };

  const isDateDisabled = (date) => {
    if (!date) return false;
    if (minDate && date < toDate(minDate)) return true;
    if (maxDate && date > toDate(maxDate)) return true;
    return false;
  };

  const renderDateInput = ({ field, disabled: isDisabled }) => {
    const value = field ? field.value : propValue;
    const selected = toDate(value);
    const [open, setOpen] = useState(false);

    const handleSelect = (date) => {
      if (!date) return;
      if (field) field.onChange(date);
      else if (propOnChange) propOnChange(date);
      onValueChange?.(date);
      setOpen(false);
    };

    const handleClear = (e) => {
      e?.stopPropagation?.();
      if (field) field.onChange(undefined);
      else if (propOnChange) propOnChange(undefined);
      onValueChange?.(undefined);
      setOpen(false);
    };

    const display = useMemo(() => (selected ? selected.toLocaleDateString("en-GB") : placeholder), [selected, placeholder]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button
              type="button"
              variant={selected ? "outline" : "secondary"}
              className={cn("w-full justify-start", inputClassName, selected && allowClear && "pr-8")}
              disabled={isDisabled}
            >
              <Icon className="h-4 w-4 mr-2" />
              {display}
            </Button>
            {allowClear && selected && !isDisabled && (
              <Button type="button" variant="ghost" className="absolute right-0 top-0 h-full px-2" onClick={handleClear}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">Clear date</span>
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
      {renderDateInput}
    </BaseFormField>
  );
};

export default DateInput;