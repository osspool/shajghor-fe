"use client";

import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "@/contexts/LocationContext";

const CollapsedSearch = ({ className, onExpand }) => {
  const { selectedLocation } = useLocation();

  // Display location text
  const getDisplayLocation = () => {
    if (!selectedLocation) return "Select location";
    if (selectedLocation.name) return selectedLocation.name;
    if (selectedLocation.coordinates) return "Selected location";
    return "Select location";
  };

  return (
    <div 
      className={cn(
        "w-full bg-white py-2 px-4 flex items-center gap-2 border-t border-b border-gray-200 shadow-sm", 
        className
      )}
    >
      <div className="flex items-center text-primary text-sm font-medium">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="truncate max-w-[80px]">
          {getDisplayLocation()}
        </span>
      </div>
      
      <div 
        className="flex-1 h-9 rounded-full border border-gray-200 flex items-center px-3 bg-gray-50"
        onClick={onExpand}
      >
        <Search className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-gray-400 text-sm">Search dishes or caterers</span>
      </div>
    </div>
  );
};

export default CollapsedSearch; 