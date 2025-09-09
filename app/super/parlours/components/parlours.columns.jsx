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

export const parlourColumns = (onEdit, onDelete) => [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <TextCell value={row.original.name} />,
    enableSorting: true,
  },
  {
    id: "slug",
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded border">
        {row.original.slug}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <TextCell value={row.original.phone} />,
    enableSorting: false,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <TextCell value={row.original.email} />,
    enableSorting: false,
  },
  {
    id: "providerType",
    accessorKey: "providerType",
    header: "Provider",
    cell: ({ row }) => <TextCell value={row.original.providerType} />,
    enableSorting: true,
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <BadgeCell value={row.original.isActive} />,
    enableSorting: true,
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const item = row.original;
      const items = [
        {
          label: "View",
          icon: Eye,
          onClick: () => window.open(`/parlours/${item.slug}`, "_blank"),
        },
        {
          label: "Edit",
          icon: Pencil,
          onClick: () => onEdit?.(item),
        },
        { type: "separator" },
        {
          label: "Delete",
          icon: Trash2,
          variant: "destructive",
          onClick: () => onDelete?.(item),
        },
      ];

      return (
        <div className="flex items-center justify-center">
          <ActionDropdown items={items} />
        </div>
      );
    },
    enableSorting: false,
  },
];


