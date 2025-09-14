"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react";
import { useServices, useServiceActions } from "@/hooks/query/useServices";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { ServiceFormDialog } from "@/components/platform/services/ServiceFormDialog";
import { ServiceItemCard } from "@/components/platform/services/ServiceItemCard";
import { CardWrapper } from "@/components/custom/ui/card-wrapper";
import HeaderSection from "@/components/custom/dashboard/header-section";

const initialFormData = {
  name: "",
  description: "",
  price: 0,
  duration: 30,
  category: "",
  isActive: true,
};

export const ServicesUi = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const { parlour, token } = useAdminTenant();
  const parlourId = parlour?._id;

  const { services = [], isLoading } = useServices(
    token,
    {
      parlourId,
      limit: 100,
    },
    { enabled: !!parlourId }
  );
  const {
    createService,
    updateService,
    deleteService,
    isCreating,
    isUpdating,
    isDeleting,
  } = useServiceActions();

  const [formState, setFormState] = useState(initialFormData);

  const handleSubmit = async (values) => {
    if (!parlourId || !token) return;

    const payload = {
      name: values.name,
      description: values.description || undefined,
      price: Number(values.price) || 0,
      duration: Number(values.duration) || 1,
      category: values.category || undefined,
      isActive: values.isActive ?? true,
    };

    if (editingService) {
      await updateService({ token, id: editingService._id, data: payload });
    } else {
      await createService({ token, data: { parlourId, ...payload } });
    }

    handleCloseDialog();
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormState({
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? 0,
      duration: service.duration ?? 30,
      category: service.category || "",
      isActive: service.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService({ token, id: serviceId });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setFormState(initialFormData);
  };

  // no category grouping

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <HeaderSection
        title="Manage Services"
        description="Add, edit, and manage your parlour services"
        actions={[
          {
            text: "Add New Service",
            icon: Plus,
            onClick: () => {
              setEditingService(null);
              setFormState(initialFormData);
              setIsDialogOpen(true);
            },
            
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceItemCard
            key={service._id}
            service={service}
            onEdit={() => handleEdit(service)}
            onDelete={() => handleDelete(service._id)}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {services?.length === 0 && (
        <Card className="p-12 text-center bg-gradient-card border-border">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Services Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start by adding your first service to attract customers
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Service
          </Button>
        </Card>
      )}

      <ServiceFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingService ? "Edit Service" : "Add New Service"}
        initialValues={formState}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
};
