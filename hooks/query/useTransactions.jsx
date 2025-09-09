import { transactionApi } from '@/api/platform/transaction-api';
import { createCrudHooks } from './crud-hooks-factory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BOOKINGS_KEYS } from './useBookings';
import { toast } from 'sonner';

// Unified CRUD hooks for transactions
const { KEYS: TRANSACTIONS_KEYS, useList, useDetail, useActions } = createCrudHooks({
  api: transactionApi,
  entityKey: 'transactions',
  singular: 'Transaction',
  plural: 'Transactions',
});

export { TRANSACTIONS_KEYS };

// Standardized exports matching organization pattern
export function useTransactions(token, params = {}, options = {}) {
  const { items, pagination, isLoading, error, refetch } = useList(token, params, options);
  return { transactions: items, pagination, isLoading, error, refetch };
}

export function useTransactionDetail(id) {
  const { item, isLoading, error, refetch } = useDetail(id);
  return { transaction: item, isLoading, error, refetch };
}

export function useTransactionActions() {
  const actions = useActions();
  return {
    createTransaction: actions.create,
    updateTransaction: actions.update,
    deleteTransaction: actions.remove,
    isCreating: actions.isCreating,
    isUpdating: actions.isUpdating,
    isDeleting: actions.isDeleting,
  };
}


export function useBookingPayment() {
  const queryClient = useQueryClient();

  const buildPayloadFromBooking = (booking = {}, overrides = {}) => {
    return {
      parlourId: booking.parlourId?._id || booking.parlourId,
      organizationId: booking.organizationId?._id || booking.organizationId,
      bookingId: booking._id,
      customerId: booking.customerId?._id || booking.customerId,
      amount: overrides.amount ?? booking.totalAmount ?? 0,
      method: overrides.method ?? booking.paymentMethod ?? 'cash',
      paymentDetails: overrides.paymentDetails ?? undefined,
      reference: overrides.reference ?? undefined,
      notes: overrides.notes ?? undefined,
      date: overrides.date ?? new Date(),
      category: overrides.category ?? 'booking',
    };
  };

  const { mutate, isLoading, error } = useMutation({
    mutationFn: async ({ action = 'receive', booking, overrides = {}, token }) => {
      const payload = buildPayloadFromBooking(booking, overrides);
      if (action === 'refund') {
        return transactionApi.refundPayment(payload, token);
      }
      return transactionApi.receivePayment(payload, token);
    },
    onSuccess: () => {
      toast.success('Payment updated');
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEYS.all });
    },
    onError: (error) => {
      toast.error(error.message || 'Payment action failed');
    },
  });

  return { bookingPayment: mutate, isProcessing: isLoading, error, buildPayloadFromBooking };
}

