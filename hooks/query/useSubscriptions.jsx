import { subscriptionApi } from '@/api/platform/subscription-api';
import { createCrudHooks } from './crud-hooks-factory';

// Unified CRUD hooks for transactions
const { KEYS: SUBSCRIPTIONS_KEYS, useList, useDetail, useActions } = createCrudHooks({
  api: subscriptionApi,
  entityKey: 'subscriptions',
  singular: 'Subscription',
  plural: 'Subscriptions',
});

export { SUBSCRIPTIONS_KEYS };

// Standardized exports matching organization pattern
export function useSubscriptions(token, params = {}, options = {}) {
  const { items, pagination, isLoading, error, refetch } = useList(token, params, options);
  return { subscriptions: items, pagination, isLoading, error, refetch };
}

export function useSubscriptionDetail(id) {
  const { item, isLoading, error, refetch } = useDetail(id);
  return { subscription: item, isLoading, error, refetch };
}

export function useSubscriptionActions() {
  const actions = useActions();
  return {
    createSubscription: actions.create,
    updateSubscription: actions.update,
    deleteSubscription: actions.remove,
    isCreating: actions.isCreating,
    isUpdating: actions.isUpdating,
    isDeleting: actions.isDeleting,
  };
}



