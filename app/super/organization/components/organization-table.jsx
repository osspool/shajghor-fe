"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/custom/ui/data-table";
import { useOrganizations, useOrganizationActions } from "@/hooks/query/useOrganizations";
import { organizationColumns } from "./organization.columns";

export const OrganizationTable = React.memo(function OrganizationTable({
  apiParams,
  currentPage = 1,
  itemsPerPage = 15,
  onPageChange,
  onEdit,
  token,
}) {
  const { organizations, pagination, isLoading, error } = useOrganizations(token, apiParams);
  const { deleteOrganization } = useOrganizationActions();

  const handleDelete = async (item) => {
    if (!item?._id) return;
    await deleteOrganization({ token, id: item._id });
  };

  const columns = useMemo(() => organizationColumns(onEdit, handleDelete), [onEdit]);
  const memoizedData = useMemo(() => organizations || [], [organizations]);

  const paginationConfig = useMemo(
    () => ({
      totalDocs: pagination?.totalDocs || 0,
      limit: pagination?.limit || itemsPerPage,
      currentPage: pagination?.currentPage || 1,
      totalPages: pagination?.totalPages || 1,
      hasNextPage: pagination?.hasNextPage || false,
      hasPrevPage: pagination?.hasPrevPage || false,
      onPageChange: onPageChange,
    }),
    [pagination, itemsPerPage, onPageChange]
  );

  if (error) throw error;

  return (
    <DataTable
      columns={columns}
      data={memoizedData}
      isLoading={isLoading}
      pagination={paginationConfig}
      onPageChange={onPageChange}
      className="h-[74dvh] rounded-lg"
    />
  );
});


