"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OpenStatusBadge from "@/components/platform/parlour/ui/open-status-badge";
import ProviderTypeBadge from "@/components/platform/parlour/ui/provider-type-badge";
import LocationModeBadge from "@/components/platform/parlour/ui/location-mode-badge";
import { MapPin, Phone, ExternalLink, Scissors, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function ParlourCard({ 
  parlour, 
  className = "", 
  variant = "default",
  showBookButton = false
}) {
  const {
    slug,
    name,
    branch,
    address,
    phone,
    coverImage,
    providerType = "salon",
    serviceLocationMode,
    hasOffers,
    offerText,
    isFeatured,
    isActive = true,
    about,
    workingHours
  } = parlour;

  const displayName = branch ? `${name} - ${branch}` : name;
  const displayAddress = address?.city && address?.area 
    ? `${address.area}, ${address.city}`
    : address?.address || address?.city || "";

  const isOpen = workingHours ? checkIfOpen(workingHours) : true;
  
  const providerIcon = providerType === "artist" ? Home : Scissors;
  const ProviderIcon = providerIcon;

  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
      !isActive && "opacity-60",
      isFeatured && "ring-2 ring-primary/20 shadow-md",
      className
    )}>
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
            <ProviderIcon className="h-12 w-12 text-primary/40" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          {isFeatured && (
            <Badge variant="default" className="rounded-full px-2 py-0.5 text-[11px] font-medium">
              Featured
            </Badge>
          )}
          <ProviderTypeBadge type={providerType} />
        </div>
        <div className="absolute top-2 right-2">
          <OpenStatusBadge isOpen={isOpen} />
        </div>
      </div>

      <CardContent className="p-3 md:p-4">
        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[15px] leading-snug line-clamp-1 md:line-clamp-2 group-hover:text-primary transition-colors">
              {displayName}
            </h3>
            {phone && (
              <Link href={`tel:${phone}`} aria-label="Call">
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <Phone className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {displayAddress && (
            <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{displayAddress}</span>
            </div>
          )}

          {/* Meta */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <LocationModeBadge mode={serviceLocationMode} />
            {hasOffers && offerText ? (
              <Badge variant="destructive" className="rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                {offerText}
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/booking/${slug}`}>
            <Button variant="default" size="sm" className="w-full">
              View Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {showBookButton && isActive ? (
            <Link href={`/booking/${slug}#book`}>
              <Button variant="outline" size="sm" className="w-full">
                Book Now
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to check if parlour is open
function checkIfOpen(workingHours) {
  if (!workingHours || typeof workingHours !== 'object') return true;
  
  const now = new Date();
  // Get 3-letter lowercase weekday like 'mon', 'tue'
  const currentDay = now.toLocaleString(undefined, { weekday: 'short' }).toLowerCase();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
  
  const todayHours = workingHours[currentDay];
  if (!todayHours || !todayHours.isOpen) return false;
  
  if (!todayHours.startTime || !todayHours.endTime) return true;
  
  const [startHour, startMin] = todayHours.startTime.split(':').map(Number);
  const [endHour, endMin] = todayHours.endTime.split(':').map(Number);
  
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;
  
  return currentTime >= startTime && currentTime <= endTime;
}

// Compact version for lists
export function CompactParlourCard({ parlour, className = "" }) {
  return (
    <ParlourCard 
      parlour={parlour} 
      className={cn("max-w-sm", className)}
      variant="compact"
    />
  );
}

// Featured version for hero sections
export function FeaturedParlourCard({ parlour, className = "" }) {
  return (
    <ParlourCard 
      parlour={parlour} 
      className={cn("max-w-md", className)}
      variant="featured"
      showBookButton={true}
    />
  );
}