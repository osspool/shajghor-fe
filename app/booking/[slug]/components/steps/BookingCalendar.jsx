import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-utils/form-input";
import { Clock, Users } from "lucide-react";
import { useBookingContext } from "@/contexts/BookingContext";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { useAvailability } from "@/hooks/query/useBookings";



export const BookingCalendar = ({ 
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

  const dateParam = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;
  const { data: availabilityData, isLoading: isLoadingAvailability, error: availabilityError } = useAvailability(parlourId, dateParam);
  const timeSlots = Array.isArray(availabilityData?.data) ? availabilityData.data : [];
  const isLoadingSlots = !!selectedDate && isLoadingAvailability;
  
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    const dayName = format(date, 'EEEE').toLowerCase();
    const dayConfig = workingHours?.[dayName];
    if (!dayConfig || dayConfig.isOpen === false) return true;
    return false;
  };

  const generateAtHomeTimes = (date) => {
    if (!date) return [];
    const dayName = format(date, 'EEEE').toLowerCase();
    const dayConfig = workingHours?.[dayName];
    if (!dayConfig || !dayConfig.isOpen) return [];

    const toMinutes = (hhmm) => {
      const [h, m] = hhmm.split(":" ).map(Number);
      return h * 60 + m;
    };
    const start = toMinutes(dayConfig.startTime || '10:00');
    const end = toMinutes(dayConfig.endTime || '21:00');
    const step = Math.max(5, parseInt(slotDurationMinutes) || 30);

    const items = [];
    for (let t = start; t <= end; t += step) {
      const hh = String(Math.floor(t / 60)).padStart(2, '0');
      const mm = String(t % 60).padStart(2, '0');
      items.push({ time: `${hh}:${mm}`, isAvailable: true, availableCapacity: 1, totalCapacity: 1 });
    }
    return items;
  };

  const atHomeSlots = serviceType === 'at-home' ? generateAtHomeTimes(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-gradient-card p-6 rounded-2xl border border-border shadow-card">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Select Date</h2>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={isDateDisabled}
            className="rounded-xl border-0"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
              day: "h-10 w-10 p-0 font-normal hover:bg-primary/10 hover:text-primary transition-colors",
            }}
          />
        </div>
      </div>

      {/* Time Slots Section (hidden for at-home bookings) */}
      {selectedDate && serviceType !== 'at-home' && (
        <div className="bg-gradient-card p-6 rounded-2xl border border-border shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Available Times</h2>
          </div>
          
          {isLoadingSlots ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : availabilityError ? (
            <div className="text-center py-8 text-destructive">
              Failed to load availability. Please try another date.
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No available time slots for this date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.isAvailable}
                  onClick={() => onTimeSelect(slot.time)}
                  className={`
                    h-12 transition-all duration-300 text-sm font-medium relative
                    ${selectedTime === slot.time 
                      ? 'bg-gradient-primary shadow-soft' 
                      : !slot.isAvailable 
                        ? 'opacity-50 cursor-not-allowed bg-muted'
                        : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span>{slot.time}</span>
                    {slot.totalCapacity > 1 && slot.isAvailable && (
                      <div className="flex items-center gap-1 text-xs opacity-70">
                        <Users className="h-3 w-3" />
                        <span>{slot.availableCapacity}/{slot.totalCapacity}</span>
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-4 text-center">
            All times are in Bangladesh Standard Time (BST)
          </p>
        </div>
      )}
      {selectedDate && serviceType === 'at-home' && (
        <div className="bg-gradient-card p-6 rounded-2xl border border-border shadow-card">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              You chose at-home service. Pick a preferred time within working hours. Parlour will confirm.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {atHomeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  onClick={() => onTimeSelect(slot.time)}
                  className="h-10 text-xs"
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};