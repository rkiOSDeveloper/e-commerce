/**
 * Cart Service
 * Handles all cart-related operations
 */

class CartService {
    constructor() {
        this.storageKey = 'clothyfly_cart';
    }

    /**
     * Get current cart
     * @returns {Array} Cart items
     */
    getCart() {
        try {
            const cartStr = localStorage.getItem(this.storageKey);
            return cartStr ? JSON.parse(cartStr) : [];
        } catch (error) {
            console.error('Error getting cart:', error);
            return [];
        }
    }

    /**
     * Save cart to storage
     * @param {Array} cart - Cart items
     */
    saveCart(cart) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(cart));
            this.notifyCartUpdate();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    /**
     * Add item to cart
     * @param {Object} product - Product object
     * @param {number} quantity - Quantity to add
     * @param {string} size - Selected size
     * @param {string} color - Selected color
     * @returns {Object} Response object
     */
    async addToCart(product, quantity = 1, size = 'M', color = 'Default') {
        try {
            // Check stock availability
            const inStock = await productService.checkStock(product.id, quantity);

            if (!inStock) {
                return {
                    success: false,
                    message: 'Product is out of stock'
                };
            }

            const cart = this.getCart();

            // Create unique instance ID for this variant
            const instanceId = `${product.id}-${size}-${color}-${Date.now()}`;

            // Check if exact variant exists
            const existingItemIndex = cart.findIndex(
                item => item.id === product.id &&
                    item.size === size &&
                    item.color === color
            );

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                const cartItem = {
                    instanceId: instanceId,
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images && product.images.length > 0 ? product.images[0] : (product.image || 'placeholder.jpg'),
                    size: size,
                    color: color,
                    quantity: quantity,
                    addedAt: new Date().toISOString()
                };

                cart.push(cartItem);
            }

            this.saveCart(cart);

            return {
                success: true,
                message: 'Product added to cart',
                cart: cart
            };
        } catch (error) {
            console.error('Error adding to cart:', error);
            return {
                success: false,
                message: 'Failed to add product to cart'
            };
        }
    }

    /**
     * Update cart item quantity
     * @param {string} instanceId - Cart item instance ID
     * @param {number} quantity - New quantity
     * @returns {Object} Response object
     */
    updateQuantity(instanceId, quantity) {
        try {
            const cart = this.getCart();
            const itemIndex = cart.findIndex(item => item.instanceId === instanceId);

            if (itemIndex === -1) {
                return {
                    success: false,
                    message: 'Item not found in cart'
                };
            }

            if (quantity < 1) {
                quantity = 1;
            }

            cart[itemIndex].quantity = quantity;
            this.saveCart(cart);

            return {
                success: true,
                message: 'Quantity updated',
                cart: cart
            };
        } catch (error) {
            console.error('Error updating quantity:', error);
            return {
                success: false,
                message: 'Failed to update quantity'
            };
        }
    }

    /**
     * Remove item from cart
     * @param {string} instanceId - Cart item instance ID
     * @returns {Object} Response object
     */
    removeFromCart(instanceId) {
        try {
            let cart = this.getCart();
            cart = cart.filter(item => item.instanceId !== instanceId);

            this.saveCart(cart);

            return {
                success: true,
                message: 'Item removed from cart',
                cart: cart
            };
        } catch (error) {
            console.error('Error removing from cart:', error);
            return {
                success: false,
                message: 'Failed to remove item'
            };
        }
    }

    /**
     * Clear entire cart
     */
    clearCart() {
        try {
            localStorage.removeItem(this.storageKey);
            this.notifyCartUpdate();

            return {
                success: true,
                message: 'Cart cleared'
            };
        } catch (error) {
            console.error('Error clearing cart:', error);
            return {
                success: false,
                message: 'Failed to clear cart'
            };
        }
    }

    /**
     * Get cart item count
     * @returns {number} Total items in cart
     */
    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Calculate cart total
     * @returns {Object} Cart totals
     */
    getCartTotal() {
        const cart = this.getCart();

        const subtotal = cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const shipping = subtotal > 0 && subtotal < 1000 ? 50 : 0;
        const tax = 0; // Can add tax calculation
        const total = subtotal + shipping + tax;

        return {
            subtotal,
            shipping,
            tax,
            total,
            itemCount: cart.length
        };
    }

    /**
     * Notify cart update (for UI refresh)
     */
    notifyCartUpdate() {
        // Dispatch custom event for cart updates
        const event = new CustomEvent('cartUpdated', {
            detail: {
                cart: this.getCart(),
                count: this.getCartCount(),
                total: this.getCartTotal()
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Validate cart (check stock availability)
     * @returns {Promise<Object>} Validation result
     */
    async validateCart() {
        try {
            const cart = this.getCart();
            const invalidItems = [];

            for (const item of cart) {
                const inStock = await productService.checkStock(item.id, item.quantity);
                if (!inStock) {
                    invalidItems.push(item);
                }
            }

            return {
                valid: invalidItems.length === 0,
                invalidItems: invalidItems
            };
        } catch (error) {
            console.error('Error validating cart:', error);
            return {
                valid: false,
                error: 'Validation failed'
            };
        }
    }
}

// Create singleton instance
const cartService = new CartService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cartService;
}

// Ensure global availability
window.cartService = cartService;
