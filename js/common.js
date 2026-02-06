/**
 * Common JavaScript Functionality
 * Shared across index.html, product_list.html, and product_detail.html
 */

// ============================================
// CONSTANTS & CONFIGURATION
// Centralized configuration and magic strings
// ============================================
const CONFIG = {
    // Storage Keys
    STORAGE_KEYS: {
        CART: 'clothyfly_cart',
        USER: 'clothyfly_user',
        WISHLIST: 'clothyfly_wishlist',
        PENDING_WISHLIST: 'clothyfly_pending_wishlist'
    },

    // Element IDs
    IDS: {
        CART_DRAWER: 'cart-drawer',
        CART_DRAWER_ITEMS: 'cart-drawer-items',
        CART_DRAWER_BOTTOM: 'cart-drawer-bottom',
        CART_DRAWER_SUBTOTAL: 'cart-drawer-subtotal',
        CART_COUNT_BADGE: 'cart-count-badge',
        WISHLIST_COUNT_BADGE: 'wishlist-count-badge',
        MOBILE_WISHLIST_BADGE: 'mobile-wishlist-badge',
        COPYRIGHT_YEAR: 'copyright-year',
        SCROLL_TO_TOP: 'scroll-to-top',
        PROFILE_POPUP: 'profile-popup',
        MOBILE_MENU: 'mobile-menu',
        LOGIN_POPUP: 'login-popup',
        LOGIN_STEP_EMAIL: 'login-step-email',
        LOGIN_STEP_OTP: 'login-step-otp',
        LOGIN_STEP_CREATE_ACCOUNT: 'login-step-create-account'
    },

    // CSS Selectors
    SELECTORS: {
        CART_BADGES: '.cart-count-badge, #cart-count-badge',
        WISHLIST_BADGES: 'a[href="wishlist.html"] span.absolute',
        WISHLIST_BTN: '.wishlist-btn',
        LOGIN_BTN: 'button[onclick="toggleLoginPopup()"]',
        PROFILE_BTN: 'button[onclick="toggleProfilePopup()"]'
    },

    // CSS Classes
    CLASSES: {
        HIDDEN: 'hidden',
        INVISIBLE: 'invisible',
        OPACITY_0: 'opacity-0',
        OVERFLOW_HIDDEN: 'overflow-hidden',
        TRANSLATE_X_FULL: 'translate-x-full',
        TRANSLATE_Y_4: 'translate-y-4'
    },

    // Default Values
    DEFAULTS: {
        SIZE: 'M',
        COLOR: 'Default',
        SCROLL_THRESHOLD: 300
    }
};

// ============================================
// UTILITY: StorageManager
// Centralized localStorage management with error handling
// ============================================
class StorageManager {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
            return false;
        }
    }

    // Cart methods
    static getCart() {
        return this.get(CONFIG.STORAGE_KEYS.CART, []);
    }

    static saveCart(cart) {
        return this.set(CONFIG.STORAGE_KEYS.CART, cart);
    }

    // Wishlist methods
    static getWishlist() {
        return this.get(CONFIG.STORAGE_KEYS.WISHLIST, []);
    }

    static saveWishlist(wishlist) {
        return this.set(CONFIG.STORAGE_KEYS.WISHLIST, wishlist);
    }

    // User methods
    static getUser() {
        return this.get(CONFIG.STORAGE_KEYS.USER, null);
    }

    static saveUser(user) {
        return this.set(CONFIG.STORAGE_KEYS.USER, user);
    }

    static clearUser() {
        return this.remove(CONFIG.STORAGE_KEYS.USER);
    }

    static isLoggedIn() {
        return this.getUser() !== null;
    }

    // Pending wishlist (sessionStorage)
    static getPendingWishlist() {
        try {
            const item = sessionStorage.getItem(CONFIG.STORAGE_KEYS.PENDING_WISHLIST);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading pending wishlist:', error);
            return null;
        }
    }

    static savePendingWishlist(product) {
        try {
            sessionStorage.setItem(CONFIG.STORAGE_KEYS.PENDING_WISHLIST, JSON.stringify(product));
            return true;
        } catch (error) {
            console.error('Error saving pending wishlist:', error);
            return false;
        }
    }

    static clearPendingWishlist() {
        try {
            sessionStorage.removeItem(CONFIG.STORAGE_KEYS.PENDING_WISHLIST);
            return true;
        } catch (error) {
            console.error('Error clearing pending wishlist:', error);
            return false;
        }
    }
}

// ============================================
// UTILITY: DOMUtils
// Helper functions for common DOM operations
// ============================================
class DOMUtils {
    /**
     * Get element by selector (ID, class, or CSS selector)
     */
    static get(selector) {
        if (typeof selector === 'string') {
            return document.querySelector(selector);
        }
        return selector; // Already an element
    }

    /**
     * Get all elements matching selector
     */
    static getAll(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Show element(s)
     */
    static show(selector) {
        const elements = typeof selector === 'string' ? this.getAll(selector) : [selector];
        elements.forEach(el => {
            if (el) el.classList.remove('hidden', 'invisible', 'opacity-0');
        });
    }

    /**
     * Hide element(s)
     */
    static hide(selector) {
        const elements = typeof selector === 'string' ? this.getAll(selector) : [selector];
        elements.forEach(el => {
            if (el) el.classList.add('hidden');
        });
    }

    /**
     * Toggle element visibility
     */
    static toggle(selector) {
        const element = this.get(selector);
        if (!element) return;

        if (element.classList.contains('hidden')) {
            this.show(element);
        } else {
            this.hide(element);
        }
    }

    /**
     * Add class(es) to element
     */
    static addClass(selector, ...classes) {
        const element = this.get(selector);
        if (element) element.classList.add(...classes);
    }

    /**
     * Remove class(es) from element
     */
    static removeClass(selector, ...classes) {
        const element = this.get(selector);
        if (element) element.classList.remove(...classes);
    }

    /**
     * Toggle class on element
     */
    static toggleClass(selector, className) {
        const element = this.get(selector);
        if (element) element.classList.toggle(className);
    }

    /**
     * Check if element has class
     */
    static hasClass(selector, className) {
        const element = this.get(selector);
        return element ? element.classList.contains(className) : false;
    }

    /**
     * Set text content
     */
    static setText(selector, text) {
        const element = this.get(selector);
        if (element) element.textContent = text;
    }

    /**
     * Set HTML content
     */
    static setHTML(selector, html) {
        const element = this.get(selector);
        if (element) element.innerHTML = html;
    }

    /**
     * Get text content
     */
    static getText(selector) {
        const element = this.get(selector);
        return element ? element.textContent : '';
    }

    /**
     * Get HTML content
     */
    static getHTML(selector) {
        const element = this.get(selector);
        return element ? element.innerHTML : '';
    }
}

// ============================================
// MAIN CODE STARTS HERE
// ============================================


document.addEventListener("DOMContentLoaded", () => {
    // Dynamic Copyright Year - Using DOMUtils
    DOMUtils.setText('#copyright-year', new Date().getFullYear());

    // Scroll to Top Logic
    const scrollToTopBtn = document.getElementById("scroll-to-top");
    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove(
                    "opacity-0",
                    "invisible",
                    "translate-y-4",
                );
                scrollToTopBtn.classList.add("opacity-100", "visible", "translate-y-0");
            } else {
                scrollToTopBtn.classList.add("opacity-0", "invisible", "translate-y-4");
                scrollToTopBtn.classList.remove(
                    "opacity-100",
                    "visible",
                    "translate-y-0",
                );
            }
        });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Mobile Search Input Listener
    const mobileSearchInput = document.getElementById("mobile-search-input");
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                window.location.href =
                    "product_list.html?search=" + encodeURIComponent(e.target.value);
            }
        });
    }

    // Desktop Search Logic
    const desktopSearchInput = document.getElementById("search-input-field");
    const desktopSearchBtn = document.getElementById("search-btn-icon");

    if (desktopSearchInput) {
        desktopSearchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                window.location.href =
                    "product_list.html?search=" + encodeURIComponent(e.target.value);
            }
        });
    }

    // Check Wishlist UI on load
    checkWishlistUI();
    updateWishlistBadge();

    // Search Bar Highlight Logic
    const searchInput = document.getElementById("search-input-field");
    const searchBtn = document.getElementById("search-btn-icon");

    if (searchInput && searchBtn) {
        searchInput.addEventListener("input", () => {
            if (searchInput.value.trim() !== "") {
                // Highlight icon
                searchBtn.classList.remove("text-gray-500", "dark:text-gray-400");
                searchBtn.classList.add("text-black", "dark:text-white");
            } else {
                // Revert to default
                searchBtn.classList.add("text-gray-500", "dark:text-gray-400");
                searchBtn.classList.remove("text-black", "dark:text-white");
            }
        });
    }

    if (desktopSearchBtn && desktopSearchInput) {
        desktopSearchBtn.addEventListener("click", function () {
            window.location.href =
                "product_list.html?search=" +
                encodeURIComponent(desktopSearchInput.value);
        });
    }
});

// Event Delegation for Wishlist Buttons (handles both static and dynamic elements)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if (btn) {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation if wrapped in link

        // Extract data from attributes
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        const image = btn.dataset.image;
        const originalPrice = btn.dataset.originalPrice;
        const offer = btn.dataset.offer;
        const tag = btn.dataset.tag;

        if (id) {
            toggleWishlist({ id, name, price, image, originalPrice, offer, tag }, btn);
        }
    }
});

// Listen to wishlistUpdated event from wishlistService
window.addEventListener('wishlistUpdated', (event) => {
    // Update badge count
    updateWishlistBadge();

    // Update all heart icons on the current page
    checkWishlistUI();

    // If we're on the wishlist page, re-render the list
    if (typeof renderWishlist === 'function') {
        renderWishlist();
    }
});

// Mobile Menu Logic
function toggleMobileMenu() {
    const menu = DOMUtils.get("#mobile-menu-drawer");
    const btn = DOMUtils.get("#mobile-menu-btn");
    const icon = DOMUtils.get("#mobile-menu-icon");
    const stickyCartBar = DOMUtils.get("#sticky-cart-bar");

    const isOpen = menu && !DOMUtils.hasClass(menu, "-translate-x-full");

    if (isOpen) {
        // Close Menu
        if (menu) DOMUtils.addClass(menu, "-translate-x-full");
        DOMUtils.removeClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);

        // Show Sticky Cart (Product Detail Page specific, simplified check)
        if (stickyCartBar) DOMUtils.removeClass(stickyCartBar, CONFIG.CLASSES.HIDDEN);

        // Animate Icon to Menu
        if (btn) DOMUtils.removeClass(btn, "rotate-90");
        if (icon) icon.textContent = "menu";
    } else {
        // Open Menu
        if (menu) DOMUtils.removeClass(menu, "-translate-x-full");
        DOMUtils.addClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);

        // Hide Sticky Cart
        if (stickyCartBar) DOMUtils.addClass(stickyCartBar, CONFIG.CLASSES.HIDDEN);

        // Animate Icon to Close
        if (btn) DOMUtils.addClass(btn, "rotate-90");
        if (icon) icon.textContent = "close";
    }
}

function toggleMobileSubmenu(submenuId, chevronId) {
    const submenu = DOMUtils.get(`#${submenuId}`);
    const chevron = DOMUtils.get(`#${chevronId}`);

    if (submenu && submenu.classList.contains("hidden")) {
        DOMUtils.removeClass(submenu, CONFIG.CLASSES.HIDDEN);
        if (
            (chevronId.includes("products") || chevronId.includes("user")) &&
            chevron
        ) {
            chevron.style.transform = "rotate(180deg)";
        } else if (chevron) {
            chevron.innerText = "remove";
        }
    } else if (submenu) {
        DOMUtils.addClass(submenu, CONFIG.CLASSES.HIDDEN);
        if (
            (chevronId.includes("products") || chevronId.includes("user")) &&
            chevron
        ) {
            chevron.style.transform = "rotate(0deg)";
        } else if (chevron) {
            chevron.innerText = "add";
        }
    }
}

function toggleSearchModal() {
    const modal = DOMUtils.get("#search-modal");
    const input = DOMUtils.get("#mobile-search-input");

    if (!modal) return;

    const isOpen = !modal.classList.contains("translate-y-full");

    if (isOpen) {
        DOMUtils.addClass(modal, "translate-y-full");
        DOMUtils.removeClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
    } else {
        DOMUtils.removeClass(modal, "translate-y-full");
        DOMUtils.addClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
        if (input) setTimeout(() => input.focus(), 300);
    }
}

// --- Cart Logic (Shared) ---

// Initialize Cart Badge on Load
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
});

// Login Popup Logic
// Login Popup Logic - DEPRECATED
// Logic moved to AuthPopupManager (js/components/auth-popup.js)
// function injectLoginPopup() { ... }
// Smart Dispatcher: Called by Header Icon
function toggleLoginPopup() {
    // Check if user is already logged in
    if (typeof StorageManager !== 'undefined' && StorageManager.isLoggedIn()) {
        toggleProfilePopup();
        return;
    }

    // If AuthPopupManager is initialized, use it
    if (window.authPopupManager) {
        window.authPopupManager.open();
        return;
    }
    console.warn('AuthPopupManager not initialized');
}



// Cart functions now delegated to CartService and CartDrawerManager

function updateCartBadge() {
    // Determine count: prefer service, fallback to storage
    let count = 0;
    if (typeof cartService !== 'undefined') {
        count = cartService.getCartCount();
    } else {
        const cart = StorageManager.getCart();
        count = cart.reduce((acc, item) => acc + item.quantity, 0);
    }

    // Update all cart count badges using DOMUtils
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

// Listen for cart updates from service
window.addEventListener('cartUpdated', (e) => {
    updateCartBadge();
    // Also re-render drawer if open (handled in drawer manager normally, but good redundancy)
});

// Cart drawer functions are now handled by CartDrawerManager
// These remain as fallbacks if CartDrawerManager is not loaded
function renderCartDrawer() {
    if (window.cartDrawerManager) {
        window.cartDrawerManager.render();
    }
}

function updateDrawerQuantity(instanceId, change) {
    if (window.cartDrawerManager) {
        window.cartDrawerManager.updateQuantity(instanceId, change);
    }
}

function removeFromCart(instanceId, quantity) {
    if (window.cartDrawerManager) {
        window.cartDrawerManager.removeItem(instanceId, quantity);
    }
}

// Check Login State on Load
function checkLoginState() {
    const user = StorageManager.getUser();
    // Select the button by its onclick attribute
    const loginBtn = document.querySelector(
        'button[onclick="toggleLoginPopup()"]',
    );
    const loginIcon = loginBtn ? loginBtn.querySelector(".material-icons") : null;

    if (user && loginIcon) {
        // User is logged in
        loginIcon.textContent = "person";

        // Populate Profile Popup if it exists
        const initials = DOMUtils.get("#profile-initials");
        const name = DOMUtils.get("#profile-name");
        const email = DOMUtils.get("#profile-email");

        if (initials && name && email) {
            const firstName = user.firstname || user.name?.split(' ')[0] || '?';
            const lastName = user.lastname || user.name?.split(' ')[1] || '';

            initials.textContent = (
                (firstName[0] || '') + (lastName[0] || '')
            ).toUpperCase();

            name.textContent = `${firstName} ${lastName}`;
            email.textContent = user.email;
        }

        // Mobile Drawer: Show User View
        const mobileGuest = DOMUtils.get("#mobile-drawer-guest");
        const mobileUser = DOMUtils.get("#mobile-drawer-user");
        const mobileName = DOMUtils.get("#mobile-user-name");

        if (mobileGuest) DOMUtils.addClass(mobileGuest, CONFIG.CLASSES.HIDDEN);
        if (mobileUser) DOMUtils.removeClass(mobileUser, CONFIG.CLASSES.HIDDEN);

        if (mobileName) {
            const firstName = user.firstname || user.name?.split(' ')[0] || 'User';
            const lastName = user.lastname || user.name?.split(' ')[1] || '';
            mobileName.textContent = `${firstName} ${lastName}`;
        }
    } else {
        // User is not logged in
        if (loginIcon) loginIcon.textContent = "person_outline";

        // Mobile Drawer: Show Guest View
        const mobileGuest = document.getElementById("mobile-drawer-guest");
        const mobileUser = document.getElementById("mobile-drawer-user");

        if (mobileGuest) mobileGuest.classList.remove("hidden");
        if (mobileUser) mobileUser.classList.add("hidden");
    }
}

// --- Wishlist Logic ---

function toggleWishlist(product, btn) {
    // Check if wishlistService is available
    if (typeof wishlistService === 'undefined') {
        console.error('wishlistService is not loaded');
        return;
    }

    // Check if product is currently in wishlist
    const isInWishlist = wishlistService.isInWishlist(product.id);

    if (isInWishlist) {
        // Remove from wishlist
        const result = wishlistService.removeFromWishlist(product.id);

        if (result.success) {
            updateHeartIcon(btn, false);
        } else {
            console.error('Failed to remove from wishlist:', result.message);
        }
    } else {
        // Prepare product object for wishlist service
        const wishlistProduct = {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price) || 0,
            originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
            images: product.image ? [product.image] : []
        };

        // Add to wishlist
        const result = wishlistService.addToWishlist(wishlistProduct);

        if (result.success) {
            updateHeartIcon(btn, true);
        } else if (result.requiresLogin) {
            // User is not logged in - login popup will be shown by service
            toggleLoginPopup();
        } else {
            console.error('Failed to add to wishlist:', result.message);
        }
    }

    // Note: Badge update will be handled by wishlistUpdated event listener
}

function updateHeartIcon(btn, isFilled) {
    if (!btn) return;
    const icon = btn.querySelector(".material-icons");
    if (!icon) return;

    if (isFilled) {
        icon.textContent = "favorite";
        btn.classList.add("text-red-500");
        if (!btn.classList.contains("text-white")) {
            // Only remove black if it's not a white-text button (helper)
            // Actually, usually we toggle class but let's be safe
            btn.classList.remove("text-black");
            btn.classList.remove("text-gray-400"); // Mobile nav
        }
    } else {
        icon.textContent = "favorite_border";
        btn.classList.remove("text-red-500");
        // Restore default color - usually black or gray depending on context
        // This is tricky without knowing original class.
        // For simplicity, we assume generic card hearts are black on hover/active.
        // Let's check class list to decide.
        btn.classList.add("text-black");
    }
}

function checkWishlistUI() {
    if (typeof wishlistService === 'undefined') {
        console.error('wishlistService is not loaded');
        return;
    }

    const wishlist = wishlistService.getWishlist();
    const wishlistIds = wishlist.map(item => item.id);
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");

    wishlistBtns.forEach(btn => {
        const id = btn.dataset.id;
        if (wishlistIds.includes(id)) {
            updateHeartIcon(btn, true);
        } else {
            updateHeartIcon(btn, false);
        }
    });
}

function updateWishlistBadge() {
    if (typeof wishlistService === 'undefined') {
        console.error('wishlistService is not loaded');
        return;
    }

    const count = wishlistService.getWishlistCount();

    // Update all wishlist badge elements using DOMUtils
    DOMUtils.getAll('a[href="wishlist.html"] span.absolute').forEach(badge => {
        if (badge) {
            DOMUtils.setText(badge, count);
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    });
}

// Inject Profile Popup
function injectProfilePopup() {
    if (!document.getElementById("profile-popup")) {
        const popupHTML = `
            <div id="profile-popup" class="hidden absolute top-16 right-4 sm:right-16 z-50 w-72 bg-white dark:bg-card-dark rounded shadow-xl border border-gray-100 dark:border-gray-800 transition-all origin-top-right">
                <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div id="profile-initials" class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-black dark:text-white">
                        <!-- Initials -->
                    </div>
                    <div class="overflow-hidden">
                        <h3 id="profile-name" class="font-bold text-gray-900 dark:text-white truncate"><!-- Name --></h3>
                        <p id="profile-email" class="text-xs text-gray-500 truncate"><!-- Email --></p>
                    </div>
                </div>
                <div class="py-2">
                    <a href="profile.html" class="block px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Profile</a>
                    <a href="orders.html" class="block px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Orders</a>
                </div>
                <div class="py-2 border-t border-gray-100 dark:border-gray-800">
                     <button onclick="handleLogout()" class="w-full text-left px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Sign out</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", popupHTML);
    }
}

function toggleProfilePopup() {
    const popup = document.getElementById("profile-popup");
    if (!popup) return;

    if (popup.classList.contains("hidden")) {
        popup.classList.remove("hidden");
        // Close on click outside
        setTimeout(() => {
            document.addEventListener("click", closeProfilePopupOutside);
        }, 0);
    } else {
        popup.classList.add("hidden");
        document.removeEventListener("click", closeProfilePopupOutside);
    }
}

function closeProfilePopupOutside(e) {
    const popup = document.getElementById("profile-popup");
    const loginBtn = document.querySelector(
        'button[onclick="toggleLoginPopup()"]',
    ); // The trigger button

    // If click is NOT in popup AND NOT on the trigger button
    if (popup && !popup.contains(e.target) && !loginBtn.contains(e.target)) {
        popup.classList.add("hidden");
        document.removeEventListener("click", closeProfilePopupOutside);
    }
}

function handleLogout() {
    StorageManager.clearUser();
    checkLoginState(); // Reset Icon & Drawer

    // Explicitly Close Profile Popup
    const popup = document.getElementById("profile-popup");
    if (popup) {
        popup.classList.add("hidden");
        document.removeEventListener("click", closeProfilePopupOutside);
    }

    // Show toast if available
    if (window.Toast) {
        window.Toast.show('Logged out successfully', 'success');
    } else {
        console.log("Logged out");
    }

    // Page-specific Redirect Logic
    const currentPath = window.location.pathname;

    if (currentPath.includes('checkout.html')) {
        // Scenario A: Checkout -> Cart
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000); // Small delay for toast visibility
    } else {
        // Scenario B/C: All other pages -> Home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

/**
 * CHECKOUT ACTION HANDLER
 * Centralized function to handle checkout button clicks from any location
 * (Cart Drawer, Cart Page, etc.)
 * 
 * Flow:
 * 1. Check if user is logged in
 * 2. If logged in -> redirect to checkout.html
 * 3. If guest -> save redirect intent and open login popup
 */
function handleCheckoutAction() {
    console.log('[Checkout Action] Initiated');

    // Check if authService is available
    if (typeof authService === 'undefined') {
        console.error('[Checkout Action] authService not found');
        if (window.Toast) window.Toast.show('Unable to proceed to checkout. Please refresh the page.', 'error');
        return;
    }

    // Auth Check
    if (authService.isLoggedIn()) {
        // User is logged in - proceed directly to checkout
        console.log('[Checkout Action] User logged in, redirecting to checkout');
        window.location.href = 'checkout.html';
    } else {
        // Guest user - save redirect intent and open login popup
        console.log('[Checkout Action] Guest user, saving redirect intent and opening login popup');

        // Save post-login redirect intent
        sessionStorage.setItem('redirect_after_login', 'checkout.html');

        // Open login popup
        if (typeof window.authPopupManager !== 'undefined') {
            window.authPopupManager.open();
        } else {
            console.error('[Checkout Action] Auth popup manager not found');
            if (window.Toast) window.Toast.show('Please log in to continue to checkout', 'info');
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    injectProfilePopup();
    checkLoginState();
});
