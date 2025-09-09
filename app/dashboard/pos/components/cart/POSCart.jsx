"use client";
import { useMemo, useState } from "react";
import { usePOS } from "../../context/POSContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingSheet } from "@/components/platform/booking/booking-sheet";
import { PenSquare, Wallet, RotateCcw } from "lucide-react";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { BookingPaymentDialog } from "@/components/platform/finance/booking-payment-dialog";
import { BookingTransactionsSummary } from "./BookingTransactionsSummary";
import { IconButton } from "@/components/custom/ui/icon-button";

export function POSCart({ token }) {
  const { state } = usePOS();
  const { parlour } = useAdminTenant();
  const booking = state.selectedBooking;
  const [openBookingSheet, setOpenBookingSheet] = useState(false);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");

  const totals = useMemo(() => {
    const services = booking?.services || [];
    const sum = services.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
    const additional = Number(booking?.additionalCost) || 0;
    return { amount: sum + additional, additional };
  }, [booking]);

  // Related transactions are rendered via reusable component

  if (!booking) {
    return (
      <div className="h-full p-4 flex flex-col items-center justify-center text-sm text-muted-foreground">
        Select a booking from the left to process.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{booking.customerName}</div>
            <div className="text-xs text-muted-foreground">{booking.customerPhone}</div>
          </div>
          <Badge variant="outline" className="capitalize">{booking.status}</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        {(booking.services || []).map((s, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-lg border bg-card p-2">
            <div className="text-sm">{s.serviceName}</div>
            <div className="text-sm font-medium">৳{s.price}</div>
          </div>
        ))}

        {totals.additional > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Additional</span>
            <span>৳{totals.additional}</span>
          </div>
        )}

        <Separator />
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span>৳{totals.amount}</span>
        </div>

        <BookingTransactionsSummary token={token} booking={booking} totalAmount={totals.amount} />
      </div>

      <div className="p-3 border-t space-y-2">
        <div className="flex gap-2">
          <IconButton
            Icon={Wallet}
            variant="success"
            className="flex-1"
            onClick={() => { setAmount(String(totals.amount)); setMethod(booking.paymentMethod || 'cash'); setOpenPayDialog(true); }}
          >
            Receive Payment
          </IconButton>
          <IconButton
            Icon={RotateCcw}
            variant="danger"
            className="flex-1"
            onClick={() => setOpenRefundDialog(true)}
          >
            Refund
          </IconButton>
        </div>
        <div className="flex">
          <IconButton Icon={PenSquare} variant="outline" fullWidth onClick={() => setOpenBookingSheet(true)}>
            Edit Booking
          </IconButton>
        </div>
      </div>

      <BookingSheet
        token={token}
        open={openBookingSheet}
        onOpenChange={setOpenBookingSheet}
        organizationId={parlour?.organizationId}
        parlourId={parlour?._id}
        booking={booking}
      />

      <BookingPaymentDialog
        open={openPayDialog}
        onOpenChange={setOpenPayDialog}
        action="receive"
        booking={booking}
        token={token}
        defaultAmount={Number(amount) || totals.amount}
        defaultMethod={method}
      />
      <BookingPaymentDialog
        open={openRefundDialog}
        onOpenChange={setOpenRefundDialog}
        action="refund"
        booking={booking}
        token={token}
        defaultAmount={Number(amount) || totals.amount}
        defaultMethod={method}
        title="Refund Payment"
      />
    </div>
  );
}


