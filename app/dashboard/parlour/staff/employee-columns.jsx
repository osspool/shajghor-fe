"use client";
import React from "react";
import { User, Mail, BadgeCheck, Shield, Pencil, Trash2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionDropdown } from "@/components/custom/ui/dropdown-wrapper";

const EmployeeCell = React.memo(({ item }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <User className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <div className="text-sm font-medium truncate max-w-[160px] sm:max-w-[220px]">
        {item?.userId?.name || "Unnamed"}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground truncate max-w-[200px]">
        <Mail className="h-3.5 w-3.5" />
        <span className="truncate">{item?.userId?.email}</span>
      </div>
    </div>
  </div>
));
EmployeeCell.displayName = "EmployeeCell";

const RoleCell = React.memo(({ item }) => (
  <div className="flex flex-col gap-1 text-xs">
    <div className="flex items-center gap-1">
      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
      <Badge variant="secondary" className="px-2 py-0.5 capitalize">{item.role}</Badge>
    </div>
    {item.title && (
      <div className="text-muted-foreground">{item.title}</div>
    )}
  </div>
));
RoleCell.displayName = "RoleCell";

const StatusCell = React.memo(({ item }) => (
  <div className="text-xs">
    <span className="inline-flex items-center px-2 py-0.5 rounded-full border bg-muted/60">
      {item.active ? "Active" : "Inactive"}
    </span>
  </div>
));
StatusCell.displayName = "StatusCell";

const SalaryCell = React.memo(({ item }) => (
  <div className="text-sm font-medium text-primary whitespace-nowrap">৳{item.salaryAmount || 0}</div>
));
SalaryCell.displayName = "SalaryCell";

export const employeeColumns = (onEdit, onDelete, onPay) => [
  {
    id: 'employee',
    header: 'Employee',
    cell: ({ row }) => <EmployeeCell item={row.original} />,
    enableSorting: false,
  },
  {
    id: 'role',
    header: 'Role/Title',
    cell: ({ row }) => <RoleCell item={row.original} />,
    enableSorting: false,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusCell item={row.original} />,
    enableSorting: true,
  },
  {
    id: 'salary',
    header: 'Salary',
    cell: ({ row }) => <SalaryCell item={row.original} />,
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
        <div className="flex items-center gap-2 justify-center">
          <Button size="sm" variant="outline" onClick={() => onPay?.(item)} className="whitespace-nowrap">
            <Banknote className="h-4 w-4 mr-1" /> Pay
          </Button>
          <ActionDropdown items={items} />
        </div>
      );
    }
  }
];


