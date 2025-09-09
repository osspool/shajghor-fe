"use client"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookingStepper } from "./BookingStepper";
import { ServiceSelectionStep } from "./steps/ServiceSelectionStep";
import { DateTimeSelectionStep } from "./steps/DateTimeSelectionStep";
import { CustomerInfoStep } from "./steps/CustomerInfoStep";
import { PaymentConfirmationStep } from "./steps/PaymentConfirmationStep";
import { useBookingContext } from "@/contexts/BookingContext";
import { useBookingNavigation } from "../hooks/useBookingNavigation";
import { useBookingPersistence } from "../hooks/useBookingPersistence";
import { useEffect, useRef, useState } from "react";

export const BookingWizard = ({ session, organizationId, providerType = "salon", serviceLocationMode = "in-salon", parlourId, workingHours = {}, slotDurationMinutes = 30 }) => {
  const { state, dispatch } = useBookingContext();
  const isAuthenticated = !!session?.user;
  const user = session?.user;
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const { 
    steps, 
    totalSteps, 
    currentStep, 
    canProceedFromStep, 
    nextStep, 
    prevStep, 
    getCurrentStepInfo,
    goToStep 
  } = useBookingNavigation();
  const containerRef = useRef(null);
  
  // Initialize persistence
  useBookingPersistence();

  // Update auth state when user changes
  useEffect(() => {
    dispatch({
      type: 'SET_AUTH',
      payload: {
        isAuthenticated,
        userProfile: user ? {
          name: user.name,
          phone: user.phone,
          email: user.email,
        } : undefined,
      }
    });
  }, [user, isAuthenticated, dispatch]);

  const handleServiceToggle = (service) => {
    dispatch({ type: 'TOGGLE_SERVICE', payload: service });
  };

  const handleDateSelect = (date) => {
    dispatch({ type: 'SET_DATE', payload: date });
  };

  const handleTimeSelect = (time) => {
    dispatch({ type: 'SET_TIME', payload: time });
  };

  const handleCustomerInfoChange = (name, phone, address) => {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: { name, phone, address } });
  };

  // If service location mode restricts options, enforce in context
  useEffect(() => {
    if (serviceLocationMode === 'in-salon') {
      dispatch({ type: 'SET_SERVICE_TYPE', payload: 'in-salon' });
    } else if (serviceLocationMode === 'at-home') {
      dispatch({ type: 'SET_SERVICE_TYPE', payload: 'at-home' });
    }
  }, [serviceLocationMode, dispatch]);

  const supportedModes = serviceLocationMode === 'both' ? ['in-salon', 'at-home'] : [serviceLocationMode];

  // Smoothly bring the wizard container into view and focus on step change
  useEffect(() => {
    if (!isConfirmationShown && containerRef.current) {
      try {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (_) {}
      try {
        containerRef.current.focus({ preventScroll: true });
      } catch (_) {}
    }
  }, [currentStep, isConfirmationShown]);

  const renderStep = () => {
    const stepNumber = isAuthenticated && currentStep === 3 ? 4 : currentStep;
    
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelectionStep
            selectedServices={state.selectedServices}
            onServiceToggle={handleServiceToggle}
            supportedModes={supportedModes}
            parlourId={parlourId}
          />
        );
      case 2:
        return (
          <DateTimeSelectionStep
            selectedDate={state.selectedDate}
            selectedTime={state.selectedTime}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            parlourId={parlourId}
            workingHours={workingHours}
            slotDurationMinutes={slotDurationMinutes}
            serviceType={state.serviceType}
          />
        );
      case 3:
        // For authenticated users, step 3 is payment
        if (isAuthenticated) {
          return (
            <PaymentConfirmationStep
              selectedServices={state.selectedServices}
              selectedDate={state.selectedDate}
              selectedTime={state.selectedTime}
              customerName={state.customerName}
              customerPhone={state.customerPhone}
              onConfirmationShown={setIsConfirmationShown}
            />
          );
        }
        // For non-authenticated users, step 3 is customer info
        return (
          <CustomerInfoStep
            customerName={state.customerName}
            customerPhone={state.customerPhone}
            onInfoChange={handleCustomerInfoChange}
          />
        );
      case 4:
        return (
          <PaymentConfirmationStep
            selectedServices={state.selectedServices}
            selectedDate={state.selectedDate}
            selectedTime={state.selectedTime}
            customerName={state.customerName}
            customerPhone={state.customerPhone}
            onConfirmationShown={setIsConfirmationShown}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        tabIndex={-1}
        aria-live="polite"
        className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-8 pb-24 md:pb-8 shadow-card focus:outline-none"
      >
        <BookingStepper 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          steps={steps}
          isFinished={isConfirmationShown}
          onStepClick={(step) => {
            if (step < currentStep) {
              goToStep(step);
            }
          }}
        />
        
        <div className="min-h-[520px] md:min-h-[560px]">
          {renderStep()}
        </div>
        
        {/* In-card Navigation (desktop and up) - Hide when showing booking confirmation */}
        {!isConfirmationShown && (
          <div className="hidden md:flex justify-between items-center mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            
            {currentStep < totalSteps && (
              <Button
                onClick={nextStep}
                disabled={!canProceedFromStep(currentStep)}
                className="flex items-center gap-2"
              >
                {(!isAuthenticated && currentStep === 3) ? 'Confirm booking' : 'Continue'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Sticky Mobile Action Bar */}
      {!isConfirmationShown && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-4xl mx-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="h-12"
                aria-label="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              {currentStep < totalSteps && (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedFromStep(currentStep)}
                  className="h-12"
                  aria-label="Continue to next step"
                >
                  {(!isAuthenticated && currentStep === 3) ? 'Confirm booking' : 'Continue'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};