// @/api/platform/category-api.js
import { BaseApi } from "../api-factory";
import { handleApiRequest } from "../api-handler";

/**
 * Booking API with specialized methods for booking management
 */
class BookingApi extends BaseApi {
  constructor(config = {}) {
    super('bookings', config);
  }
  
    // _id, yyyy-mm-dd (public endpoint)
    async getAvailability({ parlourId, date, options = {} }) {
      if (!parlourId || !date) throw new Error('Parlour ID and date are required');
      const requestOptions = {
        cache: this.config.cache,
        ...options,
      };
      return handleApiRequest("GET", `${this.baseUrl}/availability?parlourId=${parlourId}&date=${date}`, requestOptions);
    }
  
    // Utility: generate shareable booking URL (client-safe)
    generateBookingUrl(bookingId) {
      if (typeof window === 'undefined') return `/booking/${bookingId}`;
      const baseUrl = window.location.origin;
      return `${baseUrl}/booking/${bookingId}`;
    }
  
}

// Create and export a singleton instance of the CategoriesApi
export const bookingApi = new BookingApi();