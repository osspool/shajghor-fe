"use client";
import { Button } from "@/components/ui/button";
import { SheetWrapper } from "@/components/custom/ui/sheet-wrapper";
import { BookingForm } from "@/components/platform/booking/form/booking.form";

export function BookingSheet({
  token,
  open,
  onOpenChange,
  organizationId,
  parlourId,
  booking = null,
  size = "lg",
}) {
  const isEdit = !!booking;

  const handleSuccess = () => {
    if (!isEdit) onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <SheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Booking" : "Add New Booking"}
      description={isEdit ? "Update booking details" : "Create a new booking"}
      size={size}
      className="px-4"
      footer={(
        <div className="flex gap-2 w-full">
          <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
            {isEdit ? "Close" : "Cancel"}
          </Button>
          <Button type="submit" form="booking-sheet-form" className="flex-1">
            {isEdit ? "Update Booking" : "Create Booking"}
          </Button>
        </div>
      )}
    >
      <BookingForm
        token={token}
        organizationId={organizationId}
        parlourId={parlourId}
        booking={booking}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        formId="booking-sheet-form"
        hideActions
      />
    </SheetWrapper>
  );
}


