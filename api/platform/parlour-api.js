// @/api/platform/parlour-api.js
import { BaseApi } from "../api-factory";
import { handleApiRequest } from "../api-handler";

/**
 * Parlour API with specialized methods for parlour management
 */
class ParlourApi extends BaseApi {
  constructor(config = {}) {
    super('parlours', config);
  }


  async getByOwnerId({ ownerId, token = null, options = {} } = {}) {
    if (!ownerId) throw new Error('Owner ID is required');
    const requestOptions = {
      cache: this.config.cache,
      ...options,
    };
    if (token) requestOptions.token = token;
    return handleApiRequest("GET", `${this.baseUrl}/owner/${ownerId}`, requestOptions);
  }

  async getBySlug({ slug, token = null, options = {} } = {}) {
    if (!slug) throw new Error('Slug is required');
    const requestOptions = {
      cache: this.config.cache,
      ...options,
    };
    if (token) requestOptions.token = token;
    return handleApiRequest("GET", `${this.baseUrl}/slug/${slug}`, requestOptions);
  }
}

// Create and export a singleton instance of the CategoriesApi
export const parlourApi = new ParlourApi();