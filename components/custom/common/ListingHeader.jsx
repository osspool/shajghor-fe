"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ListingHeader({
  title,
  description,
  searchValue,
  onSearchChange,
  onSearch,
  onClear,
  isLoading,
  hasActiveFilters,
  hasActiveSearch,
  resultsCount,
  FilterComponent,
  filters,
  onFilterChange,
  className,
}) {
  return (
    <div
      className={cn(
        "border-b relative",
        "bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20",
        className
      )}
    >
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-lg">{description}</p>
            )}

            {typeof resultsCount === "number" && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{resultsCount} parlours found</span>
                {(hasActiveSearch || hasActiveFilters) && (
                  <>
                    <span>•</span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={onClear}
                      className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      Clear filters
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="w-full lg:w-auto lg:min-w-[500px] xl:min-w-[600px]">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search parlours by name, location, or services..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && onSearch?.()}
                  className="pl-10 h-12"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-1.5 h-12 px-4",
                      hasActiveFilters && "bg-primary/10 border-primary"
                    )}
                    disabled={isLoading}
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
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Filter Options</h4>
                      {(hasActiveFilters || hasActiveSearch) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onClear}
                          className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                          disabled={isLoading}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {FilterComponent && (
                        <FilterComponent
                          filters={filters}
                          onFilterChange={onFilterChange}
                          disabled={isLoading}
                        />
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" onClick={onSearch} className="flex-1 h-9" disabled={isLoading}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button size="sm" onClick={onSearch} disabled={isLoading} className="gap-1.5 h-12 px-4">
                <Search size={16} />
                Search
              </Button>

              {(hasActiveSearch || hasActiveFilters) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClear}
                  disabled={isLoading}
                  className="h-12 px-4"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


