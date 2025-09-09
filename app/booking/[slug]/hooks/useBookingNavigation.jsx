import { useBookingContext } from '@/contexts/BookingContext';

export function useBookingNavigation() {
  const { state, dispatch } = useBookingContext();

  // Define steps based on authentication status
  const getSteps = () => {
    const baseSteps = ["Services", "Date & Time"]; 
    const customerStep = "Your Info";
    const paymentStep = "Payment";

    if (state.isAuthenticated) {
      return [...baseSteps, paymentStep];
    }
    return [...baseSteps, customerStep, paymentStep];
  };

  const steps = getSteps();
  const totalSteps = steps.length;

  // Check if user can proceed from current step
  const canProceedFromStep = (step) => {
    switch (step) {
      case 1: // Services
        return state.selectedServices.length > 0;
      
      case 2: // Date & Time
        // Date and time are required for both; at-home skips capacity slots UI but still needs a time input
        return state.selectedDate !== undefined && state.selectedTime !== null;
      
      case 3: // Customer Info (only if not authenticated)
        if (state.isAuthenticated) {
          // This is payment step for authenticated users
          return true;
        }
        // For at-home, capture address too
        const hasContact = state.customerName.trim() !== "" && state.customerPhone.trim() !== "";
        if (state.serviceType === 'at-home') {
          return hasContact && state.serviceAddress.trim() !== "";
        }
        return hasContact;
      
      case 4: // Payment (only for non-authenticated users)
        return true;
      
      default:
        return false;
    }
  };

  // Navigate to next step
  const nextStep = () => {
    if (state.currentStep < totalSteps && canProceedFromStep(state.currentStep)) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  // Jump to specific step
  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  // Get current step info
  const getCurrentStepInfo = () => {
    const adjustedStep = state.isAuthenticated && state.currentStep === 3 ? 4 : state.currentStep;
    return {
      stepNumber: state.currentStep,
      stepName: steps[state.currentStep - 1],
      isFirst: state.currentStep === 1,
      isLast: state.currentStep === totalSteps,
      canProceed: canProceedFromStep(state.currentStep),
      progress: (state.currentStep / totalSteps) * 100,
    };
  };

  return {
    steps,
    totalSteps,
    currentStep: state.currentStep,
    canProceedFromStep,
    nextStep,
    prevStep,
    goToStep,
    getCurrentStepInfo,
  };
}