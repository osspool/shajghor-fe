"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/custom/ui/data-table";
import { useParlours, useParlourActions } from "@/hooks/query/useParlours";
import { parlourColumns } from "./parlours.columns";

export const ParloursTable = React.memo(function ParloursTable({
  apiParams,
  currentPage = 1,
  itemsPerPage = 15,
  onPageChange,
  onEdit,
  token,
}) {
  const { parlours, pagination, isLoading, error } = useParlours(
    token,
    apiParams
  );

  const { deleteParlour, isDeleting } = useParlourActions();

  const handleDelete = async (item) => {
    if (!item?._id) return;
    await deleteParlour({ token, id: item._id });
  };

  const columns = useMemo(() => parlourColumns(onEdit, handleDelete), [onEdit]);
  const memoizedData = useMemo(() => parlours || [], [parlours]);

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


