"use client";
import { useMemo, useState, useCallback } from "react";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { BookingSheet } from "@/components/platform/booking/booking-sheet";
import { DataTable } from "@/components/custom/ui/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { BookingsSearch } from "./BookingsSearch";
import { useBookings, useBookingActions } from "@/hooks/query/useBookings";
import { bookingsColumns } from "./bookings-columns";
import { Calendar, Plus } from "lucide-react";
import HeaderSection from "@/components/custom/dashboard/header-section";
import ErrorBoundaryWrapper from "@/components/custom/error/error-boundary-wrapper";

export function BookingsClient({ token }) {
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
    bookings = [],
    pagination,
    isLoading,
  } = useBookings(token, apiParams, { public: false });
  const { deleteBooking, isDeleting } = useBookingActions();

  const handleEdit = useCallback((item) => {
    setSelected(item);
    setOpen(true);
  }, []);
  const handleDelete = useCallback(
    async (item) => {
      if (confirm("Delete booking?"))
        await deleteBooking({ token, id: item._id });
    },
    [deleteBooking, token]
  );
  const handlePageChange = useCallback(
    (page) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(page));
      router.push(`/dashboard/parlour/bookings?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  const columns = useMemo(
    () => bookingsColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="flex flex-col gap-2">
      <HeaderSection
        icon={Calendar}
        title="Bookings"
        variant="compact"
        description="Manage your bookings"
        actions={[
          {
            icon: Plus,
            text: "Add Booking",
            size: "sm",
            onClick: () => setOpen(true),
          },
        ]}
      />
      <div className="py-4">
        <BookingsSearch />
      </div>

      <ErrorBoundaryWrapper>
        <DataTable
          columns={columns}
          data={bookings}
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
      
      <BookingSheet
        token={token}
        open={open}
        onOpenChange={setOpen}
        organizationId={parlour?.organizationId}
        parlourId={parlour?._id}
        booking={selected}
      />
    </div>
  );
}
