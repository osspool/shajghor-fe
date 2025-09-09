"use client";
import { BaseSearch } from "@/components/common/BaseSearch";
import { useTransactionSearch } from "@/hooks/filter/use-transaction-search";
import SelectInput from "@/components/form-utils/select-input";
import { TRANSACTION_CATEGORY_OPTIONS, TRANSACTION_TYPE_OPTIONS } from "@/constants/booking-constants";
import { DateRangeFilter } from "@/components/form-utils/date-range-filter";

export function TransactionSearch() {
  const searchHook = useTransactionSearch();

  const parseYmd = (s) => {
    if (!s) return undefined;
    const parts = s.split('-');
    if (parts.length !== 3) return undefined;
    const [y, m, d] = parts.map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return isNaN(dt.getTime()) ? undefined : dt;
  };

  const searchOptions = [
    { value: "_id", label: "Transaction ID" },
  ];

  const filterComponents = [
    () => (
      <div className="grid grid-cols-1 gap-3">
        <SelectInput
          label="Type"
          items={[{ value: "", label: "All" }, ...TRANSACTION_TYPE_OPTIONS]}
          value={searchHook.type}
          onValueChange={searchHook.setType}
          placeholder="All"
        />
        <SelectInput
          label="Category"
          items={[{ value: "", label: "All" }, ...TRANSACTION_CATEGORY_OPTIONS]}
          value={searchHook.category}
          onValueChange={searchHook.setCategory}
          placeholder="All"
        />
        <DateRangeFilter
          label="Date Range"
          compact
          initialStartDate={parseYmd(searchHook.dateFrom)}
          initialEndDate={parseYmd(searchHook.dateTo)}
          onFilter={searchHook.applyDateRange}
          onClear={searchHook.clearDateRange}
        />
      </div>
    ),
  ];

  return (
    <BaseSearch
      searchType={searchHook.searchType}
      setSearchType={searchHook.setSearchType}
      searchValue={searchHook.searchValue}
      setSearchValue={searchHook.setSearchValue}
      searchOptions={searchOptions}
      filters={{}}
      onFilterChange={() => {}}
      filterComponents={filterComponents}
      onSearch={searchHook.handleSearch}
      onClear={searchHook.clearSearch}
      hasActiveSearch={searchHook.hasActiveSearch}
      hasActiveFilters={searchHook.hasActiveFilters}
      searchPlaceholder={() => 'Search transaction id...'}
    />
  );
}
