"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ParlourCard } from "./ParlourCard";
import { Home, ArrowRight, MapPin, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParlours } from "@/hooks/query/useParlours";
import { useLocation } from "@/contexts/LocationContext";

export function TopArtists({ className = "" }) {
  const { city: selectedCity } = useLocation();
  
  // Build query params with location filtering
  const queryParams = {
    providerType: "artist",
    isActive: true,
    limit: 6,
    sortBy: "featured" // or however your API sorts top results
  };
  
  // Add city filter if location is selected
  if (selectedCity) {
    const cityName = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);
    queryParams['address.city[in]'] = cityName;
  }
  
  // Fetch top artists (home service providers)
  const { parlours: artists, pagination, isLoading, error } = useParlours("", queryParams, {public: true});

  // Skip the entire section if no artists or error
  if (error || (!isLoading && (!artists || artists.length === 0))) {
    return null;
  }

  return (
    <section className={cn("py-16 lg:py-24 bg-background", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="px-4 py-2">
            <Home className="w-4 h-4 mr-2" />
            Home Service Artists
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {selectedCity 
              ? `Top Artists in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`
              : "Top Artists Near You"
            }
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {selectedCity
              ? `Professional beauty artists in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} who come to your home`
              : "Professional beauty artists who come to your home for personalized services"
            }
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <TopArtistsLoading />
        ) : artists && artists.length > 0 ? (
          <>
            {/* Artists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {artists.map((artist) => (
                <ParlourCard
                  key={artist._id || artist.id}
                  parlour={artist}
                  className="h-full"
                  showBookButton={true}
                />
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Link href="/parlours?providerType%5Bin%5D=artist">
                <Button size="lg" className="gap-2">
                  View All Artists
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        ) : null}

        {/* Benefits Section */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-3">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">At Your Convenience</h3>
              <p className="text-sm text-muted-foreground">
                Professional beauty services in the comfort of your own home
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Personalized Service</h3>
              <p className="text-sm text-muted-foreground">
                One-on-one attention with customized beauty treatments
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Verified Professionals</h3>
              <p className="text-sm text-muted-foreground">
                All artists are background-checked and highly rated
              </p>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="mt-16 text-center space-y-6">
          <h3 className="text-2xl font-semibold">Popular Home Services</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Bridal Makeup",
              "Hair Styling", 
              "Facial Treatment",
              "Mehndi Design",
              "Party Makeup",
              "Hair Care",
              "Nail Art",
              "Eyebrow Threading"
            ].map((service) => (
              <Link key={service} href={`/parlours?providerType%5Bin%5D=artist&name=${encodeURIComponent(service)}`}>
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {service}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TopArtistsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[16/9] w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyArtistsState() {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
        <Home className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">No Home Service Artists Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're working on onboarding professional beauty artists in your area. Check back soon!
        </p>
      </div>
      <Link href="/parlours?providerType[in]=salon">
        <Button variant="outline" className="gap-2">
          Browse Salons Instead
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}