"use client";

import { Building2, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import HeaderSection from "@/components/custom/dashboard/header-section";
import { ParloursTable } from "./parlours-table";
import { ParlourSheet } from "@/components/platform/parlour/parlour-sheet";
import { BaseSearch } from "@/components/common/BaseSearch";
import { useParlourSearch } from "@/hooks/filter/use-parlour-search";

export function ParlourListUi({
  token,
  initialPage = 1,
  initialLimit = 15,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || initialPage;
  const limit = Number(searchParams.get("limit")) || initialLimit;

  const [selectedParlour, setSelectedParlour] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handlePageChange = useCallback(
    (page) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      router.push(`/super/parlours?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, limit]
  );

  const handleCreate = useCallback(() => {
    setSelectedParlour(null);
    setIsSheetOpen(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setSelectedParlour(item);
    setIsSheetOpen(true);
  }, []);

  const headerActions = useMemo(
    () => [
      {
        text: "New Parlour",
        icon: Plus,
        onClick: handleCreate,
      },
    ],
    [handleCreate]
  );

  const parlourSearch = useParlourSearch();

  const apiParams = useMemo(
    () => ({ page: currentPage, limit, ...parlourSearch.getSearchParams() }),
    [currentPage, limit, parlourSearch.getSearchParams]
  );

  return (
    <div className="flex flex-col gap-2">
      <HeaderSection
        icon={Building2}
        title="Parlours"
        description="Manage parlours"
        actions={headerActions}
      />
      <div className="flex-shrink-0 p-4 bg-card border-b rounded-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg font-semibold">Data</h2>
          <BaseSearch
            searchType={parlourSearch.searchType}
            setSearchType={parlourSearch.setSearchType}
            searchValue={parlourSearch.searchValue}
            setSearchValue={parlourSearch.setSearchValue}
            searchOptions={[
              { value: "name", label: "Name" },
              { value: "slug", label: "Slug" },
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
            ]}
            onSearch={parlourSearch.handleSearch}
            onClear={parlourSearch.clearSearch}
            hasActiveSearch={parlourSearch.hasActiveSearch}
            hasActiveFilters={parlourSearch.hasActiveFilters}
            showFilterButton={true}
            filters={parlourSearch.filters}
            onFilterChange={parlourSearch.updateFilter}
            filterComponents={[]}
          />
        </div>
      </div>

      <ParloursTable
        token={token}
        apiParams={apiParams}
        currentPage={currentPage}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
      />

      <ParlourSheet
        token={token}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        parlour={selectedParlour}
        showOwnershipFields={true}
      />
    </div>
  );
}


