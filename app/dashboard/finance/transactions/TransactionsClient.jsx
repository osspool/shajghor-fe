"use client";
import { useMemo, useState, useCallback } from "react";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { TransactionSheet } from "@/components/platform/finance/transaction-sheet";
import { DataTable } from "@/components/custom/ui/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { TransactionSearch } from "./TransactionSearch";
import { transactionsColumns } from "./transactions-columns";
import { Plus, Wallet } from "lucide-react";
import HeaderSection from "@/components/custom/dashboard/header-section";
import ErrorBoundaryWrapper from "@/components/custom/error/error-boundary-wrapper";
import { useTransactionActions, useTransactions } from "@/hooks/query/useTransactions";

export function TransactionsClient({ token }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { parlour } = useAdminTenant();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const currentPage = Number(searchParams.get("page")) || 1;

  const apiParams = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      page: currentPage,
      limit: 15,
      parlourId: parlour?._id,
      ...params,
    };
  }, [searchParams, currentPage, parlour?._id]);

  const {
    transactions = [],
    pagination,
    isLoading,
  } = useTransactions(token, apiParams, { public: false });
  const { deleteTransaction, isDeleting } = useTransactionActions();

  const handleEdit = useCallback((item) => {
    setSelected(item);
    setOpen(true);
  }, []);
  const handleDelete = useCallback(
    async (item) => {
      if (confirm("Delete booking?"))
        await deleteTransaction({ token, id: item._id });
    },
    [deleteTransaction, token]
  );
  const handlePageChange = useCallback(
    (page) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(page));
      router.push(`/dashboard/finance/transactions?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  const columns = useMemo(
    () => transactionsColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="flex flex-col gap-2">
      <HeaderSection
        icon={Wallet}
        title="Transactions"
        variant="compact"
        description="Manage your transactions"
        actions={[
          {
            icon: Plus,
            text: "Add Transaction",
            size: "sm",
            onClick: () => setOpen(true),
          },
        ]}
      />
      <div className="py-4">
        <TransactionSearch />
      </div>

      <ErrorBoundaryWrapper>
        <DataTable
          columns={columns}
          data={transactions}
          isLoading={isLoading}
          pagination={{
            totalDocs: pagination?.totalDocs || 0,
            limit: pagination?.limit || 15,
            currentPage: pagination?.currentPage || currentPage,
            totalPages: pagination?.totalPages || 1,
            hasNextPage: pagination?.hasNextPage || false,
            hasPrevPage: pagination?.hasPrevPage || false,
            onPageChange: handlePageChange,
          }}
          className="h-[74dvh] rounded-lg"
        />
      </ErrorBoundaryWrapper>
      
      <TransactionSheet
        token={token}
        open={open}
        onOpenChange={setOpen}
        organizationId={parlour?.organizationId}
        parlourId={parlour?._id}
        transaction={selected}
      />
    </div>
  );
}
