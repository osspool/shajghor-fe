"use client";
import { useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Search } from "lucide-react";
import { toast } from "sonner";
import { useServices } from "@/hooks/query/useServices";
import { useBookingActions } from "@/hooks/query/useBookings";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { bookingSchema } from "@/schemas/booking.schema";
import FormInput from "@/components/form-utils/form-input";
import FormTextarea from "@/components/form-utils/form-textarea";
import SelectInput from "@/components/form-utils/select-input";
import DateInput from "@/components/form-utils/date-input";
import { DynamicTabs } from "@/components/custom/ui/tabs-wrapper";
import { generateTimeOptionsForDate } from "@/lib/time-slots";
import { PAYMENT_METHOD_OPTIONS, PAYMENT_STATUS_OPTIONS, BOOKING_STATUS_OPTIONS, SERVICE_TYPE_OPTIONS } from "@/constants/booking-constants";
import { FormErrorSummary } from "@/components/form-utils/FormErrorSummary";
import { useUserSearch } from "@/hooks/query/use-user";

export function BookingForm({ token, organizationId, parlourId, booking = null, onSuccess, onCancel, formId = "booking-form", hideActions = false }) {
  const isEdit = !!booking;
  const { services: allServices = [] } = useServices(token, { parlourId, limit: 100 }, { public: !token });
  const { createBooking, updateBooking, isCreating, isUpdating } = useBookingActions();
  const { parlour: tenantParlour } = useAdminTenant();
  const { searchUser, user: foundUser, notFound, isSearching } = useUserSearch({ token });

  const defaultValues = useMemo(() => ({
    organizationId: booking?.organizationId || organizationId || "",
    parlourId: booking?.parlourId || parlourId || "",
    customerId: booking?.customerId || "",
    customerName: booking?.customerName || "",
    customerPhone: booking?.customerPhone || "",
    services: booking?.services || [],
    serviceType: booking?.serviceType || 'in-salon',
    serviceAddress: booking?.serviceAddress || "",
    appointmentDate: booking?.appointmentDate || "",
    appointmentTime: booking?.appointmentTime || "",
    status: booking?.status || 'pending',
    paymentStatus: booking?.paymentStatus || 'pending',
    paymentMethod: booking?.paymentMethod || 'cash',
    additionalCost: booking?.additionalCost || 0,
    additionalCostReason: booking?.additionalCostReason || "",
    notes: booking?.notes || "",
    totalAmount: booking?.totalAmount || 0,
    totalDuration: booking?.totalDuration || 0,
  }), [booking, organizationId, parlourId]);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
  });

  const isSubmitting = isCreating || isUpdating;
  const formErrors = form.formState.errors;

  // Derive totals from selected services + additional cost
  const servicesWatch = form.watch("services");
  const additionalCostWatch = form.watch("additionalCost");
  const computedTotals = useMemo(() => {
    const services = servicesWatch || [];
    const addCost = Number(additionalCostWatch) || 0;
    const totalDuration = services.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
    const totalAmount = services.reduce((sum, s) => sum + (Number(s.price) || 0), 0) + addCost;
    return { totalAmount, totalDuration };
  }, [servicesWatch, additionalCostWatch]);

  // Keep totals in form state for validation/submission
  if (form.getValues("totalAmount") !== computedTotals.totalAmount) {
    form.setValue("totalAmount", computedTotals.totalAmount, { shouldValidate: false, shouldDirty: false });
  }
  if (form.getValues("totalDuration") !== computedTotals.totalDuration) {
    form.setValue("totalDuration", computedTotals.totalDuration, { shouldValidate: false, shouldDirty: false });
  }

  const toggleService = useCallback((service, checked) => {
    const current = form.getValues("services") || [];
    const exists = current.some((s) => s.serviceId === service._id);
    let next;
    if (checked && !exists) {
      next = [...current, { serviceId: service._id, serviceName: service.name, price: service.price, duration: service.duration }];
    } else if (!checked && exists) {
      next = current.filter((s) => s.serviceId !== service._id);
    } else {
      next = current;
    }
    form.setValue("services", next, { shouldValidate: true, shouldDirty: true });
  }, [form]);

  const removeServiceByIndex = useCallback((index) => {
    const current = form.getValues("services") || [];
    const next = current.filter((_, i) => i !== index);
    form.setValue("services", next, { shouldValidate: true, shouldDirty: true });
  }, [form]);

  // Time slot generation from parlour working hours
  const workingParlour = tenantParlour || {};
  const slotDuration = Number(workingParlour?.slotDurationMinutes) || 30;
  const leadTimeMinutes = Number(workingParlour?.leadTimeMinutes) || 0;
  const dayHours = workingParlour?.workingHours || {};
  const breaks = Array.isArray(workingParlour?.breaks) ? workingParlour.breaks : [];
  const dailyCutoffTime = workingParlour?.dailyCutoffTime || ""; // HH:mm

  const selectedDate = form.watch("appointmentDate");
  const selectedDateObj = useMemo(() => {
    if (!selectedDate) return null;
    if (selectedDate instanceof Date) return selectedDate;
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? null : d;
  }, [selectedDate]);

  const selectedDayKey = useMemo(() => {
    if (!selectedDateObj) return null;
    const dayIdx = selectedDateObj.getDay(); // 0=Sun
    const map = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    return map[dayIdx];
  }, [selectedDateObj]);

  const timeOptions = useMemo(() => {
    if (!selectedDateObj || !selectedDayKey) return [];
    return generateTimeOptionsForDate({
      date: selectedDateObj,
      workingHours: dayHours,
      slotDurationMinutes: slotDuration,
      breaks,
      leadTimeMinutes,
      dailyCutoffTime,
    });
  }, [selectedDateObj, selectedDayKey, dayHours, slotDuration, breaks, leadTimeMinutes, dailyCutoffTime]);

  useEffect(() => {
    // Only enforce when a date is selected and options are available
    if (!selectedDayKey || !selectedDateObj || timeOptions.length === 0) return;
    const current = form.getValues("appointmentTime");
    const valid = timeOptions.some((opt) => opt.value === current);
    if (!valid) {
      // Clear without triggering validation on mount
      form.setValue("appointmentTime", "", { shouldValidate: false, shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayKey, selectedDateObj?.getTime?.(), timeOptions.length]);

  const onSubmit = useCallback(async (data) => {
    try {
      const normalized = {
        ...data,
        organizationId: data.organizationId || undefined,
        customerId: data.customerId || undefined,
        serviceAddress: data.serviceType === 'at-home' ? (data.serviceAddress || undefined) : undefined,
      };

      if (isEdit) {
        await updateBooking({ token, id: booking._id, data: normalized });
      } else {
        await createBooking({ token, data: normalized });
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} booking`);
    }
  }, [isEdit, updateBooking, createBooking, token, booking?._id, onSuccess]);

  const handleFormError = useCallback((errors) => {
    toast.error("Please fix the validation errors before submitting");
    console.log("Booking form validation failed:", errors);
  }, []);

  // Autofill customer from user search
  useEffect(() => {
    if (foundUser) {
      if (foundUser.name) {
        form.setValue("customerName", foundUser.name, { shouldDirty: true });
      }
      if (foundUser._id) {
        form.setValue("customerId", foundUser._id, { shouldDirty: true });
      }
      if (!form.getValues("customerPhone") && foundUser.phone) {
        form.setValue("customerPhone", foundUser.phone, { shouldDirty: true });
      }
      toast.success("User loaded");
    }
  }, [foundUser]);

  useEffect(() => {
    if (notFound) {
      toast.message("No user found for given query");
    }
  }, [notFound]);

  const handleFindUserByPhone = useCallback(() => {
    const phone = (form.getValues("customerPhone") || "").trim();
    if (!phone) {
      toast.error("Enter customer phone to search");
      return;
    }
    searchUser(phone, "phone");
  }, [form, searchUser]);

  const customerTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput control={form.control} name="customerName" label="Customer Name" required disabled={isSubmitting} />
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-3 md:col-span-4">
          <FormInput control={form.control} name="customerPhone" label="Customer Phone" required disabled={isSubmitting || isSearching} />
        </div>
        <div className="col-span-2 md:col-span-1 flex items-end">
          <Button type="button" variant="outline" className="w-full" onClick={handleFindUserByPhone} disabled={isSubmitting || isSearching}>
            <Search className="h-4 w-4 mr-1" /> Find
          </Button>
        </div>
      </div>
      <FormInput
        control={form.control}
        name="customerId"
        label="Customer ID"
        placeholder="Auto-generated"
        disabled
        readOnly
      />
    </div>
  );

  const servicesTab = (
    <div className="space-y-4">
      <div>
        <div className="text-sm text-muted-foreground">Selected Services:</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(form.watch("services") || []).map((service, index) => (
            <Badge key={`${service.serviceId}-${index}`} variant="default" className="flex items-center gap-1">
              {service.serviceName} - ৳{service.price}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeServiceByIndex(index)}
                type="button"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto">
        <div className="text-sm text-muted-foreground">Available Services:</div>
        {allServices.map((service) => {
          const isSelected = (form.watch("services") || []).some((s) => s.serviceId === service._id);
          return (
            <div key={service._id} className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/50">
              <Checkbox
                id={service._id}
                checked={isSelected}
                onCheckedChange={(checked) => toggleService(service, checked)}
                disabled={isSubmitting}
              />
              <label htmlFor={service._id} className="flex-1 cursor-pointer text-sm">
                <div className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <div className="text-sm text-muted-foreground">৳{service.price} • {service.duration}min</div>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-3 mt-3 space-y-1">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Services Subtotal:</span>
          <span>৳{(form.watch("services") || []).reduce((sum, s) => sum + (Number(s.price) || 0), 0)}</span>
        </div>
        {Number(form.watch("additionalCost")) > 0 && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Additional Cost:</span>
            <span>৳{form.watch("additionalCost")}</span>
          </div>
        )}
        <div className="flex justify-between items-center font-medium">
          <span>Total Amount:</span>
          <span className="text-primary">৳{computedTotals.totalAmount}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Total Duration:</span>
          <span>{computedTotals.totalDuration} mins</span>
        </div>
      </div>
    </div>
  );

  const scheduleTab = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateInput control={form.control} name="appointmentDate" label="Appointment Date" disabled={isSubmitting} />
        <SelectInput
          control={form.control}
          name="appointmentTime"
          label="Appointment Time"
          placeholder={selectedDayKey ? (timeOptions.length ? "Select a time" : "No times available") : "Select date first"}
          items={timeOptions}
          disabled={isSubmitting || !selectedDayKey || timeOptions.length === 0}
        />
        <SelectInput control={form.control} name="serviceType" label="Service Type" items={SERVICE_TYPE_OPTIONS} disabled={isSubmitting} />
      </div>
      {form.watch("serviceType") === 'at-home' && (
        <FormInput control={form.control} name="serviceAddress" label="Service Address" disabled={isSubmitting} />
      )}
    </div>
  );

  const paymentTab = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectInput control={form.control} name="status" label="Status" items={BOOKING_STATUS_OPTIONS} disabled={isSubmitting} />
        <SelectInput control={form.control} name="paymentStatus" label="Payment Status" items={PAYMENT_STATUS_OPTIONS} disabled={isSubmitting} />
        <SelectInput control={form.control} name="paymentMethod" label="Payment Method" items={PAYMENT_METHOD_OPTIONS} disabled={isSubmitting} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={form.control}
          name="additionalCost"
          label="Additional Cost (৳)"
          type="number"
          min="0"
          disabled={isSubmitting}
          transform={{ input: (v) => (v?.toString() ?? "0"), output: (v) => Number(v) || 0 }}
        />
        {Number(form.watch("additionalCost")) > 0 && (
          <FormInput
            control={form.control}
            name="additionalCostReason"
            label="Reason for Additional Cost"
            placeholder="e.g., Damage charges, Extra time, ..."
            disabled={isSubmitting}
          />
        )}
      </div>
    </div>
  );

  const notesTab = (
    <FormTextarea control={form.control} name="notes" label="Notes" rows={3} placeholder="Add any special notes..." disabled={isSubmitting} />
  );

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-6">
        <DynamicTabs
          defaultValue="customer"
          tabs={[
            { value: "customer", label: "Customer", content: customerTab },
            { value: "services", label: "Services", content: servicesTab },
            { value: "schedule", label: "Schedule", content: scheduleTab },
            { value: "payment", label: "Payment", content: paymentTab },
            { value: "notes", label: "Notes", content: notesTab },
          ]}
        />

        <FormErrorSummary errors={formErrors} />

        {!hideActions && (
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="flex-1">
              {isEdit ? "Close" : "Cancel"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}