"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable base search component that can be configured for different entities
 * Supports search types, filters, and consistent UI patterns
 */
export function BaseSearch({
  // Search configuration
  searchType,
  setSearchType,
  searchValue,
  setSearchValue,
  searchOptions = [],
  
  // Filter configuration
  filters = {},
  onFilterChange,
  filterComponents = [],
  
  // Actions
  onSearch,
  onClear,
  
  // Status
  hasActiveSearch = false,
  hasActiveFilters = false,
  
  // UI customization
  className = "",
  searchPlaceholder = "Search...",
  showFilterButton = true,
  disabled = false,
}) {
  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !disabled) {
      onSearch?.();
    }
  };

  // Generate placeholder text based on search type
  const getPlaceholder = () => {
    if (typeof searchPlaceholder === 'function') {
      return searchPlaceholder(searchType);
    }
    return searchPlaceholder;
  };

  return (
    <div className={cn("flex items-center gap-2 w-full lg:w-auto", className)}>
      {/* Search Type Selector */}
      {searchOptions.length > 0 && (
        <Select value={searchType} onValueChange={setSearchType} disabled={disabled}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {searchOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Search Input */}
      <div className="relative flex-1 lg:w-64">
        <Input
          placeholder={getPlaceholder()}
          value={searchValue}
          onChange={(e) => setSearchValue?.(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-8"
          disabled={disabled}
        />
        {searchValue && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
            onClick={() => setSearchValue?.("")}
            type="button"
            disabled={disabled}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Popover */}
      {showFilterButton && filterComponents.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-1.5",
                hasActiveFilters && "bg-primary/10 border-primary"
              )}
              disabled={disabled}
            >
              <Filter size={16} />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-6 p-1">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Filter Options</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                    disabled={disabled}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Filter Components */}
              <div className="space-y-4">
                {filterComponents.map((FilterComponent, index) => (
                  <div key={index}>
                    <FilterComponent 
                      filters={filters}
                      onFilterChange={onFilterChange}
                      disabled={disabled}
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  onClick={onSearch}
                  className="flex-1 h-9"
                  disabled={disabled}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Search Button */}
      <Button
        size="sm"
        onClick={onSearch}
        disabled={disabled || (!searchValue.trim() && !hasActiveFilters)}
        className="gap-1.5"
      >
        <Search size={16} />
        Search
      </Button>

      {/* Clear Button - Only show when there's an active search */}
      {hasActiveSearch && (
        <Button
          size="sm"
          variant="outline"
          onClick={onClear}
          disabled={disabled}
        >
          Clear
        </Button>
      )}
    </div>
  );
} 