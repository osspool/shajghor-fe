"use client";
import React from "react";
import { Calendar, Clock, Phone, User, Pencil, Trash2 } from "lucide-react";
import { ActionDropdown } from "@/components/custom/ui/dropdown-wrapper";

const CustomerCell = React.memo(({ item }) => (
  <div className="flex items-center gap-2 text-sm">
    <User className="h-4 w-4 text-muted-foreground" />
    <span>{item.customerName}</span>
  </div>
));
CustomerCell.displayName = "CustomerCell";

const PhoneCell = React.memo(({ item }) => (
  <div className="flex items-center gap-2 text-sm">
    <Phone className="h-4 w-4 text-muted-foreground" />
    <span>{item.customerPhone}</span>
  </div>
));
PhoneCell.displayName = "PhoneCell";

const AppointmentCell = React.memo(({ item }) => (
  <div className="text-xs text-muted-foreground">
    <div className="flex items-center gap-1">
      <Calendar className="h-3.5 w-3.5" />
      {new Date(item.appointmentDate).toLocaleDateString('en-GB')}
    </div>
    <div className="flex items-center gap-1">
      <Clock className="h-3.5 w-3.5" />
      {item.appointmentTime}
    </div>
  </div>
));
AppointmentCell.displayName = "AppointmentCell";

const ServicesCell = React.memo(({ item }) => (
  <div className="text-xs text-muted-foreground">
    {item.services?.map(s => s.serviceName).join(', ')}
  </div>
));
ServicesCell.displayName = "ServicesCell";

const AmountCell = React.memo(({ item }) => (
  <div className="text-sm font-medium text-primary">৳{item.totalAmount}</div>
));
AmountCell.displayName = "AmountCell";

const StatusCell = React.memo(({ item }) => (
  <div className="text-xs">
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted border">
      {item.status}
    </span>
  </div>
));
StatusCell.displayName = "StatusCell";

export const bookingsColumns = (onEdit, onDelete) => [
  {
    id: 'customerName',
    header: 'Customer',
    cell: ({ row }) => <CustomerCell item={row.original} />,
    enableSorting: false,
  },
  {
    id: 'customerPhone',
    header: 'Phone',
    cell: ({ row }) => <PhoneCell item={row.original} />,
    enableSorting: false,
  },
  {
    id: 'appointment',
    header: 'Appointment',
    cell: ({ row }) => <AppointmentCell item={row.original} />,
    enableSorting: true,
  },
  {
    id: 'services',
    header: 'Services',
    cell: ({ row }) => <ServicesCell item={row.original} />,
    enableSorting: false,
  },
  {
    id: 'amount',
    header: 'Amount',
    cell: ({ row }) => <AmountCell item={row.original} />,
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


