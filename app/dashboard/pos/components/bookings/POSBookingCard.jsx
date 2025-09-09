"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function POSBookingCard({ booking, isSelected, onSelect }) {
  return (
    <div
      className={
        "p-3 rounded-lg border bg-card hover:shadow-sm transition flex flex-col gap-2 cursor-pointer " +
        (isSelected ? "ring-2 ring-primary border-primary" : "")
      }
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{booking.customerName || "Walk-in"}</div>
        <Badge variant="outline" className="capitalize">
          {booking.status}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">{booking.customerPhone || "-"}</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        <span>
          {new Date(booking.appointmentDate).toLocaleDateString("en-GB")} {booking.appointmentTime}
        </span>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="text-sm font-semibold">৳{booking.totalAmount}</div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isSelected ? "default" : "secondary"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        </div>
      </div>
    </div>
  );
}


