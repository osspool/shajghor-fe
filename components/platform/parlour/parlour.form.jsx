"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-utils/form-input";
import FormTextarea from "@/components/form-utils/form-textarea";
import SelectInput from "@/components/form-utils/select-input";
import TagInput from "@/components/form-utils/tag-input";
import SwitchInput from "@/components/form-utils/switch-input";
import RadioInput from "@/components/form-utils/radio-input";
import { parlourSchema } from "@/schemas/parlour.schema";
import { useParlourActions } from "@/hooks/query/useParlours";
import { toast } from "sonner";
import { FormErrorSummary } from "@/components/form-utils/FormErrorSummary";
import { DynamicTabs } from "@/components/custom/ui/tabs-wrapper";
import { WeeklyWorkingHours } from "./weekly-working-hours";
import { PopularCities, PopularAreasByCity } from "@/constants/locations";
import { PARLOUR_TAGS } from "@/constants/tags";

export function ParlourForm({ token, parlour = null, onSuccess, onCancel, showOwnershipFields = false, formId = "parlour-form", hideActions = false, canEditAdminFields = false }) {
  const isEdit = !!parlour;

  const { createParlour, updateParlour, deleteParlour, isCreating, isUpdating, isDeleting } =
    useParlourActions();

  const defaultValues = useMemo(
    () => ({
      slug: parlour?.slug || "",
      name: parlour?.name || "",
      branch: parlour?.branch || "",
      ownerId: parlour?.ownerId || "",
      organizationId: parlour?.organizationId || "",
      address: parlour?.address || { address: "", city: PopularCities.DHAKA, area: "", zipCode: "" },
      phone: parlour?.phone || "",
      email: parlour?.email || "",
      coverImage: parlour?.coverImage || "",
      socialLinks: parlour?.socialLinks || {},
      socialMediaUrl: parlour?.socialMediaUrl || {
        instagram: "",
        facebook: "",
        tiktok: "",
        youtube: "",
        website: "",
      },
      workingHours: parlour?.workingHours || {},
      breaks: parlour?.breaks || [],
      providerType: parlour?.providerType || "salon",
      serviceLocationMode: parlour?.serviceLocationMode || "in-salon",
      serviceTypes: parlour?.serviceTypes || [],
      tags: parlour?.tags || [],
      capacity: parlour?.capacity ?? 1,
      slotDurationMinutes: parlour?.slotDurationMinutes ?? 30,
      leadTimeMinutes: parlour?.leadTimeMinutes ?? 0,
      dailyCutoffTime: parlour?.dailyCutoffTime || "",
      isActive: parlour?.isActive ?? true,
      hasOffers: parlour?.hasOffers ?? false,
      isFeatured: parlour?.isFeatured ?? false,
      offerText: parlour?.offerText || "",
      about: parlour?.about || { title: "", description: "", features: [] },
      portfolio: parlour?.portfolio || [],
      advert: parlour?.advert || {
        running: false,
        startTime: "",
        endTime: "",
        adImage: "",
        adLink: "",
        adText: "",
        adButtonText: "",
      },
    }),
    [parlour]
  );

  const form = useForm({
    resolver: zodResolver(parlourSchema),
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
          // Normalize tags for consistent search (trim, lowercase, unique)
          tags: Array.from(
            new Set(
              (data.tags || [])
                .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
                .filter((t) => t)
            )
          ),
          branch: data.branch ? data.branch : undefined,
          ownerId: data.ownerId ? data.ownerId : undefined,
          organizationId: data.organizationId ? data.organizationId : undefined,
          address: data.address
            ? {
                address: data.address.address || undefined,
                city: data.address.city || undefined,
                area: data.address.area || undefined,
                zipCode: data.address.zipCode || undefined,
                coordinates:
                  data.address.coordinates &&
                  data.address.coordinates[0] !== undefined &&
                  data.address.coordinates[1] !== undefined &&
                  data.address.coordinates[0] !== "" &&
                  data.address.coordinates[1] !== ""
                    ? [
                        Number(data.address.coordinates[0]),
                        Number(data.address.coordinates[1]),
                      ]
                    : undefined,
              }
            : undefined,
          socialMediaUrl: {
            instagram: data.socialMediaUrl?.instagram || undefined,
            facebook: data.socialMediaUrl?.facebook || undefined,
            tiktok: data.socialMediaUrl?.tiktok || undefined,
            youtube: data.socialMediaUrl?.youtube || undefined,
            website: data.socialMediaUrl?.website || undefined,
          },
          advert: data.advert ? {
            running: !!data.advert.running,
            startTime: data.advert.startTime || undefined,
            endTime: data.advert.endTime || undefined,
            adImage: data.advert.adImage || undefined,
            adLink: data.advert.adLink || undefined,
            adText: data.advert.adText || undefined,
            adButtonText: data.advert.adButtonText || undefined,
          } : undefined,
        };
        if (isEdit) {
          await updateParlour({ token, id: parlour._id, data: normalized });
        } else {
          await createParlour({ token, data: normalized });
          onSuccess?.();
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} parlour`);
      }
    },
    [isEdit, updateParlour, createParlour, token, parlour?._id, onSuccess]
  );

  const handleDelete = useCallback(async () => {
    if (!parlour?._id) return;
    try {
      await deleteParlour({ token, id: parlour._id });
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to delete parlour");
    }
  }, [parlour?._id, deleteParlour, token, onSuccess]);

  const handleFormError = useCallback((errors) => {
    toast.error("Please fix the validation errors before submitting");
    console.log("Parlour form validation failed:", errors);
  }, []);

  const detailsContent = (
    <div className="space-y-6">
      {showOwnershipFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={form.control}
            name="ownerId"
            label="Owner ID"
            placeholder="24-hex ObjectId"
            description="Optional. Only visible to super admins."
            disabled={isSubmitting}
          />
          <FormInput
            control={form.control}
            name="organizationId"
            label="Organization ID"
            placeholder="24-hex ObjectId"
            description="Optional. Only visible to super admins."
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput control={form.control} name="name" label="Name" placeholder="Parlour name" required disabled={isSubmitting} />
        <FormInput control={form.control} name="slug" label="Slug" placeholder="unique-slug" required disabled={isSubmitting} />
        <FormInput control={form.control} name="branch" label="Branch" placeholder="e.g., Gulshan Branch" disabled={isSubmitting} />
        <FormInput control={form.control} name="phone" label="Phone" placeholder="" disabled={isSubmitting} />
        <FormInput control={form.control} name="email" label="Email" placeholder="" disabled={isSubmitting} />
        <FormInput control={form.control} name="coverImage" label="Cover Image URL" placeholder="https://..." disabled={isSubmitting} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput control={form.control} name="address.address" label="Street Address" placeholder="House, Road, Area" disabled={isSubmitting} />
        <SelectInput
          control={form.control}
          name="address.city"
          label="City"
          placeholder="Select city"
          items={Object.values(PopularCities).map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))}
          disabled={isSubmitting}
          onValueChange={() => {
            form.setValue("address.area", "", { shouldDirty: true });
          }}
        />
        <SelectInput
          control={form.control}
          name="address.area"
          label="Area"
          placeholder="Select area"
          items={(PopularAreasByCity[form.watch("address.city")] || []).map((v) => ({ value: v, label: v.split(" ").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") }))}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput control={form.control} name="address.zipCode" label="Zip Code" placeholder="" disabled={isSubmitting} />
        <FormInput
          control={form.control}
          name="address.coordinates.0"
          label="Latitude"
          placeholder="e.g., 90.4125"
          inputClassName="w-full"
          disabled={isSubmitting}
          type="number"
          transform={{ input: (v) => (v === undefined || v === null ? "" : String(v)), output: (v) => { const n = parseFloat(v); return isNaN(n) ? undefined : n; } }}
        />
        <FormInput
          control={form.control}
          name="address.coordinates.1"
          label="Longitude"
          placeholder="e.g., 23.8103"
          inputClassName="w-full"
          disabled={isSubmitting}
          type="number"
          transform={{ input: (v) => (v === undefined || v === null ? "" : String(v)), output: (v) => { const n = parseFloat(v); return isNaN(n) ? undefined : n; } }}
        />
      </div>

      <RadioInput
        control={form.control}
        name="providerType"
        label="Provider Type"
        choices={[
          { value: "salon", label: "Salon" },
          { value: "artist", label: "Artist" },
        ]}
        orientation="horizontal"
        disabled={isSubmitting}
      />

      <RadioInput
        control={form.control}
        name="serviceLocationMode"
        label="Service Location"
        choices={[
          { value: "in-salon", label: "In-salon" },
          { value: "at-home", label: "At-home" },
          { value: "both", label: "Both" },
        ]}
        orientation="horizontal"
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput control={form.control} name="socialMediaUrl.instagram" label="Instagram URL" placeholder="https://instagram.com/..." disabled={isSubmitting} />
        <FormInput control={form.control} name="socialMediaUrl.facebook" label="Facebook URL" placeholder="https://facebook.com/..." disabled={isSubmitting} />
        <FormInput control={form.control} name="socialMediaUrl.tiktok" label="TikTok URL" placeholder="https://tiktok.com/@..." disabled={isSubmitting} />
        <FormInput control={form.control} name="socialMediaUrl.youtube" label="YouTube URL" placeholder="https://youtube.com/@..." disabled={isSubmitting} />
        <FormInput control={form.control} name="socialMediaUrl.website" label="Website" placeholder="https://..." disabled={isSubmitting} />
      </div>

      <TagInput
        control={form.control}
        name="serviceTypes"
        label="Service Types"
        description="Add types like haircut, makeup, etc."
        placeholder="Type and press Enter"
        disabled={isSubmitting}
        allowDuplicates={false}
      />

      <TagInput
        control={form.control}
        name="tags"
        label="Tags"
        description="Add tags to improve search (e.g., mehendi, bridal makeup)."
        placeholder="Add tag (comma to add multiple)"
        disabled={isSubmitting}
        allowDuplicates={false}
        suggestions={PARLOUR_TAGS}
        transformTag={(t) => t.trim().toLowerCase()}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          control={form.control}
          name="capacity"
          label="Capacity"
          type="number"
          min="1"
          required
          disabled={isSubmitting}
          transform={{ input: (v) => v?.toString() || "1", output: (v) => parseInt(v) || 1 }}
        />
        <FormInput
          control={form.control}
          name="slotDurationMinutes"
          label="Slot Duration (min)"
          type="number"
          min="5"
          required
          disabled={isSubmitting}
          transform={{ input: (v) => v?.toString() || "30", output: (v) => parseInt(v) || 30 }}
        />
        <FormInput
          control={form.control}
          name="leadTimeMinutes"
          label="Lead Time (min)"
          type="number"
          min="0"
          required
          disabled={isSubmitting}
          transform={{ input: (v) => v?.toString() || "0", output: (v) => parseInt(v) || 0 }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          control={form.control}
          name="dailyCutoffTime"
          label="Daily Cutoff Time"
          placeholder="18:00"
          disabled={isSubmitting}
        />
        <SwitchInput control={form.control} name="isActive" label="Active" disabled={isSubmitting} />
        <SwitchInput control={form.control} name="hasOffers" label="Has Offers" disabled={isSubmitting} />
      </div>

      {form.watch("hasOffers") && (
        <FormInput
          control={form.control}
          name="offerText"
          label="Offer Text"
          placeholder="e.g., 10% off on weekdays"
          disabled={isSubmitting}
        />
      )}
    </div>
  );

  const aboutContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput control={form.control} name="about.title" label="About Title" placeholder="e.g., Why choose us" disabled={isSubmitting} />
        <FormTextarea control={form.control} name="about.description" label="About Description" rows={3} placeholder="Short description" disabled={isSubmitting} />
      </div>
      <TagInput
        control={form.control}
        name="about.features"
        label="Key Features"
        description="Add up to 6 features"
        placeholder="Feature"
        maxTags={6}
        allowDuplicates={false}
        disabled={isSubmitting}
      />
      <TagInput
        control={form.control}
        name="portfolio"
        label="Portfolio Image URLs"
        description="Add up to 4 image URLs (https://...)"
        placeholder="https://image-url"
        maxTags={4}
        allowDuplicates={false}
        validateTag={(t) => /^https?:\/\//i.test(t)}
        disabled={isSubmitting}
      />
    </div>
  );

  const adminDisabled = isSubmitting || !canEditAdminFields;

  const promotionContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SwitchInput control={form.control} name="isFeatured" label="Featured" disabled={adminDisabled} />
        <SwitchInput control={form.control} name="advert.running" label="Advert Running" disabled={adminDisabled} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput control={form.control} name="advert.startTime" label="Advert Start" type="time" disabled={adminDisabled} />
        <FormInput control={form.control} name="advert.endTime" label="Advert End" type="time" disabled={adminDisabled} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput control={form.control} name="advert.adImage" label="Advert Image URL" placeholder="https://..." disabled={adminDisabled} />
        <FormInput control={form.control} name="advert.adLink" label="Advert Link URL" placeholder="https://..." disabled={adminDisabled} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput control={form.control} name="advert.adText" label="Advert Text" placeholder="Short copy" disabled={adminDisabled} />
        <FormInput control={form.control} name="advert.adButtonText" label="Advert Button Text" placeholder="e.g., Book now" disabled={adminDisabled} />
      </div>
      {!canEditAdminFields && (
        <div className="text-sm text-muted-foreground">Only super admins can edit promotion fields.</div>
      )}
    </div>
  );

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-6">
        <DynamicTabs
          defaultValue="details"
          tabs={[
            { value: "details", label: "Details", content: detailsContent },
            { value: "about", label: "About", content: aboutContent },
            { value: "hours", label: "Working Hours", content: <WeeklyWorkingHours form={form} disabled={isSubmitting} /> },
            { value: "breaks", label: "Breaks", content: (
                <div className="space-y-4">
                  {[0,1,2].map((i) => (
                    <div key={i} className="rounded-md border bg-card p-4 flex items-center gap-4 flex-wrap">
                      <div className="text-sm text-muted-foreground">From:</div>
                      <FormInput control={form.control} name={`breaks.${i}.startTime`} type="time" inputClassName="w-[130px]" disabled={isSubmitting} transform={{ input: (v)=> v ?? "", output: (v)=> v ?? "" }} />
                      <div className="text-sm text-muted-foreground">To:</div>
                      <FormInput control={form.control} name={`breaks.${i}.endTime`} type="time" inputClassName="w-[130px]" disabled={isSubmitting} transform={{ input: (v)=> v ?? "", output: (v)=> v ?? "" }} />
                    </div>
                  ))}
                </div>
            ) },
            { value: "promotion", label: "Promotion", content: promotionContent },
          ]}
        />

        <FormErrorSummary errors={formErrors} />
        {!hideActions && (
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : isEdit ? "Update Parlour" : "Create Parlour"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {isEdit ? "Close" : "Cancel"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}


