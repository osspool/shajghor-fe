import { ServiceCard } from "./ServiceCard";
import { Sparkles } from "lucide-react";
import { useServices } from "@/hooks/query/useServices";



export const ServicesList = ({ selectedServices, onServiceToggle, parlourId }) => {
  const { services = [], isLoading, error } = useServices(null, { parlourId, limit: 100 }, { public: true });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Loading Services...</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gradient-card border border-border rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load services. Please try again.</p>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Our Services</span>
        </div>
       
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            isSelected={selectedServices.some(s => s._id === service._id)}
            onToggle={onServiceToggle}
          />
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="bg-gradient-card p-4 rounded-2xl border border-border shadow-card">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
            </p>
            <p className="font-medium text-primary">
              Total: ৳{selectedServices.reduce((sum, service) => sum + service.price, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};