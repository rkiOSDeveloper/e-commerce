/**
 * Global Configuration and Constants
 * Centralized place for all magic strings and configuration values
 */

// LocalStorage Keys
export const STORAGE_KEYS = {
    CART: 'clothyfly_cart',
    USER: 'clothyfly_user',
    WISHLIST: 'clothyfly_wishlist',
    PENDING_WISHLIST: 'clothyfly_pending_wishlist'
};

// DOM Selectors
export const SELECTORS = {
    // Header & Navigation
    MOBILE_MENU: '#mobile-menu-drawer',
    MOBILE_MENU_BTN: '#mobile-menu-btn',
    MOBILE_MENU_ICON: '#mobile-menu-icon',

    // Search
    SEARCH_MODAL: '#search-modal',
    MOBILE_SEARCH_INPUT: '#mobile-search-input',
    DESKTOP_SEARCH_INPUT: '#search-input-field',
    SEARCH_BTN: '#search-btn-icon',

    // Cart
    CART_DRAWER: '#cart-drawer',
    CART_ITEMS: '#cart-drawer-items',
    CART_SUBTOTAL: '#cart-drawer-subtotal',
    CART_BOTTOM: '#cart-drawer-bottom',
    CART_BADGE: '#cart-count-badge',

    // Wishlist
    WISHLIST_BTN: '.wishlist-btn',

    // Login/Auth
    LOGIN_POPUP: '#login-popup',
    LOGIN_EMAIL: '#login-email',
    LOGIN_OTP: '#login-otp',
    LOGIN_STEP_EMAIL: '#login-step-email',
    LOGIN_STEP_OTP: '#login-step-otp',
    LOGIN_STEP_CREATE: '#login-step-create-account',

    // Profile
    PROFILE_POPUP: '#profile-popup',
    PROFILE_INITIALS: '#profile-initials',
    PROFILE_NAME: '#profile-name',
    PROFILE_EMAIL: '#profile-email',

    // Other
    SCROLL_TO_TOP: '#scroll-to-top',
    COPYRIGHT_YEAR: '#copyright-year',
    STICKY_CART_BAR: '#sticky-cart-bar'
};

// CSS Classes
export const CLASSES = {
    HIDDEN: 'hidden',
    VISIBLE: 'visible',
    OPACITY_0: 'opacity-0',
    OPACITY_100: 'opacity-100',
    INVISIBLE: 'invisible',
    TRANSLATE_Y_FULL: 'translate-y-full',
    TRANSLATE_X_FULL: '-translate-x-full',
    OVERFLOW_HIDDEN: 'overflow-hidden'
};

// UI States
export const UI_STATES = {
    SCROLL_THRESHOLD: 300, // Pixels to scroll before showing scroll-to-top
    ANIMATION_DELAY: 300, // ms for transitions
    DEBOUNCE_DELAY: 300, // ms for input debouncing
    THROTTLE_DELAY: 100, // ms for scroll throttling
    TOAST_DURATION: 3000 // ms for toast notifications
};

// Validation Patterns
export const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    OTP: /^\d{6}$/,
    PHONE: /^\d{10}$/
};

// API Endpoints (for future PHP integration)
export const API_ENDPOINTS = {
    PRODUCTS: '/api/products.php',
    PRODUCT_DETAIL: '/api/product.php',
    CART: '/api/cart.php',
    WISHLIST: '/api/wishlist.php',
    AUTH_LOGIN: '/api/auth/login.php',
    AUTH_LOGOUT: '/api/auth/logout.php',
    ORDERS: '/api/orders.php',
    PROFILE: '/api/profile.php'
};

// Error Messages
export const ERROR_MESSAGES = {
    INVALID_EMAIL: 'Enter a valid email address',
    INVALID_OTP: 'Enter the correct 6-digit code',
    REQUIRED_FIELD: 'This field is required',
    NETWORK_ERROR: 'Network error. Please try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    LOGIN_REQUIRED: 'Please login to continue',
    INVALID_PRODUCT: 'Invalid product data'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    ADDED_TO_CART: 'Added to cart',
    ADDED_TO_WISHLIST: 'Added to wishlist',
    REMOVED_FROM_WISHLIST: 'Removed from wishlist',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PROFILE_UPDATED: 'Profile updated successfully'
};
