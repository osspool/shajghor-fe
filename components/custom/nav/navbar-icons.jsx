"use client";

import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";

import { cn } from "@/lib/utils";
import Link from "next/link";
import ContactWhatsappDialog from "@/components/custom/ui/contact-whatsapp-dialog";
import { Icon } from "../ui/icon";

export function NavbarIcons({
  user,
  cartCount = 0,
  isLoading,
  isSeller,
  isAdmin,
  className
}) {
  return (
    <div className={cn("flex items-center gap-3 md:gap-4", className)}>
      {/* Cart button */}
      <ContactWhatsappDialog
        trigger={(
          <Button variant="" size="sm">
            <Icon name="phone" className="mr-2" size={16} />
            Contact
          </Button>
        )}
      />
      {/* User menu */}
      <div className="flex items-center">
        <UserNav user={user} isSeller={isSeller} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
