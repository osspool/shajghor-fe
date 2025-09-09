import { servicesApi } from '@/api/platform/services-api';
import { createCrudHooks } from './crud-hooks-factory';

// Unified CRUD hooks for services
const { KEYS: SERVICES_KEYS, useList, useDetail, useActions } = createCrudHooks({
  api: servicesApi,
  entityKey: 'services',
  singular: 'Service',
  plural: 'Services',
});

export { SERVICES_KEYS };

// Standardized exports matching organization pattern
export function useServices(token, params = {}, options = {}) {
  const { items, pagination, isLoading, error, refetch } = useList(token, params, options);
  return { services: items, pagination, isLoading, error, refetch };
}

export function useServiceDetail(id) {
  const { item, isLoading, error, refetch } = useDetail(id);
  return { service: item, isLoading, error, refetch };
}

export function useServiceActions() {
  const actions = useActions();
  return {
    createService: actions.create,
    updateService: actions.update,
    deleteService: actions.remove,
    isCreating: actions.isCreating,
    isUpdating: actions.isUpdating,
    isDeleting: actions.isDeleting,
  };
}