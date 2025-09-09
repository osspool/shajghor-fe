"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const POSContext = createContext(undefined);

export function POSProvider({ children }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Derive cart items from selected booking services
  useEffect(() => {
    if (selectedBooking?.services) {
      setCartItems(selectedBooking.services);
    } else {
      setCartItems([]);
    }
  }, [selectedBooking]);

  const value = useMemo(
    () => ({
      state: {
        selectedBooking,
        cartItems,
      },
      actions: {
        setSelectedBooking,
        clearCart: () => setCartItems([]),
      },
    }),
    [selectedBooking, cartItems]
  );

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

export function usePOS() {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error("usePOS must be used within POSProvider");
  return ctx;
}



