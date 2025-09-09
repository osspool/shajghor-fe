"use client";
import { createContext, useContext, useMemo } from "react";
import { useParlourByTenant } from "@/hooks/query/useParlours";

const AdminTenantContext = createContext(undefined);

export function AdminTenantProvider({ ownerId, accessToken = "", children }) {
  // My parlours by owner (list)
  const { parlour } = useParlourByTenant(ownerId, accessToken);

  // console.log("myParlours", parlour);

  const organization = parlour?.organizationId;

  const value = useMemo(
    () => ({
      parlour,
      organization,
      token: accessToken,
      queryKeys: {
        parlour: ["parlours", "owner", ownerId],
      },
    }),
    [parlour, ownerId]
  );

  return (
    <AdminTenantContext.Provider value={value}>
      {children}
    </AdminTenantContext.Provider>
  );
}

export function useAdminTenant() {
  const ctx = useContext(AdminTenantContext);
  if (!ctx)
    throw new Error("useAdminTenant must be used within AdminTenantProvider");
  return ctx;
}
