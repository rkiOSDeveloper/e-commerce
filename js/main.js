/**
 * Main Application Entry Point
 * Initializes all modules and sets up the application
 */

import { CONFIG } from './utils/config.js';
import { StorageManager } from './utils/storage.js';
import { DOMUtils } from './utils/dom.js';
import { PerformanceUtils } from './utils/performance.js';
import { Validator } from './utils/validator.js';
import * as Auth from './modules/auth.js';
import * as UI from './modules/ui.js';

// Make utilities globally available for debugging
window.CONFIG = CONFIG;
window.StorageManager = StorageManager;
window.DOMUtils = DOMUtils;
window.PerformanceUtils = PerformanceUtils;
window.Validator = Validator;

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application initializing...');

    // Initialize UI components
    UI.updateCartBadge();
    UI.updateWishlistBadge();
    UI.setCopyrightYear();
    UI.initScrollToTop();
    UI.initSearch();

    // Initialize authentication
    Auth.initAuth();
    Auth.checkLoginState();

    // Note: Common.js still handles:
    // - Cart drawer injection and rendering
    // - Login popup injection and handlers
    // - Mobile menu logic
    // - Wishlist button logic
    // These will remain in common.js as they're tightly coupled with existing HTML

    console.log('✅ Application initialized successfully');
});

// Export for use in other modules
export { CONFIG, StorageManager, DOMUtils, PerformanceUtils, Validator, Auth, UI };
