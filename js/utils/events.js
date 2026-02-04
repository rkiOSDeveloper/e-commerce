/**
 * Event Bus
 * Simple publish-subscribe pattern for decoupled component communication
 */

export class EventBus {
    static events = {};

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    static on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    static off(event, callback) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Data to pass to callbacks
     */
    static emit(event, data) {
        if (!this.events[event]) return;

        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event handler for "${event}":`, error);
            }
        });
    }

    /**
     * Subscribe to event once (auto-unsubscribe after first call)
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    static once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }

    /**
     * Clear all listeners for an event
     * @param {string} event - Event name
     */
    static clear(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
}

/**
 * Performance Utilities
 * Debounce and throttle functions for performance optimization
 */
export class Performance {
    /**
     * Debounce function - delays execution until after wait time has elapsed since last call
     * Good for: search input, window resize
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function - ensures function is called at most once per time period
     * Good for: scroll events, mouse move
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Request Animation Frame wrapper for smooth animations
     * @param {Function} callback - Function to call on next frame
     */
    static rafThrottle(callback) {
        let requestId = null;
        return function (...args) {
            if (requestId) return;
            requestId = requestAnimationFrame(() => {
                callback.apply(this, args);
                requestId = null;
            });
        };
    }
}
