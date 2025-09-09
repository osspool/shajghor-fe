"use client";
import { Button } from "@/components/ui/button";
import { DialogWrapper } from "@/components/custom/ui/dialog-wrapper";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-utils/form-input";
import FormTextarea from "@/components/form-utils/form-textarea";
import SwitchInput from "@/components/form-utils/switch-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceBaseSchema } from "@/schemas/service.schema";

export function ServiceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  isSubmitting,
  title = "Add New Service",
  trigger,
}) {
  const form = useForm({
    resolver: zodResolver(serviceBaseSchema),
    mode: "onChange",
    defaultValues: initialValues,
    values: initialValues, // keep in sync when props change
  });

  return (
    <DialogWrapper open={open} onOpenChange={onOpenChange} title={title} size="default" trigger={trigger} contentClassName="max-h-[90vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput control={form.control} name="name" label="Service Name" placeholder="e.g. Hair Cut & Style" required disabled={isSubmitting} />
            <FormTextarea control={form.control} name="description" label="Description" placeholder="Brief description of the service" rows={3} disabled={isSubmitting} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="price"
                label="Price (৳)"
                type="number"
                required
                disabled={isSubmitting}
                transform={{ input: (v) => (v ?? 0).toString(), output: (v) => (v === "" ? 0 : parseFloat(v)) }}
              />
              <FormInput
                control={form.control}
                name="duration"
                label="Duration (minutes)"
                type="number"
                required
                disabled={isSubmitting}
                transform={{ input: (v) => (v ?? 30).toString(), output: (v) => (v === "" ? 1 : parseInt(v)) }}
              />
            </div>
            <FormInput control={form.control} name="category" label="Category (optional)" placeholder="e.g. Hair Care" disabled={isSubmitting} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SwitchInput control={form.control} name="isActive" label="Active" labelPosition="top" disabled={isSubmitting} />
              <SwitchInput control={form.control} name="isFeatured" label="Featured" labelPosition="top" disabled={isSubmitting} />
              <SwitchInput control={form.control} name="isDiscount" label="Discount" labelPosition="top" disabled={isSubmitting} />
            </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-primary">
              {isSubmitting ? "Saving..." : title.includes("Edit") ? "Update Service" : "Create Service"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}


