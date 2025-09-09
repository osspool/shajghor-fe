import React from "react";
import { ActionDropdown } from "@/components/custom/ui/dropdown-wrapper";
import { Eye, Pencil, Trash2 } from "lucide-react";

const TextCell = React.memo(({ value, placeholder = "-" }) => (
  <div className="text-sm text-foreground">{value || placeholder}</div>
));
TextCell.displayName = "TextCell";

const DateCell = React.memo(({ value }) => {
  if (!value) return <span className="text-muted-foreground">-</span>;
  const formatted = new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return <span className="text-sm text-muted-foreground">{formatted}</span>;
});
DateCell.displayName = "DateCell";

const BadgeCell = React.memo(({ value }) => (
  <span
    className={
      value
        ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"
        : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border"
    }
  >
    {value ? "Active" : "Inactive"}
  </span>
));
BadgeCell.displayName = "BadgeCell";

export const organizationColumns = (onEdit, onDelete) => [
  { id: "name", accessorKey: "name", header: "Name", cell: ({ row }) => <TextCell value={row.original.name} />, enableSorting: true },
  { id: "id", accessorKey: "id", header: "ID", cell: ({ row }) => <TextCell value={row.original._id} />, enableSorting: true },
  { id: "phone", accessorKey: "phone", header: "Phone", cell: ({ row }) => <TextCell value={row.original.phone} /> },
  { id: "email", accessorKey: "email", header: "Email", cell: ({ row }) => <TextCell value={row.original.email} /> },
  { id: "billingPrice", accessorKey: "billingPrice", header: "Price", cell: ({ row }) => <TextCell value={row.original.billingPrice} /> },
  { id: "billingCurrency", accessorKey: "billingCurrency", header: "Currency", cell: ({ row }) => <TextCell value={row.original.billingCurrency} /> },
  { id: "lastPaidAt", accessorKey: "lastPaidAt", header: "Last Paid", cell: ({ row }) => <DateCell value={row.original.lastPaidAt} /> },
  { id: "isActive", accessorKey: "isActive", header: "Status", cell: ({ row }) => <BadgeCell value={row.original.isActive} /> },
    {
    id: "actions",
    accessorKey: "actions",
    header: <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const item = row.original;
      const items = [
        { label: "View", icon: Eye, onClick: () => onEdit?.(item) },
        { label: "Edit", icon: Pencil, onClick: () => onEdit?.(item) },
        { type: "separator" },
        { label: "Delete", icon: Trash2, variant: "destructive", onClick: () => onDelete?.(item) },
      ];
      return (
        <div className="flex items-center justify-center">
          <ActionDropdown items={items} />
        </div>
      );
    },
  },
];


