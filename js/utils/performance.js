/**
 * PerformanceUtils: Optimize event handlers and expensive operations
 * Provides debouncing and throttling utilities
 */

export class PerformanceUtils {
    /**
     * Debounce: Delay execution until after wait milliseconds have elapsed
     * since the last call. Useful for search inputs, resize handlers.
     * 
     * @param {Function} func - Function to debounce
     * @param {number} wait - Milliseconds to wait
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
     * Throttle: Limit function execution to once per specified time period.
     * Useful for scroll handlers, mouse move events.
     * 
     * @param {Function} func - Function to throttle
     * @param {number} limit - Minimum time between executions (ms)
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
}
