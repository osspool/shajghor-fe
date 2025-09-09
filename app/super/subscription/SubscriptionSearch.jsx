"use client";
import { BaseSearch } from "@/components/common/BaseSearch";
import { useSubscriptionSearch } from "@/hooks/filter/use-subscription-search";
import SelectInput from "@/components/form-utils/select-input";

export function SubscriptionSearch() {
  const searchHook = useSubscriptionSearch();

  const searchOptions = [
    { value: "organizationId", label: "Organization ID" },
  ];
  
  const StatusFilter = ({ filters, onFilterChange, disabled }) => (
    <div className="grid grid-cols-1 gap-3">
      <SelectInput
        label="Status"
        items={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "pending", label: "Pending" },
          { value: "expired", label: "Expired" },
        ]}
        allOption={{ value: "", label: "All" }}
        value={filters.status || ""}
        onValueChange={(v) => onFilterChange("status", v)}
        placeholder="All"
        disabled={disabled}
      />
    </div>
  );

  return (
    <BaseSearch
      searchType={searchHook.searchType}
      setSearchType={searchHook.setSearchType}
      searchValue={searchHook.searchValue}
      setSearchValue={searchHook.setSearchValue}
      searchOptions={searchOptions}
      filters={searchHook.filters}
      onFilterChange={searchHook.updateFilter}
      filterComponents={[StatusFilter]}
      onSearch={searchHook.handleSearch}
      onClear={searchHook.clearSearch}
      hasActiveSearch={searchHook.hasActiveSearch}
      hasActiveFilters={searchHook.hasActiveFilters}
      searchPlaceholder={() => 'Search organization id...'}
    />
  );
}