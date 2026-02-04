/**
 * StorageManager: Centralized localStorage management
 * Provides error handling and JSON serialization/deserialization
 */

export class StorageManager {
    /**
     * Get item from localStorage
     */
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    }

    /**
     * Set item in localStorage
     */
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
            return false;
        }
    }

    /**
     * Clear all localStorage
     */
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    /**
     * Check if key exists
     */
    static has(key) {
        return localStorage.getItem(key) !== null;
    }

    // Cart-specific methods
    static getCart() {
        return this.get('hoodvibe_cart', []);
    }

    static saveCart(cart) {
        return this.set('hoodvibe_cart', cart);
    }

    // User-specific methods
    static getUser() {
        return this.get('hoodvibe_user', null);
    }

    static saveUser(user) {
        return this.set('hoodvibe_user', user);
    }

    // Wishlist-specific methods
    static getWishlist() {
        return this.get('hoodvibe_wishlist', []);
    }

    static saveWishlist(wishlist) {
        return this.set('hoodvibe_wishlist', wishlist);
    }
}
