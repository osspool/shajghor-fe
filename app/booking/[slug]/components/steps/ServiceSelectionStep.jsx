import { ServicesList } from "../ServicesList";
import { useBookingContext } from "@/contexts/BookingContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";



export const ServiceSelectionStep = ({ selectedServices, onServiceToggle, supportedModes = ['in-salon'], parlourId }) => {
  const { state, dispatch } = useBookingContext();
  const supported = supportedModes?.length ? supportedModes : ['in-salon'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose Your Services
        </h2>
        <p className="text-muted-foreground">
          Select the beauty treatments you'd like to book
        </p>
      </div>
      {/* Service Type Selector */}
      <Card className="p-4 border-border">
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">Where would you like the service?</div>
          <RadioGroup
            value={state.serviceType}
            onValueChange={(val) => dispatch({ type: 'SET_SERVICE_TYPE', payload: val })}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <RadioGroupItem value="in-salon" id="in-salon" disabled={!supported.includes('in-salon')} />
              <Label htmlFor="in-salon" className="cursor-pointer">
                At Salon
              </Label>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <RadioGroupItem value="at-home" id="at-home" disabled={!supported.includes('at-home')} />
              <Label htmlFor="at-home" className="cursor-pointer">
                At Home
              </Label>
            </div>
          </RadioGroup>
          {state.serviceType === 'at-home' && (
            <p className="text-xs text-muted-foreground">
              For at-home bookings, pick any date and a preferred time; the parlour will coordinate the final schedule.
            </p>
          )}
        </div>
      </Card>
      
      <ServicesList 
        selectedServices={selectedServices}
        onServiceToggle={onServiceToggle}
        parlourId={parlourId}
      />
      
      {selectedServices.length > 0 && (
        <div className="bg-gradient-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
            </span>
            <span className="font-semibold text-primary">
              ৳{selectedServices.reduce((sum, service) => sum + service.price, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};