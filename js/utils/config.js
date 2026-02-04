/**
 * Configuration Constants
 * Centralized configuration for IDs, classes, storage keys, and defaults
 */

export const CONFIG = {
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
