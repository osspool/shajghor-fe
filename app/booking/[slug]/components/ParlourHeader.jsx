import { MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
} from "@/components/custom/ui/soical-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProviderTypeBadge from "@/components/platform/parlour/ui/provider-type-badge";
import LocationModeBadge from "@/components/platform/parlour/ui/location-mode-badge";
import OpenStatusBadge from "@/components/platform/parlour/ui/open-status-badge";
import BackButton from "./BackButton";

function IconItem({ icon: Icon, children, href, external }) {
  const Comp = href ? "a" : "div";
  if (!children) return null;
  return (
    <Comp
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors min-w-0"
    >
      {Icon ? <Icon className="h-4 w-4 text-primary shrink-0" /> : null}
      <span className="truncate">{children}</span>
    </Comp>
  );
}

function SocialButton({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {children}
    </a>
  );
}

export const ParlourHeader = ({
  name = "Sheba's Beauty Lounge",
  address = { address: "", city: "", area: "", zipCode: "", coordinates: undefined },
  phone = "+880 1712-345678",
  providerType = "salon",
  serviceTypes = [],
  coverImage = "/images/parlour-hero.jpg",
  socialMediaUrl = {},
  serviceLocationMode,
  workingHours,
}) => {
  const formattedAddress = (() => {
    if (!address) return "";
    const parts = [address.address, address.area, address.city, address.zipCode].filter(Boolean);
    return parts.join(", ");
  })();

  const mapHref = (() => {
    if (!address) return undefined;
    const hasCoords = Array.isArray(address.coordinates) && address.coordinates.length === 2 && address.coordinates[0] !== undefined && address.coordinates[1] !== undefined;
    if (hasCoords) {
      const [lon, lat] = address.coordinates;
      // Use plain search path with lat,lon like https://www.google.com/maps/search/23.753500,90.388
      return `https://www.google.com/maps/search/${encodeURIComponent(`${lat},${lon}`)}`;
    }
    if (formattedAddress) {
      // Fallback to address search
      return `https://www.google.com/maps/search/${encodeURIComponent(formattedAddress)}`;
    }
    return undefined;
  })();
  const isOpen = typeof workingHours === "object" ? checkIfOpen(workingHours) : undefined;
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden rounded-b-2xl">
        <img
          src={coverImage}
          alt={`${name} interior`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Provider badge + Back button at top */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <BackButton />
          <ProviderTypeBadge variant="hero" type={providerType} />
        </div>
        {typeof isOpen === "boolean" ? (
          <div className="absolute top-4 right-4">
            <OpenStatusBadge isOpen={isOpen} />
          </div>
        ) : null}

        {/* Parlour name overlay */}
        <div className="absolute bottom-6 inset-x-0">
          <div className="container mx-auto px-4 md:px-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
              {name}
            </h1>
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="bg-background rounded-2xl p-6 md:p-7 shadow-card border border-border">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            {/* Left: details */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {serviceLocationMode ? (
                  <LocationModeBadge mode={serviceLocationMode} />
                ) : null}
              </div>
              {serviceTypes?.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-2">
                  {serviceTypes.map((s, i) => (
                    <Badge key={i} variant="outline">{s}</Badge>
                  ))}
                </div>
              ) : null}

              {phone ? (
                <IconItem icon={Phone} href={`tel:${phone}`}>
                  {phone}
                </IconItem>
              ) : null}
              {formattedAddress ? (
                <IconItem
                  icon={MapPin}
                  href={mapHref}
                  external
                >
                  {formattedAddress}
                </IconItem>
              ) : null}

              {(socialMediaUrl?.instagram || socialMediaUrl?.facebook) ? (
                <div className="flex items-center gap-2">
                  {socialMediaUrl?.instagram ? (
                    <SocialButton href={socialMediaUrl.instagram} label="Instagram">
                      <InstagramIcon className="h-4 w-4" />
                    </SocialButton>
                  ) : null}
                  {socialMediaUrl?.facebook ? (
                    <SocialButton href={socialMediaUrl.facebook} label="Facebook">
                      <FacebookIcon className="h-4 w-4" />
                    </SocialButton>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Right: quick action */}
            <div className="w-full md:w-auto">
              <Button asChild className="w-full h-11">
                <a href="#booking-section" aria-label="Book now">Book Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to compute open/closed from working hours structure
function checkIfOpen(workingHours) {
  if (!workingHours || typeof workingHours !== "object") return true;
  const now = new Date();
  const currentDay = now.toLocaleString(undefined, { weekday: "short" }).toLowerCase();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const todayHours = workingHours[currentDay];
  if (!todayHours || !todayHours.isOpen) return false;
  if (!todayHours.startTime || !todayHours.endTime) return true;
  const [startHour, startMin] = todayHours.startTime.split(":").map(Number);
  const [endHour, endMin] = todayHours.endTime.split(":").map(Number);
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;
  return currentTime >= startTime && currentTime <= endTime;
}
