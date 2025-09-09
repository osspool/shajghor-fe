"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, MapPin, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/contexts/LocationContext";
import LocationSelector from "@/components/custom/nav/LocationSelector";

// Dummy parlour/artist data (replace with API results later)
const popularParlours = [
    { id: "p1", name: "Glam Studio", types: "Salon • Bridal", image: null, rating: 4.7, isFeatured: true },
    { id: "p2", name: "Makeup by Riya", types: "Artist • Makeup", image: null, rating: 4.6, isFeatured: true },
    { id: "p3", name: "Zen Spa", types: "Spa • Wellness", image: null, rating: 4.4, isFeatured: false },
];

const ExpandedSearch = ({ className, onCollapse, isDesktop = false }) => {
    const router = useRouter();
    const { city } = useLocation();
    // add mock search query and selected location
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [openLocationModal, setOpenLocationModal] = useState(false);

    const [inputFocused, setInputFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Minimal suggestions: only results or featured/popular
    const getSuggestions = (query) => {
        setLoading(true);
        setTimeout(() => {
            const items = query.length > 0
                ? popularParlours.filter((item) =>
                    item.name.toLowerCase().includes(query.toLowerCase()) ||
                    item.types.toLowerCase().includes(query.toLowerCase())
                  )
                : popularParlours.filter((p) => p.isFeatured);

            const mockItems = [
                { type: "parlour", name: query.length > 0 ? "Results" : "Popular Near You", items },
            ];
            setSuggestions(mockItems);
            setLoading(false);
        }, 250);
    };

    // Get suggestions on query change
    useEffect(() => {
        getSuggestions(searchQuery);
    }, [searchQuery]);

    // Handle search submission
    const handleSearch = (e) => {
        e?.preventDefault();

        // Build search params for parlour listing
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (city) params.set("city", city);

        // Add location parameters from global state
        if (selectedLocation?.coordinates) {
            params.set("latitude", selectedLocation.coordinates[0].toString());
            params.set("longitude", selectedLocation.coordinates[1].toString());
            if (selectedLocation.radius) {
                params.set("radius", selectedLocation.radius.toString());
            }
        }

        router.push(`/parlours?${params.toString()}`);
        onCollapse();
    };

    // If in desktop mode, render within the dropdown
    if (isDesktop) {
        return (
            <div className={cn("flex flex-col h-full", className)}>
                {/* Search Header - Styled to exactly match the collapsed search input */}
                <div className="search-header p-3 px-4 border-b flex items-center space-x-3 bg-gray-100">
                    <X
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={onCollapse}
                    />
                    <div className="flex-1 flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search ShajGhor"
                            className="expanded-search-input bg-gray-100 flex-1 outline-none text-gray-800 placeholder-gray-600"
                            autoFocus
                        />
                        {searchQuery && (
                            <X
                                className="h-5 w-5 text-gray-500 cursor-pointer"
                                onClick={() => setSearchQuery("")}
                            />
                        )}
                    </div>
                </div>

                {/* Suggestions area - only visible when expanded beyond initial state */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="overflow-auto max-h-[400px] pb-2 pt-1.5 px-2 border-t border-gray-100"
                >
                    <AnimatePresence>
                        {loading ? (
                            <div className="p-4">
                                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                                <div className="h-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {suggestions.length > 0 ? (
                                    suggestions.map((section, i) => (
                                        <div
                                            key={`section-${i}`}
                                            className="mb-4"
                                        >
                                            <h3 className="px-2 text-sm font-semibold text-gray-500 mb-2">
                                                {section.name}
                                            </h3>

                                            {/* Render content based on section type */}
                                            {renderSectionContent(section)}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <p>No results found</p>
                                        <p className="text-sm">
                                            Try a different search term
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    }

    // For mobile fullscreen version
    return (
        <>
        <div
            className={cn(
                "fixed inset-0 bg-white z-50 flex flex-col",
                className
            )}
        >
            {/* Search Header */}
            <div className="search-header p-3 px-4 border-b flex items-center space-x-3 bg-card">
                <ChevronLeft
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    onClick={onCollapse}
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ShajGhor"
                    className="expanded-search-input bg-card flex-1 outline-none text-foreground placeholder-muted-foreground"
                />
                {searchQuery && (
                    <X
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => setSearchQuery("")}
                    />
                )}
            </div>

            {/* Location bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
              <MapPin className="h-4 w-4 text-primary" />
              <div className="flex-1 text-left">
                <span className="text-sm font-medium">Deliver to</span>
                <p className="text-sm text-muted-foreground">
                  {selectedLocation?.name || city?.charAt(0).toUpperCase() + city?.slice(1) || "Dhaka"}
                </p>
              </div>
              <LocationSelector showLabelOnMobile buttonProps={{ onClick: () => setOpenLocationModal(true) }} />
            </div>

            {/* Suggestions area */}
            <div className="flex-1 overflow-auto">
                <AnimatePresence>
                    {loading ? (
                        <div className="p-4">
                            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                            <div className="h-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {suggestions.length > 0 ? (
                                suggestions.map((section, i) => (
                                    <div key={`section-${i}`} className="mb-6">
                                        <h3 className="px-4 text-sm font-semibold text-gray-500 mb-2">
                                            {section.name}
                                        </h3>

                                        {/* Render content based on section type */}
                                        {renderSectionContent(section, true)}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">
                                    <p>No results found</p>
                                    <p className="text-sm">
                                        Try a different search term
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
        {/* Reuse existing LocationSelector dialog by rendering a hidden trigger and programmatically clicking it is complex.
            Instead, we render the component here and rely on its internal dialog. */}
        {openLocationModal ? <LocationSelector showLabelOnMobile className="hidden" /> : null}
        </>
    );

    // Helper function to render different section types
    function renderSectionContent(section, isMobile = false) {
        const paddingClass = isMobile ? "px-4" : "px-2";

        switch (section.type) {
            case "parlour":
                return (
                    <div>
                        {section.items.map((item, j) => (
                            <button
                                key={`rest-${j}`}
                                className={`w-full ${paddingClass} py-3 text-left hover:bg-gray-50 flex items-center`}
                                onClick={() => {
                                    setSearchQuery(item.name);
                                    handleSearch();
                                }}
                            >
                                <div className="w-14 h-14 relative rounded-full overflow-hidden mr-3 bg-gray-100 flex-shrink-0">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center font-medium text-lg text-gray-500">
                                            {item.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-base">
                                        {item.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.types}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">⭐ {item.rating}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    }
};

export default ExpandedSearch;
