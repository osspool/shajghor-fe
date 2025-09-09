import NextAuth from "next-auth";

import { authConfig } from "./app/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/super/:path*",
        "/api/:path*",
        "/login",
        "/register",
    ],
};
