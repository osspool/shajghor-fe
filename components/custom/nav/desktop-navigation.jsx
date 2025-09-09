import {
    NavigationMenu,
    NavigationMenuList,
  } from "@/components/ui/navigation-menu";
  import { NavigationItem } from "./navigation-item";

  const navigationData  = [
    // { "name": "Home", "href": "/" },
    // { "name": "About", "href": "/about" },
    // { "name": "Manufacturing", "href": "/manufacturing" },
    // { "name": "Products", "href": "/products" },
    // { "name": "Sustainability", "href": "/sustainability" },
    // { "name": "Media", "href": "/media" },
    // { "name": "Contact", "href": "/contact" }
  ]
  
  export function DesktopNavigation() {
    return (
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList className="flex items-center justify-center space-x-1">
          {/* Main Navigation Items */}
          {navigationData
            .filter((item) => item.name !== "Contact")
            .map((item) => (
              <NavigationItem
                key={item.name}
                name={item.name}
                href={item.href}
              />
            ))}
  
          {/* Services Mega Menu */}
          {/* <MegaMenu
            label={navigation.services.label}
            icon="building"
            items={navigation.services.items}
            featured={{
              title: "Our Services",
              description: "Comprehensive IT solutions tailored to your business needs",
              href: "/services"
            }}
          /> */}
  
          {/* Resources Menu */}
          {/* <MegaMenu
            label={navigation.resources.label}
            icon="tag"
            items={navigation.resources.items}
          /> */}
        </NavigationMenuList>
      </NavigationMenu>
    );
  }