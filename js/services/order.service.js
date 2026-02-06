/**
 * Order Service
 * Handles all order-related operations
 */

class OrderService {
    constructor() {
        this.storageKey = 'clothyfly_orders';
    }

    /**
     * Get all orders for current user
     * @returns {Promise<Array>} User's orders
     */
    async getOrders() {
        try {
            const user = authService.getCurrentUser();

            if (!user) {
                return [];
            }

            // Get orders from mock data
            const ordersData = await apiService.get('orders', false);

            // Filter orders for current user
            const userOrders = ordersData.orders.filter(order => order.userId === user.id);

            // Also get orders from localStorage (if any)
            const localOrders = this.getLocalOrders();

            // Combine and sort by date (newest first)
            const allOrders = [...userOrders, ...localOrders];
            return allOrders.sort((a, b) =>
                new Date(b.orderDate) - new Date(a.orderDate)
            );
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }

    /**
     * Get order by ID
     * @param {string} orderId - Order ID
     * @returns {Promise<Object|null>} Order object or null
     */
    async getOrderById(orderId) {
        try {
            const orders = await this.getOrders();
            return orders.find(order => order.id === orderId) || null;
        } catch (error) {
            console.error('Error fetching order:', error);
            return null;
        }
    }

    /**
     * Create new order
     * @param {Object} orderData - Order data
     * @returns {Promise<Object>} Response object
     */
    async createOrder(orderData) {
        try {
            const user = authService.getCurrentUser();

            if (!user) {
                return {
                    success: false,
                    message: 'Please login to place an order'
                };
            }

            // Validate cart
            const validation = await cartService.validateCart();

            if (!validation.valid) {
                return {
                    success: false,
                    message: 'Some items in your cart are out of stock',
                    invalidItems: validation.invalidItems
                };
            }

            const cart = cartService.getCart();
            const cartTotal = cartService.getCartTotal();

            // Generate order ID
            const orderId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

            // Create order object
            const order = {
                id: orderId,
                userId: user.id,
                orderDate: new Date().toISOString(),
                status: 'pending',
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    image: item.image,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    price: item.price
                })),
                subtotal: cartTotal.subtotal,
                shipping: cartTotal.shipping,
                tax: cartTotal.tax,
                total: cartTotal.total,
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod,
                estimatedDelivery: this.calculateEstimatedDelivery()
            };

            // Save order to localStorage
            this.saveOrder(order);

            // Clear cart
            cartService.clearCart();

            // Notify order created
            this.notifyOrderUpdate(order);

            return {
                success: true,
                message: 'Order placed successfully',
                order: order
            };
        } catch (error) {
            console.error('Error creating order:', error);
            return {
                success: false,
                message: 'Failed to place order. Please try again.'
            };
        }
    }

    /**
     * Save order to localStorage
     * @param {Object} order - Order object
     */
    saveOrder(order) {
        try {
            const orders = this.getLocalOrders();
            orders.push(order);
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
        } catch (error) {
            console.error('Error saving order:', error);
        }
    }

    /**
     * Get orders from localStorage
     * @returns {Array} Local orders
     */
    getLocalOrders() {
        try {
            const ordersStr = localStorage.getItem(this.storageKey);
            return ordersStr ? JSON.parse(ordersStr) : [];
        } catch (error) {
            console.error('Error getting local orders:', error);
            return [];
        }
    }

    /**
     * Calculate estimated delivery date
     * @param {number} days - Days to add (default 5)
     * @returns {string} ISO date string
     */
    calculateEstimatedDelivery(days = 5) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);
        return deliveryDate.toISOString();
    }

    /**
     * Request a return for an order
     * @param {string} orderId 
     * @param {Object} returnData - { reason, comments, images }
     */
    async requestReturn(orderId, returnData) {
        try {
            const orders = this.getLocalOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                return { success: false, message: 'Order not found' };
            }

            const order = orders[orderIndex];

            // Validate status
            if (order.status !== 'delivered') {
                return { success: false, message: 'Only delivered orders can be returned' };
            }

            // Update status and save return details
            order.status = 'return_requested';
            order.returnDetails = {
                reason: returnData.reason,
                comments: returnData.comments,
                images: returnData.images || [], // Store dummy URLs or file names
                requestedAt: new Date().toISOString()
            };
            order.updatedAt = new Date().toISOString();

            // Save
            localStorage.setItem(this.storageKey, JSON.stringify(orders));

            return { success: true, order };
        } catch (error) {
            console.error('Error requesting return:', error);
            return { success: false, message: 'Failed to request return. Please try again.' };
        }
    }

    /**
     * Cancel order
     * @param {string} orderId - Order ID
     * @returns {Promise<Object>} Response object
     */
    async cancelOrder(orderId) {
        try {
            const order = await this.getOrderById(orderId);

            if (!order) {
                return {
                    success: false,
                    message: 'Order not found'
                };
            }

            if (order.status === 'delivered' || order.status === 'cancelled') {
                return {
                    success: false,
                    message: 'Cannot cancel this order'
                };
            }

            // Update order status
            order.status = 'cancelled';
            order.cancelledAt = new Date().toISOString();

            // Update in localStorage
            const orders = this.getLocalOrders();
            const index = orders.findIndex(o => o.id === orderId);

            if (index > -1) {
                orders[index] = order;
                localStorage.setItem(this.storageKey, JSON.stringify(orders));
            }

            return {
                success: true,
                message: 'Order cancelled successfully',
                order: order
            };
        } catch (error) {
            console.error('Error cancelling order:', error);
            return {
                success: false,
                message: 'Failed to cancel order'
            };
        }
    }

    /**
     * Get orders by status
     * @param {string} status - Order status
     * @returns {Promise<Array>} Filtered orders
     */
    async getOrdersByStatus(status) {
        try {
            const orders = await this.getOrders();
            return orders.filter(order => order.status === status);
        } catch (error) {
            console.error('Error filtering orders:', error);
            return [];
        }
    }

    /**
     * Get order statistics
     * @returns {Promise<Object>} Order stats
     */
    async getOrderStats() {
        try {
            const orders = await this.getOrders();

            return {
                total: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                shipped: orders.filter(o => o.status === 'shipped').length,
                delivered: orders.filter(o => o.status === 'delivered').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length,
                totalSpent: orders.reduce((sum, o) => sum + o.total, 0)
            };
        } catch (error) {
            console.error('Error calculating stats:', error);
            return {
                total: 0,
                pending: 0,
                shipped: 0,
                delivered: 0,
                cancelled: 0,
                totalSpent: 0
            };
        }
    }

    /**
     * Notify order update (for UI refresh)
     */
    notifyOrderUpdate(order) {
        // Dispatch custom event for order updates
        const event = new CustomEvent('orderCreated', {
            detail: {
                order: order
            }
        });
        window.dispatchEvent(event);
    }
    /**
     * DEV HELPER: Mark latest order as delivered
     */
    async dev_markFirstOrderDelivered() {
        const orders = this.getLocalOrders();
        if (orders.length === 0) {
            console.warn('No local orders found to update');
            return { success: false, message: 'No local orders found. Place an order first.' };
        }

        // Update the most recent order
        const order = orders[orders.length - 1]; // items are pushed, so last is newest usually, but getOrders sorts them. 
        // Let's just grab the last one pushed.

        order.status = 'delivered';
        order.deliveredAt = new Date().toISOString();

        // Save back
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
        console.log(`Order ${order.id} marked as DELIVERED`);

        // Notify
        this.notifyOrderUpdate(order);

        return { success: true, message: `Order ${order.id} updated to Delivered` };
    }
}

// Create singleton instance
const orderService = new OrderService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = orderService;
}

// Ensure global availability
window.orderService = orderService;
