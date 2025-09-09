"use client";

import { Building, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import HeaderSection from "@/components/custom/dashboard/header-section";
import { OrganizationTable } from "./organization-table";
import { OrganizationSheet } from "./organization-sheet";
import { BaseSearch } from "@/components/common/BaseSearch";
import { useOrganizationSearch } from "@/hooks/filter/use-organization-search";

export function OrganizationListUi({ token, initialPage = 1, initialLimit = 15 }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || initialPage;
  const limit = Number(searchParams.get("limit")) || initialLimit;

  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handlePageChange = useCallback(
    (page) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      router.push(`/super/organization?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, limit]
  );

  const handleCreate = useCallback(() => {
    setSelectedOrganization(null);
    setIsSheetOpen(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setSelectedOrganization(item);
    setIsSheetOpen(true);
  }, []);

  const headerActions = useMemo(
    () => [
      { text: "New Organization", icon: Plus, onClick: handleCreate },
    ],
    [handleCreate]
  );

  const orgSearch = useOrganizationSearch();

  const apiParams = useMemo(
    () => ({ page: currentPage, limit, ...orgSearch.getSearchParams() }),
    [currentPage, limit, orgSearch.getSearchParams]
  );

  return (
    <div className="flex flex-col gap-2">
      <HeaderSection icon={Building} title="Organizations" description="Manage organizations and billing" actions={headerActions} />
      <div className="flex-shrink-0 p-4 bg-card border-b rounded-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg font-semibold">Data</h2>
          <BaseSearch
            searchType={orgSearch.searchType}
            setSearchType={orgSearch.setSearchType}
            searchValue={orgSearch.searchValue}
            setSearchValue={orgSearch.setSearchValue}
            searchOptions={[
              { value: "name", label: "Name" },
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
            ]}
            onSearch={orgSearch.handleSearch}
            onClear={orgSearch.clearSearch}
            hasActiveSearch={orgSearch.hasActiveSearch}
            hasActiveFilters={orgSearch.hasActiveFilters}
            showFilterButton={false}
          />
        </div>
      </div>

      <OrganizationTable
        token={token}
        apiParams={apiParams}
        currentPage={currentPage}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
      />

      <OrganizationSheet
        token={token}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        organization={selectedOrganization}
      />
    </div>
  );
}


