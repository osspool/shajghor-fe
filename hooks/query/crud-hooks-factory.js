// Generic CRUD hooks factory to standardize query and mutation patterns
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * createCrudHooks
 * @param {Object} config
 * @param {BaseApi} config.api - API instance implementing getAll/getById/create/update/delete
 * @param {string} config.entityKey - Base key for react-query, e.g., 'services'
 * @param {string} config.singular - Singular resource name for messages, e.g., 'Service'
 * @param {string} config.plural - Plural resource name for messages, e.g., 'Services'
 * @returns {{ KEYS: any, useList: Function, useDetail: Function, useActions: Function }}
 */
export function createCrudHooks({
  api,
  entityKey,
  singular,
  plural,
  defaults = {},
}) {
  const config = {
    // Query defaults
    staleTime: 5 * 60 * 1000,
    gcTime: undefined,
    refetchOnWindowFocus: false,
    enabledRule: (token, options) => {
      // Allow explicit public queries without token
      if (options.public) {
        return options.enabled !== undefined ? options.enabled : true;
      }
      return options.enabled !== undefined ? options.enabled && !!token : !!token;
    },
    suspense: false,
    placeholderData: (previousData) => previousData,
    getId: (item) => item?._id ?? item?.id,
    // Toast messages
    messages: {
      createSuccess: `${singular} created successfully`,
      createError: `Failed to create ${singular.toLowerCase()}`,
      updateSuccess: `${singular} updated successfully`,
      updateError: `Failed to update ${singular.toLowerCase()}`,
      deleteSuccess: `${singular} deleted successfully`,
      deleteError: `Failed to delete ${singular.toLowerCase()}`,
    },
    ...defaults,
    messages: { // deep merge messages
      createSuccess: `${singular} created successfully`,
      createError: `Failed to create ${singular.toLowerCase()}`,
      updateSuccess: `${singular} updated successfully`,
      updateError: `Failed to update ${singular.toLowerCase()}`,
      deleteSuccess: `${singular} deleted successfully`,
      deleteError: `Failed to delete ${singular.toLowerCase()}`,
      ...(defaults.messages || {}),
    },
  };

  const KEYS = {
    all: [entityKey],
    detail: (id) => [entityKey, id],
    params: (params) => [entityKey, "params", JSON.stringify(params)],
  };

  function useList(token, params = {}, options = {}) {
    const queryKey = KEYS.params(params);

    const { data, isLoading, error, refetch } = useQuery({
      queryKey,
      queryFn: () => api.getAll({ token, params }),
      staleTime: options.staleTime ?? config.staleTime,
      gcTime: options.gcTime ?? config.gcTime,
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? config.refetchOnWindowFocus,
      enabled: config.enabledRule(token, options),
      suspense: options.suspense ?? config.suspense,
      // Reduce jitter and re-renders
      keepPreviousData: true,
      placeholderData: options.placeholderData ?? config.placeholderData,
      select: options.select,
      ...options,
    });

    const items = data?.docs || data || [];
    const pagination = data?.totalDocs
      ? {
          totalDocs: data.totalDocs,
          totalPages: data.totalPages || 1,
          currentPage: data.page || 1,
          limit: data.limit || 10,
          hasNextPage: data.hasNextPage || false,
          hasPrevPage: data.hasPrevPage || false,
        }
      : null;

    return { items, pagination, isLoading, error, refetch };
  }

  function useDetail(id, options = {}) {
    const { data, isLoading, error, refetch } = useQuery({
      queryKey: KEYS.detail(id),
      queryFn: () => api.getById({ id }),
      enabled: !!id && (options.enabled ?? true),
      staleTime: options.staleTime ?? config.staleTime,
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? config.refetchOnWindowFocus,
      suspense: options.suspense ?? config.suspense,
      placeholderData: options.placeholderData ?? config.placeholderData,
      select: options.select,
    });

    return { item: data, isLoading, error, refetch };
  }

  function useActions() {
    const queryClient = useQueryClient();
    const getAllListQueries = () => queryClient.getQueriesData({ queryKey: [entityKey, "params"] });

    // Helpers to update list-shaped and array-shaped caches
    const updateListCache = (listData, updater) => {
      if (!listData) return listData;
      // Paginated
      if (typeof listData === 'object' && listData.docs) {
        const updatedDocs = updater(listData.docs);
        return { ...listData, docs: updatedDocs, totalDocs: Array.isArray(updatedDocs) ? updatedDocs.length : listData.totalDocs };
      }
      // Array
      if (Array.isArray(listData)) {
        return updater(listData);
      }
      return listData;
    };

    const createMutation = useMutation({
      mutationFn: ({ token, data }) => api.create({ token, data }),
      onMutate: async ({ data }) => {
        await queryClient.cancelQueries({ queryKey: KEYS.all, exact: false });
        const previous = getAllListQueries().map(([key, old]) => [key, old]);
        const optimisticItem = { ...data, _optimistic: true, [config.getId(data) ? 'id' : '_id']: config.getId(data) ?? `temp-${Date.now()}` };
        previous.forEach(([key, old]) => {
          queryClient.setQueryData(key, (current) => updateListCache(current, (arr) => [optimisticItem, ...(arr || [])]));
        });
        return { previous };
      },
      onSuccess: () => {
        toast.success(config.messages.createSuccess);
        queryClient.invalidateQueries({ queryKey: KEYS.all });
      },
      onError: (error, _vars, context) => {
        toast.error(error?.message || config.messages.createError);
        context?.previous?.forEach(([key, old]) => queryClient.setQueryData(key, old));
      },
    });

    const updateMutation = useMutation({
      mutationFn: ({ token, id, data }) => api.update({ token, id, data }),
      onMutate: async ({ id, data }) => {
        await queryClient.cancelQueries({ queryKey: KEYS.all, exact: false });
        const previous = getAllListQueries().map(([key, old]) => [key, old]);
        previous.forEach(([key, old]) => {
          queryClient.setQueryData(key, (current) => updateListCache(current, (arr) => (arr || []).map((it) => (config.getId(it) === id ? { ...it, ...data } : it))));
        });
        // update detail
        queryClient.setQueryData(KEYS.detail(id), (current) => (current ? { ...current, ...data } : current));
        return { previous };
      },
      onSuccess: (_, { id }) => {
        toast.success(config.messages.updateSuccess);
        if (id) queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
        queryClient.invalidateQueries({ queryKey: KEYS.all });
      },
      onError: (error, _vars, context) => {
        toast.error(error?.message || config.messages.updateError);
        context?.previous?.forEach(([key, old]) => queryClient.setQueryData(key, old));
      },
    });

    const deleteMutation = useMutation({
      mutationFn: ({ token, id }) => api.delete({ token, id }),
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({ queryKey: KEYS.all, exact: false });
        const previous = getAllListQueries().map(([key, old]) => [key, old]);
        previous.forEach(([key, old]) => {
          queryClient.setQueryData(key, (current) => updateListCache(current, (arr) => (arr || []).filter((it) => config.getId(it) !== id)));
        });
        // clear detail
        queryClient.removeQueries({ queryKey: KEYS.detail(id) });
        return { previous };
      },
      onSuccess: () => {
        toast.success(config.messages.deleteSuccess);
        queryClient.invalidateQueries({ queryKey: KEYS.all });
      },
      onError: (error, _vars, context) => {
        toast.error(error?.message || config.messages.deleteError);
        context?.previous?.forEach(([key, old]) => queryClient.setQueryData(key, old));
      },
    });

    return {
      create: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
      remove: deleteMutation.mutateAsync,
      isCreating: createMutation.isPending,
      isUpdating: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
    };
  }

  return { KEYS, useList, useDetail, useActions };
}


