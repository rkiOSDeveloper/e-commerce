/**
 * Common Enhanced - Example of refactored code using new utilities
 * This demonstrates how to integrate the new utility modules
 * 
 * NOTE: This is a demonstration file showing the refactored approach.
 * To use this, you would:
 * 1. Add type="module" to script tags in HTML
 * 2. Gradually migrate functions from common.js to this file
 * 3. Update HTML pages to load this instead of common.js
 */

import { STORAGE_KEYS, SELECTORS, CLASSES, UI_STATES, ERROR_MESSAGES } from './config/constants.js';
import { StorageManager } from './utils/storage.js';
import { DOMUtils } from './utils/dom.js';
import { EventBus, Performance } from './utils/events.js';
import { Validator } from './utils/validators.js';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // Initialize all features
    initCopyright();
    initScrollToTop();
    initSearch();
    initWishlist();
    initLoginState();
    initCartBadge();
    initWishlistBadge();

    // Setup event listeners
    setupEventListeners();

    // Inject dynamic UI components
    injectLoginPopup();
    injectCartDrawer();
    injectProfilePopup();
}

// ============================================
// BASIC FEATURES (Refactored Examples)
// ============================================

/**
 * Initialize copyright year
 * BEFORE: Direct DOM manipulation
 * AFTER: Using DOMUtils
 */
function initCopyright() {
    DOMUtils.setText(SELECTORS.COPYRIGHT_YEAR, new Date().getFullYear());
}

/**
 * Initialize scroll to top button
 * BEFORE: Multiple classList calls, no throttling
 * AFTER: Using DOMUtils and Performance.throttle
 */
function initScrollToTop() {
    const btn = DOMUtils.getElement(SELECTORS.SCROLL_TO_TOP);
    if (!btn) return;

    // Throttled scroll handler for better performance
    const handleScroll = Performance.throttle(() => {
        if (window.scrollY > UI_STATES.SCROLL_THRESHOLD) {
            DOMUtils.show(btn);
        } else {
            DOMUtils.hide(btn);
        }
    }, UI_STATES.THROTTLE_DELAY);

    window.addEventListener('scroll', handleScroll);

    // Click handler
    btn.addEventListener('click', () => DOMUtils.scrollToTop());
}

/**
 * Initialize search functionality
 * BEFORE: Duplicate code for mobile/desktop
 * AFTER: Unified with DOMUtils and debouncing
 */
function initSearch() {
    const mobileInput = DOMUtils.getElement(SELECTORS.MOBILE_SEARCH_INPUT);
    const desktopInput = DOMUtils.getElement(SELECTORS.DESKTOP_SEARCH_INPUT);
    const searchBtn = DOMUtils.getElement(SELECTORS.SEARCH_BTN);

    const handleSearch = (value) => {
        if (value.trim()) {
            window.location.href = `product_list.html?search=${encodeURIComponent(value)}`;
        }
    };

    // Mobile search
    if (mobileInput) {
        mobileInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch(e.target.value);
        });
    }

    // Desktop search
    if (desktopInput) {
        desktopInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch(e.target.value);
        });

        // Highlight icon when typing (debounced)
        const highlightIcon = Performance.debounce(() => {
            if (desktopInput.value.trim()) {
                DOMUtils.removeClass(searchBtn, 'text-gray-500', 'dark:text-gray-400');
                DOMUtils.addClass(searchBtn, 'text-black', 'dark:text-white');
            } else {
                DOMUtils.addClass(searchBtn, 'text-gray-500', 'dark:text-gray-400');
                DOMUtils.removeClass(searchBtn, 'text-black', 'dark:text-white');
            }
        }, 200);

        desktopInput.addEventListener('input', highlightIcon);
    }

    // Search button click
    if (searchBtn && desktopInput) {
        searchBtn.addEventListener('click', () => handleSearch(desktopInput.value));
    }
}

// ============================================
// WISHLIST MANAGEMENT (Refactored)
// ============================================

/**
 * Initialize wishlist UI
 * BEFORE: Inline checks and updates
 * AFTER: Event-driven with EventBus
 */
function initWishlist() {
    checkWishlistUI();

    // Subscribe to wishlist events
    EventBus.on('wishlist:updated', () => {
        checkWishlistUI();
        updateWishlistBadge();
    });
}

/**
 * Toggle wishlist item
 * BEFORE: Direct localStorage access, long function
 * AFTER: Using StorageManager, Validator, and EventBus
 */
function toggleWishlist(product, btn) {
    // Validate product data
    if (!Validator.isValidProduct(product)) {
        console.error('Invalid product data:', product);
        return;
    }

    // Check if user is logged in
    if (!StorageManager.isLoggedIn()) {
        StorageManager.savePendingWishlist(product);
        toggleLoginModal();
        return;
    }

    // Get current wishlist
    const wishlist = StorageManager.getWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);

    // Toggle item
    if (index > -1) {
        wishlist.splice(index, 1);
        updateHeartIcon(btn, false);
    } else {
        wishlist.push(product);
        updateHeartIcon(btn, true);
    }

    // Save and notify
    StorageManager.saveWishlist(wishlist);
    EventBus.emit('wishlist:updated', wishlist);
}

/**
 * Update heart icon state
 * BEFORE: Manual classList manipulation
 * AFTER: Using DOMUtils
 */
function updateHeartIcon(btn, isFilled) {
    if (!btn) return;

    const icon = btn.querySelector('.material-icons');
    if (!icon) return;

    if (isFilled) {
        DOMUtils.setText(icon, 'favorite');
        DOMUtils.addClass(btn, 'text-red-500');
        DOMUtils.removeClass(btn, 'text-black', 'text-gray-400');
    } else {
        DOMUtils.setText(icon, 'favorite_border');
        DOMUtils.removeClass(btn, 'text-red-500');
        DOMUtils.addClass(btn, 'text-black');
    }
}

/**
 * Check and update all wishlist buttons
 * BEFORE: Manual iteration and checks
 * AFTER: Using StorageManager and DOMUtils
 */
function checkWishlistUI() {
    const wishlist = StorageManager.getWishlist();
    const wishlistIds = wishlist.map(item => item.id);
    const wishlistBtns = DOMUtils.getAll(SELECTORS.WISHLIST_BTN);

    wishlistBtns.forEach(btn => {
        const id = btn.dataset.id;
        updateHeartIcon(btn, wishlistIds.includes(id));
    });
}

/**
 * Update wishlist badge
 * BEFORE: Complex selector logic
 * AFTER: Using StorageManager and DOMUtils
 */
function updateWishlistBadge() {
    const wishlist = StorageManager.getWishlist();
    const count = wishlist.length;
    const wishlistLinks = DOMUtils.getAll('a[href="wishlist.html"]');

    wishlistLinks.forEach(link => {
        const badge = link.querySelector('span.absolute');
        if (badge) {
            DOMUtils.setText(badge, count);
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    });
}

// ============================================
// CART MANAGEMENT (Refactored)
// ============================================

/**
 * Initialize cart badge
 * BEFORE: Direct call
 * AFTER: Event-driven
 */
function initCartBadge() {
    updateCartBadge();

    // Subscribe to cart events
    EventBus.on('cart:updated', () => {
        updateCartBadge();
    });
}

/**
 * Add item to cart
 * BEFORE: Direct localStorage, manual badge update
 * AFTER: Using StorageManager and EventBus
 */
function addToCart(product) {
    // Validate product
    if (!Validator.isValidProduct(product)) {
        console.error(ERROR_MESSAGES.INVALID_PRODUCT, product);
        return false;
    }

    // Get current cart
    const cart = StorageManager.getCart();

    // Create unique instance ID
    const instanceId = `${product.id}-${product.size || 'M'}-${product.color || 'Default'}`;

    // Check if item exists
    const existingIndex = cart.findIndex(item => item.instanceId === instanceId);

    if (existingIndex > -1) {
        // Increment quantity
        cart[existingIndex].quantity += 1;
    } else {
        // Add new item
        cart.push({
            ...product,
            instanceId,
            quantity: 1
        });
    }

    // Save and notify
    if (StorageManager.saveCart(cart)) {
        EventBus.emit('cart:updated', cart);
        EventBus.emit('cart:item-added', product);
        toggleCartDrawer();
        return true;
    }

    return false;
}

/**
 * Update cart badge
 * BEFORE: Manual querySelectorAll and updates
 * AFTER: Using StorageManager and DOMUtils
 */
function updateCartBadge() {
    const cart = StorageManager.getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badges = DOMUtils.getAll('.cart-count-badge, #cart-count-badge');

    badges.forEach(badge => {
        DOMUtils.setText(badge, count);
        if (count > 0) {
            DOMUtils.removeClass(badge, CLASSES.HIDDEN);
        } else {
            DOMUtils.addClass(badge, CLASSES.HIDDEN);
        }
    });
}

// ============================================
// LOGIN/AUTH (Refactored)
// ============================================

/**
 * Initialize login state
 * BEFORE: Inline checks
 * AFTER: Event-driven with StorageManager
 */
function initLoginState() {
    checkLoginState();

    // Subscribe to auth events
    EventBus.on('auth:login', checkLoginState);
    EventBus.on('auth:logout', checkLoginState);
}

/**
 * Check and update login state
 * BEFORE: Direct localStorage access
 * AFTER: Using StorageManager and DOMUtils
 */
function checkLoginState() {
    const user = StorageManager.getUser();
    const loginBtn = document.querySelector('button[onclick="toggleLoginPopup()"]');
    const loginIcon = loginBtn?.querySelector('.material-icons');

    if (user && loginIcon) {
        // User is logged in
        DOMUtils.setText(loginIcon, 'person');

        // Update profile popup data
        updateProfileData(user);

        // Update mobile drawer
        DOMUtils.hide('#mobile-drawer-guest');
        DOMUtils.show('#mobile-drawer-user');
        DOMUtils.setText('#mobile-user-name', `${user.firstname} ${user.lastname}`);
    } else {
        // User is not logged in
        if (loginIcon) DOMUtils.setText(loginIcon, 'person_outline');

        // Update mobile drawer
        DOMUtils.show('#mobile-drawer-guest');
        DOMUtils.hide('#mobile-drawer-user');
    }
}

/**
 * Update profile popup data
 */
function updateProfileData(user) {
    if (!Validator.isValidUser(user)) return;

    const initials = `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();

    DOMUtils.setText(SELECTORS.PROFILE_INITIALS, initials);
    DOMUtils.setText(SELECTORS.PROFILE_NAME, `${user.firstname} ${user.lastname}`);
    DOMUtils.setText(SELECTORS.PROFILE_EMAIL, user.email);
}

/**
 * Handle logout
 * BEFORE: Direct localStorage manipulation
 * AFTER: Using StorageManager and EventBus
 */
function handleLogout() {
    StorageManager.clearUser();
    EventBus.emit('auth:logout');

    // Close profile popup
    DOMUtils.hide(SELECTORS.PROFILE_POPUP);

    console.log('Logged out successfully');
}

// ============================================
// EVENT DELEGATION SETUP
// ============================================

/**
 * Setup centralized event listeners using delegation
 * This replaces inline onclick handlers
 */
function setupEventListeners() {
    document.addEventListener('click', (e) => {
        const target = e.target;
        const action = target.closest('[data-action]')?.dataset.action;

        if (!action) return;

        // Handle different actions
        switch (action) {
            case 'toggle-menu':
                toggleMobileMenu();
                break;
            case 'toggle-cart':
                toggleCartDrawer();
                break;
            case 'toggle-login':
                toggleLoginPopup();
                break;
            case 'toggle-wishlist':
                const product = JSON.parse(target.dataset.product || '{}');
                toggleWishlist(product, target);
                break;
            case 'logout':
                handleLogout();
                break;
        }
    });
}

// ============================================
// MODAL/DRAWER FUNCTIONS (Simplified)
// ============================================

function toggleMobileMenu() {
    const menu = DOMUtils.getElement(SELECTORS.MOBILE_MENU);
    const isOpen = !menu.classList.contains(CLASSES.TRANSLATE_X_FULL);

    if (isOpen) {
        DOMUtils.addClass(menu, CLASSES.TRANSLATE_X_FULL);
        DOMUtils.enableScroll();
    } else {
        DOMUtils.removeClass(menu, CLASSES.TRANSLATE_X_FULL);
        DOMUtils.disableScroll();
    }
}

function toggleCartDrawer() {
    const drawer = DOMUtils.getElement(SELECTORS.CART_DRAWER);
    const isOpen = DOMUtils.isVisible(drawer);

    if (isOpen) {
        DOMUtils.hide(drawer);
        DOMUtils.enableScroll();
    } else {
        DOMUtils.show(drawer);
        DOMUtils.disableScroll();
        renderCartDrawer();
    }
}

function toggleLoginModal() {
    const popup = DOMUtils.getElement(SELECTORS.LOGIN_POPUP);
    const isOpen = DOMUtils.isVisible(popup);

    if (isOpen) {
        DOMUtils.hide(popup);
        DOMUtils.enableScroll();
    } else {
        DOMUtils.show(popup);
        DOMUtils.disableScroll();
    }
}

function toggleLoginPopup() {
    if (StorageManager.isLoggedIn()) {
        toggleProfilePopup();
    } else {
        toggleLoginModal();
    }
}

function toggleProfilePopup() {
    DOMUtils.toggle(SELECTORS.PROFILE_POPUP);
}

// ============================================
// PLACEHOLDER FUNCTIONS (To be implemented)
// ============================================

// These would be implemented similar to above
function injectLoginPopup() {
    // Implementation using DOMUtils.createFromHTML()
}

function injectCartDrawer() {
    // Implementation using DOMUtils.createFromHTML()
}

function injectProfilePopup() {
    // Implementation using DOMUtils.createFromHTML()
}

function renderCartDrawer() {
    // Implementation using StorageManager and DOMUtils
}

// ============================================
// EXPORTS (for use in other modules)
// ============================================

// Make functions globally available for backward compatibility
// (until all HTML onclick handlers are migrated)
window.toggleMobileMenu = toggleMobileMenu;
window.toggleCartDrawer = toggleCartDrawer;
window.toggleLoginPopup = toggleLoginPopup;
window.toggleLoginModal = toggleLoginModal;
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.handleLogout = handleLogout;
