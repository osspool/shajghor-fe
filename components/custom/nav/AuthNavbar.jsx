"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

export function AuthNavbar() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  return (
    <nav className="bg-white dark:bg-black border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isLoginPage && (
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            )}
            {!isRegisterPage && (
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 