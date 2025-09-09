import { SheetWrapper } from "@/components/custom/ui/sheet-wrapper";
import { ParlourForm } from "@/components/platform/parlour/parlour.form";

export function ParlourSheet({ token, open, onOpenChange, parlour = null }) {
  const isEdit = !!parlour;

  const handleSuccess = () => {
    if (!isEdit) onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <SheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Parlour" : "Add New Parlour"}
      description={isEdit ? "Update parlour details" : "Create a new parlour profile"}
      size="lg"
      className="px-4"
    >
      <ParlourForm
        token={token}
        parlour={parlour}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        showOwnershipFields={true}
        canEditAdminFields={true}
      />
    </SheetWrapper>
  );
}


