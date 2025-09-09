"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ExpandedSearch from "./mobile-search/ExpandedSearch";
import { useLocation } from "@/contexts/LocationContext";

const SearchBar = ({ className }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { city } = useLocation();
    const searchBarRef = useRef(null);

    // Handle click outside to close expanded search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(event.target)
            ) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Use useEffect to synchronize the expanded state
    useEffect(() => {
        if (isExpanded) {
            // When expanded, add a class to prevent scrolling
            document.body.classList.add("overflow-hidden");

            // Focus the input when expanded
            setTimeout(() => {
                const expandedInput = document.querySelector(
                    ".expanded-search-input"
                );
                if (expandedInput) {
                    expandedInput.focus();
                }
            }, 100);
        } else {
            // Remove the class when collapsed
            document.body.classList.remove("overflow-hidden");
        }
    }, [isExpanded]);

    return (
        <div
            className={cn("relative w-full max-w-[450px]", className)}
            ref={searchBarRef}
        >
            {/* Collapsed search bar */}
            <div
                className={cn(
                    "flex items-center h-10 bg-card rounded-full border cursor-pointer transition-all shadow-sm",
                    "border-border/60 hover:border-border",
                    isExpanded ? "invisible pointer-events-none" : "visible"
                )}
                onClick={() => setIsExpanded(true)}
            >
                <div className="flex items-center pl-4 w-full">
                    <Search className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Search parlours or artists</span>
                </div>
            </div>

            {/* Expanded search overlay */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{
                                opacity: 0.9,
                                height: "40px",
                                width: "100%",
                                borderRadius: "9999px",
                                y: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto",
                                width: "100%",
                                borderRadius: "0.5rem",
                                y: 0,
                                transition: {
                                    duration: 0.2,
                                    height: { duration: 0.25 },
                                },
                            }}
                            exit={{
                                opacity: 0,
                                height: "40px",
                                borderRadius: "9999px",
                                transition: {
                                    duration: 0.15,
                                    opacity: { duration: 0.1 },
                                },
                            }}
                            className="absolute top-0 left-0 right-0 bg-white shadow-xl border border-gray-200 z-50 overflow-hidden"
                            style={{ maxHeight: "calc(100vh - 70px)" }}
                        >
                            <ExpandedSearch
                                onCollapse={() => setIsExpanded(false)}
                                isDesktop={true}
                            />
                        </motion.div>

                        {/* Background overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.2 },
                            }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.15 },
                            }}
                            className="fixed inset-0 bg-black/15 z-40"
                            style={{ pointerEvents: "none" }}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
