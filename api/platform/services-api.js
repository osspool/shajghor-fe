// @/api/platform/category-api.js
import { BaseApi } from "../api-factory";
import { handleApiRequest } from "../api-handler";

/**
 * Services API with specialized methods for service management
 */
class ServicesApi extends BaseApi {
  constructor(config = {}) {
    super('services', config);
  }
  
  
}

// Create and export a singleton instance of the CategoriesApi
export const servicesApi = new ServicesApi();