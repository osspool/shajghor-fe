// src/components/custom/status-badge.js
"use client";
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    draft: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
    refunded: "bg-purple-100 text-purple-800",
    partially_refunded: "bg-blue-100 text-blue-800",
  };

  return (
    <Badge className={`${statusStyles[status]} px-3 py-1 capitalize`}>
      {status.replace("_", " ")}
    </Badge>
  );
};

export default StatusBadge;
