"use client";
import React from "react";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { ActionDropdown } from "@/components/custom/ui/dropdown-wrapper";

const PlanCell = React.memo(({ item }) => (
  <div className="text-sm font-medium">{item.planName}</div>
));
PlanCell.displayName = "PlanCell";

const PriceCell = React.memo(({ item }) => {
  const { price, currency } = item;
  const value = Number(price)?.toLocaleString("en-US");
  const formatted = currency === "BDT" ? `৳${value}` : `${currency} ${value}`;
  return <div className="text-sm font-medium text-primary">{formatted}</div>;
});
PriceCell.displayName = "PriceCell";

const BillingCycleCell = React.memo(({ item }) => (
  <div className="text-xs text-muted-foreground">
    {String(item.billingCycle || "").replace(/\b\w/g, (c) => c.toUpperCase())}
  </div>
));
BillingCycleCell.displayName = "BillingCycleCell";

const StatusCell = React.memo(({ item }) => (
  <div className="text-xs">
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted border">
      {item.status}
    </span>
  </div>
));
StatusCell.displayName = "StatusCell";

const PeriodCell = React.memo(({ item }) => {
  const start = item.periodStart
    ? new Date(item.periodStart).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
  const end = item.periodEnd
    ? new Date(item.periodEnd).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
  return (
    <div className="text-xs text-muted-foreground flex items-center gap-1">
      <Calendar className="h-3.5 w-3.5" />
      <span>
        {start} - {end}
      </span>
    </div>
  );
});
PeriodCell.displayName = "PeriodCell";

export const subscriptionsColumns = (onEdit, onDelete) => [
  {
    id: 'planName',
    header: 'Plan',
    cell: ({ row }) => <PlanCell item={row.original} />,
    enableSorting: true,
  },
  {
    id: 'price',
    header: 'Price',
    cell: ({ row }) => <PriceCell item={row.original} />,
    enableSorting: true,
  },
  {
    id: 'billingCycle',
    header: 'Billing Cycle',
    cell: ({ row }) => <BillingCycleCell item={row.original} />,
    enableSorting: true,
  },
  {
    id: 'period',
    header: 'Period',
    cell: ({ row }) => <PeriodCell item={row.original} />,
    enableSorting: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusCell item={row.original} />,
    enableSorting: true,
  },
  {
    id: 'actions',
    header: <div className="text-center">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => {
      const item = row.original;
      const items = [
        { label: 'Edit', icon: Pencil, onClick: () => onEdit?.(item) },
        { type: 'separator' },
        { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => onDelete?.(item) },
      ];
      return (
        <div className="flex items-center justify-center">
          <ActionDropdown items={items} />
        </div>
      );
    }
  }
];


