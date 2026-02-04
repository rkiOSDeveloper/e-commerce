/**
 * Common JavaScript Functionality - Phase 6 Cleaned
 * Shared utilities + thin wrappers that delegate to modules
 */

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

// ============================================
// THIN WRAPPERS FOR ONCLICK HANDLERS
// These delegate to module functionality
// ============================================

// Menu Wrappers
function toggleMobileMenu() {
    if (window.MenuManager) {
        window.MenuManager.toggleMobileMenu();
    }
}

function toggleMobileSubmenu(submenuId, chevronId) {
    if (window.MenuManager) {
        window.MenuManager.toggleSubmenu(submenuId, chevronId);
    }
}

function toggleSearchModal() {
    if (window.MenuManager) {
        window.MenuManager.toggleSearchModal();
    }
}

// Cart Wrappers
function toggleCartDrawer() {
    if (window.CartManager) {
        window.CartManager.toggle();
    }
}

function addToCart(product) {
    if (window.CartManager) {
        window.CartManager.addToCart(product);
    }
}

function removeFromCart(instanceId) {
    if (window.CartManager) {
        window.CartManager.removeFromCart(instanceId);
    }
}

function renderCartDrawer() {
    if (window.CartManager) {
        window.CartManager.renderDrawer();
    }
}

function updateCartBadge() {
    if (window.CartManager) {
        window.CartManager.updateCartBadge();
    } else {
        // Fallback for pages without modules
        const cart = StorageManager.getCart();
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count-badge, #cart-count-badge').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
}

// Wishlist Wrappers
function toggleWishlist(product, btn) {
    if (window.WishlistManager) {
        window.WishlistManager.toggle(product, btn);
    }
}

function checkWishlistUI() {
    if (window.WishlistManager) {
        window.WishlistManager.checkUI();
    }
}

function updateWishlistBadge() {
    if (window.WishlistManager) {
        window.WishlistManager.updateBadge();
    } else {
        // Fallback for pages without modules
        const wishlist = StorageManager.getWishlist();
        const count = wishlist.length;
        document.querySelectorAll('a[href="wishlist.html"] span.absolute').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
}

// Login Wrappers
function toggleLoginPopup() {
    if (window.LoginManager) {
        window.LoginManager.toggleLoginPopup();
    }
}

// Alias for compatibility
const toggleLoginModal = toggleLoginPopup;

function handleLoginSubmit(event) {
    if (window.LoginManager) {
        window.LoginManager.handleLoginSubmit(event);
    }
}

function handleOtpSubmit(event) {
    if (window.LoginManager) {
        window.LoginManager.handleOtpSubmit(event);
    }
}

function handleCreateAccountSubmit(event) {
    if (window.LoginManager) {
        window.LoginManager.handleCreateAccountSubmit(event);
    }
}

function switchToCreateAccount() {
    if (window.LoginManager) {
        window.LoginManager.switchToCreateAccount();
    }
}

function switchBackToEmail() {
    if (window.LoginManager) {
        window.LoginManager.switchBackToEmail();
    }
}

function switchToLogin() {
    if (window.LoginManager) {
        window.LoginManager.switchToLogin();
    }
}

// Legacy injectLoginPopup for DOMContentLoaded compatibility
function injectLoginPopup() {
    // Login popup is now injected by LoginManager module
    console.log('Login popup injection handled by LoginManager module');
}

// Profile Wrapper
function toggleProfilePopup() {
    if (window.ProfileManager) {
        window.ProfileManager.togglePopup();
    }
}

// Auth helpers
function checkLoginState() {
    const user = StorageManager.getUser();
    const loginBtns = document.querySelectorAll('button[onclick="toggleLoginPopup()"]');
    const profileBtns = document.querySelectorAll('button[onclick="toggleProfilePopup()"]');

    if (user) {
        // Show profile button, hide login button
        loginBtns.forEach(btn => btn.classList.add('hidden'));
        profileBtns.forEach(btn => {
            btn.classList.remove('hidden');
            const nameSpan = btn.querySelector('.hidden.sm\\:inline');
            if (nameSpan) nameSpan.textContent = user.firstName || 'User';
        });
    } else {
        // Show login button, hide profile button
        loginBtns.forEach(btn => btn.classList.remove('hidden'));
        profileBtns.forEach(btn => btn.classList.add('hidden'));
    }
}

function handleLogout() {
    StorageManager.clearUser();
    checkLoginState();
    const popup = document.getElementById('profile-popup');
    if (popup) popup.classList.add('hidden');
    console.log('Logged out');
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    updateWishlistBadge();
    checkLoginState();
});

