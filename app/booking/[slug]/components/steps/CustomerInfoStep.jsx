import { Label } from "@/components/ui/label";
import { User, Phone } from "lucide-react";
import { useBookingContext } from "@/contexts/BookingContext";
import FormInput from "@/components/form-utils/form-input";



export const CustomerInfoStep = ({ 
  customerName, 
  customerPhone, 
  onInfoChange 
}) => {
  const { state } = useBookingContext();
  
  const handleNameChange = (name) => {
    onInfoChange(name, customerPhone);
  };

  const handlePhoneChange = (phone) => {
    onInfoChange(customerName, phone);
  };
  const handleAddressChange = (address) => {
    onInfoChange(customerName, customerPhone, address);
  };
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your Information
        </h2>
        <p className="text-muted-foreground">
          Please provide your contact details
        </p>
      </div>
      
      <div className="max-w-md mx-auto space-y-6">
        <FormInput
          label={
            <span className="flex items-center gap-2 text-foreground">
              <User className="h-4 w-4" /> Your Name
            </span>
          }
          placeholder="Enter your full name"
          value={customerName}
          onChange={(val) => handleNameChange(val)}
          inputClassName="h-12 text-base"
        />
        
        <FormInput
          label={
            <span className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4" /> Phone Number
            </span>
          }
          placeholder="01712-345678"
          value={customerPhone}
          onChange={(val) => handlePhoneChange(val)}
          inputClassName="h-12 text-base"
        />

        {state.serviceType === 'at-home' && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">Service Address</Label>
            <FormInput
              placeholder="House, Road, Area, City"
              value={state.serviceAddress || ''}
              onChange={(val) => handleAddressChange(val)}
              inputClassName="h-12 text-base"
            />
            <p className="text-xs text-muted-foreground">We need your address to arrange at-home service.</p>
          </div>
        )}
        
        {(customerName && customerPhone) && (
          <div className="bg-gradient-card border border-border rounded-2xl p-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Contact Information</div>
              <div className="font-semibold text-foreground">{customerName}</div>
              <div className="text-sm text-muted-foreground">{customerPhone}</div>
              {state.serviceType === 'at-home' && state.serviceAddress && (
                <div className="text-sm text-muted-foreground mt-1">{state.serviceAddress}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};