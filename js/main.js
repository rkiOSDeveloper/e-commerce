/**
 * Main Application Entry Point
 * Initializes all modules and sets up the application
 */

import { CONFIG } from './utils/config.js';
import { StorageManager } from './utils/storage.js';
import { DOMUtils } from './utils/dom.js';
import { PerformanceUtils } from './utils/performance.js';
import { Validator } from './utils/validator.js';

// Import auth module functions
import * as Auth from './modules/auth.js';

// Import UI module functions  
import * as UI from './modules/ui.js';

// Import application modules (classes)
import { CartManager } from './modules/cart.js';
import { WishlistManager } from './modules/wishlist.js';
import { LoginManager } from './modules/login.js';
import { MenuManager } from './modules/menu.js';
import { ProfileManager } from './modules/profile.js';

// Make utilities globally available
window.CONFIG = CONFIG;
window.StorageManager = StorageManager;
window.DOMUtils = DOMUtils;
window.PerformanceUtils = PerformanceUtils;
window.Validator = Validator;

// Make managers globally available
window.CartManager = CartManager;
window.WishlistManager = WishlistManager;
window.LoginManager = LoginManager;
window.MenuManager = MenuManager;
window.ProfileManager = ProfileManager;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing application modules...');

    // Initialize core modules
    CartManager.init();
    WishlistManager.init();
    LoginManager.init();

    // Initialize UI features
    UI.updateCartBadge();
    UI.updateWishlistBadge();
    UI.setCopyrightYear();
    UI.initScrollToTop();
    UI.initSearch();

    // Initialize authentication
    Auth.initAuth();
    Auth.checkLoginState();

    console.log('✅ Application initialized successfully');
});

// Export for use in other modules
export { CONFIG, StorageManager, DOMUtils, PerformanceUtils, Validator };
