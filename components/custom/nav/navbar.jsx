"use client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavbarIcons } from "./navbar-icons";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchBar from "./SearchBar";
import LocationSelector from "./LocationSelector";
import MobileSearch from "./mobile-search";
import { DesktopNavigation } from "./desktop-navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar({ user, token, isSeller, isAdmin }) {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => {
      if (typeof window === "undefined") return;
      setScrolled(window.scrollY > 20);
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // Simplified version for mobile with pixel art styling
  function MobileNavbarIcons({ user, cartCount = 0, isSeller, isAdmin }) {
    return (
      <div className="flex items-center">
        {isMobile && (
          <MobileNav
            user={user}
            cartCount={0}
            isSeller={isSeller}
            isAdmin={isAdmin}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {/* Fixed main navbar only */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <div
          className={cn(
            "absolute inset-0 transition-[background-color,backdrop-filter,border-color] duration-300",
            scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/40" : "bg-transparent"
          )}
        ></div>
        <nav className="relative h-16 md:h-20">
          <div className="lg:container mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-2">
            {/* Left section: Logo */}
            <div className="flex items-center gap-3 flex-shrink-0 min-w-[140px]">
              <Logo />
              <LocationSelector />
            </div>

            {/* Middle: Location + Search (desktop) */}
            <div className="hidden md:flex flex-1 px-4 max-w-[820px] items-center gap-3">
              {/* <SearchBar className="w-full" /> */}
            </div>

            {/* Right section: Cart, User and Menu */}
            <div className="flex items-center justify-end gap-1.5 flex-shrink-0 min-w-[120px]">
              {isMobile ? (
                <MobileNavbarIcons
                  user={user}
                  cartCount={0}
                  isSeller={isSeller}
                  isAdmin={isAdmin}
                />
              ) : (
                <>
                  <NavbarIcons
                    user={user}
                    cartCount={0}
                    isLoading={false}
                    isSeller={isSeller}
                    isAdmin={isAdmin}
                  />
                  {/* <div className="ml-2 border-l pl-2">
                    <MobileNav
                      user={user}
                      cartCount={0}
                      isSeller={isSeller}
                      isAdmin={isAdmin}
                    />
                  </div> */}
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile search bar - overlay variant */}
      {/* {isMobile && <MobileSearch className="w-full" />} */}
    </>
  );
}
