"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Edit, Trash2 } from "lucide-react";

export function ServiceItemCard({ service, onEdit, onDelete, isDeleting = false }) {
  return (
    <Card className="p-4 border border-border hover:shadow-card transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{service.name}</h4>
            {service.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {service.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Badge 
              variant={service.isActive ? "default" : "secondary"}
              className={service.isActive ? "bg-green-100 text-green-800" : ""}
            >
              {service.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Price</span>
            </div>
            <span className="font-medium text-primary">৳{service.price}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Duration</span>
            </div>
            <span className="font-medium">{service.duration} mins</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 h-8">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} disabled={isDeleting} className="flex-1 h-8 border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}


