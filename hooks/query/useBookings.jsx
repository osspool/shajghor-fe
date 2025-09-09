import { bookingApi } from '@/api/platform/booking-api';
import { useQuery } from '@tanstack/react-query';
import { createCrudHooks } from './crud-hooks-factory';

// Unified CRUD hooks for bookings
const { KEYS: BOOKINGS_KEYS, useList, useDetail, useActions } = createCrudHooks({
  api: bookingApi,
  entityKey: 'bookings',
  singular: 'Booking',
  plural: 'Bookings',
});

export { BOOKINGS_KEYS };

// List
export function useBookings(token, params = {}, options = {}) {
  const { items, pagination, isLoading, error, refetch } = useList(token, params, options);
  return { bookings: items, pagination, isLoading, error, refetch };
}

// Detail
export function useBookingDetail(id) {
  const { item, isLoading, error, refetch } = useDetail(id);
  return { booking: item, isLoading, error, refetch };
}

// Actions
export function useBookingActions() {
  const actions = useActions();
  return {
    createBooking: actions.create,
    updateBooking: actions.update,
    deleteBooking: actions.remove,
    isCreating: actions.isCreating,
    isUpdating: actions.isUpdating,
    isDeleting: actions.isDeleting,
  };
}

// Availability (public endpoint)
export function useAvailability(parlourId, date) {
  return useQuery({
    queryKey: ['bookings','availability', parlourId, date],
    queryFn: () => bookingApi.getAvailability({ parlourId, date }),
    enabled: !!parlourId && !!date,
    staleTime: 5 * 60 * 1000,
  });
}