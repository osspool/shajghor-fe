"use client";

import { useAdminTenant } from "@/contexts/AdminTenantContext";

export function DashboardUi() {
  const { parlour, organization, ids } = useAdminTenant();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-lg font-semibold mb-2">Parlour</h3>
        {parlour ? (
          <div className="text-sm space-y-1">
            <div><span className="text-muted-foreground">Name:</span> {parlour.name}</div>
            <div><span className="text-muted-foreground">Slug:</span> {parlour.slug}</div>
            <div><span className="text-muted-foreground">Phone:</span> {parlour.phone || '-'}</div>
            <div><span className="text-muted-foreground">Service Mode:</span> {parlour.serviceLocationMode || '-'}</div>
            <div><span className="text-muted-foreground">Parlour ID:</span> {parlour._id}</div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No parlour found.</div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-lg font-semibold mb-2">Organization</h3>
        {organization ? (
          <div className="text-sm space-y-1">
            <div><span className="text-muted-foreground">Name:</span> {organization.name}</div>
            <div><span className="text-muted-foreground">Email:</span> {organization.email || '-'}</div>
            <div><span className="text-muted-foreground">Phone:</span> {organization.phone || '-'}</div>
            <div><span className="text-muted-foreground">Organization ID:</span> {organization._id}</div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No organization found.</div>
        )}
      </div>
    </div>
  );
}


