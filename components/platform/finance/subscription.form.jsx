"use client";
import { useMemo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FormInput from "@/components/form-utils/form-input";
import FormTextarea from "@/components/form-utils/form-textarea";
import SelectInput from "@/components/form-utils/select-input";
import DateInput from "@/components/form-utils/date-input";
import { FormErrorSummary } from "@/components/form-utils/FormErrorSummary";
import { useSubscriptionActions } from "@/hooks/query/useSubscriptions";
import { getIdString } from "@/lib/utils";
import { subscriptionCreateBody } from "@/schemas/subscription.schema";

// schema imported from @/schemas/subscription.schema

const BILLING_CYCLE_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
  { label: "Custom", value: "custom" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "Expired", value: "expired" },
];

export function SubscriptionForm({
  token,
  organizationId,
  subscription = null,
  onSuccess,
  onCancel,
  restrictToPayment = false,
  formId = "subscription-sheet-form",
}) {
  const isEdit = !!subscription;

  const defaultValues = useMemo(
    () => ({
      organizationId: getIdString(subscription?.organizationId) || getIdString(organizationId) || "",
      planName: subscription?.planName || "",
      price: subscription?.price ?? 0,
      currency: subscription?.currency || "BDT",
      billingCycle: subscription?.billingCycle || "monthly",
      status: subscription?.status || "active",
      paymentRequest: {
        method: subscription?.paymentRequest?.method || "",
        senderAccount: subscription?.paymentRequest?.senderAccount || "",
        reference: subscription?.paymentRequest?.reference || "",
        amount: subscription?.paymentRequest?.amount ?? undefined,
        transactionDate: subscription?.paymentRequest?.transactionDate || undefined,
        notes: subscription?.paymentRequest?.notes || "",
      },
      verifiedAt: subscription?.verifiedAt || undefined,
      verifiedBy: getIdString(subscription?.verifiedBy) || "",
      periodStart: subscription?.periodStart || undefined,
      periodEnd: subscription?.periodEnd || undefined,
    }),
    [subscription, organizationId, getIdString]
  );

  const form = useForm({
    resolver: zodResolver(subscriptionCreateBody),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
  });

  const {
    createSubscription,
    updateSubscription,
    isCreating,
    isUpdating,
  } = useSubscriptionActions();
  const isSubmitting = isCreating || isUpdating;
  const formErrors = form.formState.errors;

  const handleSubmitForm = useCallback(
    async (data) => {
      try {
        const normalized = {
          ...data,
          organizationId: getIdString(data.organizationId) || getIdString(organizationId),
          price: Number(data.price) || 0,
          paymentRequest: data.paymentRequest
            ? {
                method: data.paymentRequest.method || undefined,
                senderAccount: data.paymentRequest.senderAccount || undefined,
                reference: data.paymentRequest.reference || undefined,
                amount:
                  data.paymentRequest.amount === undefined || data.paymentRequest.amount === null
                    ? undefined
                    : Number(data.paymentRequest.amount),
                transactionDate: data.paymentRequest.transactionDate || undefined,
                notes: data.paymentRequest.notes || undefined,
              }
            : undefined,
          verifiedAt: data.verifiedAt || undefined,
          verifiedBy: data.verifiedBy || undefined,
          periodStart: data.periodStart || undefined,
          periodEnd: data.periodEnd || undefined,
        };

        if (isEdit) {
          await updateSubscription({ token, id: subscription._id, data: normalized });
        } else {
          await createSubscription({ token, data: normalized });
        }
        toast.success(isEdit ? "Subscription updated" : "Subscription created");
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} subscription`);
      }
    },
    [isEdit, updateSubscription, createSubscription, token, subscription?._id, onSuccess, organizationId, getIdString]
  );

  const handleFormError = useCallback(() => {
    toast.error("Please fix the validation errors before submitting");
  }, []);

  const [showAdvanced, setShowAdvanced] = useState(!!restrictToPayment);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleSubmitForm, handleFormError)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput control={form.control} name="organizationId" label="Organization ID" disabled={isSubmitting || restrictToPayment} required />
          <FormInput control={form.control} name="planName" label="Plan Name" placeholder="e.g., Pro" disabled={isSubmitting || restrictToPayment} />
          <FormInput
            control={form.control}
            name="price"
            label="Price (৳)"
            type="number"
            min="0"
            disabled={isSubmitting || restrictToPayment}
            required
            transform={{ input: (v) => (v === undefined || v === null ? "0" : String(v)), output: (v) => Number(v) || 0 }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput control={form.control} name="currency" label="Currency" placeholder="BDT" disabled={isSubmitting || restrictToPayment} />
          <SelectInput control={form.control} name="billingCycle" label="Billing Cycle" items={BILLING_CYCLE_OPTIONS} disabled={isSubmitting || restrictToPayment} />
          <SelectInput control={form.control} name="status" label="Status" items={STATUS_OPTIONS} disabled={isSubmitting || restrictToPayment} />
        </div>

        {/* Payment request fields */}
        <div className="space-y-3">
          <button type="button" className="text-sm text-primary hover:underline" onClick={() => setShowAdvanced((v) => !v)}>
            {showAdvanced ? "Hide options" : "More options"}
          </button>
          {showAdvanced && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput control={form.control} name="paymentRequest.method" label="Payment Method" placeholder="bkash/bank/cash" disabled={isSubmitting} />
                <FormInput control={form.control} name="paymentRequest.senderAccount" label="Sender Account" placeholder="Account / Wallet" disabled={isSubmitting} />
                <FormInput control={form.control} name="paymentRequest.reference" label="Reference" placeholder="Reference" disabled={isSubmitting} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  control={form.control}
                  name="paymentRequest.amount"
                  label="Payment Amount"
                  type="number"
                  min="0"
                  disabled={isSubmitting}
                  transform={{ input: (v) => (v === undefined || v === null ? "" : String(v)), output: (v) => (v === "" ? undefined : Number(v) || 0) }}
                />
                <DateInput control={form.control} name="paymentRequest.transactionDate" label="Transaction Date" disabled={isSubmitting} />
                <FormInput control={form.control} name="verifiedBy" label="Verified By (User ID)" placeholder="Optional" disabled={isSubmitting || restrictToPayment} />
              </div>
              <FormTextarea control={form.control} name="paymentRequest.notes" label="Payment Notes" rows={3} placeholder="Add any notes..." disabled={isSubmitting} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DateInput control={form.control} name="verifiedAt" label="Verified At" disabled={isSubmitting || restrictToPayment} />
                <DateInput control={form.control} name="periodStart" label="Period Start" disabled={isSubmitting || restrictToPayment} />
                <DateInput control={form.control} name="periodEnd" label="Period End" disabled={isSubmitting || restrictToPayment} />
              </div>
            </div>
          )}
        </div>

        <FormErrorSummary errors={formErrors} />
      </form>
    </Form>
  );
}


