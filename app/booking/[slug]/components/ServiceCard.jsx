import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";



export const ServiceCard = ({ service, isSelected, onToggle }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(!isSelected);
    setTimeout(() => setIsAnimating(false), 300);
    onToggle(service);
  };

  return (
    <div 
      className={`
        relative group p-6 rounded-2xl border transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'bg-gradient-primary text-primary-foreground border-primary shadow-glow' 
          : 'bg-gradient-card border-border hover:shadow-card hover:border-primary/30'
        }
      `}
      onClick={handleToggle}
    >
      {/* Service Details */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-1 ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
            {service.name}
          </h3>
          {service.description && (
            <p className={`text-sm mb-2 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {service.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className={`font-medium ${isSelected ? 'text-primary-foreground' : 'text-primary'}`}>
              ৳{service.price}
            </span>
            <span className={`${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {service.duration} mins
            </span>
          </div>
        </div>

        {/* Toggle Button */}
        <Button
          size="sm"
          variant={isSelected ? "secondary" : "outline"}
          className={`
            ml-4 rounded-full h-10 w-10 p-0 transition-all duration-300
            ${isSelected 
              ? 'bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30' 
              : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
            }
            ${isAnimating ? 'scale-110' : 'scale-100'}
          `}
        >
          {isSelected ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl border-2 border-white/30 pointer-events-none" />
      )}
    </div>
  );
};