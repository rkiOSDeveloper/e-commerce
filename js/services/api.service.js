/**
 * Base API Service
 * Handles all HTTP requests and mock data fetching
 */

class APIService {
    constructor() {
        this.baseURL = window.location.origin;
        this.dataPath = '/data';
    }

    /**
     * Fetch JSON data from local files
     * @param {string} endpoint - The JSON file to fetch (e.g., 'products', 'users')
     * @returns {Promise<any>} Parsed JSON data
     */
    async fetchJSON(endpoint) {
        try {
            const response = await fetch(`${this.dataPath}/${endpoint}.json`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Simulate API delay for realistic experience
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    async delay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generic GET request (mock)
     * @param {string} endpoint - The endpoint to fetch
     * @param {boolean} withDelay - Whether to simulate network delay
     * @returns {Promise<any>}
     */
    async get(endpoint, withDelay = true) {
        if (withDelay) {
            await this.delay();
        }
        return await this.fetchJSON(endpoint);
    }

    /**
     * Generic POST request (mock - stores in localStorage)
     * @param {string} endpoint - The endpoint
     * @param {any} data - Data to send
     * @returns {Promise<any>}
     */
    async post(endpoint, data) {
        await this.delay();
        // For mock API, we'll just return the data with success status
        return {
            success: true,
            data: data,
            message: 'Operation successful'
        };
    }

    /**
     * Generic PUT request (mock)
     * @param {string} endpoint - The endpoint
     * @param {any} data - Data to update
     * @returns {Promise<any>}
     */
    async put(endpoint, data) {
        await this.delay();
        return {
            success: true,
            data: data,
            message: 'Update successful'
        };
    }

    /**
     * Generic DELETE request (mock)
     * @param {string} endpoint - The endpoint
     * @returns {Promise<any>}
     */
    async delete(endpoint) {
        await this.delay();
        return {
            success: true,
            message: 'Delete successful'
        };
    }

    /**
     * Handle errors consistently
     * @param {Error} error - The error object
     * @returns {Object} Formatted error response
     */
    handleError(error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message,
            message: 'An error occurred. Please try again.'
        };
    }
}

// Create singleton instance
const apiService = new APIService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiService;
}
