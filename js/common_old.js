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
        CART: 'hoodvibe_cart',
        USER: 'hoodvibe_user',
        WISHLIST: 'hoodvibe_wishlist',
        PENDING_WISHLIST: 'hoodvibe_pending_wishlist'
    },

    // Element IDs
    IDS: {
        // Drawers & Popups
        CART_DRAWER: 'cart-drawer',
        CART_DRAWER_ITEMS: 'cart-drawer-items',
        CART_DRAWER_BOTTOM: 'cart-drawer-bottom',
        CART_DRAWER_SUBTOTAL: 'cart-drawer-subtotal',
        LOGIN_POPUP: 'login-popup',
        MOBILE_MENU: 'mobile-menu',
        PROFILE_POPUP: 'profile-popup',

        // Badges
        CART_COUNT_BADGE: 'cart-count-badge',
        WISHLIST_COUNT_BADGE: 'wishlist-count-badge',
        MOBILE_WISHLIST_BADGE: 'mobile-wishlist-badge',

        // Login Form - Steps
        LOGIN_STEP_EMAIL: 'login-step-email',
        LOGIN_STEP_OTP: 'login-step-otp',
        LOGIN_STEP_CREATE_ACCOUNT: 'login-step-create-account',

        // Login Form - Inputs
        LOGIN_EMAIL: 'login-email',
        LOGIN_OTP: 'login-otp',

        // Login Form - Error Messages
        LOGIN_EMAIL_ERROR: 'login-email-error',
        LOGIN_OTP_ERROR: 'login-otp-error',

        // Create Account Form - Inputs
        CREATE_ACCOUNT_FIRSTNAME: 'create-account-firstname',
        CREATE_ACCOUNT_LASTNAME: 'create-account-lastname',
        CREATE_ACCOUNT_EMAIL: 'create-account-email',

        // Create Account Form - Errors
        CREATE_ACCOUNT_FIRSTNAME_ERROR: 'create-account-firstname-error',
        CREATE_ACCOUNT_LASTNAME_ERROR: 'create-account-lastname-error',
        CREATE_ACCOUNT_EMAIL_ERROR: 'create-account-email-error',

        // OTP Display  
        OTP_EMAIL_DISPLAY: 'otp-email-display',
        OTP_BACK_BTN: 'otp-back-btn',

        // Search
        SEARCH_INPUT_FIELD: 'search-input-field',
        SEARCH_BTN_ICON: 'search-btn-icon',
        MOBILE_SEARCH_INPUT: 'mobile-search-input',

        // Other
        SCROLL_TO_TOP: 'scroll-to-top',
        COPYRIGHT_YEAR: 'copyright-year',
        MOBILE_DRAWER_GUEST: 'mobile-drawer-guest',
        MOBILE_DRAWER_USER: 'mobile-drawer-user'
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
// 3. Performance Utilities
// ============================================
/**
 * PerformanceUtils: Optimize event handlers
 */
class PerformanceUtils {
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    static throttle(func, limit = 100) {
        let inThrottle;
        return function (...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ============================================
// 4. Validator Utilities
// ============================================
/**
 * Validator: Form validation and error handling
 */
class Validator {
    /**
     * Email validation using standard regex
     */
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    }

    /**
     * Phone validation (Indian format: 10 digits starting with 6-9)
     */
    static isValidPhone(phone) {
        const cleaned = phone.replace(/\s+/g, '');
        const regex = /^[6-9]\d{9}$/;
        return regex.test(cleaned);
    }

    /**
     * OTP validation (6 digits)
     */
    static isValidOTP(otp) {
        const regex = /^\d{6}$/;
        return regex.test(otp.trim());
    }

    /**
     * Name validation (minimum 2 characters)
     */
    static isValidName(name) {
        return name.trim().length >= 2;
    }

    /**
     * Show error message on input field
     */
    static showError(input, message) {
        if (!input) return;

        // Add error styling
        input.classList.add('border-red-500', 'focus:ring-red-500');
        input.classList.remove('border-gray-300', 'focus:ring-black');

        // Create or update error message
        let errorEl = input.parentElement.querySelector('.validation-error');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.className = 'validation-error text-red-500 text-xs mt-1';
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    /**
     * Clear error message from input field
     */
    static clearError(input) {
        if (!input) return;

        // Remove error styling
        input.classList.remove('border-red-500', 'focus:ring-red-500');
        input.classList.add('border-gray-300', 'focus:ring-black');

        // Remove error message
        const errorEl = input.parentElement.querySelector('.validation-error');
        if (errorEl) errorEl.remove();
    }

    /**
     * Set loading state on button
     */
    static setLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Loading...';
            button.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
            button.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    /**
     * Auto-format phone number (digits only, max 10)
     */
    static formatPhone(input) {
        if (!input) return;
        input.value = input.value.replace(/\D/g, '').slice(0, 10);
    }

    /**
     * Auto-format OTP (digits only, max 6)
     */
    static formatOTP(input) {
        if (!input) return;
        input.value = input.value.replace(/\D/g, '').slice(0, 6);
    }
}

// ============================================
// 5. Constants Configuration
// ============================================


document.addEventListener("DOMContentLoaded", () => {
    // Dynamic Copyright Year - Using DOMUtils
    DOMUtils.setText('#copyright-year', new Date().getFullYear());

    // Scroll to Top Logic
    const scrollToTopBtn = DOMUtils.get(`#${CONFIG.IDS.SCROLL_TO_TOP}`);
    if (scrollToTopBtn) {
        window.addEventListener("scroll", PerformanceUtils.throttle(() => {
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
        }, 100), { passive: true });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Mobile Search Input - Enter Key Only
    const mobileSearchInput = DOMUtils.get(`#${CONFIG.IDS.MOBILE_SEARCH_INPUT}`);
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                const query = e.target.value.trim();
                if (query) {
                    window.location.href = "/product_list?search=" + encodeURIComponent(query);
                }
            }
        });
    }

    // Mobile Search Button Click Handler
    // Note: Using adjacent sibling selector to get the search button next to input, not the close button
    const mobileSearchBtn = document.querySelector('#mobile-search-input + button');
    if (mobileSearchBtn && mobileSearchInput) {
        mobileSearchBtn.addEventListener('click', function () {
            const query = mobileSearchInput.value.trim();
            if (query) {
                window.location.href = "/product_list?search=" + encodeURIComponent(query);
            }
        });
    }

    // Desktop Search Logic - Enter Key
    const desktopSearchInput = DOMUtils.get(`#${CONFIG.IDS.SEARCH_INPUT_FIELD}`);
    const desktopSearchBtn = DOMUtils.get(`#${CONFIG.IDS.SEARCH_BTN_ICON}`);

    if (desktopSearchInput) {
        desktopSearchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                const query = e.target.value.trim();
                if (query) {
                    window.location.href = "/product_list?search=" + encodeURIComponent(query);
                }
            }
        });
    }

    // Search Button Click Handler
    if (desktopSearchBtn && desktopSearchInput) {
        desktopSearchBtn.addEventListener("click", function () {
            const query = desktopSearchInput.value.trim();
            if (query) {
                window.location.href = "/product_list?search=" + encodeURIComponent(query);
            }
        });
    }
    if (loginEmailInput) {
        // Clear error as user types
        loginEmailInput.addEventListener('input', function () {
            if (this.value.trim().length > 0) {
                Validator.clearError(this);
            }
        });

        // Validate on blur
        loginEmailInput.addEventListener('blur', function () {
            const email = this.value.trim();
            if (email && !Validator.isValidEmail(email)) {
                Validator.showError(this, 'Please enter a valid email address');
            }
        });
    }

    // OTP validation
    const loginOTPInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`);
    if (loginOTPInput) {
        // Auto-format and clear errors
        loginOTPInput.addEventListener('input', function () {
            Validator.formatOTP(this);
            Validator.clearError(this);
        });

        // Validate on blur  
        loginOTPInput.addEventListener('blur', function () {
            if (this.value && !Validator.isValidOTP(this.value)) {
                Validator.showError(this, 'OTP must be 6 digits');
            }
        });
    }

    // Create account form validation
    const createFirstName = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_FIRSTNAME}`);
    const createLastName = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_LASTNAME}`);
    const createEmail = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_EMAIL}`);

    if (createFirstName) {
        createFirstName.addEventListener('input', function () {
            Validator.clearError(this);
        });
        createFirstName.addEventListener('blur', function () {
            if (!this.value.trim()) {
                Validator.showError(this, 'First name is required');
            } else if (!Validator.isValidName(this.value)) {
                Validator.showError(this, 'Name must be at least 2 characters');
            }
        });
    }

    if (createLastName) {
        createLastName.addEventListener('input', function () {
            Validator.clearError(this);
        });
        createLastName.addEventListener('blur', function () {
            if (!this.value.trim()) {
                Validator.showError(this, 'Last name is required');
            } else if (!Validator.isValidName(this.value)) {
                Validator.showError(this, 'Name must be at least 2 characters');
            }
        });
    }

    if (createEmail) {
        createEmail.addEventListener('input', function () {
            Validator.clearError(this);
        });
        createEmail.addEventListener('blur', function () {
            const email = this.value.trim();
            if (email && !Validator.isValidEmail(email)) {
                Validator.showError(this, 'Please enter a valid email address');
            }
        });
    }

    // Wishlist/Favorite Button Logic
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    wishlistBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
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
        });
    });

    // Check Wishlist UI on load
    checkWishlistUI();
    updateWishlistBadge();

    // Search Bar Highlight Logic
    const searchInput = DOMUtils.get(`#${CONFIG.IDS.SEARCH_INPUT_FIELD}`);
    const searchBtn = DOMUtils.get(`#${CONFIG.IDS.SEARCH_BTN_ICON}`);

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

// Initialize Cart and Popups on Load
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    injectLoginPopup();

    // Inject Search Modal if not present (Checking mobile search input wrapper exists to determine if we need it, or just inject if missing)
    // Actually search modal is usually in HTML, but cart drawer might be missing on some pages.

    // Inject Cart Drawer Markup if not present
    if (!document.getElementById("cart-drawer")) {
        const drawerHTML = `
           <div id="cart-drawer" class="fixed inset-0 z-50 invisible opacity-0 transition-opacity duration-300">
             <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="toggleCartDrawer()"></div>
             <div class="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-card-dark shadow-2xl transform transition-transform duration-300 translate-x-full flex flex-col">
                 <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                     <h2 class="font-display text-xl font-medium">Shopping Cart</h2>
                     <button onclick="toggleCartDrawer()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
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
});

// Login Popup Logic
function injectLoginPopup() {
    if (!DOMUtils.get(`#${CONFIG.IDS.LOGIN_POPUP}`)) {
        const popupHTML = `
            <div id="login-popup" class="fixed inset-0 z-[60] invisible opacity-0 transition-opacity duration-300">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="toggleLoginModal()"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-card-dark p-8 rounded-lg shadow-2xl">
                    <button onclick="toggleLoginModal()" class="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                        <span class="material-icons">close</span>
                    </button>
                    <div id="login-step-email">
                        <div class="text-center mb-8">
                            <img src="images/Clothyfly-dark.svg" alt="Clothyfly" class="h-8 mx-auto mb-4 dark:invert" />
                            <h2 class="text-xl font-bold mb-1 dark:text-white">Sign in</h2>
                            <p class="text-gray-500 dark:text-gray-400 text-sm">Sign in or create an account</p>
                        </div>
                        <form class="space-y-4" onsubmit="handleLoginSubmit(event)">
                            <div>
                                <input id="login-email" type="text" placeholder="Email" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="login-email-error" class="hidden text-red-600 text-sm mt-1 text-left">Enter a valid email address</p>
                            </div>
                            <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Continue</button>
                        </form>
                        <div class="relative my-8">
                            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
                            <div class="relative flex justify-center text-sm"><span class="px-4 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400">or</span></div>
                        </div>
                        <div class="space-y-3">
                            <button onclick="switchToCreateAccount()" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Create Account</button>
                            <button class="w-full border border-black dark:border-white text-black dark:text-white font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                                 <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                 </svg>
                                 Sign in with Google
                            </button>
                        </div>
                        <div class="mt-8 text-center text-xs text-gray-400">
                            By continuing, you agree to our <a href="#" class="underline hover:text-black dark:hover:text-white">Terms of Service</a> & <a href="#" class="underline hover:text-black dark:hover:text-white">Privacy Policy</a>
                        </div>
                    </div>

                    <!-- OTP Step -->
                    <div id="login-step-otp" class="hidden">
                         <div class="text-center mb-8">
                            <img src="images/Clothyfly-dark.svg" alt="Clothyfly" class="h-8 mx-auto mb-4 dark:invert" />
                            <h2 class="text-xl font-bold mb-1 dark:text-white text-left">Enter code</h2>
                            <p class="text-gray-500 dark:text-gray-400 text-sm text-left">Sent to <span id="otp-email-display"></span></p>
                        </div>
                        <form class="space-y-4" onsubmit="handleOtpSubmit(event)">
                            <div>
                                <input id="login-otp" type="text" placeholder="6-digit code" maxlength="6" oninput="this.value = this.value.replace(/[^0-9]/g, '')" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="login-otp-error" class="hidden text-red-600 text-sm mt-1 text-left">Enter the correct 6-digit code</p>
                            </div>
                            <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Submit</button>
                        </form>
                        <div class="mt-4 text-left">
                            <button id="otp-back-btn" onclick="switchBackToEmail()" class="text-black dark:text-white hover:underline text-sm font-medium">Sign in with a different email</button>
                        </div>
                    </div>

                    <!-- Create Account Step -->
                    <div id="login-step-create-account" class="hidden">
                        <div class="text-center mb-6">
                            <img src="images/Clothyfly-dark.svg" alt="Clothyfly" class="h-8 mx-auto mb-4 dark:invert" />
                            <h2 class="text-xl font-bold mb-1 dark:text-white">Create Account</h2>
                            <p class="text-gray-500 dark:text-gray-400 text-sm">create an account or sign in</p>
                        </div>
                        <form class="space-y-4" onsubmit="handleCreateAccountSubmit(event)">
                            <div>
                                <input id="create-account-firstname" type="text" placeholder="First name" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="create-account-firstname-error" class="hidden text-red-600 text-sm mt-1 text-left">First name is required</p>
                            </div>
                            <div>
                                <input id="create-account-lastname" type="text" placeholder="Last name" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="create-account-lastname-error" class="hidden text-red-600 text-sm mt-1 text-left">Last name is required</p>
                            </div>
                            <div>
                                <input id="create-account-email" type="text" placeholder="Email" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="create-account-email-error" class="hidden text-red-600 text-sm mt-1 text-left">Enter a valid email address</p>
                            </div>
                            <button type="submit" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Create Account</button>
                        </form>
                        <div class="relative my-6">
                            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
                            <div class="relative flex justify-center text-sm"><span class="px-4 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400">or</span></div>
                        </div>
                        <div class="space-y-3">
                            <button onclick="switchToLogin()" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Login</button>
                            <button class="w-full border border-black dark:border-white text-black dark:text-white font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                        <div class="mt-6 text-center text-xs text-gray-400">
                            By continuing, you agree to our <a href="#" class="underline hover:text-black dark:hover:text-white">Terms of Service</a> & <a href="#" class="underline hover:text-black dark:hover:text-white">Privacy Policy</a>
                        </div>
                    </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", popupHTML);
    }
}

function handleCreateAccountSubmit(event) {
    event.preventDefault();
    const firstNameInput = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_FIRSTNAME}`);
    const lastNameInput = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_LASTNAME}`);
    const emailInput = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_EMAIL}`);

    const firstNameError = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_FIRSTNAME_ERROR}`);
    const lastNameError = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_LASTNAME_ERROR}`);
    const emailError = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_EMAIL_ERROR}`);

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    // Validate First Name
    if (!firstName) {
        DOMUtils.addClass(firstNameInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.removeClass(firstNameInput, "focus:ring-black");
        DOMUtils.removeClass(firstNameError, CONFIG.CLASSES.HIDDEN);
        isValid = false;
    } else {
        DOMUtils.removeClass(firstNameInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.addClass(firstNameInput, "focus:ring-black");
        DOMUtils.addClass(firstNameError, CONFIG.CLASSES.HIDDEN);
    }

    // Validate Last Name
    if (!lastName) {
        DOMUtils.addClass(lastNameInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.removeClass(lastNameInput, "focus:ring-black");
        DOMUtils.removeClass(lastNameError, CONFIG.CLASSES.HIDDEN);
        isValid = false;
    } else {
        DOMUtils.removeClass(lastNameInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.addClass(lastNameInput, "focus:ring-black");
        DOMUtils.addClass(lastNameError, CONFIG.CLASSES.HIDDEN);
    }

    // Validate Email
    if (!email || !emailRegex.test(email)) {
        DOMUtils.addClass(emailInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.removeClass(emailInput, "focus:ring-black");
        DOMUtils.removeClass(emailError, CONFIG.CLASSES.HIDDEN);
        isValid = false;
    } else {
        DOMUtils.removeClass(emailInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.addClass(emailInput, "focus:ring-black");
        DOMUtils.addClass(emailError, CONFIG.CLASSES.HIDDEN);
    }

    if (isValid) {
        // Proceed with account creation logic here
        // Switch to OTP Step
        document
            .getElementById("login-step-create-account")
            .classList.add("hidden");
        document.getElementById("login-step-otp").classList.remove("hidden");
        document.getElementById("otp-email-display").textContent = email;
        //OTP UI Reset
        document.getElementById("login-otp-error").classList.add("hidden");
        document
            .getElementById("login-otp")
            .classList.remove("border-red-600", "focus:ring-red-600");
        document
            .getElementById("login-otp")
            .classList.add("focus:ring-black", "border-gray-300");
        document.getElementById("login-otp").value = "";

        // Update Back Button for Create Account
        const backBtn = document.getElementById("otp-back-btn");
        if (backBtn) {
            backBtn.textContent = "Sign up with a different email";
            backBtn.onclick = () => switchToCreateAccount(true);
        }
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const emailInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL}`);
    const errorMsg = DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL_ERROR}`);
    const email = emailInput.value.trim();

    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        // Show Error
        DOMUtils.addClass(emailInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.removeClass(emailInput, "focus:ring-black");
        DOMUtils.removeClass(errorMsg, CONFIG.CLASSES.HIDDEN);
    } else {
        // Hide Error
        DOMUtils.removeClass(emailInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.addClass(emailInput, "focus:ring-black");
        DOMUtils.addClass(errorMsg, CONFIG.CLASSES.HIDDEN);

        // Switch to OTP Step
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_EMAIL}`), CONFIG.CLASSES.HIDDEN);
        DOMUtils.removeClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_OTP}`), CONFIG.CLASSES.HIDDEN);
        DOMUtils.setText(`#${CONFIG.IDS.OTP_EMAIL_DISPLAY}`, email);

        //OTP UI Reset
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP_ERROR}`), CONFIG.CLASSES.HIDDEN);
        DOMUtils.removeClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`), "border-red-600", "focus:ring-red-600");
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`), "focus:ring-black", "border-gray-300");
        DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`).value = "";

        // Reset Back Button to Default (Login)
        const backBtn = DOMUtils.get(`#${CONFIG.IDS.OTP_BACK_BTN}`);
        if (backBtn) {
            backBtn.textContent = "Sign in with a different email";
            backBtn.onclick = switchBackToEmail;
        }
    }
}

function handleOtpSubmit(event) {
    event.preventDefault();
    const otpInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`);
    const errorMsg = DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP_ERROR}`);
    const otp = otpInput.value.trim();

    // Check if OTP is exactly 6 digits
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        // Show Error
        DOMUtils.addClass(otpInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.removeClass(otpInput, "focus:ring-black");
        DOMUtils.removeClass(errorMsg, CONFIG.CLASSES.HIDDEN);
    } else {
        // Hide Error
        DOMUtils.removeClass(otpInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.addClass(otpInput, "focus:ring-black");
        DOMUtils.addClass(errorMsg, CONFIG.CLASSES.HIDDEN);

        // Simulate OTP verification & Login
        const mockUser = {
            firstname: "Rohit",
            lastname: "Kardani",
            email: "kardanirohit9@gmail.com",
        };
        StorageManager.saveUser(mockUser);
        console.log("User logged in:", mockUser);
        checkLoginState(); // Update Header Icon

        // Check for pending wishlist item
        const pendingWishlist = StorageManager.getPendingWishlist();
        if (pendingWishlist) {
            try {
                toggleWishlist(pendingWishlist, null); // Add to wishlist (btn is null, but checkWishlistUI handles icons)
                StorageManager.clearPendingWishlist();
            } catch (e) {
                console.error("Error processing pending wishlist item", e);
            }
        }

        toggleLoginModal(); // Close popup
        // Reset after transition
        setTimeout(() => {
            switchBackToEmail();
            otpInput.value = ""; // Clear OTP
        }, 300);
    }
}

function switchBackToEmail() {
    DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_OTP}`), CONFIG.CLASSES.HIDDEN);
    DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_CREATE_ACCOUNT}`), CONFIG.CLASSES.HIDDEN);
    DOMUtils.removeClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_EMAIL}`), CONFIG.CLASSES.HIDDEN);
}

function resetCreateAccountForm() {
    const caFields = ["firstname", "lastname", "email"];
    caFields.forEach((field) => {
        const input = DOMUtils.get(`#create-account-${field}`);
        const error = DOMUtils.get(`#create-account-${field}-error`);
        if (input && error) {
            input.value = "";
            DOMUtils.removeClass(input, "border-red-600", "focus:ring-red-600");
            DOMUtils.addClass(input, "focus:ring-black", "border-gray-300");
            DOMUtils.addClass(error, CONFIG.CLASSES.HIDDEN);
        }
    });
}

function switchToCreateAccount(keepData = false) {
    DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_EMAIL}`), CONFIG.CLASSES.HIDDEN);
    DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_OTP}`), CONFIG.CLASSES.HIDDEN);
    DOMUtils.removeClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_CREATE_ACCOUNT}`), CONFIG.CLASSES.HIDDEN);
    if (!keepData) {
        resetCreateAccountForm();
    }
}

function switchToLogin() {
    switchBackToEmail();
    resetLoginPopupUI();
}

function resetLoginPopupUI() {
    DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`).value = "";
    DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL}`).value = "";
    DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL_ERROR}`), CONFIG.CLASSES.HIDDEN);
    DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP_ERROR}`), CONFIG.CLASSES.HIDDEN);

    const loginOtpInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`);
    DOMUtils.removeClass(loginOtpInput, "border-red-600", "focus:ring-red-600");
    DOMUtils.addClass(loginOtpInput, "focus:ring-black", "border-gray-300");

    const loginEmailInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL}`);
    DOMUtils.removeClass(loginEmailInput, "border-red-600", "focus:ring-red-600");
    DOMUtils.addClass(loginEmailInput, "focus:ring-black", "border-gray-300");

    // Reset Create Account UI (reusing logic implicitly by ensuring clean state)
    // For cleaner code, we can call switchToCreateAccount reset logic here if extracted,
    // but effectively we just need to ensure fields are clean.
    // Since switchToCreateAccount is called on switch, we just need to ensure resetting the popup also resets these fields.

    // We can also extract this to a function if needed, but for now duplicating the short loop or relying on switch logic is fine.
    // Let's duplicate the reset loop here to ensure it's cleared on popup close too.
    const caFields = ["firstname", "lastname", "email"];
    caFields.forEach((field) => {
        const input = document.getElementById(`create-account-${field}`);
        const error = document.getElementById(`create-account-${field}-error`);
        if (input && error) {
            input.value = "";
            input.classList.remove("border-red-600", "focus:ring-red-600");
            input.classList.add("focus:ring-black", "border-gray-300");
            error.classList.add("hidden");
        }
    });
}

// Smart Dispatcher: Called by Header Icon
function toggleLoginPopup() {
    const user = localStorage.getItem("hoodvibe_user");
    if (user) {
        toggleProfilePopup();
    } else {
        toggleLoginModal();
    }
}

// Dumb Visibility Toggle: Called by Internal Interactions (Close Btn, OTP Success)
function toggleLoginModal() {
    const popup = DOMUtils.get(`#${CONFIG.IDS.LOGIN_POPUP}`);
    if (popup) {
        if (DOMUtils.hasClass(popup, CONFIG.CLASSES.INVISIBLE)) {
            // Opening
            resetLoginPopupUI();
            switchBackToEmail();
            DOMUtils.removeClass(popup, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
            DOMUtils.addClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
        } else {
            // Closing
            DOMUtils.addClass(popup, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
            DOMUtils.removeClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
        }
    }
}

function toggleCartDrawer() {
    const drawer = DOMUtils.get(`#${CONFIG.IDS.CART_DRAWER}`);
    if (drawer) {
        if (DOMUtils.hasClass(drawer, CONFIG.CLASSES.INVISIBLE)) {
            DOMUtils.removeClass(drawer, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
            const innerDrawer = drawer.querySelector('div[class*="translate-x-full"]');
            if (innerDrawer) DOMUtils.removeClass(innerDrawer, CONFIG.CLASSES.TRANSLATE_X_FULL);
            DOMUtils.addClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
            renderCartDrawer();
        } else {
            DOMUtils.addClass(drawer, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
            const innerDrawer = drawer.querySelector('div[class*="translate-x-full"]');
            if (innerDrawer) DOMUtils.addClass(innerDrawer, CONFIG.CLASSES.TRANSLATE_X_FULL);
            DOMUtils.removeClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
        }
    }
}

function addToCart(product) {
    // Using StorageManager - automatic error handling!
    let cart = StorageManager.getCart();

    // Create unique instance ID based on product ID + options
    // (so same product with different sizes are different items)
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

    // Using StorageManager - returns true/false for success
    StorageManager.saveCart(cart);
    updateCartBadge();


    // Always render cart to refresh contents
    renderCartDrawer();

    // Open drawer if it's currently closed
    const drawer = DOMUtils.get(`#${CONFIG.IDS.CART_DRAWER}`);
    if (drawer && drawer.classList.contains("invisible")) {
        toggleCartDrawer();
    }
}

function updateCartBadge() {
    const cart = StorageManager.getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);

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

function renderCartDrawer() {
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

    // If we have items, show the bottom section
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
                            <button onclick="updateDrawerQuantity('${item.instanceId}', -1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">-</button>
                            <span class="flex-1 text-center text-sm font-medium h-full flex items-center justify-center">${item.quantity}</span>
                            <button onclick="updateDrawerQuantity('${item.instanceId}', 1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">+</button>
                         </div>
                         <button onclick="removeFromCart('${item.instanceId}', -${item.quantity})" class="text-xs underline text-gray-500 hover:text-black transition-colors">
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

function updateDrawerQuantity(instanceId, change) {
    let cart = StorageManager.getCart();
    const itemIndex = cart.findIndex((item) => item.instanceId === instanceId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) cart[itemIndex].quantity = 1;

        StorageManager.saveCart(cart);
        renderCartDrawer();
        updateCartBadge();
        // Also update full cart if open
        if (typeof renderFullCart === "function") renderFullCart();
    }
}

function removeFromCart(instanceId, change) {
    let cart = StorageManager.getCart();
    const itemIndex = cart.findIndex((item) => item.instanceId === instanceId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) {
            // Remove item if quantity goes to 0? Or keep at 1? Usually remove or keep 1.
            // Let's remove for better UX in drawer
            cart.splice(itemIndex, 1);
        }

        StorageManager.saveCart(cart);
        renderCartDrawer();
        updateCartBadge();
        // Also update full cart if open
        if (typeof renderFullCart === "function") renderFullCart();
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
            initials.textContent = (
                user.firstname[0] + user.lastname[0]
            ).toUpperCase();
            name.textContent = `${user.firstname} ${user.lastname}`;
            email.textContent = user.email;
        }

        // Mobile Drawer: Show User View
        const mobileGuest = DOMUtils.get("#mobile-drawer-guest");
        const mobileUser = DOMUtils.get("#mobile-drawer-user");
        const mobileName = DOMUtils.get("#mobile-user-name");

        if (mobileGuest) DOMUtils.addClass(mobileGuest, CONFIG.CLASSES.HIDDEN);
        if (mobileUser) DOMUtils.removeClass(mobileUser, CONFIG.CLASSES.HIDDEN);

        if (mobileName)
            mobileName.textContent = `${user.firstname} ${user.lastname}`;
    } else {
        // User is not logged in
        if (loginIcon) loginIcon.textContent = "person_outline";

        // Mobile Drawer: Show Guest View
        const mobileGuest = DOMUtils.get(`#${CONFIG.IDS.MOBILE_DRAWER_GUEST}`);
        const mobileUser = DOMUtils.get(`#${CONFIG.IDS.MOBILE_DRAWER_USER}`);

        if (mobileGuest) mobileGuest.classList.remove("hidden");
        if (mobileUser) mobileUser.classList.add("hidden");
    }
}

// --- Wishlist Logic ---

function toggleWishlist(product, btn) {
    // Check if user is logged in
    const user = StorageManager.getUser();
    if (!user) {
        // Not logged in: Store intent and show login popup
        StorageManager.savePendingWishlist(product);
        toggleLoginModal();
        return;
    }

    let wishlist = StorageManager.getWishlist();
    const index = wishlist.findIndex((item) => item.id === product.id);

    if (index > -1) {
        // Remove
        wishlist.splice(index, 1);
        updateHeartIcon(btn, false);
    } else {
        // Add
        wishlist.push(product);
        updateHeartIcon(btn, true);
    }

    StorageManager.saveWishlist(wishlist);
    updateWishlistBadge();
    checkWishlistUI(); // Update other buttons for same product if any
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
    let wishlist = StorageManager.getWishlist();
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
    const wishlist = StorageManager.getWishlist();
    const count = wishlist.length;

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

    // Ideally redirect to home or show toast
    console.log("Logged out");
}

document.addEventListener("DOMContentLoaded", () => {
    injectProfilePopup();
    checkLoginState();
});
