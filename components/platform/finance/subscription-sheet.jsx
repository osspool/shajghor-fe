"use client";
import { SheetWrapper } from "@/components/custom/ui/sheet-wrapper";
import { SubscriptionForm } from "@/components/platform/finance/subscription.form";

export function SubscriptionSheet({
  token,
  open,
  onOpenChange,
  organizationId,
  // Accept both 'subscription' and legacy 'transaction' prop from caller
  subscription = null,
  transaction = null,
  restrictToPayment = false,
}) {
  const current = subscription || transaction || null;
  const isEdit = !!current;

  const handleSuccess = () => {
    if (!isEdit) onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <SheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Subscription" : "Add New Subscription"}
      description={isEdit ? "Update subscription details" : "Create a new subscription"}
      size="lg"
      className="px-4"
      footer={(
        <div className="flex gap-2 w-full">
          <button type="button" className="flex-1 btn btn-outline" onClick={handleCancel}>
            {isEdit ? "Close" : "Cancel"}
          </button>
          <button type="submit" form="subscription-sheet-form" className="flex-1 btn btn-primary">
            {isEdit
              ? (restrictToPayment ? "Request Payment" : "Update Subscription")
              : "Create Subscription"}
          </button>
        </div>
      )}
    >
      <SubscriptionForm
        token={token}
        organizationId={organizationId}
        subscription={current}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        restrictToPayment={restrictToPayment}
        formId="subscription-sheet-form"
      />
    </SheetWrapper>
  );
}


