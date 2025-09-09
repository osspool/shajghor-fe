"use client";

import SimpleSearch from "@/components/custom/common/SimpleSearch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Scissors, Home, Star, TrendingUp, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSection({ className = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/parlours?name=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/parlours");
    }
  };

  const popularCities = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Rangpur"];
  const stats = [
    { icon: Users, label: "Happy Customers", value: "10K+" },
    { icon: Scissors, label: "Verified Parlours", value: "500+" },
    { icon: Star, label: "Average Rating", value: "4.8" },
    { icon: Clock, label: "Services Completed", value: "25K+" },
  ];

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 dark:from-indigo-950 dark:via-violet-950 dark:to-slate-950", className)}>
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(180deg,white,transparent)]" />
      {/* Colorful gradient blobs */}
      <div className="pointer-events-none absolute -top-10 -right-10 blur-3xl opacity-25 sm:opacity-30">
        <div className="w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-br from-fuchsia-400 via-pink-400 to-rose-400 rounded-full" />
      </div>
      <div className="pointer-events-none absolute -bottom-24 -left-16 blur-3xl opacity-25 hidden sm:block">
        <div className="w-[28rem] h-[28rem] bg-gradient-to-tr from-sky-400 via-cyan-400 to-teal-400 rounded-full" />
      </div>
      <div className="pointer-events-none absolute top-1/3 -left-10 blur-[60px] opacity-25 hidden sm:block">
        <div className="w-72 h-72 bg-gradient-to-tr from-amber-300 via-orange-400 to-pink-400 rounded-full" />
      </div>
      <div className="pointer-events-none absolute bottom-1/3 -right-10 blur-[60px] opacity-25 hidden sm:block">
        <div className="w-72 h-72 bg-gradient-to-tr from-indigo-400 via-violet-400 to-purple-400 rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-20  lg:py-24 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Text */}
          <div className="space-y-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-2" />
              Bangladesh's #1 Beauty Platform
            </Badge>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight lg:leading-[1.1]">
              Find Your Perfect{" "}
              <span
                className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-pink-500 dark:from-fuchsia-400 dark:via-pink-400 dark:to-rose-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] pb-1"
              >
                Beauty Parlour
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover and book appointments at the best beauty salons and parlours across Bangladesh. 
              From traditional beauty services to modern treatments.
            </p>
          </div>

          {/* Minimal Search using reusable component */}
          <SimpleSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            placeholder="Search parlours by name, location, or services..."
            buttonText="Search Parlours"
            className="max-w-2xl mx-auto"
          />

          {/* Service Types */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 justify-center items-center">
            <Link href="/parlours?providerType%5Bin%5D=salon">
              <Card className="group cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex items-center gap-3 p-4 sm:p-6">
                  <div className="p-2.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm sm:text-base">Beauty Salons</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Visit professional salons</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/parlours?providerType%5Bin%5D=artist">
              <Card className="group cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex items-center gap-3 p-4 sm:p-6">
                  <div className="p-2.5 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Home className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm sm:text-base">Popular Artists</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Beauty services at home</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="hidden md:block max-w-4xl mx-auto mt-16 pt-16 border-t border-border/50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-foreground">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}