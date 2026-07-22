/**
 * SMT Portal Authentication Module
 * Handles token validation and session management
 */

const Auth = {
    /**
     * Token key in sessionStorage
     */
    TOKEN_KEY: 'smt_portal_token',

    /**
     * Session key for user data
     */
    USER_KEY: 'smt_portal_user',

    /**
     * Initialize authentication on page load
     */
    init: function() {
        // Check if we're on dashboard page
        if (this.isProtectedPage()) {
            this.verifyAccess();
        }
    },

    /**
     * Check if current page is protected
     */
    isProtectedPage: function() {
        const currentPage = window.location.pathname.split('/').pop() || '';
        return currentPage === 'dashboard.html';
    },

    /**
     * Verify user has valid access token
     */
    verifyAccess: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        const tokenFromSession = sessionStorage.getItem(this.TOKEN_KEY);

        // If token in URL, validate and save to sessionStorage
        if (tokenFromUrl) {
            if (this.validateToken(tokenFromUrl)) {
                this.saveToken(tokenFromUrl);
                // Clean URL by removing token parameter
                window.history.replaceState({}, document.title, 'dashboard.html');
                return;
            } else {
                // Invalid token in URL
                this.redirectToLogin('Token tidak sah');
                return;
            }
        }

        // Check if token exists in sessionStorage
        if (tokenFromSession) {
            if (this.validateToken(tokenFromSession)) {
                // Token valid, continue
                return;
            } else {
                // Token expired or invalid
                sessionStorage.removeItem(this.TOKEN_KEY);
                this.redirectToLogin('Sesi anda telah tamat');
            }
        } else {
            // No token found, redirect to login
            this.redirectToLogin();
        }
    },

    /**
     * Validate token format and expiration
     * Development placeholder - ready for n8n API integration
     * 
     * @param {string} token - Token to validate
     * @returns {boolean} - True if token is valid
     */
    validateToken: function(token) {
        // Development validation
        // Token must be alphanumeric, minimum 10 characters
        // Format: token_[random]_[timestamp]
        
        if (!token || typeof token !== 'string') {
            return false;
        }

        // Check token length (minimum 10 characters)
        if (token.length < 10) {
            return false;
        }

        // Check if token contains only valid characters (alphanumeric, underscore, dash)
        if (!/^[a-zA-Z0-9_\-]+$/.test(token)) {
            return false;
        }

        // TODO: Future integration with n8n API
        // Replace this with actual API validation:
        // return this.validateTokenWithAPI(token);

        console.log('[AUTH] Token validation passed (development mode)');
        return true;
    },

    /**
     * Future: Validate token with n8n API
     * This is a placeholder for future integration
     * 
     * @param {string} token - Token to validate
     * @returns {Promise<boolean>} - Promise that resolves with validation result
     */
    validateTokenWithAPI: async function(token) {
        try {
            // Example API call structure for future n8n integration
            const response = await fetch('/api/auth/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token: token })
            });

            const data = await response.json();
            
            if (response.ok && data.valid) {
                // Save user data if returned
                if (data.user) {
                    this.saveUserData(data.user);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('[AUTH] API validation error:', error);
            return false;
        }
    },

    /**
     * Save token to sessionStorage
     * 
     * @param {string} token - Token to save
     */
    saveToken: function(token) {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        console.log('[AUTH] Token saved to session');
    },

    /**
     * Save user data to sessionStorage
     * 
     * @param {object} userData - User data object
     */
    saveUserData: function(userData) {
        try {
            sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
            console.log('[AUTH] User data saved');
        } catch (error) {
            console.error('[AUTH] Error saving user data:', error);
        }
    },

    /**
     * Get stored token
     * 
     * @returns {string|null} - Stored token or null
     */
    getToken: function() {
        return sessionStorage.getItem(this.TOKEN_KEY);
    },

    /**
     * Get stored user data
     * 
     * @returns {object|null} - User data or null
     */
    getUserData: function() {
        try {
            const data = sessionStorage.getItem(this.USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('[AUTH] Error retrieving user data:', error);
            return null;
        }
    },

    /**
     * Logout user - clear session and redirect to login
     */
    logout: function() {
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        console.log('[AUTH] User logged out');
        this.redirectToLogin('Anda telah log keluar');
    },

    /**
     * Redirect to login page
     * 
     * @param {string} message - Optional message to display
     */
    redirectToLogin: function(message) {
        if (message) {
            console.log('[AUTH] Redirecting to login:', message);
        }
        window.location.href = 'index.html';
    },

    /**
     * Get logout button and attach event listener
     */
    setupLogoutButton: function() {
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                Auth.logout();
            });
            console.log('[AUTH] Logout button initialized successfully');
        } else {
            console.warn('[AUTH] Logout button not found in DOM');
        }
    }
};

/**
 * Initialize auth on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    Auth.init();
    Auth.setupLogoutButton();
});
