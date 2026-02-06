/**
 * MobileMenuManager
 * Manages mobile menu drawer functionality including:
 * - Opening/closing the drawer
 * - Expandable/collapsible sub menus
 * - User authentication state (guest vs logged-in)
 */
class MobileMenuManager {
    constructor() {
        this.menuDrawer = null;
        this.menuButton = null;
        this.menuIcon = null;
        this.stickyCartBar = null;
        this.guestSection = null;
        this.userSection = null;
        this.userNameElement = null;
        this.categories = null;
    }

    /**
     * Initialize mobile menu functionality
     */
    async init() {
        console.log('[MobileMenuManager] Initializing mobile menu...');

        // Get DOM elements
        this.menuDrawer = document.getElementById('mobile-menu-drawer');
        this.menuButton = document.getElementById('mobile-menu-btn');
        this.menuIcon = document.getElementById('mobile-menu-icon');
        this.stickyCartBar = document.getElementById('sticky-cart-bar');
        this.guestSection = document.getElementById('mobile-drawer-guest');
        this.userSection = document.getElementById('mobile-drawer-user');
        this.userNameElement = document.getElementById('mobile-user-name');

        // Load categories and render
        await this.loadCategories();
        this.renderCategories();

        // Update user section based on auth state
        this.updateUserSection();

        // Expose functions globally for onclick handlers
        window.toggleMobileMenu = this.toggleMenu.bind(this);
        window.toggleMobileSubmenu = this.toggleSubmenu.bind(this);

        console.log('[MobileMenuManager] ✓ Mobile menu initialized');
    }

    /**
     * Toggle mobile menu open/close
     */
    toggleMenu() {
        const isOpen = this.menuDrawer && !this.menuDrawer.classList.contains('-translate-x-full');

        if (isOpen) {
            // Close Menu
            if (this.menuDrawer) this.menuDrawer.classList.add('-translate-x-full');
            document.body.classList.remove('overflow-hidden');

            // Show sticky cart bar (if exists on product detail page)
            if (this.stickyCartBar) this.stickyCartBar.classList.remove('hidden');

            // Animate icon to menu
            if (this.menuButton) this.menuButton.classList.remove('rotate-90');
            if (this.menuIcon) this.menuIcon.textContent = 'menu';

            console.log('[MobileMenuManager] Menu closed');
        } else {
            // Open Menu
            if (this.menuDrawer) this.menuDrawer.classList.remove('-translate-x-full');
            document.body.classList.add('overflow-hidden');

            // Hide sticky cart bar
            if (this.stickyCartBar) this.stickyCartBar.classList.add('hidden');

            // Animate icon to close
            if (this.menuButton) this.menuButton.classList.add('rotate-90');
            if (this.menuIcon) this.menuIcon.textContent = 'close';

            console.log('[MobileMenuManager] Menu opened');
        }
    }

    /**
     * Toggle submenu expand/collapse
     * @param {string} submenuId - ID of the submenu to toggle
     * @param {string} chevronId - ID of the chevron icon
     */
    toggleSubmenu(submenuId, chevronId) {
        const submenu = document.getElementById(submenuId);
        const chevron = document.getElementById(chevronId);

        if (!submenu) {
            console.warn(`[MobileMenuManager] Submenu not found: ${submenuId}`);
            return;
        }

        if (submenu.classList.contains('hidden')) {
            // Expand submenu
            submenu.classList.remove('hidden');

            // Update chevron icon
            if (chevron) {
                if (chevronId.includes('products') || chevronId.includes('user')) {
                    // Use rotate for main products and user menus
                    chevron.style.transform = 'rotate(180deg)';
                } else {
                    // Use minus icon for subcategories
                    chevron.innerText = 'remove';
                }
            }

            console.log(`[MobileMenuManager] Expanded: ${submenuId}`);
        } else {
            // Collapse submenu
            submenu.classList.add('hidden');

            // Update chevron icon
            if (chevron) {
                if (chevronId.includes('products') || chevronId.includes('user')) {
                    // Reset rotation
                    chevron.style.transform = 'rotate(0deg)';
                } else {
                    // Use plus icon for subcategories
                    chevron.innerText = 'add';
                }
            }

            console.log(`[MobileMenuManager] Collapsed: ${submenuId}`);
        }
    }

    /**
     * Update user section based on authentication state
     * Shows guest view or user view with user's name
     */
    updateUserSection() {
        // Check if authService exists and user is authenticated
        if (typeof authService !== 'undefined' && authService.isLoggedIn()) {
            const user = authService.getCurrentUser();

            // Show user section, hide guest section
            if (this.guestSection) this.guestSection.classList.add('hidden');
            if (this.userSection) this.userSection.classList.remove('hidden');

            // Update user name
            if (this.userNameElement && user) {
                this.userNameElement.textContent = user.name || user.email || 'User';
            }

            console.log('[MobileMenuManager] User view displayed');
        } else {
            // Show guest section, hide user section
            if (this.guestSection) this.guestSection.classList.remove('hidden');
            if (this.userSection) this.userSection.classList.add('hidden');

            console.log('[MobileMenuManager] Guest view displayed');
        }
    }

    /**
     * Refresh user section (call this after login/logout)
     */
    refresh() {
        console.log('[MobileMenuManager] Refreshing user section...');
        this.updateUserSection();
    }

    /**
     * Load categories from categories.json
     */
    async loadCategories() {
        try {
            const response = await fetch('data/categories.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            this.categories = data.categories;
            console.log('[MobileMenuManager] Categories loaded:', this.categories.length);
        } catch (error) {
            console.error('[MobileMenuManager] Failed to load categories:', error);
            throw error;
        }
    }

    /**
     * Render categories into the mobile menu
     */
    renderCategories() {
        const productsSubmenu = document.getElementById('products-submenu');
        if (!productsSubmenu) {
            console.warn('[MobileMenuManager] Products submenu container not found');
            return;
        }

        let html = '';

        // Render each main category (Men, Women)
        this.categories.forEach(category => {
            html += this.generateCategoryHTML(category);
        });

        productsSubmenu.innerHTML = html;
        console.log('[MobileMenuManager] Categories rendered');
    }

    /**
     * Generate HTML for a main category (Men or Women)
     */
    generateCategoryHTML(category) {
        let html = `
            <div>
                <button onclick="toggleMobileSubmenu('${category.id}-submenu', '${category.id}-chevron')"
                        class="w-full flex items-center justify-between group cursor-pointer focus:outline-none">
                    <span class="block text-base font-bold text-gray-800">${category.name}</span>
                    <span id="${category.id}-chevron"
                          class="material-icons text-gray-500 text-sm transition-transform duration-300">add</span>
                </button>
                <div id="${category.id}-submenu" class="hidden mt-3 pl-4 space-y-3">
        `;

        // Render subcategories
        category.subcategories.forEach(subcategory => {
            html += this.generateSubcategoryHTML(category, subcategory);
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Generate HTML for a subcategory
     */
    generateSubcategoryHTML(category, subcategory) {
        const subcatId = `${category.id}-${subcategory.id}`;

        let html = `
            <div>
                <button onclick="toggleMobileSubmenu('${subcatId}-submenu', '${subcatId}-chevron')"
                        class="w-full flex items-center justify-between group cursor-pointer focus:outline-none">
                    <span class="block text-sm text-gray-600 hover:text-black">${subcategory.name}</span>
                    <span id="${subcatId}-chevron"
                          class="material-icons text-gray-500 text-sm transition-transform duration-300">add</span>
                </button>
                <div id="${subcatId}-submenu" class="hidden mt-2 pl-4 space-y-2">
        `;

        // Render items
        subcategory.items.forEach(item => {
            const itemSlug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            html += `
                    <a href="product_list.html?category=${category.slug}&subcategory=${subcategory.id}&item=${itemSlug}"
                       class="block text-sm text-gray-500 hover:text-black">${item}</a>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }
}
