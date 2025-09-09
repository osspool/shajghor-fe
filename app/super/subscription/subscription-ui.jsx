"use client";
import { useMemo, useState, useCallback } from "react";
import { SubscriptionSheet } from "@/components/platform/finance/subscription-sheet";
import { DataTable } from "@/components/custom/ui/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { SubscriptionSearch } from "./SubscriptionSearch";
import { subscriptionsColumns } from "./subscriptions-columns";
import { Plus, Wallet } from "lucide-react";
import HeaderSection from "@/components/custom/dashboard/header-section";
import ErrorBoundaryWrapper from "@/components/custom/error/error-boundary-wrapper";
import { useSubscriptionActions, useSubscriptions } from "@/hooks/query/useSubscriptions";

export function SubscriptionUI({ token }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const currentPage = Number(searchParams.get("page")) || 1;

  const apiParams = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      page: currentPage,
      limit: 15,
      ...params,
    };
  }, [searchParams, currentPage]);

  const {
    subscriptions = [],
    pagination,
    isLoading,
  } = useSubscriptions(token, apiParams, { public: false });
  const { deleteSubscription, isDeleting } = useSubscriptionActions();

  const handleEdit = useCallback((item) => {
    setSelected(item);
    setOpen(true);
  }, []);
  const handleDelete = useCallback(
    async (item) => {
      if (confirm("Delete subscription?"))
        await deleteSubscription({ token, id: item._id });
    },
    [deleteSubscription, token]
  );
  const handlePageChange = useCallback(
    (page) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(page));
      router.push(`/super/subscription?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  const columns = useMemo(
    () => subscriptionsColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="flex flex-col gap-2">
      <HeaderSection
        icon={Wallet}
        title="Subscriptions"
        variant="compact"
        description="Manage your subscriptions"
        actions={[
          {
            icon: Plus,
            text: "Add Subscription",
            size: "sm",
            onClick: () => setOpen(true),
          },
        ]}
      />
      <div className="py-4">
        <SubscriptionSearch />
      </div>

      <ErrorBoundaryWrapper>
        <DataTable
          columns={columns}
          data={subscriptions}
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
      
      <SubscriptionSheet
        token={token}
        open={open}
        onOpenChange={setOpen}
        subscription={selected}
      />
    </div>
  );
}
