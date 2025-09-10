"use server";

import { z } from "zod";

import { forgetPassApi, resetPassApi } from "@/api/user-data";

import { signIn } from "./auth";

const authLoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const authRegisterSchema = z
    .object({
        name: z.string().min(3),
        email: z.string().email(),
        phone: z.string(),
        password: z.string().min(6),
        password2: z.string().min(6),
    })
    .refine((data) => data.password === data.password2, {
        message: "Passwords do not match",
        path: ["password2"],
    });

const authForgetPassSchema = z.object({
    email: z.string().email(),
});

const authResetSchema = z.object({
    password: z.string().min(6),
    token: z.string(),
});

// export interface LoginActionState {
//   status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
// }

export const login = async (_, formData) => {
    try {
        const validatedData = authLoginSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        await signIn("credentials", {
            email: validatedData.email,
            password: validatedData.password,
            redirect: false,
        });

        console.log("Logged in");

        return { status: "success" };
    } catch (error) {
        console.log("server error", error);
        if (error instanceof z.ZodError) {
            return { status: "invalid_data" };
        }

        return { status: "failed" };
    }
};

// export interface RegisterActionState {
//   status:
//     | "idle"
//     | "in_progress"
//     | "success"
//     | "failed"
//     | "user_exists"
//     | "invalid_data";
// }

export const register = async (_, formData) => {
    try {
        try {
            const validatedData = authRegisterSchema.parse({
                name: formData.get("name"),
                email: formData.get("email"),
                phone: String(formData.get("phone") || ""),
                password: formData.get("password"),
                password2: formData.get("password2"),
            });

            // At this point, we know the user doesn't exist, so create the user
            try {
                let response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: validatedData.email,
                            name: validatedData.name,
                            phone: validatedData.phone,
                            password: validatedData.password,
                        }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    return {
                        status: "failed",
                        error: errorData.message || "Registration failed",
                    };
                }

                const data = await response.json();
                return {
                    status: "success",
                    message: data.message || "User registered successfully",
                };
            } catch (error) {
                console.log(error);
                return {
                    status: "failed",
                    error: error.message || "Registration failed",
                };
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Get the specific validation errors
                const fieldErrors = error.errors.reduce((acc, err) => {
                    const field = err.path[0];
                    acc[field] = err.message;
                    return acc;
                }, {});

                return {
                    status: "invalid_data",
                    errors: fieldErrors,
                };
            }
            return { status: "failed" };
        }
    } catch (error) {
        console.error("Unexpected error during registration:", error);
        return { status: "failed" };
    }
};

export const forgetPass = async (_, formData) => {
    try {
        const validatedData = authForgetPassSchema.parse({
            email: formData.get("email"),
        });

        try {
            const data = await forgetPassApi(validatedData);
            console.log("Password reset email sent:", data);
            return { status: "success" };
        } catch (apiError) {
            console.log("API error:", apiError.message);
            return {
                status: "failed",
                error: apiError.message,
            };
        }
    } catch (error) {
        console.error("Validation error:", error);
        if (error instanceof z.ZodError) {
            return { status: "invalid_data" };
        }
        return { status: "failed" };
    }
};

export const resetPass = async (_, formData) => {
    try {
        const validatedData = authResetSchema.parse({
            password: formData.get("password"),
            token: formData.get("token"),
        });

        try {
            const data = await resetPassApi({
                newPassword: validatedData.password,
                token: validatedData.token,
            });

            console.log("Password reset response:", data);

            if (data && data.message === "Password has been reset") {
                return { status: "success" };
            }

            return { status: "failed" };
        } catch (apiError) {
            console.log("API error:", apiError.message);
            return {
                status: "failed",
                error: apiError.message,
            };
        }
    } catch (error) {
        console.error("Validation error:", error);
        if (error instanceof z.ZodError) {
            return { status: "invalid_data" };
        }
        return { status: "failed" };
    }
};
