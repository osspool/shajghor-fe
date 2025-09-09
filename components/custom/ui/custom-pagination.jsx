// components/custom/custom-pagination.jsx
"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function CustomPagination({ currentPage, onPageChange, totalPages, hasPrevPage, hasNextPage }) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Convert currentPage to number to ensure proper comparison
  const currentPageNum = Number(currentPage);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    // Reduce delta on mobile for fewer page numbers
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show around current page
    for (
      let i = Math.max(2, currentPageNum - delta);
      i <= Math.min(totalPages - 1, currentPageNum + delta);
      i++
    ) {
      range.push(i);
    }

    // Always show first page
    if (currentPageNum - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    // Add the calculated range
    rangeWithDots.push(...range);

    // Handle last page
    if (currentPageNum + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      if (!range.includes(totalPages)) {
        rangeWithDots.push(totalPages);
      }
    }

    return [...new Set(rangeWithDots)]; // Remove any duplicates
  };

  // For very small screens, show minimal pagination
  if (isMobile && totalPages > 5) {
    return (
      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => (hasPrevPage ? onPageChange(currentPageNum - 1) : undefined)}
              className={cn(
                "cursor-pointer transition-colors h-8 px-2 text-xs",
                !hasPrevPage && "pointer-events-none opacity-50 cursor-not-allowed",
                hasPrevPage && "hover:bg-accent hover:text-accent-foreground"
              )}
              aria-disabled={!hasPrevPage}
            />
          </PaginationItem>

          {/* Show current page info */}
          <PaginationItem>
            <div className="flex h-8 items-center justify-center px-3 text-xs font-medium bg-primary text-primary-foreground rounded-md">
              {currentPageNum} / {totalPages}
            </div>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => (hasNextPage ? onPageChange(currentPageNum + 1) : undefined)}
              className={cn(
                "cursor-pointer transition-colors h-8 px-2 text-xs",
                !hasNextPage && "pointer-events-none opacity-50 cursor-not-allowed",
                hasNextPage && "hover:bg-accent hover:text-accent-foreground"
              )}
              aria-disabled={!hasNextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent className="gap-1 flex-wrap">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => (hasPrevPage ? onPageChange(currentPageNum - 1) : undefined)}
            className={cn(
              "cursor-pointer transition-colors",
              isMobile ? "h-8 px-2 text-xs" : "h-9 px-3 text-sm",
              !hasPrevPage && "pointer-events-none opacity-50 cursor-not-allowed",
              hasPrevPage && "hover:bg-accent hover:text-accent-foreground"
            )}
            aria-disabled={!hasPrevPage}
          />
        </PaginationItem>

        {getPageNumbers().map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum === "..." ? (
              <span className={cn(
                "flex items-center justify-center text-muted-foreground",
                isMobile ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"
              )}>
                ...
              </span>
            ) : (
              <PaginationLink
                className={cn(
                  "cursor-pointer transition-colors",
                  isMobile ? "h-8 w-8 text-xs p-0" : "h-9 w-9 text-sm p-0",
                  "hover:bg-accent hover:text-accent-foreground",
                  Number(currentPageNum) === Number(pageNum) && 
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => (typeof pageNum === "number" ? onPageChange(pageNum) : undefined)}
                isActive={Number(currentPageNum) === Number(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={Number(currentPageNum) === Number(pageNum) ? "page" : undefined}
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => (hasNextPage ? onPageChange(currentPageNum + 1) : undefined)}
            className={cn(
              "cursor-pointer transition-colors",
              isMobile ? "h-8 px-2 text-xs" : "h-9 px-3 text-sm",
              !hasNextPage && "pointer-events-none opacity-50 cursor-not-allowed",
              hasNextPage && "hover:bg-accent hover:text-accent-foreground"
            )}
            aria-disabled={!hasNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const PaginationInfo = ({ currentPage, totalDocs, itemsPerPage = 10 }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (totalDocs === 0) {
    return (
      <div className="flex-1 text-sm text-muted-foreground">
        <p>No entries found</p>
      </div>
    );
  }

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalDocs);

  return (
    <div className="flex-1 text-sm text-muted-foreground">
      <p className={cn("whitespace-nowrap", isMobile && "text-xs")}>
        {isMobile ? (
          // Shorter format for mobile
          <span>
            {startEntry.toLocaleString()}-{endEntry.toLocaleString()} of {totalDocs.toLocaleString()}
          </span>
        ) : (
          // Full format for desktop
          <span>
            Showing{" "}
            <span className="font-medium text-foreground">{startEntry.toLocaleString()}</span>{" "}
            to{" "}
            <span className="font-medium text-foreground">{endEntry.toLocaleString()}</span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{totalDocs.toLocaleString()}</span>{" "}
            {totalDocs === 1 ? "result" : "results"}
          </span>
        )}
      </p>
    </div>
  );
};

export { CustomPagination, PaginationInfo };
