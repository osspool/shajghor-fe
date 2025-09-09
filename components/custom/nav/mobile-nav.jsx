// components/navbar/mobile-nav.jsx
"use client";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav({
    user,
    cartCount = 0,
    isAdmin,
    isSuperAdmin,
    className,
}) {
    const pathname = usePathname();
    const { setTheme, theme } = useTheme();

    // Navigation items
    const publicNavItems = [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/parlours" },
        { name: "How it Works", href: "/how-it-works" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Start Selling", href: "/parlours/benefits" },
    ];

    // User-specific nav items
    const userNavItems = user
        ? [
              { name: "My Orders", href: "/profile/my-orders" },
              { name: "Profile", href: "/profile" },
          ]
        : [];

    // Admin/Seller nav items
    const roleNavItems = [];
    if (isSuperAdmin) {
        roleNavItems.push({ name: "Admin Panel", href: "/super" });
    }
    if (isAdmin) {
        roleNavItems.push({ name: "Seller Dashboard", href: "/dashboard" });
    }

    // Combine all navigation items
    const navItems = [...publicNavItems, ...userNavItems];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-9 w-9", className)}
                    aria-label="Menu"
                >
                    <Menu className="h-[18px] w-[18px]" />
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                    Main navigation links and account options
                </SheetDescription>

                <div className="flex h-full flex-col">
                    <SheetHeader className="px-4 pt-4 pb-2 border-b">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">
                                ShajGhor
                            </span>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto py-4">
                        {/* Main Navigation */}
                        <nav className="flex flex-col gap-1 px-4">
                            {navItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/" &&
                                        pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                                            isActive
                                                ? "bg-gray-100 text-primary font-medium"
                                                : "hover:bg-gray-50"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Role-specific Navigation */}
                        {roleNavItems.length > 0 && (
                            <div className="mt-6 border-t pt-4 px-4">
                                <div className="mb-2">
                                    <span className="text-sm text-muted-foreground">
                                        Admin Area
                                    </span>
                                </div>
                                <nav className="flex flex-col gap-1">
                                    {roleNavItems.map((item) => {
                                        const isActive =
                                            pathname === item.href ||
                                            (item.href !== "/" &&
                                                pathname.startsWith(item.href));

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "hover:bg-gray-50"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        )}

                        {/* Theme & Cart */}
                        <div className="mt-6 border-t pt-4 px-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm">Theme</span>
                                <Button
                                    onClick={() =>
                                        setTheme(
                                            theme === "dark" ? "light" : "dark"
                                        )
                                    }
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <SheetFooter className="border-t p-4">
                        {user ? (
                            <div className="space-y-3 w-full">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">
                                        Signed in as
                                    </span>
                                    <div className="font-medium truncate">
                                        {user?.email}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        signOut({
                                            redirectTo: "/",
                                        });
                                    }}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign out
                                </Button>
                            </div>
                        ) : (
                            <SheetClose asChild>
                                <Button asChild className="w-full">
                                    <Link href="/login">
                                        <User className="h-4 w-4 mr-2" />
                                        Sign In
                                    </Link>
                                </Button>
                            </SheetClose>
                        )}
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
