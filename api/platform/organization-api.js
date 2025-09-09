// @/api/platform/category-api.js
import { BaseApi } from "../api-factory";
import { handleApiRequest } from "../api-handler";

/**
 * Organization API with specialized methods for organization management
 */
class OrganizationApi extends BaseApi {
  constructor(config = {}) {
    super('organizations', config);
  }
  
  
}

// Create and export a singleton instance of the CategoriesApi
export const organizationApi = new OrganizationApi();