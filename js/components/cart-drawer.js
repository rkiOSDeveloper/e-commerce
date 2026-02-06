/**
 * Cart Drawer Manager
 * Manages the shopping cart slide-out drawer functionality
 */
class CartDrawerManager {
    constructor() {
        this.drawer = null;
        this.itemsList = null;
        this.bottomSection = null;
        this.subtotalEl = null;
    }

    /**
     * Initialize cart drawer functionality
     */
    init() {
        console.log('[CartDrawerManager] Initializing cart drawer...');

        // Get DOM elements
        this.drawer = document.getElementById('cart-drawer');
        this.itemsList = document.getElementById('cart-drawer-items');
        this.bottomSection = document.getElementById('cart-drawer-bottom');
        this.subtotalEl = document.getElementById('cart-drawer-subtotal');

        // Expose functions globally for onclick handlers
        window.toggleCartDrawer = this.toggle.bind(this);
        window.updateDrawerQuantity = this.updateQuantity.bind(this);
        window.removeFromCart = this.removeItem.bind(this);

        // Attach checkout button listener
        const checkoutBtn = document.getElementById('cart-drawer-checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (typeof handleCheckoutAction === 'function') {
                    handleCheckoutAction();
                } else {
                    console.error('[CartDrawer] handleCheckoutAction not found');
                }
            });
            console.log('[CartDrawerManager] ✓ Checkout button listener attached');
        }

        console.log('[CartDrawerManager] ✓ Cart drawer initialized');
    }

    /**
     * Toggle cart drawer visibility
     */
    toggle() {
        if (!this.drawer) return;

        const isOpen = !this.drawer.classList.contains('invisible');

        if (isOpen) {
            // Close drawer
            this.drawer.classList.add('invisible', 'opacity-0');
            const innerDrawer = this.drawer.querySelector('div[class*="translate-x-full"]');
            if (innerDrawer) innerDrawer.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        } else {
            // Open drawer
            this.drawer.classList.remove('invisible', 'opacity-0');
            const innerDrawer = this.drawer.querySelector('div[class*="translate-x-full"]');
            if (innerDrawer) innerDrawer.classList.remove('translate-x-full');
            document.body.classList.add('overflow-hidden');
            this.render();
        }
    }

    /**
     * Open the cart drawer
     */
    open() {
        if (!this.drawer || !this.drawer.classList.contains('invisible')) return;
        this.toggle();
    }

    /**
     * Render cart items in the drawer
     */
    render() {
        if (!this.itemsList) return;

        // Use service to get cart
        const cart = typeof cartService !== 'undefined' ? cartService.getCart() : [];

        this.itemsList.innerHTML = '';

        if (cart.length === 0) {
            this.itemsList.innerHTML = '<p class="text-left text-base text-black dark:text-gray-300 pt-2 px-1">Your cart is currently empty.</p>';
            if (this.bottomSection) this.bottomSection.classList.add('hidden');
            if (this.subtotalEl) this.subtotalEl.textContent = 'Rs. 0.00';
            return;
        }

        // Show bottom section if we have items
        if (this.bottomSection) this.bottomSection.classList.remove('hidden');

        let total = 0;

        cart.forEach((item) => {
            total += item.price * item.quantity;
            const itemHTML = `
                <div class="flex gap-4 mb-6">
                    <a href="product_detail.html?id=${item.id}" class="w-24 h-24 flex-shrink-0 border border-gray-200">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain p-1">
                    </a>
                    <div class="flex-1 flex flex-col items-start">
                         <a href="product_detail.html?id=${item.id}" class="text-sm font-medium uppercase text-black hover:text-gray-600 transition-colors block mb-1 tracking-wide">
                            ${item.name}
                        </a>
                        <div class="text-xs text-gray-500 mb-3">
                            ${item.color ? `<p class="mb-0.5"><span class='font-semibold'>Color:</span> ${item.color}</p>` : ''}
                            ${item.size ? `<p><span class='font-semibold'>Size:</span> ${item.size}</p>` : ''}
                        </div>

                         <div class="text-base font-normal text-black mb-3">
                            Rs. ${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>

                         <div class="flex items-center gap-4">
                             <div class="flex items-center border border-gray-200 bg-white rounded-sm h-8 w-24">
                                <button onclick="updateDrawerQuantity('${item.instanceId}', -1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">-</button>
                                <span class="flex-1 text-center text-sm font-medium h-full flex items-center justify-center">${item.quantity}</span>
                                <button onclick="updateDrawerQuantity('${item.instanceId}', 1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">+</button>
                             </div>
                             <button onclick="removeFromCart('${item.instanceId}', ${item.quantity})" class="text-xs underline text-gray-500 hover:text-black transition-colors">
                                Remove
                             </button>
                         </div>
                    </div>
                </div>
            `;
            this.itemsList.insertAdjacentHTML('beforeend', itemHTML);
        });

        if (this.subtotalEl) {
            this.subtotalEl.textContent = `Rs. ${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        }
    }

    /**
     * Update quantity of an item in the cart
     */
    updateQuantity(instanceId, change) {
        if (typeof cartService === 'undefined') return;

        // Determine new quantity check
        // Ideally service handles "decrease by 1", but typically updateQuantity takes new TOTAL quantity or we check current first.
        // Let's get current logic: change is +1 or -1.

        const cart = cartService.getCart();
        const item = cart.find(i => i.instanceId === instanceId);
        if (!item) return;

        const newQty = item.quantity + change;
        if (newQty > 0) {
            cartService.updateQuantity(instanceId, newQty);
        } else {
            // If <= 0, remove it? or do nothing? Standard is usually remove if explicitly passed 0, or min 1.
            // Service updateQuantity(qty < 1) sets it to 1.
            // We should call removeFromCart if we want to remove.
            // But the UI button usually stops at 1 or removes. 
            // Existing logic: "if (cart[itemIndex].quantity <= 0) { cart.splice... }"
            // Let's mirror that.
            if (change < 0 && item.quantity === 1) {
                // Asked to decrease from 1 -> remove
                cartService.removeFromCart(instanceId);
            } else {
                cartService.updateQuantity(instanceId, newQty);
            }
        }

        this.render();
    }

    /**
     * Remove item from cart
     */
    removeItem(instanceId, quantity) {
        if (typeof cartService !== 'undefined') {
            cartService.removeFromCart(instanceId);
            this.render();
        }
    }
}
