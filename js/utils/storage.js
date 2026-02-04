/**
 * Storage Manager
 * Centralized localStorage management with error handling and type safety
 */

import { STORAGE_KEYS } from '../config/constants.js';

export class StorageManager {
    /**
     * Get item from localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Parsed value or default
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
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
     * @returns {boolean} Success status
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
     * @param {string} key - Storage key
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

    // Cart specific methods
    static getCart() {
        return this.get(STORAGE_KEYS.CART, []);
    }

    static saveCart(cart) {
        if (!Array.isArray(cart)) {
            console.error('Cart must be an array');
            return false;
        }
        return this.set(STORAGE_KEYS.CART, cart);
    }

    static clearCart() {
        return this.set(STORAGE_KEYS.CART, []);
    }

    // Wishlist specific methods
    static getWishlist() {
        return this.get(STORAGE_KEYS.WISHLIST, []);
    }

    static saveWishlist(wishlist) {
        if (!Array.isArray(wishlist)) {
            console.error('Wishlist must be an array');
            return false;
        }
        return this.set(STORAGE_KEYS.WISHLIST, wishlist);
    }

    static clearWishlist() {
        return this.set(STORAGE_KEYS.WISHLIST, []);
    }

    // User specific methods
    static getUser() {
        return this.get(STORAGE_KEYS.USER, null);
    }

    static saveUser(user) {
        if (!user || typeof user !== 'object') {
            console.error('User must be an object');
            return false;
        }
        return this.set(STORAGE_KEYS.USER, user);
    }

    static clearUser() {
        return this.remove(STORAGE_KEYS.USER);
    }

    static isLoggedIn() {
        return this.getUser() !== null;
    }

    // Pending wishlist (sessionStorage for temporary data)
    static getPendingWishlist() {
        try {
            const item = sessionStorage.getItem(STORAGE_KEYS.PENDING_WISHLIST);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading pending wishlist:', error);
            return null;
        }
    }

    static savePendingWishlist(product) {
        try {
            sessionStorage.setItem(STORAGE_KEYS.PENDING_WISHLIST, JSON.stringify(product));
            return true;
        } catch (error) {
            console.error('Error saving pending wishlist:', error);
            return false;
        }
    }

    static clearPendingWishlist() {
        try {
            sessionStorage.removeItem(STORAGE_KEYS.PENDING_WISHLIST);
            return true;
        } catch (error) {
            console.error('Error clearing pending wishlist:', error);
            return false;
        }
    }
}
