import { useEffect } from 'react';
import { useBookingContext } from '@/contexts/BookingContext';
import { storage } from '@/lib/storage-utils';

const STORAGE_KEY_PREFIX = 'booking_progress_';

export function useBookingPersistence() {
  const { state, dispatch } = useBookingContext();

  // Generate storage key based on parlour name
  const getStorageKey = (parlourName) => {
    return `${STORAGE_KEY_PREFIX}${parlourName.toLowerCase().replace(/\s+/g, '_')}`;
  };

  // Save booking state to localStorage
  const saveBookingState = () => {
    const storageKey = getStorageKey(state.parlourName);
    const stateToSave = {
      currentStep: state.currentStep,
      selectedServices: state.selectedServices,
      selectedDate: state.selectedDate?.toISOString(),
      selectedTime: state.selectedTime,
      serviceType: state.serviceType,
      // Only persist meaningful values to avoid overwriting prefilled user data with empties
      serviceAddress: state.serviceAddress?.trim() ? state.serviceAddress : undefined,
      customerName: state.customerName?.trim() ? state.customerName : undefined,
      customerPhone: state.customerPhone?.trim() ? state.customerPhone : undefined,
    };

    storage.set(storageKey, stateToSave);
  };

  // Load booking state from localStorage
  const loadBookingState = () => {
    const storageKey = getStorageKey(state.parlourName);

    const parsedState = storage.get(storageKey);
    if (parsedState) {
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          ...parsedState,
          selectedDate: parsedState.selectedDate ? new Date(parsedState.selectedDate) : undefined,
          // Do not override existing state with empty strings
          customerName: parsedState.customerName?.trim() ? parsedState.customerName : undefined,
          customerPhone: parsedState.customerPhone?.trim() ? parsedState.customerPhone : undefined,
          serviceAddress: parsedState.serviceAddress?.trim() ? parsedState.serviceAddress : undefined,
        }
      });
    }
  };

  // Clear booking state from localStorage
  const clearBookingState = () => {
    const storageKey = getStorageKey(state.parlourName);
    storage.remove(storageKey);
  };

  // Load state on mount
  useEffect(() => {
    loadBookingState();
  }, [state.parlourName]);

  // Save state whenever booking data changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Only save if there's meaningful progress
      if (state.selectedServices.length > 0 || state.selectedDate || state.customerName) {
        saveBookingState();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    state.currentStep,
    state.selectedServices,
    state.selectedDate,
    state.selectedTime,
    state.serviceType,
    state.customerName,
    state.customerPhone,
  ]);

  return {
    saveBookingState,
    loadBookingState,
    clearBookingState,
  };
}