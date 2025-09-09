"use client";

import { LocationProvider } from "@/contexts/LocationContext";

export function ClientProviders({ children,  }) {
  return (


<LocationProvider>
  <div>
    {children}
  </div>
</LocationProvider>



  );
}
