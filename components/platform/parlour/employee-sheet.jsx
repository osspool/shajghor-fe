"use client";
import { SheetWrapper } from "@/components/custom/ui/sheet-wrapper";
import { EmployeeForm } from "@/components/platform/parlour/employee.form";

export function EmployeeSheet({
  token,
  open,
  onOpenChange,
  organizationId,
  parlourId,
  employee = null,
  user = null,
}) {
  const isEdit = !!employee;

  const handleSuccess = () => {
    if (!isEdit) onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <SheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Employee" : "Add New Employee"}
      description={isEdit ? "Update employee details" : "Create a new employee"}
      size="lg"
      className="px-4"
    >
      <EmployeeForm
        token={token}
        organizationId={organizationId}
        parlourId={parlourId}
        employee={employee}
        user={user}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </SheetWrapper>
  );
}


