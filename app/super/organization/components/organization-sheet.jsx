import { SheetWrapper } from "@/components/custom/ui/sheet-wrapper";
import { OrganizationForm } from "@/components/platform/organization/organization.form";

export function OrganizationSheet({ token, open, onOpenChange, organization = null }) {
  const isEdit = !!organization;

  const handleSuccess = () => {
    if (!isEdit) onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <SheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Organization" : "Add New Organization"}
      description={isEdit ? "Update organization details" : "Create a new organization"}
      size="lg"
      className="px-4"
    >
      <OrganizationForm
        token={token}
        organization={organization}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </SheetWrapper>
  );
}


