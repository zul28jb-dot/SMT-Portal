/**
 * SMT Portal Configuration
 * Centralized configuration for API endpoints and environment
 */

const CONFIG = {
  /**
   * n8n API Base URL
   * Replace with your actual n8n webhook domain
   * Example: "https://n8n.yourcompany.com/webhook"
   */
  API_BASE_URL: "https://YOUR-N8N-DOMAIN/webhook",

  /**
   * Application Version
   */
  VERSION: "1.0.0",

  /**
   * Environment
   * Options: development, staging, production
   */
  ENV: "development",

  /**
   * API Endpoints
   * Relative to API_BASE_URL
   */
  ENDPOINTS: {
    DASHBOARD: "/dashboard",
    TRANSACTIONS: "/transactions",
    PROFILE: "/profile",
    AUTH: "/auth"
  },

  /**
   * Request timeout (milliseconds)
   */
  REQUEST_TIMEOUT: 10000,

  /**
   * Enable API debug logging
   */
  DEBUG: true,

  /**
   * Get full API URL for endpoint
   * @param {string} endpoint - Endpoint key from ENDPOINTS
   * @returns {string} - Full API URL
   */
  getApiUrl: function(endpoint) {
    const endpointPath = this.ENDPOINTS[endpoint] || endpoint;
    return this.API_BASE_URL + endpointPath;
  }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
