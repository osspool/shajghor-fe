"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";

/**
 * DateRangeFilter Component
 * 
 * A component for selecting date ranges for filtering data
 * - Only applies filter when explicitly submitted
 * - Supports clearing filters
 * - Handles state internally
 * 
 * @param {Object} props
 * @param {Date} props.initialStartDate - Initial start date
 * @param {Date} props.initialEndDate - Initial end date
 * @param {Function} props.onFilter - Callback when filter is applied (receives startDate, endDate)
 * @param {Function} props.onClear - Callback when filter is cleared
 * @param {string} props.className - Additional classes for the container
 * @param {string} props.buttonClassName - Additional classes for trigger button
 * @param {string} props.label - Optional label for the filter
 * @param {boolean} props.compact - Use compact styling
 * @param {boolean} props.alignRight - Align popover to the right
 * @param {Date} props.minDate - Minimum selectable date
 * @param {Date} props.maxDate - Maximum selectable date
 */
export function DateRangeFilter({
  initialStartDate,
  initialEndDate,
  onFilter,
  onClear,
  className,
  buttonClassName,
  label = "Date Range",
  compact = false,
  alignRight = true,
  minDate,
  maxDate,
}) {
  // Internal state with single-calendar range selection (user applies explicitly)
  const [internalRange, setInternalRange] = useState({ from: initialStartDate || null, to: initialEndDate || null });
  // Applied state shown on the trigger button
  const [appliedRange, setAppliedRange] = useState({ from: initialStartDate || null, to: initialEndDate || null });
  
  // Popover open state
  const [isOpen, setIsOpen] = useState(false);

  // Update internal state when props change
  useEffect(() => {
    setInternalRange({ from: initialStartDate || null, to: initialEndDate || null });
    setAppliedRange({ from: initialStartDate || null, to: initialEndDate || null });
  }, [initialStartDate, initialEndDate]);

  // Handle applying the filter
  const handleApplyFilter = () => {
    setAppliedRange(internalRange);
    onFilter?.(internalRange.from || null, internalRange.to || null);
    setIsOpen(false);
  };

  // Handle clearing the filter
  const handleClearFilter = () => {
    setInternalRange({ from: null, to: null });
    setAppliedRange({ from: null, to: null });
    onClear?.();
    setIsOpen(false);
  };

  // Format the display text for the button
  const getDisplayText = () => {
    const from = appliedRange.from;
    const to = appliedRange.to;
    if (!from && !to) return compact ? "Date" : "Select date range";
    const formatStr = compact ? "MM/dd" : "MMM d, yyyy";
    if (from && to) return `${format(from, formatStr)} - ${format(to, formatStr)}`;
    if (from) return `From ${format(from, formatStr)}`;
    if (to) return `Until ${format(to, formatStr)}`;
  };

  return (
    <div className={cn("relative", className)}>
      {!compact && label && (
        <div className="text-sm font-medium mb-1.5">{label}</div>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal h-9",
              (appliedRange.from || appliedRange.to) && "text-foreground",
              buttonClassName
            )}
            onClick={() => setIsOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">{getDisplayText()}</span>
            {(appliedRange.from || appliedRange.to) && (
              <X 
                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFilter();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align={alignRight ? "end" : "start"}
          side="bottom"
        >
          <div className="p-3 space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Select Range</div>
              <Calendar
                mode="range"
                selected={internalRange}
                onSelect={(range) => setInternalRange(range || { from: null, to: null })}
                disabled={(date) => (minDate && date < minDate) || (maxDate && date > maxDate)}
                numberOfMonths={1}
                initialFocus
              />
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between pt-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilter}
              >
                Clear
              </Button>
              <Button 
                size="sm" 
                onClick={handleApplyFilter}
                disabled={!internalRange.from && !internalRange.to}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 