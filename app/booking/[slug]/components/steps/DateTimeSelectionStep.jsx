import { BookingCalendar } from "./BookingCalendar";
import { useBookingContext } from "@/contexts/BookingContext";



export const DateTimeSelectionStep = ({ 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect,
  parlourId,
  workingHours = {},
  slotDurationMinutes = 30,
  serviceType = 'in-salon',
}) => {
  const { state } = useBookingContext();
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Pick Your Date & Time
        </h2>
        <p className="text-muted-foreground">
          {state.serviceType === 'at-home' 
            ? "Choose a convenient date during working hours. Exact time will be confirmed by the parlour."
            : "Choose when you'd like your appointment"}
        </p>
      </div>
      
      <BookingCalendar
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateSelect={onDateSelect}
        onTimeSelect={onTimeSelect}
        parlourId={parlourId}
        workingHours={workingHours}
        slotDurationMinutes={slotDurationMinutes}
        serviceType={serviceType}
      />
      
      {selectedDate && selectedTime && (
        <div className="bg-gradient-card border border-border rounded-2xl p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Your appointment</div>
            <div className="font-semibold text-foreground">
              {selectedDate.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at {selectedTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};