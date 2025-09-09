"use client";

import { Input } from "@/components/ui/input";
import { ParlourCard } from "@/components/custom/parlour/ParlourCard";
import { ParlourFilters } from "@/components/custom/parlour/ParlourFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useClientParlourSearch } from "@/hooks/filter/use-client-parlour-search";
import { useParlours } from "@/hooks/query/useParlours";
import { Search, SlidersHorizontal, MapPin, Scissors, X, Filter } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLocation } from "@/contexts/LocationContext";
import { useState } from "react";
import ListingHeader from "@/components/custom/common/ListingHeader";

export default function ParloursPage() {
  const { city: selectedCity } = useLocation();
  const search = useClientParlourSearch();
  
  // Get search params but add simple search query
  const baseParams = search.getSearchParams();
  const searchParams = {
    ...baseParams,
    ...(search.searchValue && { search: search.searchValue })
  };
  
  const { parlours, pagination, isLoading, error } = useParlours("", searchParams, {
    keepPreviousData: true,
    public: true
  });

  const filterComponents = [
    (props) => <ParlourFilters {...props} />
  ];

  return (
    <div className="">
      <ListingHeader
        className="pt-20 md:pt-24"
        title={selectedCity ? `Beauty Parlours in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}` : "Beauty Parlours in Bangladesh"}
        description={selectedCity ? `Discover and book appointments at the best beauty parlours in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}` : "Discover and book appointments at the best beauty parlours near you"}
        searchValue={search.searchValue}
        onSearchChange={search.setSearchValue}
        onSearch={search.handleSearch}
        onClear={search.clearSearch}
        isLoading={isLoading}
        hasActiveFilters={search.hasActiveFilters}
        hasActiveSearch={search.hasActiveSearch}
        resultsCount={!isLoading && parlours ? (pagination?.total || parlours.length) : undefined}
        FilterComponent={({ filters, onFilterChange, disabled }) => (
          <ParlourFilters filters={filters} onFilterChange={onFilterChange} disabled={disabled} />
        )}
        filters={search.filters}
        onFilterChange={search.updateFilter}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Active Filters Display */}
        {(search.hasActiveSearch || search.hasActiveFilters || selectedCity) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCity && (
                <Badge variant="default" className="gap-2">
                  <MapPin className="h-3 w-3" />
                  Near {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
                </Badge>
              )}
              
              {search.searchValue && (
                <Badge variant="secondary" className="gap-2">
                  <Search className="h-3 w-3" />
                  Search: "{search.searchValue}"
                </Badge>
              )}
              
              {search.getSelectedCities().map(city => (
                <Badge key={city} variant="secondary" className="gap-2">
                  <MapPin className="h-3 w-3" />
                  {city}
                </Badge>
              ))}
              
              {search.getSelectedServiceTypes().map(type => (
                <Badge key={type} variant="secondary" className="gap-2">
                  <Scissors className="h-3 w-3" />
                  {type === 'salon' ? 'Salon' : 'Home Service'}
                </Badge>
              ))}
              
              {search.isFeaturedOnly && (
                <Badge variant="secondary">Featured Only</Badge>
              )}
              
              {search.isOffersOnly && (
                <Badge variant="secondary">Has Offers</Badge>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {error ? (
          <ErrorState />
        ) : isLoading ? (
          <LoadingState />
        ) : parlours && parlours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parlours.map((parlour) => (
              <ParlourCard
                key={parlour._id || parlour.id}
                parlour={parlour}
                showBookButton={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            hasActiveFilters={search.hasActiveSearch || search.hasActiveFilters}
            onClearFilters={search.clearSearch}
          />
        )}

        {/* Load More / Pagination */}
        {parlours && parlours.length > 0 && pagination?.hasNextPage && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" disabled={isLoading}>
              Load More Parlours
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[16/9] w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <SlidersHorizontal className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Unable to Load Parlours</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        There was an error loading the parlours. Please try again later.
      </p>
      <Button onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
}

function EmptyState({ hasActiveFilters, onClearFilters }) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {hasActiveFilters ? "No Parlours Match Your Filters" : "No Parlours Found"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {hasActiveFilters 
          ? "Try adjusting your search criteria or clear some filters to see more results."
          : "We're working on adding more parlours to this area. Check back soon!"
        }
      </p>
      {hasActiveFilters && (
        <Button onClick={onClearFilters} variant="outline">
          Clear All Filters
        </Button>
      )}
    </div>
  );
}