"use client";

import { useBaseSearch } from "./use-base-search";
import { useLocation } from "@/contexts/LocationContext";
import { useEffect } from "react";

const BD_CITIES = [
  "Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Barishal",
  "Rangpur", "Mymensingh", "Comilla", "Gazipur", "Narayanganj", 
  "Jessore", "Bogra", "Dinajpur", "Kushtia", "Faridpur", "Pabna",
  "Sirajganj", "Tangail", "Jamalpur", "Kishoreganj", "Manikganj",
  "Narsingdi", "Gopalganj", "Shariatpur", "Madaripur", "Munshiganj",
  "Rajbari", "Satkhira", "Meherpur", "Chuadanga", "Jhenaidah",
  "Magura", "Narail", "Bagerhat", "Pirojpur", "Jhalokathi",
  "Patuakhali", "Barguna", "Bhola", "Feni", "Lakshmipur",
  "Noakhali", "Brahmanbaria", "Chandpur", "Sherpur", "Netrakona"
];

const SERVICE_TYPES = [
  { value: "salon", label: "Salon" },
  { value: "artist", label: "Home Service Artist" }
];

/**
 * Client-side parlour search hook for customers with Bangladesh cities and service types
 */
export function useClientParlourSearch(basePath = "/parlours") {
  const { city: selectedCity } = useLocation();
  
  const config = {
    basePath,
    searchFields: {
      name: "name",
      address: "address",
    },
    filterFields: {
      city: {
        paramName: "address.city[in]",
        type: "array",
        defaultValue: [],
      },
      providerType: {
        paramName: "providerType[in]",
        type: "array", 
        defaultValue: [],
      },
      serviceLocationMode: {
        paramName: "serviceLocationMode[in]",
        type: "array",
        defaultValue: [],
      },
      isActive: {
        paramName: "isActive",
        type: "boolean",
        defaultValue: true,
      },
      isFeatured: {
        paramName: "isFeatured",
        type: "boolean",
        defaultValue: "",
      },
      hasOffers: {
        paramName: "hasOffers",
        type: "boolean", 
        defaultValue: "",
      }
    },
  };

  const searchHook = useBaseSearch(config);

  // Helper functions for parlour-specific filtering
  const getSelectedCities = () => searchHook.filters.city || [];
  const getSelectedServiceTypes = () => searchHook.filters.providerType || [];
  const getSelectedLocationModes = () => searchHook.filters.serviceLocationMode || [];

  const setCity = (cities) => {
    searchHook.updateFilter("city", Array.isArray(cities) ? cities : [cities]);
  };

  const setServiceType = (types) => {
    searchHook.updateFilter("providerType", Array.isArray(types) ? types : [types]);
  };

  const setLocationMode = (modes) => {
    searchHook.updateFilter("serviceLocationMode", Array.isArray(modes) ? modes : [modes]);
  };

  const toggleFeaturedOnly = () => {
    const current = searchHook.filters.isFeatured;
    searchHook.updateFilter("isFeatured", current ? "" : true);
  };

  const toggleOffersOnly = () => {
    const current = searchHook.filters.hasOffers;
    searchHook.updateFilter("hasOffers", current ? "" : true);
  };

  // Search options for the BaseSearch component
  const searchOptions = [
    { value: "name", label: "Name" },
    { value: "address", label: "Location" },
  ];

  // Generate placeholder text based on search type
  const getSearchPlaceholder = (searchType) => {
    switch (searchType) {
      case "name":
        return "Search parlours by name...";
      case "address":
        return "Search by area, city...";
      default:
        return "Search parlours...";
    }
  };

  // Get search params with location context
  const getLocationFilteredParams = () => {
    const params = searchHook.getSearchParams();
    
    // Add selected city to params if not already filtered by city
    if (selectedCity && !params['address.city[in]']) {
      const cityName = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);
      params['address.city[in]'] = cityName;
    }
    
    return params;
  };

  return {
    ...searchHook,
    
    // Override getSearchParams to include location context
    getSearchParams: getLocationFilteredParams,
    
    // Location context
    selectedCity,
    
    // Parlour-specific data
    cities: BD_CITIES,
    serviceTypes: SERVICE_TYPES,
    locationModes: [
      { value: "in-salon", label: "In Salon" },
      { value: "at-home", label: "At Home" },
      { value: "both", label: "Both" }
    ],
    
    // Parlour-specific getters
    getSelectedCities,
    getSelectedServiceTypes,
    getSelectedLocationModes,
    
    // Parlour-specific setters
    setCity,
    setServiceType,
    setLocationMode,
    toggleFeaturedOnly,
    toggleOffersOnly,
    
    // UI helpers
    searchOptions,
    getSearchPlaceholder,
    
    // Check if specific filters are active
    isFeaturedOnly: !!searchHook.filters.isFeatured,
    isOffersOnly: !!searchHook.filters.hasOffers,
  };
}