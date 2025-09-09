"use client"
import { createContext, useContext, useEffect, useReducer } from 'react';

// export interface BookingState {
//   currentStep: number;
//   selectedServices: Service[];
//   selectedDate: Date | undefined;
//   selectedTime: string | null;
//   customerName: string;
//   customerPhone: string;
//   parlourName: string;
//   isAuthenticated: boolean;
//   userProfile?: {
//     name: string;
//     phone: string;
//     email: string;
//   };
// }

// type BookingAction = 
//   | { type: 'SET_STEP'; payload: number }
//   | { type: 'SET_SERVICES'; payload: Service[] }
//   | { type: 'TOGGLE_SERVICE'; payload: Service }
//   | { type: 'SET_DATE'; payload: Date | undefined }
//   | { type: 'SET_TIME'; payload: string | null }
//   | { type: 'SET_CUSTOMER_INFO'; payload: { name: string; phone: string } }
//   | { type: 'SET_PARLOUR'; payload: string }
//   | { type: 'SET_AUTH'; payload: { isAuthenticated: boolean; userProfile?: BookingState['userProfile'] } }
//   | { type: 'RESET_BOOKING' }
//   | { type: 'LOAD_STATE'; payload: Partial<BookingState> };

const initialState = {
  // Wizard navigation
  currentStep: 1,

  // Contextual IDs
  organizationId: '',
  parlourId: '',

  // Services selection
  selectedServices: [],
  totalAmount: 0,
  totalDuration: 0,

  // Schedule
  selectedDate: undefined, // Date object
  selectedTime: null, // "HH:mm" or similar

  // Service mode
  serviceType: 'in-salon', // 'in-salon' | 'at-home'
  serviceAddress: '',

  // Customer details
  customerId: '',
  customerName: '',
  customerPhone: '',

  // Payment & status (optional on create)
  status: 'pending',
  paymentStatus: 'pending',
  paymentMethod: 'cash',
  additionalCost: undefined,
  additionalCostReason: '',
  notes: '',

  // Display only
  parlourName: 'Sheba\'s Beauty Lounge',
  isAuthenticated: false,
};

function computeTotals(services) {
  const sumAmount = (services || []).reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const sumDuration = (services || []).reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  return { totalAmount: sumAmount, totalDuration: sumDuration };
}

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_SERVICES': {
      const totals = computeTotals(action.payload);
      return { ...state, selectedServices: action.payload, ...totals };
    }
    
    case 'TOGGLE_SERVICE': {
        const isSelected = state.selectedServices.some(s => s._id === action.payload._id);
        const nextServices = isSelected
          ? state.selectedServices.filter(s => s._id !== action.payload._id)
          : [...state.selectedServices, action.payload];
        const totals = computeTotals(nextServices);
        return { ...state, selectedServices: nextServices, ...totals };
      }
    
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    
    case 'SET_TIME':
      return { ...state, selectedTime: action.payload };
    
    case 'SET_SERVICE_TYPE':
      return {
        ...state,
        serviceType: action.payload,
        selectedTime: action.payload === 'at-home' ? null : state.selectedTime,
      };
    
    case 'SET_CUSTOMER_INFO':
      return { 
        ...state, 
        customerName: action.payload.name,
        customerPhone: action.payload.phone,
        serviceAddress: action.payload.address ?? state.serviceAddress,
      };

    case 'SET_PARLOUR_IDS':
      return { ...state, parlourId: action.payload.parlourId || state.parlourId, organizationId: action.payload.organizationId || state.organizationId };

    case 'SET_SERVICE_ADDRESS':
      return { ...state, serviceAddress: action.payload };

    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };

    case 'SET_NOTES':
      return { ...state, notes: action.payload };

    case 'SET_ADDITIONALS':
      return { ...state, additionalCost: action.payload.additionalCost, additionalCostReason: action.payload.additionalCostReason || state.additionalCostReason };
    
    case 'SET_PARLOUR':
      return { ...state, parlourName: action.payload };
    
    case 'SET_AUTH':
      return { 
        ...state, 
        isAuthenticated: action.payload.isAuthenticated,
        userProfile: action.payload.userProfile,
        // Auto-fill customer info if authenticated
        customerName: action.payload.userProfile?.name || state.customerName,
        customerPhone: action.payload.userProfile?.phone || state.customerPhone,
      };
    
    case 'RESET_BOOKING':
      return {
        ...initialState,
        parlourName: state.parlourName,
        isAuthenticated: state.isAuthenticated,
        userProfile: state.userProfile,
      };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}



const BookingContext = createContext(undefined);

export function BookingContextProvider({ children, session, initialBooking = {} }) {
  // Initialize state once from server-provided values
  const init = () => {
    const base = { ...initialState, ...initialBooking };
    // Ensure totals match selected services
    const totals = computeTotals(base.selectedServices);
    const isAuthenticated = !!session?.user;
    const userProfile = isAuthenticated
      ? {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          phone: session?.user?.phone || '',
        }
      : undefined;
    return {
      ...base,
      ...totals,
      isAuthenticated,
      userProfile,
      // Autofill customer from session on first load
      customerName: base.customerName || userProfile?.name || '',
      customerPhone: base.customerPhone || userProfile?.phone || '',
    };
  };

  const [state, dispatch] = useReducer(bookingReducer, undefined, init);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
}