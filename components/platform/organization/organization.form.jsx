"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-utils/form-input";
import SwitchInput from "@/components/form-utils/switch-input";
import DateInput from "@/components/form-utils/date-input";
import { organizationSchema } from "@/schemas";
import { useOrganizationActions } from "@/hooks/query/useOrganizations";
import { toast } from "sonner";
import { FormErrorSummary } from "@/components/form-utils/FormErrorSummary";

export function OrganizationForm({ token, organization = null, onSuccess, onCancel }) {
  const isEdit = !!organization;

  const { createOrganization, updateOrganization, deleteOrganization, isCreating, isUpdating, isDeleting } =
    useOrganizationActions();

  const defaultValues = useMemo(
    () => ({
      name: organization?.name || "",
      ownerId: organization?.ownerId || "",
      address: organization?.address || "",
      phone: organization?.phone || "",
      email: organization?.email || "",
      billingPrice: organization?.billingPrice ?? 0,
      billingCurrency: organization?.billingCurrency || "BDT",
      lastPaidAt: organization?.lastPaidAt || "",
      lastPaidMethod: organization?.lastPaidMethod || "",
      billingNotes: organization?.billingNotes || "",
      isActive: organization?.isActive ?? true,
    }),
    [organization]
  );

  const form = useForm({
    resolver: zodResolver(organizationSchema),
    mode: "onChange",
    defaultValues,
  });

  const isSubmitting = isCreating || isUpdating || isDeleting;
  const formErrors = form.formState.errors;

  const onSubmit = useCallback(
    async (data) => {
      try {
        const normalized = {
          ...data,
          ownerId: data.ownerId ? data.ownerId : undefined,
          lastPaidAt: data.lastPaidAt
            ? (data.lastPaidAt instanceof Date
                ? data.lastPaidAt.toISOString()
                : new Date(data.lastPaidAt).toISOString())
            : undefined,
        };
        if (isEdit) {
          await updateOrganization({ token, id: organization._id, data: normalized });
        } else {
          await createOrganization({ token, data: normalized });
          onSuccess?.();
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} organization`);
      }
    },
    [isEdit, updateOrganization, createOrganization, token, organization?._id, onSuccess]
  );

  const handleDelete = useCallback(async () => {
    if (!organization?._id) return;
    try {
      await deleteOrganization({ token, id: organization._id });
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to delete organization");
    }
  }, [organization?._id, deleteOrganization, token, onSuccess]);

  const handleFormError = useCallback((errors) => {
    toast.error("Please fix the validation errors before submitting");
    console.log("Organization form validation failed:", errors);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput control={form.control} name="name" label="Name" required disabled={isSubmitting} />
          <FormInput control={form.control} name="ownerId" label="Owner ID" placeholder="24-hex ObjectId" disabled={isSubmitting} />
          <FormInput control={form.control} name="phone" label="Phone" disabled={isSubmitting} />
          <FormInput control={form.control} name="email" label="Email" disabled={isSubmitting} />
          <FormInput control={form.control} name="address" label="Address" disabled={isSubmitting} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            control={form.control}
            name="billingPrice"
            label="Billing Price"
            type="number"
            min="0"
            disabled={isSubmitting}
            transform={{ input: (v) => (v ?? 0).toString(), output: (v) => parseFloat(v) || 0 }}
          />
          <FormInput control={form.control} name="billingCurrency" label="Currency" placeholder="BDT" disabled={isSubmitting} />
          <FormInput control={form.control} name="lastPaidMethod" label="Last Paid Method" placeholder="bkash/nagad/bank" disabled={isSubmitting} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateInput control={form.control} name="lastPaidAt" label="Last Paid At" disabled={isSubmitting} />
          <FormInput control={form.control} name="billingNotes" label="Billing Notes" disabled={isSubmitting} />
        </div>

        <SwitchInput control={form.control} name="isActive" label="Active" disabled={isSubmitting} />

        <FormErrorSummary errors={formErrors} />

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Saving..." : isEdit ? "Update Organization" : "Create Organization"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {isEdit ? "Close" : "Cancel"}
          </Button>
          {isEdit && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}


