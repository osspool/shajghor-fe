// @/api/api-factory.js
import { handleApiRequest } from "./api-handler";

/**
 * Base API class that provides standardized CRUD operations
 * Supports direct field queries and bracket syntax: field[operator]=value
 */
export class BaseApi {
  constructor(entity, config = {}) {
    this.entity = entity;
    this.config = {
      basePath: '',
      defaultParams: {
        limit: 10,
        page: 1,
        ...(config.defaultParams || {})
      },
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      },
      ...config,
    };
    
    this.baseUrl = `${this.config.basePath}/${this.entity}`;
  }
  
  /**
   * Creates query string from parameters
   * Supports: ?field=value and ?field[operator]=value
   */
  createQueryString(params = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      
      // Handle arrays - use [in] for multiple values, direct for single
      if (Array.isArray(value)) {
        if (value.length > 1) {
          searchParams.append(`${key}[in]`, value.join(','));
        } else if (value.length === 1) {
          searchParams.append(key, value[0]);
        }
      }
      // Handle primitive values directly
      else {
        searchParams.append(key, value.toString());
      }
    });
    
    return searchParams.toString();
  }
  
  /**
   * Prepares parameters for API request
   * Handles pagination, sorting, and filters
   */
  prepareParams(params = {}) {
    const result = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        // Handle pagination
        if (['page', 'limit'].includes(key)) {
          result[key] = parseInt(value) || (key === 'page' ? 1 : 10);
        }
        // Handle arrays with bracket syntax
        else if (Array.isArray(value)) {
          if (value.length > 1) {
            result[`${key}[in]`] = value.join(',');
          } else if (value.length === 1) {
            result[key] = value[0];
          }
        }
        // Pass through all other parameters as-is
        else {
          result[key] = value;
        }
      }
    });

    return result;
  }

  /**
   * Get all records with pagination and filtering
   */
  async getAll({ token = null, params = {}, options = {} } = {}) {
    const processedParams = this.prepareParams(params);
    const queryString = this.createQueryString(processedParams);
    
    const requestOptions = {
      cache: this.config.cache,
      limit: 30,
      ...options
    };
  
    if (token) {
      requestOptions.token = token;
    }
  
    return handleApiRequest("GET", `${this.baseUrl}?${queryString}`, requestOptions);
  }

  /**
   * Get a single record by ID
   */
  async getById({ token = null, id, options = {} } = {}) {
    if (!id) {
      throw new Error("ID is required");
    }
  
    const requestOptions = {
      cache: this.config.cache,
      ...options
    };
  
    if (token) {
      requestOptions.token = token;
    }
  
    return handleApiRequest("GET", `${this.baseUrl}/${id}`, requestOptions);
  }

  /**
   * Create a new record
   */
  async create({ token, data, options = {} } = {}) {
    return handleApiRequest("POST", this.baseUrl, {
      token,
      body: data,
      ...options
    });
  }

  /**
   * Update an existing record
   */
  async update({ token, id, data, options = {} } = {}) {
    return handleApiRequest("PATCH", `${this.baseUrl}/${id}`, {
      token,
      body: data,
      ...options
    });
  }

  /**
   * Delete a record
   */
  async delete({ token, id, options = {} } = {}) {
    return handleApiRequest("DELETE", `${this.baseUrl}/${id}`, {
      token,
      ...options
    });
  }

  /**
   * Search with custom parameters
   * Examples:
   * - search({ 'brand[contains]': 'nike' })
   * - search({ upc: '123456789' })
   */
  async search({ token = null, searchParams = {}, params = {}, options = {} } = {}) {
    const queryParams = {
      ...params,
      ...searchParams
    };
    
    const processedParams = this.prepareParams(queryParams);
    const queryString = this.createQueryString(processedParams);
    
    const requestOptions = {
      cache: this.config.cache,
      ...options
    };
  
    if (token) {
      requestOptions.token = token;
    }
  
    return handleApiRequest("GET", `${this.baseUrl}?${queryString}`, requestOptions);
  }

  /**
   * Find records by field with optional operator
   * Examples:
   * - findBy({ field: 'brand', value: 'nike', operator: 'contains' })
   */
  async findBy({ token = null, field, value, operator = null, params = {}, options = {} } = {}) {
    if (!field || value === undefined) {
      throw new Error("Field and value are required");
    }
    
    let queryParams = { ...params };
    
    if (operator) {
      queryParams[`${field}[${operator}]`] = Array.isArray(value) ? value.join(',') : value;
    } else {
      queryParams[field] = value;
    }
    
    const processedParams = this.prepareParams(queryParams);
    const queryString = this.createQueryString(processedParams);
    
    const requestOptions = {
      cache: this.config.cache,
      ...options
    };
  
    if (token) {
      requestOptions.token = token;
    }
  
    return handleApiRequest("GET", `${this.baseUrl}?${queryString}`, requestOptions);
  }
  
  /**
   * Make a custom API request
   */
  async request(method, endpoint, { token, data, params, options = {} } = {}) {
    let url = endpoint;
    
    if (params) {
      const processedParams = this.prepareParams(params);
      const queryString = this.createQueryString(processedParams);
      url = `${endpoint}?${queryString}`;
    }
    
    return handleApiRequest(method, url, {
      token,
      body: data,
      cache: this.config.cache,
      ...options
    });
  }
}

/**
 * Factory function to create a new BaseApi instance
 */
export const createCrudApi = (entity, config = {}) => {
  return new BaseApi(entity, config);
};