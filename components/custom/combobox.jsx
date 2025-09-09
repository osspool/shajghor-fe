// components/ui/combobox.jsx
"use client";
import { useState } from "react";
import { Check } from "lucide-react";
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

const Combobox = ({
  options = [],
  value,
  onValueChange,
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
    onValueChange(selectedValue);
    setOpen(false);
  };

  const selectedItem = options.find((item) => item[valueKey] === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {value ? selectedItem?.[displayKey] : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
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
                  {value === option[valueKey] && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;