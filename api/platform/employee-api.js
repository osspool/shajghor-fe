// @/api/platform/inventory-api.js
import { BaseApi } from "../api-factory";
import { handleApiRequest } from "../api-handler";

/**
 * Employee API with specialized methods for employee management
 */
class EmployeeApi extends BaseApi {
  constructor(config = {}) {
    super('employees', config);
  }
  
}

// Create and export a singleton instance of the CategoriesApi
export const employeeApi = new EmployeeApi();