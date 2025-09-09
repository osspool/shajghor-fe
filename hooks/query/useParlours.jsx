// hooks/query/useParlours.js
"use client";

import { parlourApi } from "@/api/platform/parlour-api";
import { useQuery } from "@tanstack/react-query";
import { createCrudHooks } from "./crud-hooks-factory";

// Unified CRUD hooks for parlours + custom slug detail key
const { KEYS: BASE_PARLOUR_KEYS, useList, useDetail, useActions } = createCrudHooks({
  api: parlourApi,
  entityKey: 'parlours',
  singular: 'Parlour',
  plural: 'Parlours',
  defaults: { public: true },
});

export const PARLOUR_KEYS = {
  ...BASE_PARLOUR_KEYS,
  detailBySlug: (slug) => ['parlours', 'slug', slug],
  byOwner: (ownerId) => ['parlours', 'owner', ownerId],
};

// List
export function useParlours(token, params = {}, options = {}) {
  const { items, pagination, isLoading, error, refetch } = useList(token, params, options);
  return { parlours: items, pagination, isLoading, error, refetch };
}

// Actions
export function useParlourActions() {
  const actions = useActions();
  return {
    createParlour: actions.create,
    updateParlour: actions.update,
    deleteParlour: actions.remove,
    isCreating: actions.isCreating,
    isUpdating: actions.isUpdating,
    isDeleting: actions.isDeleting,
  };
}

// Detail by ID
export function useParlourDetail(id) {
  const { item, isLoading, error, refetch } = useDetail(id);
  return { parlour: item, isLoading, error, refetch };
}

// Detail by Slug (custom endpoint)
export function useParlourDetailBySlug(slug) {
  const { data, isLoading, error } = useQuery({
    queryKey: PARLOUR_KEYS.detailBySlug(slug),
    queryFn: () => parlourApi.getBySlug({ slug }),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  return { parlour: data?.data ?? data, isLoading, error };
}

// List by Owner (Tenant)
export function useParlourByTenant(ownerId, token, options = {}) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: PARLOUR_KEYS.byOwner(ownerId),
    queryFn: () => parlourApi.getByOwnerId({ ownerId, token }),
    enabled: !!ownerId && (options.enabled ?? true),
    staleTime: options.staleTime ?? 5 * 60 * 1000,
  });

  const raw = data?.data ?? data;
  

  return { parlour: raw, data: raw, isLoading, error, refetch };
}

