// @/api/fee-rules.js
"use server";
import { handleApiRequest } from "../api-handler";

/**
 * Get detailed fee rules
 * @param {Object} options - Request options
 * @param {string} options.token - Authentication token (optional)
 * @param {Object} options.cache - Cache strategy
 * @returns {Promise<Object>} The detailed fee rules data
 */
export async function getDetailedFeeRules({ token, cache = "force-cache" } = {}) {
  return handleApiRequest("GET", "/fee-rules/detailed", {
    token,
    cache,
  });
}