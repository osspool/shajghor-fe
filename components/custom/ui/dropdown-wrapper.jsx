"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function DropdownWrapper({
    trigger,
    children,
    align = "end",
    side = "bottom",
    sideOffset = 4,
    className,
    contentClassName,
    ...props
}) {
    return (
        <DropdownMenu {...props}>
            <DropdownMenuTrigger asChild>
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                side={side}
                sideOffset={sideOffset}
                className={cn("min-w-[160px]", contentClassName)}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Convenience component for action dropdowns (like the 3-dot menu)
export function ActionDropdown({
    items = [],
    triggerIcon: TriggerIcon = MoreHorizontal,
    triggerVariant = "ghost",
    triggerSize = "icon",
    triggerClassName,
    align = "end",
    contentClassName,
    ...props
}) {
    const trigger = (
        <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn("text-muted-foreground hover:text-primary", triggerClassName)}
        >
            <TriggerIcon size={16} />
        </Button>
    );

    return (
        <DropdownWrapper
            trigger={trigger}
            align={align}
            contentClassName={contentClassName}
            {...props}
        >
            {items.map((item, index) => {
                if (item.type === "separator") {
                    return <DropdownMenuSeparator key={`separator-${index}`} />;
                }
                
                if (item.type === "label") {
                    return (
                        <DropdownMenuLabel key={`label-${index}`} className={item.className}>
                            {item.label}
                        </DropdownMenuLabel>
                    );
                }

                if (item.type === "group") {
                    return (
                        <DropdownMenuGroup key={`group-${index}`}>
                            {item.items?.map((groupItem, groupIndex) => (
                                <DropdownMenuItem
                                    key={`group-item-${groupIndex}`}
                                    onClick={groupItem.onClick}
                                    disabled={groupItem.disabled}
                                    className={cn(
                                        groupItem.variant === "destructive" && "text-destructive focus:text-destructive",
                                        groupItem.className
                                    )}
                                >
                                    {groupItem.icon && (
                                        <groupItem.icon className="mr-2 h-4 w-4" />
                                    )}
                                    {groupItem.label}
                                    {groupItem.shortcut && (
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {groupItem.shortcut}
                                        </span>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    );
                }

                return (
                    <DropdownMenuItem
                        key={`item-${index}`}
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className={cn(
                            item.variant === "destructive" && "text-destructive focus:text-destructive",
                            item.className
                        )}
                    >
                        {item.icon && (
                            <item.icon className="mr-2 h-4 w-4" />
                        )}
                        {item.label}
                        {item.shortcut && (
                            <span className="ml-auto text-xs text-muted-foreground">
                                {item.shortcut}
                            </span>
                        )}
                    </DropdownMenuItem>
                );
            })}
        </DropdownWrapper>
    );
}

// Convenience component for select-style dropdowns
export function SelectDropdown({
    value,
    onValueChange,
    placeholder = "Select option...",
    options = [],
    triggerClassName,
    contentClassName,
    disabled = false,
    ...props
}) {
    const selectedOption = options.find(option => option.value === value);

    const trigger = (
        <Button
            variant="outline"
            disabled={disabled}
            className={cn(
                "w-full justify-between",
                !selectedOption && "text-muted-foreground",
                triggerClassName
            )}
        >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    );

    return (
        <DropdownWrapper
            trigger={trigger}
            align="start"
            contentClassName={cn("w-full min-w-[var(--radix-dropdown-menu-trigger-width)]", contentClassName)}
            {...props}
        >
            {options.map((option) => (
                <DropdownMenuItem
                    key={option.value}
                    onClick={() => onValueChange?.(option.value)}
                    className={cn(
                        "cursor-pointer",
                        value === option.value && "bg-accent"
                    )}
                >
                    {option.icon && (
                        <option.icon className="mr-2 h-4 w-4" />
                    )}
                    {option.label}
                </DropdownMenuItem>
            ))}
        </DropdownWrapper>
    );
}

// Convenience component for checkbox dropdowns (multi-select)
export function CheckboxDropdown({
    values = [],
    onValuesChange,
    placeholder = "Select options...",
    options = [],
    triggerClassName,
    contentClassName,
    disabled = false,
    showSelectedCount = true,
    ...props
}) {
    const selectedOptions = options.filter(option => values.includes(option.value));
    const displayText = selectedOptions.length > 0 
        ? showSelectedCount 
            ? `${selectedOptions.length} selected`
            : selectedOptions.map(opt => opt.label).join(", ")
        : placeholder;

    const trigger = (
        <Button
            variant="outline"
            disabled={disabled}
            className={cn(
                "w-full justify-between",
                selectedOptions.length === 0 && "text-muted-foreground",
                triggerClassName
            )}
        >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    );

    const handleCheckedChange = (optionValue, checked) => {
        if (checked) {
            onValuesChange?.([...values, optionValue]);
        } else {
            onValuesChange?.(values.filter(value => value !== optionValue));
        }
    };

    return (
        <DropdownWrapper
            trigger={trigger}
            align="start"
            contentClassName={cn("w-full min-w-[var(--radix-dropdown-menu-trigger-width)]", contentClassName)}
            {...props}
        >
            {options.map((option) => (
                <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={values.includes(option.value)}
                    onCheckedChange={(checked) => handleCheckedChange(option.value, checked)}
                >
                    {option.icon && (
                        <option.icon className="mr-2 h-4 w-4" />
                    )}
                    {option.label}
                </DropdownMenuCheckboxItem>
            ))}
        </DropdownWrapper>
    );
}

// Convenience component for radio dropdowns (single select with radio buttons)
export function RadioDropdown({
    value,
    onValueChange,
    placeholder = "Select option...",
    options = [],
    triggerClassName,
    contentClassName,
    disabled = false,
    ...props
}) {
    const selectedOption = options.find(option => option.value === value);

    const trigger = (
        <Button
            variant="outline"
            disabled={disabled}
            className={cn(
                "w-full justify-between",
                !selectedOption && "text-muted-foreground",
                triggerClassName
            )}
        >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    );

    return (
        <DropdownWrapper
            trigger={trigger}
            align="start"
            contentClassName={cn("w-full min-w-[var(--radix-dropdown-menu-trigger-width)]", contentClassName)}
            {...props}
        >
            <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
                {options.map((option) => (
                    <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                    >
                        {option.icon && (
                            <option.icon className="mr-2 h-4 w-4" />
                        )}
                        {option.label}
                    </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
        </DropdownWrapper>
    );
}

// Note: Individual dropdown components can be imported directly from "@/components/ui/dropdown-menu" 