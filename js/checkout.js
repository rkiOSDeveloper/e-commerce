/**
 * Checkout Page Logic
 * Handles authentication guard, address selection, and order placement
 */

let selectedAddressId = null;

/**
 * Initialize checkout page
 */
function initCheckout() {
    console.log('[Checkout] Initializing...');

    // Always populate state dropdown first
    populateStateDropdown();

    // 1. Auth Guard: Check if user is logged in
    if (!authService.isLoggedIn()) {
        console.log('[Checkout] User not logged in, opening auth popup...');

        // Listen for successful login
        window.addEventListener('loginSuccess', () => {
            console.log('[Checkout] Login successful, proceeding with checkout');
            location.reload(); // Reload to fresh init
        }, { once: true });

        // Open auth popup after a short delay to ensure components are loaded
        setTimeout(() => {
            if (typeof window.authPopupManager !== 'undefined') {
                window.authPopupManager.openPopup();
            }
        }, 500);
        return;
    }

    proceedWithCheckout();
}

/**
 * Proceed with checkout after auth check
 */
function proceedWithCheckout() {
    // 2. Validate cart - redirect if empty
    const cart = cartService.getCart();
    if (!cart || cart.length === 0) {
        console.log('[Checkout] Cart is empty, redirecting to cart page');
        window.location.href = 'cart.html';
        return;
    }

    // 3. Load and render
    loadAddresses();
    loadOrderSummary();
    populateStateDropdown();

    // 4. Ensure state dropdown is populated
    populateStateDropdown();

    // 5. Listen for address updates
    window.addEventListener('addressUpdated', () => {
        console.log('[Checkout] Address list updated, reloading...');
        loadAddresses();
    });

    console.log('[Checkout] Initialized successfully');
}

/**
 * Load and render saved addresses
 */
function loadAddresses() {
    const container = document.getElementById('checkout-address-list');
    const noAddressMsg = document.getElementById('no-address-message');

    if (!container) return;

    // Fetch addresses from localStorage
    const addressesStr = localStorage.getItem('clothyfly_addresses');
    const addresses = addressesStr ? JSON.parse(addressesStr) : [];

    if (addresses.length === 0) {
        container.classList.add('hidden');
        if (noAddressMsg) noAddressMsg.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    if (noAddressMsg) noAddressMsg.classList.add('hidden');

    // Find default address
    const defaultAddress = addresses.find(addr => addr.isDefault);

    // Auto-select default or first address
    if (!selectedAddressId && addresses.length > 0) {
        selectedAddressId = defaultAddress ? defaultAddress.id : addresses[0].id;
    }

    // Render address cards with radio buttons
    container.innerHTML = addresses.map(addr => `
        <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors
            ${selectedAddressId === addr.id
            ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}">
            <input type="radio" name="shipping-address" value="${addr.id}" 
                ${selectedAddressId === addr.id ? 'checked' : ''}
                onchange="selectAddress(${addr.id})"
                class="mt-1 text-black focus:ring-black dark:bg-gray-700 dark:border-gray-600">
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-gray-900 dark:text-white">${addr.firstname} ${addr.lastname}</span>
                    ${addr.isDefault ? '<span class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs font-medium rounded text-gray-600 dark:text-gray-300">Default</span>' : ''}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    ${addr.line1}<br>
                    ${addr.line2 ? addr.line2 + '<br>' : ''}
                    ${addr.city}, ${addr.state} - ${addr.pincode}<br>
                    <span class="inline-flex items-center gap-1 mt-1">
                        <span class="material-icons text-xs">phone</span>
                        ${addr.phone}
                    </span>
                </div>
            </div>
        </label>
    `).join('');

    console.log('[Checkout] Loaded', addresses.length, 'addresses');
}

/**
 * Handle address selection
 */
function selectAddress(id) {
    selectedAddressId = id;
    console.log('[Checkout] Selected address:', id);
}

/**
 * Load order summary from cart
 */
function loadOrderSummary() {
    const cart = cartService.getCart();
    const totals = cartService.getCartTotal();

    // Render cart items
    const itemsContainer = document.getElementById('checkout-cart-items');
    if (itemsContainer) {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="flex gap-3">
                <div class="w-16 h-20 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">${item.name}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        ${item.size ? 'Size: ' + item.size : ''} ${item.color ? '• ' + item.color : ''}
                    </p>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-xs text-gray-500">Qty: ${item.quantity}</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">Rs. ${(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update totals
    document.getElementById('checkout-subtotal').textContent = `Rs. ${totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('checkout-shipping').textContent = `Rs. ${totals.shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('checkout-tax').textContent = `Rs. ${totals.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('checkout-total').textContent = `Rs. ${totals.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    console.log('[Checkout] Order summary loaded');
}

/**
 * Place order
 */
async function placeOrder() {
    console.log('[Checkout] Placing order...');

    // Validate address selection
    if (!selectedAddressId) {
        window.Toast.show('Please select a delivery address', 'error');
        return;
    }

    // Get selected address
    const addressesStr = localStorage.getItem('clothyfly_addresses');
    const addresses = addressesStr ? JSON.parse(addressesStr) : [];
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    if (!selectedAddress) {
        window.Toast.show('Selected address not found', 'error');
        return;
    }

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'cod';

    // Prepare order data
    const orderData = {
        shippingAddress: {
            name: `${selectedAddress.firstname} ${selectedAddress.lastname}`,
            phone: selectedAddress.phone,
            addressLine1: selectedAddress.line1,
            addressLine2: selectedAddress.line2 || '',
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode,
            country: selectedAddress.country || 'India'
        },
        paymentMethod: paymentMethod
    };

    // Create order via service
    const result = await orderService.createOrder(orderData);

    if (result.success) {
        console.log('[Checkout] Order placed successfully:', result.order.id);

        // Redirect to order confirmation page
        window.location.href = `order_confirmation.html?id=${result.order.id}`;
    } else {
        console.error('[Checkout] Order placement failed:', result.message);
        window.Toast.show(result.message || 'Failed to place order. Please try again.', 'error');
    }
}

// --- Address Popup Functions (Reused from profile.js) ---

function openAddAddressPopup() {
    const popup = document.getElementById('add-address-popup');
    if (popup) {
        // Reset form
        document.getElementById('add-address-id').value = '';
        document.getElementById('add-address-popup-title').textContent = 'Add address';
        document.getElementById('add-address-firstname').value = '';
        document.getElementById('add-address-lastname').value = '';
        document.getElementById('add-address-line1').value = '';
        document.getElementById('add-address-line2').value = '';
        document.getElementById('add-address-city').value = '';
        document.getElementById('add-address-state').value = 'Gujarat';
        document.getElementById('add-address-pincode').value = '';
        document.getElementById('add-address-phone').value = '';
        document.getElementById('add-address-default').checked = false;

        popup.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

function closeAddAddressPopup() {
    const popup = document.getElementById('add-address-popup');
    if (popup) {
        popup.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

function saveCheckoutAddress() {
    const firstname = document.getElementById('add-address-firstname').value;
    const lastname = document.getElementById('add-address-lastname').value;
    const line1 = document.getElementById('add-address-line1').value;
    const line2 = document.getElementById('add-address-line2').value;
    const city = document.getElementById('add-address-city').value;
    const state = document.getElementById('add-address-state').value;
    const pincode = document.getElementById('add-address-pincode').value;
    const phone = document.getElementById('add-address-phone').value;
    const isDefault = document.getElementById('add-address-default').checked;

    if (!firstname || !lastname || !line1 || !city || !state || !pincode || !phone) {
        window.Toast.show('Please fill in all required fields', 'error');
        return;
    }

    const addressesStr = localStorage.getItem('clothyfly_addresses');
    let addresses = addressesStr ? JSON.parse(addressesStr) : [];

    // If set as default, remove default from others
    if (isDefault) {
        addresses.forEach(a => a.isDefault = false);
    }

    // Add new address
    const newAddress = {
        id: Date.now(),
        firstname,
        lastname,
        line1,
        line2,
        city,
        state,
        pincode,
        country: 'India',
        phone: '+91' + phone,
        isDefault: isDefault || addresses.length === 0 // Force default if it's the first one
    };
    addresses.push(newAddress);

    localStorage.setItem('clothyfly_addresses', JSON.stringify(addresses));

    // Dispatch event to refresh address list
    window.dispatchEvent(new CustomEvent('addressUpdated'));

    closeAddAddressPopup();

    console.log('[Checkout] New address saved');
}

function populateStateDropdown() {
    const stateSelect = document.getElementById('add-address-state');
    if (!stateSelect) return;

    const states = [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
        "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
        "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    stateSelect.innerHTML = `<option value="">Select State</option>` + states.map(state =>
        `<option value="${state}">${state}</option>`
    ).join('');

    // Set default to Gujarat
    stateSelect.value = 'Gujarat';
}
