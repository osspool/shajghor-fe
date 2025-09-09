// @/api/platform/transaction-api.js
import { BaseApi } from "../api-factory";

/**
 * Transaction API with specialized methods for transaction management
 */
class TransactionApi extends BaseApi {
  constructor(config = {}) {
    super('transactions', config);
  }

  async receivePayment(data, token) {
    const endpoint = `${this.baseUrl}/receive-payment`;
    return this.request('POST', endpoint, { data, token });
  }

  async refundPayment(data, token) {
    const endpoint = `${this.baseUrl}/refund`;
    return this.request('POST', endpoint, { data, token });
  }
  
  
}

// Create and export a singleton instance of the TransactionApi
export const transactionApi = new TransactionApi();