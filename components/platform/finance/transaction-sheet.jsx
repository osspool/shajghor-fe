"use client";
import { SheetWrapper } from "@/components/custom/ui/sheet-wrapper";
import { TransactionForm } from "@/components/platform/finance/transaction.form";

export function TransactionSheet({
  token,
  open,
  onOpenChange,
  organizationId,
  parlourId,
  transaction = null,
}) {
  const isEdit = !!transaction;

  const handleSuccess = () => {
    if (!isEdit) onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <SheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Transaction" : "Add New Transaction"}
      description={isEdit ? "Update transaction details" : "Create a new transaction"}
      size="lg"
      className="px-4"
      footer={(
        <div className="flex gap-2 w-full">
          <button type="button" className="flex-1 btn btn-outline" onClick={handleCancel}>
            {isEdit ? "Close" : "Cancel"}
          </button>
          <button type="submit" form="transaction-sheet-form" className="flex-1 btn btn-primary">
            {isEdit ? "Update Transaction" : "Create Transaction"}
          </button>
        </div>
      )}
    >
      <TransactionForm
        token={token}
        organizationId={organizationId}
        parlourId={parlourId}
        transaction={transaction}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        formId="transaction-sheet-form"
      />
    </SheetWrapper>
  );
}


