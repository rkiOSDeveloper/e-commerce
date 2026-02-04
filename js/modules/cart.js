/**
 * Cart Module
 * Handles shopping cart drawer, add/remove items, badge updates
 */

import { CONFIG } from '../utils/config.js';
import { StorageManager } from '../utils/storage.js';
import { DOMUtils } from '../utils/dom.js';

/**
 * Cart Manager Class
 */
export class CartManager {
    /**
     * Initialize cart drawer in DOM if not present
     */
    static injectCartDrawer() {
        if (!document.getElementById("cart-drawer")) {
            const drawerHTML = `
               <div id="cart-drawer" class="fixed inset-0 z-50 invisible opacity-0 transition-opacity duration-300">
                 <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="window.cartManager.toggle()"></div>
                 <div class="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-card-dark shadow-2xl transform transition-transform duration-300 translate-x-full flex flex-col">
                     <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                         <h2 class="font-display text-xl font-medium">Shopping Cart</h2>
                         <button onclick="window.cartManager.toggle()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                             <span class="material-icons">close</span>
                         </button>
                     </div>
                     <div class="flex-1 overflow-y-auto p-4" id="cart-drawer-items">
                         <!-- Cart Items -->
                     </div>
                     <div id="cart-drawer-bottom" class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-card-dark">
                         <div class="flex justify-between items-center ">
                             <span class="text-lg font-medium">Subtotal</span>
                             <span id="cart-drawer-subtotal" class="text-lg font-bold">Rs. 0.00</span>
                         </div>
                         <p class="text-xs text-gray-500 mb-6">Taxes and shipping calculated at checkout</p>
                         <button class="block w-full py-3 bg-primary text-white font-medium hover:opacity-90 transition-opacity rounded uppercase tracking-wide mb-3">Check Out</button>
                         <a href="cart.html" class="block w-full text-center text-sm underline text-black dark:text-white hover:text-gray-600 transition-colors">View Cart</a>
                     </div>
                 </div>
              </div>
            `;
            document.body.insertAdjacentHTML("beforeend", drawerHTML);
        }
    }

    /**
     * Toggle cart drawer visibility
     */
    static toggle() {
        const drawer = DOMUtils.get(`#${CONFIG.IDS.CART_DRAWER}`);
        if (drawer) {
            if (DOMUtils.hasClass(drawer, CONFIG.CLASSES.INVISIBLE)) {
                DOMUtils.removeClass(drawer, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
                const innerDrawer = drawer.querySelector('div[class*="translate-x-full"]');
                if (innerDrawer) DOMUtils.removeClass(innerDrawer, CONFIG.CLASSES.TRANSLATE_X_FULL);
                DOMUtils.addClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
                this.render();
            } else {
                DOMUtils.addClass(drawer, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
                const innerDrawer = drawer.querySelector('div[class*="translate-x-full"]');
                if (innerDrawer) DOMUtils.addClass(innerDrawer, CONFIG.CLASSES.TRANSLATE_X_FULL);
                DOMUtils.removeClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
            }
        }
    }

    /**
     * Add product to cart
     */
    static addToCart(product) {
        let cart = StorageManager.getCart();

        // Create unique instance ID based on product ID + options
        const instanceId = `${product.id}-${product.size || "M"}-${product.color || "Default"}`;

        const existingItemIndex = cart.findIndex(
            (item) => item.instanceId === instanceId,
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                ...product,
                instanceId,
                quantity: 1,
            });
        }

        StorageManager.saveCart(cart);
        this.updateBadge();
        this.render();

        // Open drawer if it's currently closed
        const drawer = DOMUtils.get(`#${CONFIG.IDS.CART_DRAWER}`);
        if (drawer && drawer.classList.contains("invisible")) {
            this.toggle();
        }
    }

    /**
     * Update cart badge count
     */
    static updateBadge() {
        const cart = StorageManager.getCart();
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);

        // Update all cart count badges
        DOMUtils.getAll('.cart-count-badge, #cart-count-badge').forEach((badge) => {
            if (badge) {
                DOMUtils.setText(badge, count);
                if (count > 0) {
                    DOMUtils.show(badge);
                } else {
                    DOMUtils.hide(badge);
                }
            }
        });
    }

    /**
     * Render cart drawer contents
     */
    static render() {
        const list = DOMUtils.get(`#${CONFIG.IDS.CART_DRAWER_ITEMS}`);
        const bottomSection = DOMUtils.get(`#${CONFIG.IDS.CART_DRAWER_BOTTOM}`);
        const subtotalEl = DOMUtils.get(`#${CONFIG.IDS.CART_DRAWER_SUBTOTAL}`);

        if (!list) return;

        const cart = StorageManager.getCart();
        list.innerHTML = "";

        if (cart.length === 0) {
            list.innerHTML =
                '<p class="text-left text-base text-black dark:text-gray-300 pt-2 px-1">Your cart is currently empty.</p>';
            if (bottomSection) DOMUtils.addClass(bottomSection, CONFIG.CLASSES.HIDDEN);
            if (subtotalEl) subtotalEl.textContent = "Rs. 0.00";
            return;
        }

        // Show bottom section if we have items
        if (bottomSection) DOMUtils.removeClass(bottomSection, CONFIG.CLASSES.HIDDEN);

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
                            ${item.color ? `<p class="mb-0.5"><span class='font-semibold'>Color:</span> ${item.color}</p>` : ""}
                            ${item.size ? `<p><span class='font-semibold'>Size:</span> ${item.size}</p>` : ""}
                        </div>

                         <div class="text-base font-normal text-black mb-3">
                            Rs. ${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                         </div>

                         <div class="flex items-center gap-4">
                             <div class="flex items-center border border-gray-200 bg-white rounded-sm h-8 w-24">
                                <button onclick="window.cartManager.updateQuantity('${item.instanceId}', -1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">-</button>
                                <span class="flex-1 text-center text-sm font-medium h-full flex items-center justify-center">${item.quantity}</span>
                                <button onclick="window.cartManager.updateQuantity('${item.instanceId}', 1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">+</button>
                             </div>
                             <button onclick="window.cartManager.removeItem('${item.instanceId}')" class="text-xs underline text-gray-500 hover:text-black transition-colors">
                                Remove
                             </button>
                         </div>
                    </div>
                </div>
            `;
            list.insertAdjacentHTML("beforeend", itemHTML);
        });

        if (subtotalEl) {
            subtotalEl.textContent = `Rs. ${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
        }
    }

    /**
     * Update quantity of cart item
     */
    static updateQuantity(instanceId, change) {
        let cart = StorageManager.getCart();
        const itemIndex = cart.findIndex((item) => item.instanceId === instanceId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity < 1) cart[itemIndex].quantity = 1;

            StorageManager.saveCart(cart);
            this.render();
            this.updateBadge();
            // Also update full cart if open
            if (typeof window.renderFullCart === "function") window.renderFullCart();
        }
    }

    /**
     * Remove item from cart
     */
    static removeItem(instanceId) {
        let cart = StorageManager.getCart();
        const itemIndex = cart.findIndex((item) => item.instanceId === instanceId);

        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
            StorageManager.saveCart(cart);
            this.render();
            this.updateBadge();
            // Also update full cart if open
            if (typeof window.renderFullCart === "function") window.renderFullCart();
        }
    }

    /**
     * Initialize cart on page load
     */
    static init() {
        this.injectCartDrawer();
        this.updateBadge();
    }
}

// Make globally accessible for onclick handlers
window.cartManager = CartManager;

// Legacy function exports for backward compatibility
export function toggleCartDrawer() {
    CartManager.toggle();
}

export function addToCart(product) {
    CartManager.addToCart(product);
}

export function updateCartBadge() {
    CartManager.updateBadge();
}

export function renderCartDrawer() {
    CartManager.render();
}

export function updateDrawerQuantity(instanceId, change) {
    CartManager.updateQuantity(instanceId, change);
}

export function removeFromCart(instanceId) {
    CartManager.removeItem(instanceId);
}
