"use client";

import FormInput from "@/components/form-utils/form-input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import OrganizationInfo from "./organization-info";
import { updateUser } from "@/api/user-data";

export default function SellerProfileClient({ initialData, token }) {
    const router = useRouter();
    const { update } = useSession();
    // Form for personal information
    const personalMethods = useForm({
        defaultValues: {
            name: initialData?.name || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            address: initialData?.address || "",
            roles: Array.isArray(initialData?.roles) ? initialData.roles.join(", ") : "",
        },
    });

    const onSubmitPersonalInfo = async (formData) => {
        try {
            const id = initialData?._id || initialData?.id;
            if (!id) throw new Error("Missing user id");
            const payload = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
            };
            const updated = await updateUser(token, id, payload);
            const updatedUser = updated?.data || updated;
            await update({
                user: {
                    name: updatedUser?.name ?? formData.name,
                    email: updatedUser?.email ?? personalMethods.getValues("email"),
                    phone: updatedUser?.phone ?? formData.phone,
                    roles: Array.isArray(updatedUser?.roles) ? updatedUser.roles : initialData?.roles,
                    image: updatedUser?.image ?? initialData?.image,
                },
            });
            personalMethods.reset({
                name: updatedUser?.name ?? formData.name,
                email: updatedUser?.email ?? personalMethods.getValues("email"),
                phone: updatedUser?.phone ?? formData.phone,
                address: updatedUser?.address ?? formData.address,
                roles: Array.isArray(updatedUser?.roles)
                    ? updatedUser.roles.join(", ")
                    : personalMethods.getValues("roles"),
            });
            toast.success("Personal information updated successfully");
        } catch (error) {
            console.error("Failed to update personal information:", error);
            toast.error("Failed to update personal information");
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl mb-2">Your Profile</h2>
            </div>

            <div className="animate-scale-in">
                {/* Personal Information Form */}
                <div className="rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">
                        Personal Information
                    </h3>
                    <FormProvider {...personalMethods}>
                        <form
                            onSubmit={personalMethods.handleSubmit(
                                onSubmitPersonalInfo
                            )}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    control={personalMethods.control}
                                    name="name"
                                    label="Full Name"
                                    required
                                />
                                <FormInput
                                    control={personalMethods.control}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    required
                                    disabled
                                />
                                <FormInput
                                    control={personalMethods.control}
                                    name="phone"
                                    label="Phone"
                                    required
                                />
                                <FormInput
                                    control={personalMethods.control}
                                    name="address"
                                    label="Address"
                                />
                                <FormInput
                                    control={personalMethods.control}
                                    name="roles"
                                    label="Roles"
                                    disabled
                                    readOnly
                                    description="Assigned roles (not editable)"
                                />
                            </div>
                            <div className="pt-4">
                                <Button type="submit" className="px-8">
                                    Update Personal Info
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>

                {/* Organization Information Form Component */}
                <OrganizationInfo token={token} user={initialData} />
            </div>
        </div>
    );
}
