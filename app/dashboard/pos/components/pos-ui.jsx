// @/app/dashboard/sales/pos/components/pos-ui.jsx
"use client";

import { ResponsiveSplitLayout } from "@/components/custom/ui/ResponsiveSplitLayout";
import { ShoppingCart, Package } from "lucide-react";
import { POSBookings } from "./bookings/POSBookings";
import { POSCart } from "./cart/POSCart";
import { usePOS } from "../context/POSContext";

export function PosUi({ token }) {
  const { state } = usePOS();

  return (
    <div className="h-full border-t-2 overflow-hidden">
      <ResponsiveSplitLayout
        leftPanel={{
          content: <POSBookings token={token} />,
          title: "Bookings",
          icon: <Package className="h-4 w-4" />,
        }}
        rightPanel={{
          content: <POSCart token={token} />,
          title: "Cart",
          icon: <ShoppingCart className="h-4 w-4" />,
          badge: state.cartItems.length > 0 ? state.cartItems.length : undefined
        }}
        variant="fixed" // Use fixed variant for cleaner POS UI
        rightPanelWidth={350} // Fixed cart width
        mobileBreakpoint="lg" // Switch to mobile layout only below lg (1024px)
        leftPanelClassName="bg-background"
        rightPanelClassName="bg-muted/30"
      />
    </div>
  );
}
