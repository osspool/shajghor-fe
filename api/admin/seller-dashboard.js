// @/api/admin/seller-dashboard.js
import { handleApiRequest } from "../api-handler";

/**
 * Get seller dashboard summary data
 * 
 * @param {Object} options
 * @param {string} options.token - Authentication token (required)
 * @param {number} [options.year] - Year to filter data by
 * @param {number} [options.month] - Month to filter data by (1-12)
 * @param {string|Date} [options.startDate] - Start date for custom date range
 * @param {string|Date} [options.endDate] - End date for custom date range
 * @param {boolean} [options.allTime] - Flag to return all-time data instead of current month
 * @returns {Promise<Object>} Dashboard data with wallet, orders, withdrawals, and transaction information
 */
export async function getSellerDashboard({ 
  token, 
  year, 
  month, 
  startDate, 
  endDate,
  allTime,
  options = {} 
} = {}) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  // Build query parameters
  const params = new URLSearchParams();
  if (year) params.append('year', year.toString());
  if (month) params.append('month', month.toString());
  
  if (startDate) {
    const formattedStartDate = startDate instanceof Date 
      ? startDate.toISOString() 
      : new Date(startDate).toISOString();
    params.append('startDate', formattedStartDate);
  }
  
  if (endDate) {
    const formattedEndDate = endDate instanceof Date 
      ? endDate.toISOString() 
      : new Date(endDate).toISOString();
    params.append('endDate', formattedEndDate);
  }

  if (allTime) params.append('allTime', 'true');
  
  const queryString = params.toString();
  const endpoint = `/seller/dashboard${queryString ? `?${queryString}` : ''}`;

  return handleApiRequest("GET", endpoint, {
    token,
    cache: 'no-store', // Always fetch fresh data for dashboard
    ...options
  });
}

/**
 * Dashboard data types for reference
 */
export const DashboardDataTypes = {
  PERIOD_TYPE: {
    MONTH: 'month',
    CUSTOM: 'custom',
    ALL_TIME: 'all-time'
  },
  TRANSACTION_TYPES: {
    ORDER_PAYMENT: 'order_payment',
    PLATFORM_FEE: 'platform_fee',
    REFERRAL_COMMISSION: 'referral_commission',
    WITHDRAWAL: 'withdrawal',
    REFUND: 'refund',
    ADJUSTMENT: 'adjustment',
    DEPOSIT: 'deposit'
  },
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },
  WITHDRAWAL_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled'
  }
};