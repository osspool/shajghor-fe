"use client";

import { useState, useEffect } from "react";
import ExpandedSearch from "./ExpandedSearch";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Search, MapPin } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";

const MobileSearch = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { city } = useLocation();


  // Prevent body scrolling when search is expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);
  
  // Display location text
  const getDisplayLocation = () => (city ? city.charAt(0).toUpperCase() + city.slice(1) : "Dhaka");

  return (
    <div className={cn("w-full", className)}>
      {/* Fixed Search Bar below navbar */}
      <div className="fixed top-16 left-0 right-0 z-40 px-4 pb-2 bg-background/80 backdrop-blur-md border-b border-border/40">
        <motion.div 
          className="flex items-center gap-2 bg-card rounded-full p-2 border border-border/60 shadow-sm"
          onClick={() => setIsExpanded(true)}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground flex-1">Search parlours or artists</span>
        </motion.div>
      </div>
      
  
      
      {/* Spacer to keep content below fixed search (mobile) */}
      <div className="h-24" />
      
      {/* Full Search UI - Only visible when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <ExpandedSearch onCollapse={() => setIsExpanded(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileSearch; 