// @/lib/api-utils.js

export const formatPaginationResponse = (data) => {
    if (!data) return {
      totalDocs: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false,
      docs: [],
    };

    if (Array.isArray(data)) {
      return {
        docs: data,
        totalDocs: data.length,
        totalPages: 1,
        currentPage: 1,
        limit: data.length,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    return {
      docs: data.docs || [],
      totalDocs: data.totalDocs || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.page || 1,
      limit: data.limit || 10,
      hasNextPage: data.hasNextPage || false,
      hasPrevPage: data.hasPrevPage || false,
    };
  };