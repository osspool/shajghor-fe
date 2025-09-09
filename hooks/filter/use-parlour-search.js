"use client";

import { useBaseSearch } from "./use-base-search";

export function useParlourSearch() {
  const config = {
    basePath: "/super/parlours",
    searchFields: {
      name: "name[contains]",
      slug: "slug",
      email: "email",
      phone: "phone",
    },
    filterFields: {
      providerType: { paramName: "providerType", type: "string", defaultValue: "" },
      isActive: { paramName: "isActive", type: "string", defaultValue: "" },
    },
    defaultSearchType: "name",
  };

  return useBaseSearch(config);
}


