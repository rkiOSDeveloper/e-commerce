/**
 * Wishlist Service
 * Handles all wishlist-related operations
 */

class WishlistService {
    constructor() {
        this.storageKey = 'clothyfly_wishlist';
        this.pendingKey = 'clothyfly_pending_wishlist';
    }

    /**
     * Get current wishlist
     * @returns {Array} Wishlist items
     */
    getWishlist() {
        try {
            const wishlistStr = localStorage.getItem(this.storageKey);
            return wishlistStr ? JSON.parse(wishlistStr) : [];
        } catch (error) {
            console.error('Error getting wishlist:', error);
            return [];
        }
    }

    /**
     * Save wishlist to storage
     * @param {Array} wishlist - Wishlist items
     */
    saveWishlist(wishlist) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
            this.notifyWishlistUpdate();
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }

    /**
     * Add item to wishlist
     * @param {Object} product - Product object
     * @returns {Object} Response object
     */
    addToWishlist(product) {
        try {
            // Check if user is logged in
            if (!authService.isLoggedIn()) {
                // Store in session for post-login addition
                this.savePendingWishlist(product);

                return {
                    success: false,
                    requiresLogin: true,
                    message: 'Please login to add items to wishlist'
                };
            }

            const wishlist = this.getWishlist();

            // Check if product already in wishlist
            const exists = wishlist.some(item => item.id === product.id);

            if (exists) {
                return {
                    success: false,
                    message: 'Product already in wishlist'
                };
            }

            // Add to wishlist
            const wishlistItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.images[0],
                addedAt: new Date().toISOString()
            };

            wishlist.push(wishlistItem);
            this.saveWishlist(wishlist);

            return {
                success: true,
                message: 'Added to wishlist',
                wishlist: wishlist
            };
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return {
                success: false,
                message: 'Failed to add to wishlist'
            };
        }
    }

    /**
     * Remove item from wishlist
     * @param {string} productId - Product ID
     * @returns {Object} Response object
     */
    removeFromWishlist(productId) {
        try {
            let wishlist = this.getWishlist();
            wishlist = wishlist.filter(item => item.id !== productId);

            this.saveWishlist(wishlist);

            return {
                success: true,
                message: 'Removed from wishlist',
                wishlist: wishlist
            };
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return {
                success: false,
                message: 'Failed to remove from wishlist'
            };
        }
    }

    /**
     * Check if product is in wishlist
     * @param {string} productId - Product ID
     * @returns {boolean} In wishlist status
     */
    isInWishlist(productId) {
        const wishlist = this.getWishlist();
        return wishlist.some(item => item.id === productId);
    }

    /**
     * Get wishlist count
     * @returns {number} Number of items in wishlist
     */
    getWishlistCount() {
        return this.getWishlist().length;
    }

    /**
     * Clear wishlist
     */
    clearWishlist() {
        try {
            localStorage.removeItem(this.storageKey);
            this.notifyWishlistUpdate();

            return {
                success: true,
                message: 'Wishlist cleared'
            };
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            return {
                success: false,
                message: 'Failed to clear wishlist'
            };
        }
    }

    /**
     * Move item from wishlist to cart
     * @param {string} productId - Product ID
     * @returns {Promise<Object>} Response object
     */
    async moveToCart(productId) {
        try {
            // Get full product details
            const product = await productService.getById(productId);

            if (!product) {
                return {
                    success: false,
                    message: 'Product not found'
                };
            }

            // Add to cart
            const cartResult = await cartService.addToCart(product);

            if (cartResult.success) {
                // Remove from wishlist
                this.removeFromWishlist(productId);

                return {
                    success: true,
                    message: 'Moved to cart'
                };
            }

            return cartResult;
        } catch (error) {
            console.error('Error moving to cart:', error);
            return {
                success: false,
                message: 'Failed to move to cart'
            };
        }
    }

    /**
     * Save pending wishlist item (for post-login)
     * @param {Object} product - Product to save
     */
    savePendingWishlist(product) {
        try {
            sessionStorage.setItem(this.pendingKey, JSON.stringify(product));
        } catch (error) {
            console.error('Error saving pending wishlist:', error);
        }
    }

    /**
     * Get and process pending wishlist
     * @returns {Object} Result of adding pending item
     */
    processPendingWishlist() {
        try {
            const pendingStr = sessionStorage.getItem(this.pendingKey);

            if (!pendingStr) {
                return null;
            }

            const product = JSON.parse(pendingStr);
            sessionStorage.removeItem(this.pendingKey);

            // Add to wishlist now that user is logged in
            return this.addToWishlist(product);
        } catch (error) {
            console.error('Error processing pending wishlist:', error);
            return null;
        }
    }

    /**
     * Notify wishlist update (for UI refresh)
     */
    notifyWishlistUpdate() {
        // Dispatch custom event for wishlist updates
        const event = new CustomEvent('wishlistUpdated', {
            detail: {
                wishlist: this.getWishlist(),
                count: this.getWishlistCount()
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Get wishlist with full product details
     * @returns {Promise<Array>} Wishlist with full product data
     */
    async getWishlistWithDetails() {
        try {
            const wishlist = this.getWishlist();
            const withDetails = [];

            for (const item of wishlist) {
                // Handle both object items and legacy string IDs
                const id = typeof item === 'string' ? item : item.id;

                // Use global productService if available
                if (typeof productService !== 'undefined') {
                    const product = await productService.getById(id);
                    if (product) {
                        withDetails.push({
                            ...product, // Get fresh details from service
                            addedAt: item.addedAt || new Date().toISOString()
                        });
                    }
                } else {
                    // Fallback if productService not available (shouldn't happen if scripts loaded correctly)
                    console.warn('ProductService not found for wishlist expansion');
                    if (typeof item !== 'string') withDetails.push(item);
                }
            }

            return withDetails;
        } catch (error) {
            console.error('Error getting wishlist details:', error);
            // Fallback to basic wishlist if expansion fails
            return this.getWishlist().filter(item => typeof item !== 'string');
        }
    }
}

// Create singleton instance
const wishlistService = new WishlistService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = wishlistService;
}
