"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X, MapPin, Scissors, Home, Star, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function CityFilter({ filters, onFilterChange, disabled = false }) {
  const selectedCities = filters?.city || [];
  const [open, setOpen] = useState(false);

  const BD_CITIES = [
    "Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Barishal",
    "Rangpur", "Mymensingh", "Comilla", "Gazipur", "Narayanganj", 
    "Jessore", "Bogra", "Dinajpur", "Kushtia", "Faridpur"
  ];

  const handleCityToggle = (city) => {
    const currentCities = selectedCities || [];
    const newCities = currentCities.includes(city)
      ? currentCities.filter(c => c !== city)
      : [...currentCities, city];
    
    onFilterChange?.("city", newCities);
  };

  const clearCities = () => {
    onFilterChange?.("city", []);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Cities in Bangladesh
        </Label>
        {selectedCities.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCities}
            disabled={disabled}
            className="h-auto p-1 text-xs text-muted-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-9"
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1">
              {selectedCities.length === 0 ? (
                <span className="text-muted-foreground">Select cities...</span>
              ) : selectedCities.length <= 2 ? (
                selectedCities.map(city => (
                  <Badge key={city} variant="secondary" className="text-xs">
                    {city}
                  </Badge>
                ))
              ) : (
                <>
                  <Badge variant="secondary" className="text-xs">
                    {selectedCities[0]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    +{selectedCities.length - 1} more
                  </Badge>
                </>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search cities..." />
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {BD_CITIES.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={() => handleCityToggle(city)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCities.includes(city) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCities.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {selectedCities.map(city => (
            <Badge key={city} variant="secondary" className="text-xs">
              {city}
              <button
                className="ml-1 hover:text-destructive"
                onClick={() => handleCityToggle(city)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function ServiceTypeFilter({ filters, onFilterChange, disabled = false }) {
  const selectedTypes = filters?.providerType || [];

  const serviceTypes = [
    { value: "salon", label: "Salon", icon: Scissors },
    { value: "artist", label: "Home Service Artist", icon: Home }
  ];

  const handleTypeToggle = (type) => {
    const currentTypes = selectedTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFilterChange?.("providerType", newTypes);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Service Type</Label>
      <div className="space-y-2">
        {serviceTypes.map(({ value, label, icon: Icon }) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              id={`service-${value}`}
              checked={selectedTypes.includes(value)}
              onCheckedChange={() => handleTypeToggle(value)}
              disabled={disabled}
            />
            <Label
              htmlFor={`service-${value}`}
              className="flex items-center gap-2 text-sm font-normal cursor-pointer"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LocationModeFilter({ filters, onFilterChange, disabled = false }) {
  const selectedModes = filters?.serviceLocationMode || [];

  const locationModes = [
    { value: "in-salon", label: "In Salon" },
    { value: "at-home", label: "At Home" },
    { value: "both", label: "Both Options" }
  ];

  const handleModeToggle = (mode) => {
    const currentModes = selectedModes || [];
    const newModes = currentModes.includes(mode)
      ? currentModes.filter(m => m !== mode)
      : [...currentModes, mode];
    
    onFilterChange?.("serviceLocationMode", newModes);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Service Location</Label>
      <div className="space-y-2">
        {locationModes.map(({ value, label }) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              id={`location-${value}`}
              checked={selectedModes.includes(value)}
              onCheckedChange={() => handleModeToggle(value)}
              disabled={disabled}
            />
            <Label
              htmlFor={`location-${value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpecialOffersFilter({ filters, onFilterChange, disabled = false }) {
  const isFeatured = !!filters?.isFeatured;
  const hasOffers = !!filters?.hasOffers;

  const handleFeaturedToggle = () => {
    onFilterChange?.("isFeatured", isFeatured ? "" : true);
  };

  const handleOffersToggle = () => {
    onFilterChange?.("hasOffers", hasOffers ? "" : true);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Special Filters</Label>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="featured-toggle"
            className="flex items-center gap-2 text-sm font-normal cursor-pointer"
          >
            <Star className="h-4 w-4" />
            Featured Only
          </Label>
          <Switch
            id="featured-toggle"
            checked={isFeatured}
            onCheckedChange={handleFeaturedToggle}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="offers-toggle"
            className="flex items-center gap-2 text-sm font-normal cursor-pointer"
          >
            <Tag className="h-4 w-4" />
            Has Offers
          </Label>
          <Switch
            id="offers-toggle"
            checked={hasOffers}
            onCheckedChange={handleOffersToggle}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

// Combined component for all filters
export function ParlourFilters({ filters, onFilterChange, disabled = false }) {
  return (
    <div className="space-y-6">
      <CityFilter 
        filters={filters} 
        onFilterChange={onFilterChange} 
        disabled={disabled}
      />
      <ServiceTypeFilter 
        filters={filters} 
        onFilterChange={onFilterChange} 
        disabled={disabled}
      />
      <LocationModeFilter 
        filters={filters} 
        onFilterChange={onFilterChange} 
        disabled={disabled}
      />
      <SpecialOffersFilter 
        filters={filters} 
        onFilterChange={onFilterChange} 
        disabled={disabled}
      />
    </div>
  );
}