"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { InfoRow } from "@/components/custom/ui/info-row";
import { Building2, Hash, Mail, Phone, MapPin, CircleDollarSign, Calendar as CalIcon, Wallet, StickyNote, ShieldCheck } from "lucide-react";

export default function OrganizationInfo() {
  const { organization: org } = useAdminTenant();

  if (!org) {
        return (
            <div className="rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Organization</h3>
        <p className="text-sm text-muted-foreground">No organization found for this tenant.</p>
            </div>
        );
    }

  const rows = [
    { label: "Name", value: org.name, icon: Building2 },
    { label: "Organization ID", value: org._id || org.id, copyable: true, icon: Hash },
    { label: "Owner ID", value: org.ownerId, copyable: true, icon: ShieldCheck },
    { label: "Email", value: org.email, icon: Mail },
    { label: "Phone", value: org.phone, icon: Phone },
    { label: "Address", value: org.address, icon: MapPin },
    { label: "Billing Price", value: org.billingPrice != null ? `৳${org.billingPrice}` : undefined, icon: CircleDollarSign },
    { label: "Currency", value: org.billingCurrency, icon: Wallet },
    { label: "Last Paid At", value: org.lastPaidAt ? new Date(org.lastPaidAt).toLocaleString() : undefined, icon: CalIcon },
    { label: "Last Paid Method", value: org.lastPaidMethod, icon: Wallet },
    { label: "Billing Notes", value: org.billingNotes, icon: StickyNote },
    { label: "Status", value: org.isActive ? "Active" : "Inactive", icon: ShieldCheck },
  ];

    return (
            <Card className="mb-6">
                <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-1">Organization</h3>
        <p className="text-sm text-muted-foreground mb-4">Managed by super admin • Read-only</p>
        <div className="divide-y">
          {rows.map((r, idx) => (
            <InfoRow key={idx} label={r.label} value={r.value} copyable={r.copyable} icon={r.icon} />
          ))}
                    </div>
                </CardContent>
            </Card>
    );
}
