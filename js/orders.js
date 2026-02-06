/**
 * Orders Page Logic
 * Handles order list rendering, filtering, and detail expansion
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadOrders();
});

// State
let allOrders = [];
let currentFilter = 'all';

/**
 * Load and render orders
 */
async function loadOrders() {
    console.log('[Orders] Loading orders...');

    const container = document.getElementById('orders-container');
    const emptyState = document.getElementById('orders-empty');

    if (!container) {
        console.error('[Orders] Container not found');
        return;
    }

    // Fetch and store orders
    allOrders = await orderService.getOrders();
    console.log('[Orders] Loaded', allOrders.length, 'total orders');

    // Setup filtering tabs
    setupTabListeners();

    // Initial render
    renderOrdersList(allOrders, 'all');
}

/**
 * Setup tab click listeners
 */
function setupTabListeners() {
    const tabs = document.querySelectorAll('.order-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const status = tab.dataset.status;

            // Update active state
            tabs.forEach(t => {
                t.classList.remove('border-black', 'dark:border-white', 'text-black', 'dark:text-white');
                t.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-300', 'hover:border-gray-300');
            });

            tab.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-300', 'hover:border-gray-300');
            tab.classList.add('border-black', 'dark:border-white', 'text-black', 'dark:text-white');

            // Render filtered list
            renderOrdersList(allOrders, status);
        });
    });
}

/**
 * Filter and render orders list
 */
function renderOrdersList(orders, filterStatus) {
    currentFilter = filterStatus;
    const container = document.getElementById('orders-container');
    const emptyState = document.getElementById('orders-empty');

    // Filter logic
    let filteredOrders = orders;
    if (filterStatus !== 'all') {
        if (filterStatus === 'ongoing') {
            filteredOrders = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status));
        } else {
            filteredOrders = orders.filter(o => o.status === filterStatus);
        }
    }

    // Empty state logic
    if (filteredOrders.length === 0) {
        container.classList.add('hidden');
        if (emptyState) {
            emptyState.classList.remove('hidden');
            // Update empty message based on filter
            const emptyText = emptyState.querySelector('h2');
            if (emptyText) {
                const statusText = filterStatus === 'all' ? '' : filterStatus;
                emptyText.textContent = `No ${statusText} orders found`;
            }
        }
        return;
    }

    container.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');

    // Render cards
    container.innerHTML = filteredOrders.map(order => renderOrderCard(order)).join('');
}

/**
 * Render individual order card
 */
function renderOrderCard(order) {
    const statusConfig = getStatusConfig(order.status);
    const orderDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    let deliveryInfo = '';
    if (order.status === 'delivered' && order.deliveryDate) {
        deliveryInfo = `Delivered on ${new Date(order.deliveryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
    } else if (order.estimatedDelivery) {
        deliveryInfo = `Expected by ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
    }

    return `
        <div class="bg-white dark:bg-card-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <!-- Order Header -->
            <div class="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="text-sm font-bold text-gray-900 dark:text-white">${order.id}</h3>
                            <span class="px-2 py-0.5 ${statusConfig.bgClass} ${statusConfig.textClass} text-xs font-medium rounded-full">
                                ${statusConfig.label}
                            </span>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Placed on ${orderDate}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
                            <p class="text-base font-bold text-gray-900 dark:text-white">Rs. ${order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>
                ${deliveryInfo ? `<p class="text-xs text-gray-600 dark:text-gray-400 mt-2">${deliveryInfo}</p>` : ''}
            </div>

            <!-- Order Items -->
            <div class="p-4 sm:p-6">
                ${renderOrderItems(order.items, order.id)}
            </div>

            <!-- Order Actions -->
            <div class="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-wrap gap-2">
                ${order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' ? `
                    <button onclick="cancelOrder('${order.id}')" 
                        class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        Cancel Order
                    </button>
                ` : ''}
                ${order.status === 'delivered' ? `
                    <button onclick="returnOrder('${order.id}')" 
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Return Order
                    </button>
                ` : ''}
                <a href="order_detail.html?id=${order.id}" 
                    class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    View Details
                </a>
            </div>
        </div>
    `;
}

/**
 * Render order items with toggle logic
 */
function renderOrderItems(items, orderId) {
    if (!items || items.length === 0) return '';

    const alwaysShow = items.slice(0, 2);
    const hiddenItems = items.slice(2);

    // Helper to render a single item
    const renderItem = (item) => `
        <div class="flex gap-3">
            <div class="w-16 h-20 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${item.name}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    ${item.size ? 'Size: ' + item.size : ''} ${item.color ? '• ' + item.color : ''}
                </p>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500">Qty: ${item.quantity}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">Rs. ${(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    `;

    let html = `
        <div class="space-y-3 mb-4" id="order-items-list-${orderId}">
            ${alwaysShow.map(renderItem).join('')}
            
            ${hiddenItems.length > 0 ? `
                <div id="hidden-items-${orderId}" class="hidden space-y-3">
                    ${hiddenItems.map(renderItem).join('')}
                </div>
            ` : ''}
        </div>
    `;

    if (items.length > 2) {
        html += `
            <button onclick="toggleItems('${orderId}')" 
                id="toggle-btn-${orderId}"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-2">
                <span id="toggle-text-${orderId}">Show ${items.length - 2} more item${items.length - 2 > 1 ? 's' : ''}</span>
                <span id="toggle-icon-${orderId}" class="material-icons text-sm">expand_more</span>
            </button>
        `;
    }

    return html;
}

/**
 * Get status configuration (label, colors)
 */
function getStatusConfig(status) {
    const configs = {
        pending: {
            label: 'Processing',
            bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
            textClass: 'text-yellow-700 dark:text-yellow-400'
        },
        processing: { // Added processing explicitly
            label: 'Processing',
            bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
            textClass: 'text-yellow-700 dark:text-yellow-400'
        },
        shipped: {
            label: 'Shipped',
            bgClass: 'bg-blue-100 dark:bg-blue-900/30',
            textClass: 'text-blue-700 dark:text-blue-400'
        },
        delivered: {
            label: 'Delivered',
            bgClass: 'bg-green-100 dark:bg-green-900/30',
            textClass: 'text-green-700 dark:text-green-400'
        },
        cancelled: {
            label: 'Cancelled',
            bgClass: 'bg-red-100 dark:bg-red-900/30',
            textClass: 'text-red-700 dark:text-red-400'
        }
    };

    return configs[status] || configs.pending;
}

/**
 * Toggle items visibility inline
 */
function toggleItems(orderId) {
    const hiddenContainer = document.getElementById(`hidden-items-${orderId}`);
    const toggleText = document.getElementById(`toggle-text-${orderId}`);
    const toggleIcon = document.getElementById(`toggle-icon-${orderId}`);

    if (!hiddenContainer) return;

    if (hiddenContainer.classList.contains('hidden')) {
        // Show items
        hiddenContainer.classList.remove('hidden');
        toggleText.textContent = 'Show less';
        toggleIcon.textContent = 'expand_less';
    } else {
        // Hide items
        hiddenContainer.classList.add('hidden');
        // Count total hidden items to restore count
        const totalItems = document.getElementById(`order-items-list-${orderId}`).querySelectorAll('.flex.gap-3').length;
        const hiddenCount = totalItems - 2;
        toggleText.textContent = `Show ${hiddenCount} more item${hiddenCount > 1 ? 's' : ''}`;
        toggleIcon.textContent = 'expand_more';
    }
}

/**
 * Cancel order - Opens the cancel modal
 */
let currentCancelOrderId = null;

async function cancelOrder(orderId) {
    currentCancelOrderId = orderId;
    openCancelPopup();
}

/**
 * Open cancel order popup
 */
function openCancelPopup() {
    const popup = document.getElementById('cancel-popup');
    const popupContent = document.getElementById('cancel-popup-content');

    if (popup && popupContent) {
        popup.classList.remove('hidden');
        // Reset form
        document.querySelectorAll('input[name="cancel_reason"]').forEach(input => {
            input.checked = false;
        });
        document.getElementById('cancel_comment').value = '';

        // Trigger animation
        setTimeout(() => {
            popupContent.classList.remove('translate-y-full');
        }, 10);
    }
}

/**
 * Close cancel order popup
 */
function closeCancelPopup() {
    const popup = document.getElementById('cancel-popup');
    const popupContent = document.getElementById('cancel-popup-content');

    if (popup && popupContent) {
        popupContent.classList.add('translate-y-full');
        setTimeout(() => {
            popup.classList.add('hidden');
            currentCancelOrderId = null;
        }, 300);
    }
}

/**
 * Confirm cancellation - Called when user confirms in modal
 */
async function confirmCancel() {
    if (!currentCancelOrderId) {
        showToast('Error: No order selected', 'error');
        return;
    }

    // Get selected reason
    const selectedReason = document.querySelector('input[name="cancel_reason"]:checked');
    if (!selectedReason) {
        showToast('Please select a reason for cancellation', 'error');
        return;
    }

    const reason = selectedReason.value;
    const comments = document.getElementById('cancel_comment')?.value || '';

    console.log('[Orders] Cancelling order:', currentCancelOrderId, 'Reason:', reason, 'Comments:', comments);

    // Call the service
    const result = await orderService.cancelOrder(currentCancelOrderId);

    if (result.success) {
        closeCancelPopup();
        window.Toast.show('Order cancelled successfully', 'success');
        await loadOrders(); // Reload to show updated status
    } else {
        window.Toast.show(result.message || 'Failed to cancel order', 'error');
    }
}

/**
 * Show toast notification
            <span class="font-medium">${message}</span>
        `;
    }

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.remove('translate-y-full');
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-full');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Return Order Logic
 */
let currentReturnOrderId = null;

async function returnOrder(orderId) {
    currentReturnOrderId = orderId;
    openReturnPopup();
}

/**
 * Open return popup
 */
function openReturnPopup() {
    const popup = document.getElementById('return-popup');
    const popupContent = document.getElementById('return-popup-content');

    if (popup && popupContent) {
        popup.classList.remove('hidden');

        // Reset form
        document.getElementById('return_reason_select').value = '';
        const comment = document.getElementById('return_comment');
        if (comment) comment.value = '';

        // Animation
        setTimeout(() => {
            popupContent.classList.remove('translate-y-full');
        }, 10);
    }
}

/**
 * Close return popup
 */
function closeReturnPopup() {
    const popup = document.getElementById('return-popup');
    const popupContent = document.getElementById('return-popup-content');

    if (popup && popupContent) {
        popupContent.classList.add('translate-y-full');
        setTimeout(() => {
            popup.classList.add('hidden');
            currentReturnOrderId = null;
        }, 300);
    }
}

/**
 * Confirm Return
 */
async function confirmReturn() {
    if (!currentReturnOrderId) {
        window.Toast.show('Error: No order selected', 'error');
        return;
    }

    const reasonSelect = document.getElementById('return_reason_select');
    if (!reasonSelect || !reasonSelect.value) {
        window.Toast.show('Please select a reason for return', 'error');
        return;
    }

    const reason = reasonSelect.value;

    // Call service
    const result = await orderService.requestReturn(currentReturnOrderId, reason);

    if (result.success) {
        closeReturnPopup();
        window.Toast.show('Return request submitted successfully', 'success');
        // Refresh list
        await loadOrders();
    } else {
        window.Toast.show(result.message || 'Failed to submit return request', 'error');
    }
}
