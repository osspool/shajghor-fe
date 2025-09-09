"use client";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-utils/form-input";
import SwitchInput from "@/components/form-utils/switch-input";
import SelectInput from "@/components/form-utils/select-input";
import FormTextarea from "@/components/form-utils/form-textarea";
import { Badge } from "@/components/ui/badge";
import { employeeCreateBody } from "@/schemas/employee.schema";
import { EMPLOYEE_ROLE_OPTIONS } from "@/constants/platform-constants";
import { useEmployeeActions } from "@/hooks/query/useEmployees";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function EmployeeForm({ token, organizationId, parlourId, employee = null, user = null, onSuccess, onCancel }) {
  const isEdit = !!employee;
  const { createEmployee, updateEmployee, isCreating, isUpdating } = useEmployeeActions();

  const defaultValues = useMemo(() => ({
    userId: typeof employee?.userId === "object" ? (employee?.userId?._id || "") : (employee?.userId || ""),
    parlourId: employee?.parlourId || parlourId || "",
    role: employee?.role || undefined,
    title: employee?.title || "",
    active: employee?.active ?? true,
    salaryAmount: employee?.salaryAmount ?? 0,
    salaryCurrency: "BDT",
    salaryNotes: employee?.salaryNotes || "",
  }), [employee, parlourId]);

  const form = useForm({
    resolver: zodResolver(employeeCreateBody),
    defaultValues,
    mode: "onSubmit",
  });

  const isSubmitting = isCreating || isUpdating;

  const displayUser = useMemo(() => {
    if (user) return user;
    if (employee && typeof employee.userId === "object") return employee.userId;
    return null;
  }, [user, employee]);

  // Sync selected user from parent
  useEffect(() => {
    if (user?._id) {
      const current = form.getValues("userId");
      if (!current) {
        form.setValue("userId", user._id, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [user?._id]);

  const onSubmit = useCallback(async (data) => {
    try {
      const normalized = { ...data, organizationId: organizationId || undefined, salaryCurrency: "BDT" };
      if (isEdit) {
        await updateEmployee({ token, id: employee._id, data: normalized });
      } else {
        await createEmployee({ token, data: normalized });
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} employee`);
    }
  }, [isEdit, updateEmployee, createEmployee, token, employee?._id, organizationId, onSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Assignment */}
        <div className="space-y-3">
          {!form.watch("userId") && (
            <Alert>
              <AlertDescription>
                Search and select a user by email to assign as employee.
              </AlertDescription>
            </Alert>
          )}

          {/* Hidden fields to submit values while keeping UI compact */}
          <input type="hidden" {...form.register("userId")} />
          <input type="hidden" {...form.register("parlourId")} />

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="font-normal">User ID: {form.watch("userId") || "—"}</Badge>
            <Badge variant="secondary" className="font-normal">Parlour ID: {form.watch("parlourId") || "—"}</Badge>
          </div>

          {displayUser && (
            <div className="text-sm text-muted-foreground">
              Selected user: {displayUser.name || displayUser.email}
            </div>
          )}
        </div>

        {/* Employment Details */}
        <div className="border rounded-md p-4 space-y-4">
          <div className="text-sm font-medium">Employment Details</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectInput control={form.control} name="role" label="Role" items={EMPLOYEE_ROLE_OPTIONS} disabled={isSubmitting} />
            <FormInput control={form.control} name="title" label="Title" placeholder="e.g., Senior Stylist" disabled={isSubmitting} />
            <SwitchInput control={form.control} name="active" label="Active" disabled={isSubmitting} />
          </div>
        </div>

        {/* Compensation */}
        <div className="border rounded-md p-4 space-y-4">
          <div className="text-sm font-medium">Compensation</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <FormInput
              control={form.control}
              name="salaryAmount"
              label="Salary Amount"
              type="number"
              min="0"
              disabled={isSubmitting}
              transform={{ input: (v) => (v?.toString() ?? "0"), output: (v) => Number(v) || 0 }}
            />
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">Currency</div>
              <Badge className="w-fit">BDT</Badge>
            </div>
            <div className="hidden md:block" />
          </div>
          <FormTextarea control={form.control} name="salaryNotes" label="Salary Notes" rows={3} placeholder="Optional notes about compensation" disabled={isSubmitting} />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting || !form.watch("userId")} className="flex-1">
            {isSubmitting ? "Saving..." : isEdit ? "Update Employee" : "Create Employee"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="flex-1">
            {isEdit ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}


