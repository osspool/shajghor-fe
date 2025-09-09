"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function UserNav({ user, isSeller, isAdmin }) {
    return user ? (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant=""
                            size="icon"
                            className="h-9 w-9 rounded-full "
                        >
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || "User avatar"}
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="">
                                    <User className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent className="px-3 py-1.5" sideOffset={5}>
                    <span className="text-xs">{user.email}</span>
                </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="w-56 p-0">
                <div className="px-3 py-2 border-b">
                    <div className="flex items-center gap-2 mb-1">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name || "User avatar"}
                                width={24}
                                height={24}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                <User className="h-3 w-3" />
                            </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                            Signed in as
                        </span>
                    </div>
                    <div className="text-xs font-medium">{user?.email}</div>
                </div>

                {isSeller && (
                    <DropdownMenuItem
                        asChild
                        className="focus:text-foreground px-0 py-0"
                    >
                        <Link
                            href="/dashboard"
                            className="w-full px-3 py-2 text-sm transition-colors"
                        >
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                        asChild
                        className="focus:text-foreground px-0 py-0"
                    >
                        <Link
                            href="/super"
                            className="w-full px-3 py-2 text-sm transition-colors"
                        >
                            Admin
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem
                    asChild
                    className="focus:text-foreground px-0 py-0"
                >
                    <Link
                        href="/profile"
                        className="w-full px-3 py-2 text-sm transition-colors"
                    >
                        Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className="focus:text-foreground px-0 py-0"
                >
                    <Link
                        href="/profile/my-orders"
                        className="w-full px-3 py-2 text-sm transition-colors"
                    >
                        My Orders
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-0" />

                <DropdownMenuItem
                    asChild
                    className="focus:text-foreground px-0 py-0"
                >
                    <button
                        className="w-full px-3 py-2 text-sm flex items-center gap-2 text-left transition-colors"
                        onClick={() => {
                            signOut({
                                redirectTo: "/login",
                            });
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Link href="/login">
            <Button variant="outline" size="sm" className="h-9">
                Login
            </Button>
        </Link>
    );
}
