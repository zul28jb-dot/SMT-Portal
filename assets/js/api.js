/**
 * SMT Portal API Module
 * Handles all API communications
 * Currently using dummy data - ready for n8n integration
 */

/**
 * API Service Object
 */
const APIService = {
    /**
     * Get Dashboard Data
     * @returns {Promise<object>} - Dashboard data
     */
    getDashboard: function() {
        return this._simulateRequest({
            income: 4250,
            expense: 2180,
            balance: 2070,
            score: 94,
            monthlyTrend: [
                { month: 'Jan', income: 3500, expense: 2100 },
                { month: 'Feb', income: 4200, expense: 1900 },
                { month: 'Mac', income: 3800, expense: 2300 },
                { month: 'Apr', income: 4800, expense: 2500 },
                { month: 'Mei', income: 4500, expense: 2700 },
                { month: 'Jun', income: 5100, expense: 3000 },
                { month: 'Jul', income: 5400, expense: 2900 }
            ],
            budget: {
                used: 1594,
                total: 2200,
                percentage: 73,
                daysRemaining: 8
            },
            categories: [
                { name: 'Makanan & Minuman', amount: 486, count: 12, icon: '🍔' },
                { name: 'Pengangkutan', amount: 320, count: 8, icon: '🚗' },
                { name: 'Belanja Runcit', amount: 245, count: 5, icon: '🛍️' },
                { name: 'Hiburan', amount: 150, count: 3, icon: '🎮' },
                { name: 'Kesihatan', amount: 89, count: 2, icon: '🏥' }
            ],
            recentTransactions: [
                { name: 'Pizza Hut', amount: -62, date: 'Hari ini, 13:45', icon: '🍕', type: 'expense' },
                { name: 'Gaji Bulanan', amount: 4250, date: 'Kemarin, 09:00', icon: '💳', type: 'income' },
                { name: 'Shell Petrol', amount: -85, date: '2 hari yang lalu', icon: '⛽', type: 'expense' },
                { name: 'Tesco Supermarket', amount: -156, date: '3 hari yang lalu', icon: '🛒', type: 'expense' },
                { name: 'Netflix Subscription', amount: -17.90, date: '1 minggu yang lalu', icon: '🎬', type: 'expense' }
            ]
        });
    },

    /**
     * Get Transactions List
     * @param {object} filters - Filter options (page, limit, category, etc)
     * @returns {Promise<object>} - Transactions data
     */
    getTransactions: function(filters = {}) {
        const defaultFilters = {
            page: 1,
            limit: 20,
            category: null,
            startDate: null,
            endDate: null
        };

        const options = { ...defaultFilters, ...filters };

        return this._simulateRequest({
            page: options.page,
            limit: options.limit,
            total: 156,
            transactions: [
                { 
                    id: 'TXN001', 
                    name: 'Pizza Hut', 
                    amount: -62, 
                    date: new Date().toISOString(),
                    category: 'Makanan & Minuman',
                    type: 'expense',
                    description: 'Makan malam keluarga'
                },
                { 
                    id: 'TXN002', 
                    name: 'Gaji Bulanan', 
                    amount: 4250, 
                    date: new Date(Date.now() - 86400000).toISOString(),
                    category: 'Pendapatan',
                    type: 'income',
                    description: 'Gaji bulan Julai'
                },
                { 
                    id: 'TXN003', 
                    name: 'Shell Petrol', 
                    amount: -85, 
                    date: new Date(Date.now() - 172800000).toISOString(),
                    category: 'Pengangkutan',
                    type: 'expense',
                    description: 'Isi petrol'
                },
                { 
                    id: 'TXN004', 
                    name: 'Tesco Supermarket', 
                    amount: -156, 
                    date: new Date(Date.now() - 259200000).toISOString(),
                    category: 'Belanja Runcit',
                    type: 'expense',
                    description: 'Groceries mingguan'
                },
                { 
                    id: 'TXN005', 
                    name: 'Netflix Subscription', 
                    amount: -17.90, 
                    date: new Date(Date.now() - 604800000).toISOString(),
                    category: 'Hiburan',
                    type: 'expense',
                    description: 'Subscription bulanan'
                }
            ]
        });
    },

    /**
     * Get User Profile
     * @returns {Promise<object>} - User profile data
     */
    getProfile: function() {
        return this._simulateRequest({
            userId: 'user_123456',
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'JD',
            tier: 'Premium',
            joinDate: '2024-01-15',
            phone: '+60123456789',
            preferences: {
                currency: 'MYR',
                language: 'ms',
                theme: 'dark',
                notifications: true
            }
        });
    },

    /**
     * Logout User
     * @returns {Promise<object>} - Logout confirmation
     */
    logout: function() {
        return this._simulateRequest({
            success: true,
            message: 'Logout successful',
            timestamp: new Date().toISOString()
        });
    },

    /**
     * Validate Token with Backend
     * Placeholder for future n8n integration
     * @param {string} token - Token to validate
     * @returns {Promise<object>} - Validation result
     */
    validateToken: function(token) {
        if (!token) {
            return Promise.reject({ error: 'Token required' });
        }

        return this._simulateRequest({
            valid: true,
            userId: 'user_123456',
            expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
            user: {
                name: 'John Doe',
                avatar: 'JD'
            }
        });
    },

    /**
     * Simulate API request with delay
     * Development helper - will be replaced with actual fetch calls
     * @param {object} data - Response data
     * @returns {Promise<object>} - Simulated API response
     * @private
     */
    _simulateRequest: function(data) {
        return new Promise((resolve) => {
            // Simulate network delay (500ms)
            setTimeout(() => {
                const response = {
                    success: true,
                    data: data,
                    timestamp: new Date().toISOString(),
                    apiUrl: CONFIG.API_BASE_URL,
                    env: CONFIG.ENV
                };

                this._log('API Response', response);
                resolve(response);
            }, 500);
        });
    },

    /**
     * Internal logging for debugging
     * @param {string} label - Log label
     * @param {*} data - Data to log
     * @private
     */
    _log: function(label, data) {
        if (CONFIG.DEBUG) {
            console.log(`[API] ${label}:`, data);
        }
    },

    /**
     * FUTURE: Make HTTP request to n8n API
     * This will replace _simulateRequest when backend is ready
     * 
     * @param {string} endpoint - API endpoint
     * @param {object} options - Request options
     * @returns {Promise<object>} - API response
     * @private
     */
    _makeRequest: function(endpoint, options = {}) {
        const url = CONFIG.getApiUrl(endpoint);
        const token = sessionStorage.getItem('smt_portal_token');

        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            },
            timeout: CONFIG.REQUEST_TIMEOUT
        };

        if (options.body) {
            requestOptions.body = JSON.stringify(options.body);
        }

        this._log('API Request', { url, method: requestOptions.method });

        return fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                this._log('API Error', error);
                throw error;
            });
    }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}
