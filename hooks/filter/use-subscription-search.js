"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBaseSearch } from "./use-base-search";
import { clearSearchAndFilterParams } from "@/lib/filter-utils";

export function useSubscriptionSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const config = {
    basePath: "/super/subscription",
    searchFields: {
      organizationId: "organizationId",
    },
    filterFields: {
      status: { paramName: "status", type: "string", defaultValue: "" },
    },
    defaultSearchType: "organizationId",
  };

  const baseSearch = useBaseSearch(config);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    clearSearchAndFilterParams(params, config);
    params.delete("page");

    if (baseSearch.searchValue.trim()) {
      const paramName = config.searchFields[baseSearch.searchType];
      if (paramName) params.set(paramName, baseSearch.searchValue.trim());
    }

    // Include filters in URL (e.g., status)
    Object.entries(baseSearch.filters).forEach(([key, value]) => {
      const filterConfig = config.filterFields[key];
      if (!filterConfig) return;
      if (value && value !== filterConfig.defaultValue) {
        params.set(filterConfig.paramName, value);
      }
    });

    router.push(`${config.basePath}?${params.toString()}`);
  }, [baseSearch.searchType, baseSearch.searchValue, baseSearch.filters, searchParams, router]);

  const hasActiveFilters = !!(baseSearch.filters.status && baseSearch.filters.status !== "");

  return {
    searchType: baseSearch.searchType,
    setSearchType: baseSearch.setSearchType,
    searchValue: baseSearch.searchValue,
    setSearchValue: baseSearch.setSearchValue,
    handleSearch,
    clearSearch: baseSearch.clearSearch,
    getSearchParams: baseSearch.getSearchParams,
    hasActiveSearch: baseSearch.hasActiveSearch,
    hasActiveFilters,
    filters: baseSearch.filters,
    updateFilter: baseSearch.updateFilter,
  };
}


