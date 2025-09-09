"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { useBookings } from "@/hooks/query/useBookings";
import { usePOS } from "../../context/POSContext";
import { Input } from "@/components/ui/input";
import { PlusCircle, Wallet, AlertCircle } from "lucide-react";
import { BookingSheet } from "@/components/platform/booking/booking-sheet";
import { DateFilter } from "@/components/form-utils/date-filter";
import { StatCard } from "@/components/custom/ui/StatCard";
import { IconButton } from "@/components/custom/ui/icon-button";
import { POSBookingCard } from "./POSBookingCard";

export function POSBookings({ token }) {
  const { parlour } = useAdminTenant();
  const { state, actions } = usePOS();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openBookingSheet, setOpenBookingSheet] = useState(false);

  // Default to today's date; allow override via URL (?date=YYYY-MM-DD)
  const dateParam =
    searchParams.get("appointmentDate") || searchParams.get("date");
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const defaultDate = `${yyyy}-${mm}-${dd}`;

  const apiParams = useMemo(
    () => ({
      limit: 1000,
      parlourId: parlour?._id,
      appointmentDate: dateParam || defaultDate,
    }),
    [parlour?._id, dateParam, defaultDate]
  );

  const { bookings = [], isLoading } = useBookings(token, apiParams, {
    public: false,
  });

  // Keep selected booking in sync with latest fetched data
  useEffect(() => {
    if (!state?.selectedBooking || bookings.length === 0) return;
    const updated = bookings.find((b) => b._id === state.selectedBooking._id);
    if (updated) {
      // Only update if reference has changed to avoid loops
      if (updated !== state.selectedBooking) {
        actions.setSelectedBooking(updated);
      }
    }
  }, [bookings, state?.selectedBooking?._id]);

  const summary = useMemo(() => {
    const paid = bookings.filter((b) => b.paymentStatus === "paid");
    const pending = bookings.filter((b) => b.paymentStatus === "pending");
    const paidAmount = paid.reduce(
      (sum, b) => sum + (Number(b.totalAmount) || 0),
      0
    );
    const pendingAmount = pending.reduce(
      (sum, b) => sum + (Number(b.totalAmount) || 0),
      0
    );
    return {
      paidCount: paid.length,
      pendingCount: pending.length,
      paidAmount,
      pendingAmount,
    };
  }, [bookings]);

  const filtered = useMemo(() => {
    if (!query) return bookings;
    const q = query.toLowerCase();
    return bookings.filter(
      (b) =>
        (b.customerName || "").toLowerCase().includes(q) ||
        (b.customerPhone || "").toLowerCase().includes(q) ||
        (b._id || "").toLowerCase().includes(q)
    );
  }, [bookings, query]);

  const handleDateChange = (dateObj) => {
    // dateObj may be Date or null
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const ymd = `${y}-${m}-${day}`;
    const params = new URLSearchParams(searchParams);
    params.set("appointmentDate", ymd);
    router.push(`/dashboard/pos?${params.toString()}`);
  };

  const handleSelect = useCallback(
    (b) => actions.setSelectedBooking(b),
    [actions]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Summury data componen  */}
      {/* Controls */}
      <div className="p-3 flex items-center gap-2 border-b bg-background">
        <DateFilter
          value={dateParam || defaultDate}
          onChange={handleDateChange}
        />
        <Input
          placeholder="Search name, phone, or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <IconButton
          Icon={PlusCircle}
          variant="info"
          className="ml-auto"
          onClick={() => setOpenBookingSheet(true)}
        >
          New Booking
        </IconButton>
      </div>

      {/* Summary */}
      <div className="p-3 border-b bg-background">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            title="Pending Payments"
            value={`৳${summary.pendingAmount.toLocaleString()}`}
            caption={`${summary.pendingCount} booking(s)`}
            Icon={AlertCircle}
            variant="danger"
          />
          <StatCard
            title="Today's Collection"
            value={`৳${summary.paidAmount.toLocaleString()}`}
            caption={`${summary.paidCount} booking(s)`}
            Icon={Wallet}
            variant="success"
          />
        </div>
      </div>

      {/* Bookings list */}
      <div className="flex-1 overflow-auto p-3">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((b) => (
              <POSBookingCard
                key={b._id}
                booking={b}
                isSelected={state.selectedBooking?._id === b._id}
                onSelect={() => handleSelect(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sheets */}
      <BookingSheet
        token={token}
        open={openBookingSheet}
        onOpenChange={setOpenBookingSheet}
        organizationId={parlour?.organizationId}
        parlourId={parlour?._id}
        booking={null}
        
      />
    </div>
  );
}
