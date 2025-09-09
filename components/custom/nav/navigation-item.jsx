import Link from "next/link";
import { NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";


export function NavigationItem({ name, href, className }) {
  const pathname = usePathname();
    
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        href={href}
        className={cn(
          "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
          isActive(href)
            ? "bg-accent text-accent-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
            : "text-muted-foreground hover:after:absolute hover:after:bottom-0 hover:after:left-1/2 hover:after:right-1/2 hover:after:h-0.5 hover:after:bg-primary/50 hover:after:transition-all hover:after:duration-200 hover:after:rounded-full",
          className
        )}
        asChild
      >
        <Link href={href}>{name}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}