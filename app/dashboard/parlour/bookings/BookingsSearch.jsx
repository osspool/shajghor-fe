"use client";
import { BaseSearch } from "@/components/common/BaseSearch";
import { useBookingSearch } from "@/hooks/filter/use-booking-search";
import { BOOKING_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/constants/booking-constants";
import SelectInput from "@/components/form-utils/select-input";
import { DateRangeFilter } from "@/components/form-utils/date-range-filter";

export function BookingsSearch() {
  const searchHook = useBookingSearch();

  const parseYmd = (s) => {
    if (!s) return undefined;
    const parts = s.split('-');
    if (parts.length !== 3) return undefined;
    const [y, m, d] = parts.map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return isNaN(dt.getTime()) ? undefined : dt;
  };

  const searchOptions = [
    { value: "_id", label: "Booking ID" },
    { value: "customerPhone", label: "Phone" },
  ];

  const filterComponents = [
    ({ filters, onFilterChange }) => (
      <div className="grid grid-cols-1 gap-3">
        <SelectInput
          label="Status"
          items={BOOKING_STATUS_OPTIONS}
          value={searchHook.status}
          onValueChange={searchHook.setStatus}
          placeholder="All"
        />
        <SelectInput
          label="Payment"
          items={PAYMENT_STATUS_OPTIONS}
          value={searchHook.paymentStatus}
          onValueChange={searchHook.setPaymentStatus}
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
      searchPlaceholder={(type) => type === 'customerPhone' ? 'Search phone...' : 'Search booking id...'}
    />
  );
}


