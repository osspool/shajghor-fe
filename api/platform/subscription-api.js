// @/api/platform/subscription-api.js
import { BaseApi } from "../api-factory";

/**
 * Subscription API with specialized methods for subscription management
 */
class SubscriptionApi extends BaseApi {
  constructor(config = {}) {
    super('subscriptions', config);
  } 
}

// Create and export a singleton instance of the SubscriptionApi
export const subscriptionApi = new SubscriptionApi();