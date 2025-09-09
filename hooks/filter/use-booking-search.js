"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBaseSearch } from "./use-base-search";
import { clearSearchAndFilterParams } from "@/lib/filter-utils";

export function useBookingSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const config = {
    basePath: "/dashboard/parlour/bookings",
    searchFields: {
      _id: "_id",
      customerPhone: "customerPhone[contains]",
    },
    filterFields: {
      status: { paramName: "status", type: "string", defaultValue: "" },
      paymentStatus: { paramName: "paymentStatus", type: "string", defaultValue: "" },
      dateFrom: { paramName: "appointmentDate[gte]", type: "string", defaultValue: "" },
      dateTo: { paramName: "appointmentDate[lte]", type: "string", defaultValue: "" },
    },
    defaultSearchType: "_id",
  };

  const baseSearch = useBaseSearch(config);

  const status = baseSearch.filters.status || "";
  const setStatus = (value) => baseSearch.updateFilter("status", value);

  const paymentStatus = baseSearch.filters.paymentStatus || "";
  const setPaymentStatus = (value) => baseSearch.updateFilter("paymentStatus", value);

  const dateFrom = baseSearch.filters.dateFrom || "";
  const dateTo = baseSearch.filters.dateTo || "";

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    clearSearchAndFilterParams(params, config);
    params.delete("page");

    if (baseSearch.searchValue.trim()) {
      const paramName = config.searchFields[baseSearch.searchType];
      if (paramName) params.set(paramName, baseSearch.searchValue.trim());
    }

    Object.entries(baseSearch.filters).forEach(([key, value]) => {
      const filterConfig = config.filterFields[key];
      if (!filterConfig) return;
      if (value && value !== filterConfig.defaultValue) {
        params.set(filterConfig.paramName, value);
      }
    });

    router.push(`${config.basePath}?${params.toString()}`);
  }, [baseSearch.searchType, baseSearch.searchValue, baseSearch.filters, searchParams, router, config]);

  const getSearchParams = useCallback(() => {
    return baseSearch.getSearchParams();
  }, [baseSearch.getSearchParams]);

  const formatDate = (d) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const applyDateRange = useCallback((startDate, endDate) => {
    const params = new URLSearchParams(searchParams);
    clearSearchAndFilterParams(params, config);
    params.delete("page");

    if (baseSearch.searchValue.trim()) {
      const paramName = config.searchFields[baseSearch.searchType];
      if (paramName) params.set(paramName, baseSearch.searchValue.trim());
    }

    Object.entries(baseSearch.filters).forEach(([key, value]) => {
      if (key === 'dateFrom' || key === 'dateTo') return;
      const filterConfig = config.filterFields[key];
      if (!filterConfig) return;
      if (value && value !== filterConfig.defaultValue) {
        params.set(filterConfig.paramName, value);
      }
    });

    if (startDate) params.set(config.filterFields.dateFrom.paramName, formatDate(startDate));
    if (endDate) params.set(config.filterFields.dateTo.paramName, formatDate(endDate));

    router.push(`${config.basePath}?${params.toString()}`);
  }, [searchParams, router, baseSearch.searchType, baseSearch.searchValue, baseSearch.filters]);

  const clearDateRange = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    clearSearchAndFilterParams(params, config);
    params.delete("page");

    if (baseSearch.searchValue.trim()) {
      const paramName = config.searchFields[baseSearch.searchType];
      if (paramName) params.set(paramName, baseSearch.searchValue.trim());
    }
    Object.entries(baseSearch.filters).forEach(([key, value]) => {
      if (key === 'dateFrom' || key === 'dateTo') return;
      const filterConfig = config.filterFields[key];
      if (!filterConfig) return;
      if (value && value !== filterConfig.defaultValue) {
        params.set(filterConfig.paramName, value);
      }
    });

    router.push(`${config.basePath}?${params.toString()}`);
  }, [searchParams, router, baseSearch.searchType, baseSearch.searchValue, baseSearch.filters]);

  return {
    searchType: baseSearch.searchType,
    setSearchType: baseSearch.setSearchType,
    searchValue: baseSearch.searchValue,
    setSearchValue: baseSearch.setSearchValue,
    status, setStatus,
    paymentStatus, setPaymentStatus,
    dateFrom, dateTo,
    handleSearch,
    clearSearch: baseSearch.clearSearch,
    getSearchParams,
    applyDateRange,
    clearDateRange,
    hasActiveSearch: baseSearch.hasActiveSearch,
    hasActiveFilters: !!status || !!paymentStatus || !!dateFrom || !!dateTo,
  };
}


