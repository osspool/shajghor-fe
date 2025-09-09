"use client";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { transactionSchema } from "@/schemas/transaction.schema";
import FormInput from "@/components/form-utils/form-input";
import FormTextarea from "@/components/form-utils/form-textarea";
import SelectInput from "@/components/form-utils/select-input";
import DateInput from "@/components/form-utils/date-input";
import { FormErrorSummary } from "@/components/form-utils/FormErrorSummary";
import {
  PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_CATEGORIES,
} from "@/constants/booking-constants";
import { useTransactionActions } from "@/hooks/query/useTransactions";
import { Wallet, Tag, Calendar, User2, Hash, CreditCard, Landmark, UserCog, Building2, NotebookPen } from "lucide-react";
import { getIdString } from "@/lib/utils";

const INCOME_CATEGORIES = [
  TRANSACTION_CATEGORIES.BOOKING,
  TRANSACTION_CATEGORIES.OTHER,
  TRANSACTION_CATEGORIES.CAPITAL_INJECTION,
];
const EXPENSE_CATEGORIES = [
  TRANSACTION_CATEGORIES.OWNER_WITHDRAWAL,
  TRANSACTION_CATEGORIES.REFUND,
  TRANSACTION_CATEGORIES.SALARY,
  TRANSACTION_CATEGORIES.CASH_ADJUSTMENT,
  TRANSACTION_CATEGORIES.PLATFORM_FEES,
  TRANSACTION_CATEGORIES.OTHER,
];

export function TransactionForm({
  token,
  organizationId,
  parlourId,
  transaction = null,
  onSuccess,
  onCancel,
  formId = "transaction-sheet-form",
}) {
  const isEdit = !!transaction;
  const { parlour } = useAdminTenant();
  const handledByOwnerId = parlour?.ownerId || "";



  const defaultValues = useMemo(
    () => ({
      organizationId: getIdString(transaction?.organizationId) || getIdString(organizationId) || "",
      parlourId: getIdString(transaction?.parlourId) || getIdString(parlourId) || "",
      bookingId: transaction?.bookingId || "",
      customerId: transaction?.customerId || "",
      handledBy: transaction?.handledBy || handledByOwnerId || "",
      type: transaction?.type || "income",
      category: transaction?.category || undefined,
      amount: transaction?.amount ?? 0,
      method: transaction?.method || "cash",
      paymentDetails: {
        provider: transaction?.paymentDetails?.provider || "",
        walletNumber: transaction?.paymentDetails?.walletNumber || "",
        transactionId: transaction?.paymentDetails?.transactionId || "",
        bankName: transaction?.paymentDetails?.bankName || "",
        accountNumber: transaction?.paymentDetails?.accountNumber || "",
        senderName: transaction?.paymentDetails?.senderName || "",
      },
      reference: transaction?.reference || "",
      notes: transaction?.notes || "",
      date: transaction?.date || undefined,
    }),
    [transaction, organizationId, parlourId, handledByOwnerId, getIdString]
  );

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
  });

  const { createTransaction, updateTransaction, isCreating, isUpdating } =
    useTransactionActions();
  const isSubmitting = isCreating || isUpdating;
  const formErrors = form.formState.errors;

  const typeWatch = form.watch("type");
  const methodWatch = form.watch("method");
  const categoryWatch = form.watch("category");

  const categoryOptions = useMemo(() => {
    const allowed = typeWatch === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    return TRANSACTION_CATEGORY_OPTIONS.filter((opt) => allowed.includes(opt.value));
  }, [typeWatch]);

  // Dynamic payment fields per method
  const PAYMENT_FIELDS_BY_METHOD = useMemo(() => ({
    cash: [],
    bkash: ["walletNumber", "transactionId", "senderName"],
    nagad: ["walletNumber", "transactionId", "senderName"],
    online: ["provider", "transactionId", "senderName"],
    bank: ["bankName", "accountNumber", "transactionId", "senderName"],
  }), []);

  const FIELD_LABELS = useMemo(() => ({
    provider: "Provider",
    walletNumber: methodWatch === "bkash" ? "bKash Number" : methodWatch === "nagad" ? "Nagad Number" : "Wallet/Account No",
    transactionId: methodWatch === "bkash" ? "bKash TrxID" : methodWatch === "nagad" ? "Nagad TxnId" : "Transaction ID",
    bankName: "Bank Name",
    accountNumber: "Account Number",
    senderName: "Sender Name",
  }), [methodWatch]);

  const FIELD_ICONS = {
    provider: CreditCard,
    walletNumber: User2,
    transactionId: Hash,
    bankName: Landmark,
    accountNumber: CreditCard,
    senderName: User2,
  };

  // Keep paymentDetails controlled and prefill provider per method
  useEffect(() => {
    const method = methodWatch;
    const current = form.getValues("paymentDetails") || {};
    const base = {
      provider: current.provider ?? "",
      walletNumber: current.walletNumber ?? "",
      transactionId: current.transactionId ?? "",
      bankName: current.bankName ?? "",
      accountNumber: current.accountNumber ?? "",
      senderName: current.senderName ?? "",
    };

    if (method === "bkash" || method === "nagad") {
      if (base.provider !== method) {
        form.setValue("paymentDetails.provider", method, { shouldValidate: false, shouldDirty: true });
      }
    } else if (method === "bank") {
      if (base.provider !== "bank") {
        form.setValue("paymentDetails.provider", "bank", { shouldValidate: false, shouldDirty: true });
      }
    } else if (method === "cash") {
      // Clear provider for cash
      if (base.provider !== "") {
        form.setValue("paymentDetails.provider", "", { shouldValidate: false, shouldDirty: true });
      }
    }
  }, [methodWatch, form]);

  const handleSubmitForm = useCallback(
    async (data) => {
      try {
        // Normalize paymentDetails based on method to avoid sending irrelevant keys
        let paymentDetails = undefined;
        if (data.method !== "cash") {
          const src = data.paymentDetails || {};
          if (data.method === "bank") {
            paymentDetails = {
              bankName: src.bankName || undefined,
              accountNumber: src.accountNumber || undefined,
              transactionId: src.transactionId || undefined,
              senderName: src.senderName || undefined,
              provider: src.provider || undefined,
            };
          } else {
            // wallets and online
            paymentDetails = {
              provider: src.provider || data.method,
              walletNumber: src.walletNumber || undefined,
              transactionId: src.transactionId || undefined,
              senderName: src.senderName || undefined,
            };
          }
        }

        const normalized = {
          ...data,
          organizationId: getIdString(data.organizationId) || getIdString(organizationId),
          parlourId: getIdString(data.parlourId) || getIdString(parlourId),
          handledBy: data.handledBy || handledByOwnerId,
          bookingId: data.category === TRANSACTION_CATEGORIES.BOOKING ? data.bookingId || undefined : undefined,
          paymentDetails,
          amount: Number(data.amount) || 0,
          date: data.date || undefined,
        };

        if (isEdit) {
          await updateTransaction({ token, id: transaction._id, data: normalized });
        } else {
          await createTransaction({ token, data: normalized });
        }
        toast.success(isEdit ? "Transaction updated" : "Transaction created");
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} transaction`);
      }
    },
    [isEdit, updateTransaction, createTransaction, token, transaction?._id, onSuccess, organizationId, parlourId, handledByOwnerId, getIdString]
  );

  const handleFormError = useCallback(() => {
    toast.error("Please fix the validation errors before submitting");
  }, []);

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleSubmitForm, handleFormError)} className="space-y-6">
        {/* Essentials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectInput control={form.control} name="type" label="Type" items={TRANSACTION_TYPE_OPTIONS} disabled={isSubmitting} />
          <SelectInput control={form.control} name="category" label="Category" items={categoryOptions} placeholder="Select category" disabled={isSubmitting} />
          <FormInput
            control={form.control}
            name="amount"
            label="Amount (৳)"
            type="number"
            min="0"
            disabled={isSubmitting}
            required
            transform={{ input: (v) => (v === undefined || v === null ? "0" : String(v)), output: (v) => Number(v) || 0 }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateInput control={form.control} name="date" label="Date" disabled={isSubmitting} />
          <SelectInput control={form.control} name="method" label="Payment Method" items={PAYMENT_METHOD_OPTIONS} disabled={isSubmitting} />
          {categoryWatch === TRANSACTION_CATEGORIES.BOOKING && (
            <FormInput control={form.control} name="bookingId" label="Booking ID" placeholder="Required for booking" disabled={isSubmitting} required />
          )}
        </div>

        {PAYMENT_FIELDS_BY_METHOD[methodWatch]?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PAYMENT_FIELDS_BY_METHOD[methodWatch].map((fieldKey) => (
              <FormInput
                key={fieldKey}
                control={form.control}
                name={`paymentDetails.${fieldKey}`}
                label={FIELD_LABELS[fieldKey] || fieldKey}
                disabled={isSubmitting}
              />
            ))}
          </div>
        )}

        {/* Advanced */}
        <div className="space-y-3">
          <button type="button" className="text-sm text-primary hover:underline" onClick={() => setShowAdvanced((v) => !v)}>
            {showAdvanced ? "Hide options" : "More options"}
          </button>
          {showAdvanced && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput control={form.control} name="customerId" label="Customer ID" placeholder="Optional" disabled={isSubmitting} />
                <FormInput control={form.control} name="reference" label="Reference" placeholder="Optional" disabled={isSubmitting} />
              </div>
              <FormTextarea control={form.control} name="notes" label="Notes" rows={3} placeholder="Add any notes..." disabled={isSubmitting} />
            </div>
          )}
        </div>

        <FormErrorSummary errors={formErrors} />
      </form>
    </Form>
  );
}