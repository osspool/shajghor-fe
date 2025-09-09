"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PopularCities } from "@/constants/locations";

const DEFAULT_CITY = PopularCities.DHAKA;
const STORAGE_KEY = "app.selectedCity";

const LocationContext = createContext({
  city: DEFAULT_CITY,
  setCity: () => {},
  cities: [PopularCities.DHAKA],
});

export function LocationProvider({ children }) {
  const [city, setCity] = useState(DEFAULT_CITY);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setCity(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, city || DEFAULT_CITY);
    } catch {}
  }, [city]);

  const value = useMemo(() => ({ city, setCity, cities: Object.values(PopularCities) }), [city]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  return useContext(LocationContext);
}



