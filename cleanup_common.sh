#!/bin/bash

# Phase 6: common.js cleanup script
# This script creates a cleaned version of common.js with thin wrappers

echo "Creating cleaned common.js..."

# Create cleaned version - keep utility classes, add thin wrappers
cat > js/common_cleaned.js << 'CLEANED_EOF'
/**
 * Common JavaScript Functionality - Phase 6 Cleaned
 * Shared utilities + thin wrappers that delegate to modules
 */

CLEANED_EOF

# Extract lines 1-461 (CONFIG, StorageManager, DOMUtils, PerformanceUtils, Validator)
head -n 461 js/common.js >> js/common_cleaned.js

# Extract lines 467-674 (DOMContentLoaded listeners for scroll, search, validation)
sed -n '467,674p' js/common.js >> js/common_cleaned.js

# Add thin wrapper functions section
cat >> js/common_cleaned.js << 'WRAPPERS_EOF'

// ============================================
// THIN WRAPPERS FOR ONCLICK HANDLERS
// These delegate to module functionality
// ============================================

// Menu Wrappers
function toggleMobileMenu() {
    if (window.MenuManager) {
        window.MenuManager.toggleMenu();
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
        window.CartManager.toggleDrawer();
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
        window.LoginManager.togglePopup();
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

WRAPPERS_EOF

echo "Cleaned common.js created as js/common_cleaned.js"
echo "Original backed up as js/common.js.backup"
echo ""
echo "To apply the changes, run:"
echo "  mv js/common.js.backup js/common_old.js"
echo "  mv js/common_cleaned.js js/common.js"
