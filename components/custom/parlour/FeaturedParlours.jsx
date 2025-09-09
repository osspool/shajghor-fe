"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedParlourCard } from "./ParlourCard";
import { Star, ArrowRight, MapPin, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParlours } from "@/hooks/query/useParlours";
import { useLocation } from "@/contexts/LocationContext";

export function FeaturedParlours({ className = "" }) {
  const { city: selectedCity } = useLocation();
  
  // Build query params with location filtering
  const queryParams = {
    isFeatured: true,
    isActive: true,
    limit: 6
  };
  
  // Add city filter if location is selected
  if (selectedCity) {
    const cityName = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);
    queryParams['address.city[in]'] = cityName;
  }
  
  // Fetch featured parlours
  const { parlours, pagination, isLoading, error } = useParlours("", queryParams, {public: true});

  if (error) {
    return (
      <section className={cn("py-16 lg:py-24", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Unable to load featured parlours at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 lg:py-24 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Featured Parlours
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {selectedCity 
              ? `Most Popular Beauty Parlours in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`
              : "Most Popular Beauty Parlours"
            }
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {selectedCity
              ? `Discover the most loved and highly-rated beauty parlours in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`
              : "Discover the most loved and highly-rated beauty parlours across Bangladesh"
            }
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <FeaturedParloursLoading />
        ) : parlours && parlours.length > 0 ? (
          <>
            {/* Parlours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {parlours.map((parlour) => (
                <FeaturedParlourCard
                  key={parlour._id || parlour.id}
                  parlour={parlour}
                  className="h-full"
                />
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Link href="/parlours">
                <Button size="lg" className="gap-2">
                  View All Parlours
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <EmptyFeaturedState />
        )}

        {/* Quick Stats */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Trending Now</h3>
              <p className="text-sm text-muted-foreground">
                These parlours are getting the most bookings this month
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-3">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Top Rated</h3>
              <p className="text-sm text-muted-foreground">
                Highest customer satisfaction and quality services
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">All Cities</h3>
              <p className="text-sm text-muted-foreground">
                Available across all major cities in Bangladesh
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedParloursLoading() {
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

function EmptyFeaturedState() {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
        <Star className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">No Featured Parlours Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're working on featuring the best parlours in your area. Check back soon!
        </p>
      </div>
      <Link href="/parlours">
        <Button variant="outline" className="gap-2">
          Browse All Parlours
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}