/**
 * Menu Module
 * Handles mobile menu, submenus, and search modal
 */

import { CONFIG } from '../utils/config.js';
import { DOMUtils } from '../utils/dom.js';

/**
 * Menu Manager Class
 */
export class MenuManager {
    /**
     * Toggle mobile menu drawer
     */
    static toggleMobileMenu() {
        const menu = DOMUtils.get("#mobile-menu-drawer");
        const btn = DOMUtils.get("#mobile-menu-btn");
        const icon = DOMUtils.get("#mobile-menu-icon");
        const stickyCartBar = DOMUtils.get("#sticky-cart-bar");

        const isOpen = menu && !DOMUtils.hasClass(menu, "-translate-x-full");

        if (isOpen) {
            // Close Menu
            if (menu) DOMUtils.addClass(menu, "-translate-x-full");
            DOMUtils.removeClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);

            // Show Sticky Cart (Product Detail Page specific)
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

    /**
     * Toggle mobile submenu
     */
    static toggleMobileSubmenu(submenuId, chevronId) {
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

    /**
     * Toggle search modal
     */
    static toggleSearchModal() {
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
}

// Make globally accessible for onclick handlers
window.menuManager = MenuManager;

// Legacy function exports for backward compatibility
export function toggleMobileMenu() {
    MenuManager.toggleMobileMenu();
}

export function toggleMobileSubmenu(submenuId, chevronId) {
    MenuManager.toggleMobileSubmenu(submenuId, chevronId);
}

export function toggleSearchModal() {
    MenuManager.toggleSearchModal();
}
