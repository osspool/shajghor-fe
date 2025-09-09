import { HeroSection } from "@/components/custom/parlour/HeroSection";
import { FeaturedParlours } from "@/components/custom/parlour/FeaturedParlours";
import { TopArtists } from "@/components/custom/parlour/TopArtists";
import { OwnersCTA } from "@/components/custom/parlour/OwnersCTA";


export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <OwnersCTA />
      <FeaturedParlours />
      <TopArtists />
    </div>
  );
}
