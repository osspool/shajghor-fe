import { SheetWrapper } from "@/components/custom/ui/sheet-wrapper";
import { Button } from "@/components/ui/button";
import { ParlourForm } from "./parlour.form";

export function ParlourSheet({ token, open, onOpenChange, parlour = null, showOwnershipFields = false, canEditAdminFields = false }) {
  const isEdit = !!parlour && !parlour?.__action;

  const handleSuccess = () => {
    if (!isEdit) onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <SheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Parlour" : "Add New Parlour"}
      description={
        isEdit ? "Update parlour details" : "Create a new parlour profile"
      }
      size="lg"
      className="px-4"
      footer={(
        <div className="flex gap-2 w-full">
          <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
            {isEdit ? "Close" : "Cancel"}
          </Button>
          <Button type="submit" form="parlour-sheet-form" className="flex-1">
            {isEdit ? "Update Parlour" : "Create Parlour"}
          </Button>
        </div>
      )}
    >
      <ParlourForm
        token={token}
        parlour={isEdit ? parlour : null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        showOwnershipFields={showOwnershipFields}
        formId="parlour-sheet-form"
        hideActions
        canEditAdminFields={canEditAdminFields}
      />
    </SheetWrapper>
  );
}


