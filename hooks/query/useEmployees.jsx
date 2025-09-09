import { employeeApi } from '@/api/platform/employee-api';
import { createCrudHooks } from './crud-hooks-factory';

// Unified CRUD hooks for services
const { KEYS: EMPLOYEES_KEYS, useList, useDetail, useActions } = createCrudHooks({
  api: employeeApi,
  entityKey: 'employees',
  singular: 'Employee',
  plural: 'Employees',
});

export { EMPLOYEES_KEYS };

// Standardized exports matching organization pattern
export function useEmployees(token, params = {}, options = {}) {
  const { items, pagination, isLoading, error, refetch } = useList(token, params, options);
  return { employees: items, pagination, isLoading, error, refetch };
}

export function useEmployeeDetail(id) {
  const { item, isLoading, error, refetch } = useDetail(id);
  return { employee: item, isLoading, error, refetch };
}

export function useEmployeeActions() {
  const actions = useActions();
  return {
    createEmployee: actions.create,
    updateEmployee: actions.update,
    deleteEmployee: actions.remove,
    isCreating: actions.isCreating,
    isUpdating: actions.isUpdating,
    isDeleting: actions.isDeleting,
  };
}