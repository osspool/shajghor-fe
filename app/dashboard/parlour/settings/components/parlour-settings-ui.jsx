"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { ParlourForm } from "@/components/platform/parlour/parlour.form";

export function ParlourSettingsUi() {
  const { parlour, token } = useAdminTenant();

  const isReady = useMemo(() => !!parlour && !!parlour._id, [parlour]);

  return (
    <div className="space-y-4">
      {isReady ? (
        <Card className="p-4">
          <ParlourForm
            token={token}
            parlour={parlour}
            onSuccess={() => {}}
            onCancel={() => {}}
            showOwnershipFields={false}
            canEditAdminFields={false}
            hideActions={false}
            formId="tenant-parlour-settings-form"
          />
        </Card>
      ) : (
        <Card className="p-6">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </Card>
      )}
    </div>
  );
}


