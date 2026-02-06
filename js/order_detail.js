/**
 * Order Detail Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Get Order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!orderId) {
        window.location.href = 'orders.html';
        return;
    }

    await loadOrderDetails(orderId);
});

// State
let currentOrder = null;

/**
 * Load and render order details
 */
async function loadOrderDetails(orderId) {
    const loadingEl = document.getElementById('order-loading');
    const contentEl = document.getElementById('order-content');
    const errorEl = document.getElementById('order-error');

    try {
        // Fetch order
        currentOrder = await orderService.getOrderById(orderId);

        loadingEl.classList.add('hidden');

        if (!currentOrder) {
            errorEl.classList.remove('hidden');
            return;
        }

        // Render content
        renderOrderHeader(currentOrder);
        renderOrderItems(currentOrder.items);
        renderShippingInfo(currentOrder);
        renderOrderSummary(currentOrder);
        renderPaymentInfo(currentOrder);

        // Show content
        contentEl.classList.remove('hidden');

    } catch (error) {
        console.error('Error loading order details:', error);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }
}

/**
 * Render Order Header (ID, Date, Status, Actions)
 */
function renderOrderHeader(order) {
    document.getElementById('order-id').textContent = order.id;

    const date = new Date(order.orderDate).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('order-date').textContent = `Placed on ${date}`;

    const statusConfig = getStatusConfig(order.status);
    const statusBadge = document.getElementById('order-status-badge');
    statusBadge.textContent = statusConfig.label;
    statusBadge.className = `px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`;

    // Render Actions
    const actionsContainer = document.getElementById('order-actions');
    actionsContainer.innerHTML = ''; // Clear existing

    if (['pending', 'processing'].includes(order.status)) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors';
        cancelBtn.textContent = 'Cancel Order';
        cancelBtn.onclick = () => openCancelPopup();
        actionsContainer.appendChild(cancelBtn);
    }
}

/**
 * Render Order Items
 */
function renderOrderItems(items) {
    const container = document.getElementById('order-items-container');
    container.innerHTML = items.map(item => `
        <div class="flex gap-4">
            <div class="w-20 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 flex flex-col justify-between py-1">
                <div>
                    <h3 class="text-base font-medium text-gray-900 dark:text-white line-clamp-2">${item.name}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ${item.size ? `Size: ${item.size}` : ''} 
                        ${item.size && item.color ? '•' : ''} 
                        ${item.color ? `${item.color}` : ''}
                    </p>
                </div>
                <div class="flex justify-between items-end mt-2">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Qty: ${item.quantity} × Rs. ${item.price.toLocaleString('en-IN')}</p>
                    <p class="text-base font-bold text-gray-900 dark:text-white">Rs. ${(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Render Shipping Info
 */
function renderShippingInfo(order) {
    const addressContainer = document.getElementById('shipping-address');
    const { shippingAddress } = order;

    if (shippingAddress) {
        addressContainer.innerHTML = `
            <p class="font-medium text-gray-900 dark:text-white">${shippingAddress.name}</p>
            <p>${shippingAddress.addressLine1}</p>
            ${shippingAddress.addressLine2 ? `<p>${shippingAddress.addressLine2}</p>` : ''}
            <p>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pincode}</p>
            <p>${shippingAddress.country || 'India'}</p>
            <p class="mt-2 text-gray-500">${shippingAddress.phone}</p>
        `;
    } else {
        addressContainer.innerHTML = '<p class="text-gray-500 italic">Address information unavailable</p>';
    }
}

/**
 * Render Payment Info
 */
function renderPaymentInfo(order) {
    const methodMap = {
        'cod': 'Cash on Delivery',
        'card': 'Credit/Debit Card',
        'upi': 'UPI'
    };

    document.getElementById('payment-method').textContent = methodMap[order.paymentMethod] || order.paymentMethod || 'Unknown';

    const paymentStatusEl = document.getElementById('payment-status');
    const isPaid = order.paymentStatus === 'paid' || (order.status === 'delivered' && order.paymentMethod === 'cod');

    if (isPaid) {
        paymentStatusEl.innerHTML = `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                Paid
            </span>
        `;
    } else if (order.status === 'cancelled') {
        paymentStatusEl.innerHTML = `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                Cancelled
            </span>
        `;
    } else {
        paymentStatusEl.innerHTML = `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
                Pending
            </span>
        `;
    }
}

/**
 * Render Order Summary
 */
function renderOrderSummary(order) {
    document.getElementById('summary-subtotal').textContent = `Rs. ${(order.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('summary-shipping').textContent = `Rs. ${(order.shipping || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('summary-tax').textContent = `Rs. ${(order.tax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('summary-total').textContent = `Rs. ${(order.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

/**
 * Status Config Helper
 */
function getStatusConfig(status) {
    const configs = {
        pending: {
            label: 'Processing',
            bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
            textClass: 'text-yellow-700 dark:text-yellow-400'
        },
        processing: {
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

// --- Cancel Order Logic ---

function openCancelPopup() {
    const popup = document.getElementById('cancel-popup');
    const popupContent = document.getElementById('cancel-popup-content');

    if (popup && popupContent) {
        popup.classList.remove('hidden');
        // Reset form
        document.querySelectorAll('input[name="cancel_reason"]').forEach(input => input.checked = false);
        document.getElementById('cancel_comment').value = '';

        // Animation
        setTimeout(() => popupContent.classList.remove('translate-y-full'), 10);
    }
}

function closeCancelPopup() {
    const popup = document.getElementById('cancel-popup');
    const popupContent = document.getElementById('cancel-popup-content');

    if (popup && popupContent) {
        popupContent.classList.add('translate-y-full');
        setTimeout(() => popup.classList.add('hidden'), 300);
    }
}

async function confirmCancel() {
    if (!currentOrder) return;

    const selectedReason = document.querySelector('input[name="cancel_reason"]:checked');
    if (!selectedReason) {
        window.Toast.show('Please select a reason for cancellation', 'error');
        return;
    }

    const reason = selectedReason.value;
    const comments = document.getElementById('cancel_comment').value;

    try {
        const result = await orderService.cancelOrder(currentOrder.id);

        if (result.success) {
            closeCancelPopup();
            // Reload page to show updated status
            await loadOrderDetails(currentOrder.id);
            // Verify status updated
            const statusConfig = getStatusConfig('cancelled');
            const statusBadge = document.getElementById('order-status-badge');
            statusBadge.textContent = statusConfig.label;
            statusBadge.className = `px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`;

            // Remove actions
            document.getElementById('order-actions').innerHTML = '';

            window.Toast.show('Order cancelled successfully', 'success');

        } else {
            window.Toast.show(result.message || 'Failed to cancel order', 'error');
        }
    } catch (error) {
        console.error('Cancel order failed:', error);
        window.Toast.show('An error occurred while cancelling order', 'error');
    }
}
