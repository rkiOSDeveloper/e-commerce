/**
 * UI Module  
 * Handles UI interactions: drawers, popups, menus, badges
 */

import { CONFIG } from '../utils/config.js';
import { StorageManager } from '../utils/storage.js';
import { DOMUtils } from '../utils/dom.js';
import { PerformanceUtils } from '../utils/performance.js';

/**
 * Update cart badge with current cart count
 */
export function updateCartBadge() {
    const cart = StorageManager.getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);

    DOMUtils.getAll('.cart-count-badge, #cart-count-badge').forEach((badge) => {
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                DOMUtils.removeClass(badge, CONFIG.CLASSES.HIDDEN);
            } else {
                DOMUtils.addClass(badge, CONFIG.CLASSES.HIDDEN);
            }
        }
    });
}

/**
 * Update wishlist badge with current wishlist count
 */
export function updateWishlistBadge() {
    const wishlist = StorageManager.getWishlist();
    const count = wishlist.length;

    const badges = document.querySelectorAll('a[href="wishlist.html"] span.absolute');
    badges.forEach(badge => {
        if (count > 0) {
            badge.textContent = count;
            DOMUtils.removeClass(badge, CONFIG.CLASSES.HIDDEN);
        } else {
            DOMUtils.addClass(badge, CONFIG.CLASSES.HIDDEN);
        }
    });
}

/**
 * Toggle cart drawer visibility
 */
export function toggleCartDrawer() {
    const drawer = DOMUtils.get(`#${CONFIG.IDS.CART_DRAWER}`);
    if (!drawer) return;

    const isOpen = !DOMUtils.hasClass(drawer, CONFIG.CLASSES.INVISIBLE);

    if (isOpen) {
        // Close drawer
        DOMUtils.addClass(drawer, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
        setTimeout(() => {
            const innerDrawer = drawer.querySelector('.max-w-md');
            if (innerDrawer) DOMUtils.addClass(innerDrawer, CONFIG.CLASSES.TRANSLATE_X_FULL);
        }, 10);
        DOMUtils.removeClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
    } else {
        // Open drawer
        DOMUtils.removeClass(drawer, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
        setTimeout(() => {
            const innerDrawer = drawer.querySelector('.max-w-md');
            if (innerDrawer) DOMUtils.removeClass(innerDrawer, CONFIG.CLASSES.TRANSLATE_X_FULL);
        }, 10);
        DOMUtils.addClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
    }
}

/**
 * Initialize scroll to top button
 */
export function initScrollToTop() {
    const scrollToTopBtn = DOMUtils.get(`#${CONFIG.IDS.SCROLL_TO_TOP}`);
    if (scrollToTopBtn) {
        window.addEventListener("scroll", PerformanceUtils.throttle(() => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove("opacity-0", "invisible", "translate-y-4");
                scrollToTopBtn.classList.add("opacity-100", "visible", "translate-y-0");
            } else {
                scrollToTopBtn.classList.add("opacity-0", "invisible", "translate-y-4");
                scrollToTopBtn.classList.remove("opacity-100", "visible", "translate-y-0");
            }
        }, 100), { passive: true });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

/**
 * Initialize search functionality with debouncing
 */
export function initSearch() {
    // Mobile search
    const mobileSearchInput = DOMUtils.get(`#${CONFIG.IDS.MOBILE_SEARCH_INPUT}`);
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener("input", PerformanceUtils.debounce(function (e) {
            const query = e.target.value.trim();
            if (query.length > 2) {
                console.log("Search query:", query);
                // Implement search logic here
            }
        }, 500));
    }

    // Desktop search
    const desktopSearchInput = DOMUtils.get(`#${CONFIG.IDS.SEARCH_INPUT_FIELD}`);
    const desktopSearchBtn = DOMUtils.get(`#${CONFIG.IDS.SEARCH_BTN_ICON}`);

    if (desktopSearchInput) {
        desktopSearchInput.addEventListener("input", PerformanceUtils.debounce(function () {
            const value = this.value.trim();
            if (desktopSearchBtn) {
                if (value) {
                    DOMUtils.removeClass(desktopSearchBtn, "text-gray-500", "dark:text-gray-400");
                    DOMUtils.addClass(desktopSearchBtn, "text-black", "dark:text-white");
                } else {
                    DOMUtils.addClass(desktopSearchBtn, "text-gray-500", "dark:text-gray-400");
                    DOMUtils.removeClass(desktopSearchBtn, "text-black", "dark:text-white");
                }
            }
        }, 500));
    }
}

/**
 * Set copyright year
 */
export function setCopyrightYear() {
    DOMUtils.setText('#copyright-year', new Date().getFullYear());
}

/**
 * Make functions globally available for onclick handlers
 */
export function exposeGlobalFunctions(functions) {
    Object.entries(functions).forEach(([name, func]) => {
        window[name] = func;
    });
}
