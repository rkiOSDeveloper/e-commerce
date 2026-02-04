/**
 * Authentication Module
 * Handles login, OTP verification, and account creation
 */

import { CONFIG } from '../utils/config.js';
import { StorageManager } from '../utils/storage.js';
import { DOMUtils } from '../utils/dom.js';
import { Validator } from '../utils/validator.js';

/**
 * Initialize authentication-related event listeners
 */
export function initAuth() {
    // Real-time validation for email input
    const loginEmailInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL}`);
    if (loginEmailInput) {
        loginEmailInput.addEventListener('input', function () {
            if (this.value.trim().length > 0) {
                Validator.clearError(this);
            }
        });

        loginEmailInput.addEventListener('blur', function () {
            const email = this.value.trim();
            if (email && !Validator.isValidEmail(email)) {
                Validator.showError(this, 'Please enter a valid email address');
            }
        });
    }

    // Real-time validation for OTP input
    const loginOTPInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`);
    if (loginOTPInput) {
        loginOTPInput.addEventListener('input', function () {
            Validator.formatOTP(this);
            Validator.clearError(this);
        });

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
}

/**
 * Check and update login state across the UI
 */
export function checkLoginState() {
    const user = StorageManager.getUser();

    if (user) {
        // Update login button to profile
        const loginIcons = document.querySelectorAll('.login-icon');
        loginIcons.forEach(icon => {
            if (icon) icon.textContent = 'person';
        });

        // Mobile Drawer: Show User View
        const mobileGuest = DOMUtils.get(`#${CONFIG.IDS.MOBILE_DRAWER_GUEST}`);
        const mobileUser = DOMUtils.get(`#${CONFIG.IDS.MOBILE_DRAWER_USER}`);
        if (mobileGuest) DOMUtils.addClass(mobileGuest, CONFIG.CLASSES.HIDDEN);
        if (mobileUser) DOMUtils.removeClass(mobileUser, CONFIG.CLASSES.HIDDEN);
    } else {
        // Show guest view
        const loginIcons = document.querySelectorAll('.login-icon');
        loginIcons.forEach(icon => {
            if (icon) icon.textContent = 'person_outline';
        });

        const mobileGuest = DOMUtils.get(`#${CONFIG.IDS.MOBILE_DRAWER_GUEST}`);
        const mobileUser = DOMUtils.get(`#${CONFIG.IDS.MOBILE_DRAWER_USER}`);
        if (mobileGuest) DOMUtils.removeClass(mobileGuest, CONFIG.CLASSES.HIDDEN);
        if (mobileUser) DOMUtils.addClass(mobileUser, CONFIG.CLASSES.HIDDEN);
    }
}

/**
 * Process pending wishlist items after login
 */
export function processPendingWishlist() {
    const pending = StorageManager.get(CONFIG.STORAGE_KEYS.PENDING_WISHLIST, []);

    if (pending.length > 0) {
        const wishlist = StorageManager.getWishlist();
        pending.forEach(productId => {
            if (!wishlist.includes(productId)) {
                wishlist.push(productId);
            }
        });
        StorageManager.saveWishlist(wishlist);
        StorageManager.remove(CONFIG.STORAGE_KEYS.PENDING_WISHLIST);
    }
}

/**
 * Logout user
 */
export function logout() {
    StorageManager.remove(CONFIG.STORAGE_KEYS.USER);
    checkLoginState();
    window.location.reload();
}
