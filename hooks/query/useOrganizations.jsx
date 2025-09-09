"use client";

import { organizationApi } from "@/api/platform/organization-api";
import { createCrudHooks } from "./crud-hooks-factory";

// Unified CRUD hooks for organizations
const { KEYS: ORGANIZATION_KEYS, useList, useDetail, useActions } = createCrudHooks({
  api: organizationApi,
  entityKey: "organizations",
  singular: "Organization",
  plural: "Organizations",
});

export { ORGANIZATION_KEYS };

export function useOrganizations(token, params = {}, options = {}) {
  const { items, pagination, isLoading, error, refetch } = useList(token, params, options);
  return { organizations: items, pagination, isLoading, error, refetch };
}

export function useOrganizationActions() {
  const actions = useActions();
  return {
    createOrganization: actions.create,
    updateOrganization: actions.update,
    deleteOrganization: actions.remove,
    isCreating: actions.isCreating,
    isUpdating: actions.isUpdating,
    isDeleting: actions.isDeleting,
  };
}

export function useOrganizationDetail(id) {
  const { item, isLoading, error, refetch } = useDetail(id);
  return { organization: item, isLoading, error, refetch };
}


