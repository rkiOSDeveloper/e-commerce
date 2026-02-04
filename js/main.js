/**
 * Main Application Entry Point
 * Initializes all modules and sets up the application
 */

import { CONFIG } from './utils/config.js';
import { StorageManager } from './utils/storage.js';
import { DOMUtils } from './utils/dom.js';
import { PerformanceUtils } from './utils/performance.js';
import { Validator } from './utils/validator.js';

// Import application modules
import { AuthManager } from './modules/auth.js';
import { UIManager } from './modules/ui.js';
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
window.AuthManager = AuthManager;
window.UIManager = UIManager;
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

    // Initialize existing modules
    AuthManager.init();
    UIManager.init();

    console.log('✅ Application initialized successfully');
});

// Export for use in other modules
export { CONFIG, StorageManager, DOMUtils, PerformanceUtils, Validator };
