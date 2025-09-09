"use client";

import { useBaseSearch } from "./use-base-search";

export function useOrganizationSearch() {
  const config = {
    basePath: "/super/organization",
    searchFields: {
      name: "name[contains]",
      email: "email",
      phone: "phone",
    },
    filterFields: {},
    defaultSearchType: "name",
  };

  return useBaseSearch(config);
}


