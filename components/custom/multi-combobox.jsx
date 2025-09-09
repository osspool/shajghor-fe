// components/custom/multi-combobox.jsx
"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const MultiCombobox = ({
  options = [],
  values = [],
  onValuesChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  disabled = false,
  displayKey = "name",
  valueKey = "_id",
  className,
  renderOption,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    if (values.includes(selectedValue)) {
      // Remove the value
      onValuesChange(values.filter((val) => val !== selectedValue));
    } else {
      // Add the value
      onValuesChange([...values, selectedValue]);
    }
  };

  const selectedItems = options.filter((option) =>
    values.includes(option[valueKey])
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedItems.map((item) => (
          <div
            key={item[valueKey]}
            className="flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
          >
            <span>{item[displayKey]}</span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleSelect(item[valueKey])}
              aria-label={`Remove ${item[displayKey]}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {values.length > 0 ? `${values.length} selected` : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[200px]">
              {options.map((option) => (
                <CommandItem
                  key={option[valueKey]}
                  value={option[displayKey]}
                  onSelect={() => handleSelect(option[valueKey])}
                  className="flex items-center justify-between py-3"
                >
                  {renderOption ? (
                    renderOption(option)
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-medium">{option[displayKey]}</span>
                    </div>
                  )}
                  {values.includes(option[valueKey]) && (
                    <Check className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiCombobox;
