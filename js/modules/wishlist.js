/**
 * Wishlist Module
 * Handles wishlist toggle, badge updates, and UI synchronization
 */

import { CONFIG } from '../utils/config.js';
import { StorageManager } from '../utils/storage.js';
import { DOMUtils } from '../utils/dom.js';

/**
 * Wishlist Manager Class
 */
export class WishlistManager {
    /**
     * Toggle product in wishlist
     */
    static toggle(product, btn) {
        // Check if user is logged in
        const user = StorageManager.getUser();
        if (!user) {
            // Not logged in: Store intent and show login popup
            StorageManager.savePendingWishlist(product);
            if (typeof window.loginManager !== 'undefined') {
                window.loginManager.toggleModal();
            }
            return;
        }

        let wishlist = StorageManager.getWishlist();
        const index = wishlist.findIndex((item) => item.id === product.id);

        if (index > -1) {
            // Remove from wishlist
            wishlist.splice(index, 1);
            this.updateHeartIcon(btn, false);
        } else {
            // Add to wishlist
            wishlist.push(product);
            this.updateHeartIcon(btn, true);
        }

        StorageManager.saveWishlist(wishlist);
        this.updateBadge();
        this.checkUI(); // Update all buttons for same product
    }

    /**
     * Update heart icon appearance
     */
    static updateHeartIcon(btn, isFilled) {
        if (!btn) return;
        const icon = btn.querySelector(".material-icons");
        if (!icon) return;

        if (isFilled) {
            icon.textContent = "favorite";
            btn.classList.add("text-red-500");
            if (!btn.classList.contains("text-white")) {
                btn.classList.remove("text-black");
                btn.classList.remove("text-gray-400");
            }
        } else {
            icon.textContent = "favorite_border";
            btn.classList.remove("text-red-500");
            btn.classList.add("text-black");
        }
    }

    /**
     * Check and update all wishlist button states
     */
    static checkUI() {
        let wishlist = StorageManager.getWishlist();
        const wishlistIds = wishlist.map(item => item.id);
        const wishlistBtns = document.querySelectorAll(".wishlist-btn");

        wishlistBtns.forEach(btn => {
            const id = btn.dataset.id;
            if (wishlistIds.includes(id)) {
                this.updateHeartIcon(btn, true);
            } else {
                this.updateHeartIcon(btn, false);
            }
        });
    }

    /**
     * Update wishlist badge count
     */
    static updateBadge() {
        const wishlist = StorageManager.getWishlist();
        const count = wishlist.length;

        // Update all wishlist badge elements
        DOMUtils.getAll('a[href="wishlist.html"] span.absolute').forEach(badge => {
            if (badge) {
                DOMUtils.setText(badge, count);
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
        });
    }

    /**
     * Initialize wishlist buttons on page load
     */
    static init() {
        // Add event listeners to all wishlist buttons
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
                    this.toggle({ id, name, price, image, originalPrice, offer, tag }, btn);
                }
            });
        });

        // Check and update UI on load
        this.checkUI();
        this.updateBadge();
    }
}

// Make globally accessible
window.wishlistManager = WishlistManager;

// Legacy function exports for backward compatibility
export function toggleWishlist(product, btn) {
    WishlistManager.toggle(product, btn);
}

export function updateHeartIcon(btn, isFilled) {
    WishlistManager.updateHeartIcon(btn, isFilled);
}

export function checkWishlistUI() {
    WishlistManager.checkUI();
}

export function updateWishlistBadge() {
    WishlistManager.updateBadge();
}
