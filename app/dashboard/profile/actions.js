"use server";

import { updateUser } from "@/api/user-data";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function updateSellerProfile(userId, formData) {
  try {
    const session = await auth();
    const token = session?.accessToken;
    
    if (!token) {
      throw new Error("No token found");
    }

    const response = await updateUser(token, userId, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    });

    revalidatePath("/dashboard/profile");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to update seller profile:", error);
    return { 
      success: false, 
      error: "Failed to update profile. Please try again." 
    };
  }
} 