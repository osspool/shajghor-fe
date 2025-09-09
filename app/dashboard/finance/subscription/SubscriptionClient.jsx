"use client";
import { useState, useCallback, useMemo } from "react";
import { SubscriptionSheet } from "@/components/platform/finance/subscription-sheet";
import { Wallet, Calendar } from "lucide-react";
import HeaderSection from "@/components/custom/dashboard/header-section";
import ErrorBoundaryWrapper from "@/components/custom/error/error-boundary-wrapper";
import { useSubscriptions } from "@/hooks/query/useSubscriptions";
import { Button } from "@/components/ui/button";

export function SubscriptionClient({ token }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { subscriptions = [], isLoading } = useSubscriptions(token, {}, { public: false });
  const subscription = subscriptions?.[0] || null;

  const handleEdit = useCallback(() => {
    if (subscription) {
      setSelected(subscription);
      setOpen(true);
    }
  }, [subscription]);

  const formatCurrency = useCallback((price, currency) => {
    const value = Number(price)?.toLocaleString("en-US");
    return currency === "BDT" ? `৳${value}` : `${currency} ${value}`;
  }, []);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <HeaderSection
        icon={Wallet}
        title="Subscription"
        variant="compact"
        description="Your current subscription"
      />

      <ErrorBoundaryWrapper>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading subscription...</div>
          ) : !subscription ? (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">No subscription found.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold">{subscription.planName}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(subscription.price, subscription.currency)} / {String(subscription.billingCycle || "").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                </div>
                <div className="text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted border">
                    {subscription.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Period: {formatDate(subscription.periodStart)} - {formatDate(subscription.periodEnd)}</span>
                </div>
                {subscription.verifiedAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Verified: {formatDate(subscription.verifiedAt)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button size="sm" onClick={handleEdit} disabled={!subscription}>
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundaryWrapper>

      <SubscriptionSheet
        token={token}
        open={open}
        onOpenChange={setOpen}
        subscription={selected}
        restrictToPayment={true}
      />
    </div>
  );
}
