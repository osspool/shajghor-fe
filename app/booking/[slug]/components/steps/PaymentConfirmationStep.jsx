import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Banknote, Calendar, Clock, User, Phone, Scissors, Home } from "lucide-react";
import { useBookingContext } from "@/contexts/BookingContext";
import { BookingConfirmation } from "../BookingConfirmation";
import { Label } from "@/components/ui/label";
import FormInput from "@/components/form-utils/form-input";
import { useBookingActions } from "@/hooks/query/useBookings";



export const PaymentConfirmationStep = ({ 
  selectedServices, 
  selectedDate, 
  selectedTime, 
  customerName, 
  customerPhone,
  onConfirmationShown
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const { state, dispatch } = useBookingContext();
  const { createBooking, isCreating } = useBookingActions();

  const totalPrice = selectedServices.reduce((sum, service) => sum + (Number(service.price) || 0), 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + (Number(service.duration) || 0), 0);

  // Load persisted confirmation if exists
  useEffect(() => {
    try {
      const stored = localStorage.getItem('latestBooking');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only hydrate if stored booking matches current parlour and looks server-generated
        const isServerId = typeof parsed?._id === 'string' && parsed._id.length >= 12 && !parsed._id.startsWith('BKG');
        if (parsed?.parlourId === state.parlourId && isServerId) {
          setConfirmedBooking(parsed);
          onConfirmationShown?.(true);
        } else {
          localStorage.removeItem('latestBooking');
        }
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleBooking = async () => {
    if (!selectedDate) return;
    if (!selectedTime) return; // appointmentTime is required by backend schema
    if (state.serviceType === 'at-home' && !state.serviceAddress) return;
    
    setIsSubmitting(true);
    
    try {
      const servicesPayload = selectedServices.map(s => ({
        serviceId: s._id,
        serviceName: s.name,
        price: s.price,
        duration: s.duration,
      }));

      const payload = {
        organizationId: state.organizationId || undefined,
        parlourId: state.parlourId,
        customerId: state.customerId || undefined,
        customerName,
        customerPhone,
        services: servicesPayload,
        serviceType: state.serviceType,
        serviceAddress: state.serviceType === 'at-home' ? (state.serviceAddress || undefined) : undefined,
        appointmentDate: selectedDate.toISOString(),
        appointmentTime: selectedTime,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cash',
        totalAmount: totalPrice,
        totalDuration: totalDuration,
        additionalCost: state.additionalCost || undefined,
        additionalCostReason: state.additionalCostReason || undefined,
        notes: state.notes || undefined,
      };

      const bookingRes = await createBooking({ token: null, data: payload });
      const booking = bookingRes?.data ?? bookingRes;
      try { localStorage.setItem('latestBooking', JSON.stringify(booking)); } catch (_) {}

      // Show booking confirmation and notify parent
      setConfirmedBooking(booking);
      onConfirmationShown?.(true);
      
    } catch (error) {
      // Errors are already toasted inside the CRUD hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    onConfirmationShown?.(false);
    dispatch({ type: 'RESET_BOOKING' });
    try { localStorage.removeItem('latestBooking'); } catch (_) {}
  };

  // Show booking confirmation if booking is confirmed
  if (confirmedBooking) {
    return <BookingConfirmation booking={confirmedBooking} parlourName={state.parlourName} onNewBooking={handleNewBooking} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Confirm Your Booking
        </h2>
        <p className="text-muted-foreground">
          Review your appointment details. Payment will be collected at the parlour or a representative will contact you.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Booking Summary */}
        <div className="bg-gradient-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Booking Summary</h3>
          
          {/* Services */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Scissors className="h-4 w-4" />
              Services
            </div>
            {selectedServices.map((service) => (
              <div key={service._id} className="flex justify-between items-center py-2">
                <div>
                  <span className="font-medium text-foreground">{service.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">({service.duration} mins)</span>
                </div>
                <span className="font-medium text-primary">৳{service.price}</span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Date & Time */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-foreground">
                {selectedDate?.toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-foreground">{selectedTime} ({totalDuration} minutes total)</span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Customer Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span className="text-foreground">{customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-foreground">{customerPhone}</span>
            </div>
            {state.serviceType === 'at-home' && state.serviceAddress && (
              <div className="flex items-center gap-2 text-sm">
                <Home className="h-4 w-4 text-primary" />
                <span className="text-foreground">{state.serviceAddress}</span>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Total */}
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-foreground">Total</span>
            <span className="text-primary">৳{totalPrice}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-gradient-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Confirm Booking</h3>
          {state.serviceType === 'at-home' && (
            <div className="mb-4">
              <Label className="text-sm">Service Address</Label>
              <FormInput
                placeholder="House, Road, Area, City"
                value={state.serviceAddress || ''}
                onChange={(val) => dispatch({ type: 'SET_CUSTOMER_INFO', payload: { name: customerName, phone: customerPhone, address: val } })}
              />
              <p className="text-xs text-muted-foreground mt-1">Required for at-home bookings.</p>
            </div>
          )}
          
          <div className="grid gap-4">
            <Button
              size="lg"
              disabled={isSubmitting || isCreating || (state.serviceType === 'at-home' && !state.serviceAddress)}
              onClick={handleBooking}
              className="h-14 w-full justify-center text-center p-4 bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
            >
              {isSubmitting || isCreating ? 'Confirming...' : 'Confirm Booking'}
            </Button>
            <div className="text-xs text-muted-foreground text-center">Payment will be collected at the parlour. A representative may contact you for details.</div>
          </div>
        </div>
      </div>
    </div>
  );
};