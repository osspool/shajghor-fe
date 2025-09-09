"use client";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { PopularCities } from "@/constants/locations";
import { DialogWrapper } from "@/components/custom/ui/dialog-wrapper";
import Combobox from "@/components/custom/combobox";

export default function LocationSelector({ showLabelOnMobile = true, className = "", buttonProps = {} }) {
  const { city, setCity, cities } = useLocation();
  const [open, setOpen] = useState(false);

  const cityOptions = useMemo(() => {
    const source = Array.isArray(cities) && cities.length > 0 ? cities : [PopularCities.DHAKA];
    return source.map((c) => ({ _id: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
  }, [cities]);

  const selectedLabel = useMemo(() => {
    return cityOptions.find((o) => o._id === city)?.label || "Select city";
  }, [cityOptions, city]);

  const trigger = (
    <Button
      variant="ghost"
      className={`px-2 h-10 gap-2 md:gap-2 md:h-10 ${className}`}
      aria-label="Select city"
      {...buttonProps}
    >
      <MapPin className="h-4 w-4 text-primary" />
      <span className={`${showLabelOnMobile ? "inline" : "hidden md:inline"} capitalize`}>
        {selectedLabel}
      </span>
    </Button>
  );

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Select your city"
      description="We will show parlours based on your selected city."
      size="sm"
    >
      <Combobox
        options={cityOptions}
        value={city}
        onValueChange={(val) => {
          setCity(val);
          setOpen(false);
        }}
        placeholder="Choose a city"
        searchPlaceholder="Search cities..."
        emptyText="No cities found."
        displayKey="label"
      />
    </DialogWrapper>
  );
}