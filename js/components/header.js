/**
 * HeaderManager
 * Manages header functionality including dynamic mega menus, search, and badges
 */
class HeaderManager {
    constructor() {
        this.categories = null;
    }

    /**
     * Initialize header functionality
     */
    async init() {
        console.log('[HeaderManager] Initializing...');

        try {
            await this.loadCategories();
            this.renderMegaMenus();
            this.setupSearch();
            this.updateBadges();
            this.setupActiveNav();

            console.log('[HeaderManager] ✓ Initialized successfully');
        } catch (error) {
            console.error('[HeaderManager] ✗ Initialization failed:', error);
        }
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
            console.log('[HeaderManager] Categories loaded:', this.categories.length);
        } catch (error) {
            console.error('[HeaderManager] Failed to load categories:', error);
            throw error;
        }
    }

    /**
     * Render mega menus dynamically from categories data
     */
    renderMegaMenus() {
        // Render Men's mega menu
        const menCategory = this.categories.find(cat => cat.id === 'men');
        if (menCategory) {
            const menMenuEl = document.getElementById('men-mega-menu');
            if (menMenuEl) {
                menMenuEl.innerHTML = this.generateMegaMenuHTML(menCategory);
                console.log('[HeaderManager] Men\'s mega menu rendered');
            }
        }

        // Render Women's mega menu
        const womenCategory = this.categories.find(cat => cat.id === 'women');
        if (womenCategory) {
            const womenMenuEl = document.getElementById('women-mega-menu');
            if (womenMenuEl) {
                womenMenuEl.innerHTML = this.generateMegaMenuHTML(womenCategory);
                console.log('[HeaderManager] Women\'s mega menu rendered');
            }
        }
    }

    /**
     * Generate mega menu HTML from category data
     */
    generateMegaMenuHTML(category) {
        const subcategories = category.subcategories || [];
        const columns = this.splitIntoColumns(subcategories, 5);

        let html = '';
        columns.forEach(column => {
            html += '<div>';
            column.forEach(subcategory => {
                // Category header
                html += `
          <h4 class="font-bold text-red-500 uppercase text-xs mb-4">
            <a href="product_list.html?category=${category.slug}&subcategory=${subcategory.id}" 
               class="hover:text-black dark:hover:text-white transition-colors">
              ${subcategory.name}
            </a>
          </h4>
        `;

                // Category items
                if (subcategory.items && subcategory.items.length > 0) {
                    html += '<ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">';
                    subcategory.items.forEach(item => {
                        const itemSlug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        html += `
              <li>
                <a href="product_list.html?category=${category.slug}&subcategory=${subcategory.id}&item=${itemSlug}" 
                   class="hover:text-black dark:hover:text-white hover:font-bold">
                  ${item}
                </a>
              </li>
            `;
                    });
                    html += '</ul>';
                }

                // Add spacing between subcategories
                html += '<div class="mt-6"></div>';
            });
            html += '</div>';
        });

        return html;
    }

    /**
     * Split subcategories into columns for grid layout
     */
    splitIntoColumns(subcategories, numColumns) {
        const columns = Array.from({ length: numColumns }, () => []);
        subcategories.forEach((subcategory, index) => {
            const columnIndex = index % numColumns;
            columns[columnIndex].push(subcategory);
        });
        return columns;
    }

    /**
     * Setup search functionality
     */
    setupSearch() {
        // Desktop search
        const searchInput = document.getElementById('search-input-field');
        const searchButton = document.getElementById('search-btn-icon');

        if (searchInput) {
            // Handle Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }

        if (searchButton) {
            // Handle search button click
            searchButton.addEventListener('click', () => {
                if (searchInput) {
                    this.performSearch(searchInput.value);
                }
            });
        }

        // Mobile search (from modal if it exists)
        const mobileSearchInput = document.getElementById('modal-search-input');
        const mobileSearchButton = document.getElementById('modal-search-btn');

        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(mobileSearchInput.value);
                }
            });
        }

        if (mobileSearchButton) {
            mobileSearchButton.addEventListener('click', () => {
                if (mobileSearchInput) {
                    this.performSearch(mobileSearchInput.value);
                }
            });
        }

        console.log('[HeaderManager] Search functionality initialized');
    }

    /**
     * Perform search navigation
     */
    performSearch(query) {
        const trimmedQuery = query?.trim();
        if (trimmedQuery) {
            const searchUrl = `product_list.html?search=${encodeURIComponent(trimmedQuery)}`;
            console.log('[HeaderManager] Searching for:', trimmedQuery);
            window.location.href = searchUrl;
        }
    }

    /**
     * Update cart and wishlist badges
     */
    updateBadges() {
        // Update cart badge
        if (typeof cartService !== 'undefined') {
            const cartItems = cartService.getCart();
            const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            this.updateBadge('cart-count-badge', cartCount);
        }

        // Update wishlist badge
        if (typeof wishlistService !== 'undefined') {
            const wishlistItems = wishlistService.getWishlist();
            const wishlistCount = wishlistItems.length;
            this.updateBadge('wishlist-count-badge', wishlistCount);
        }

        console.log('[HeaderManager] Badges updated');
    }

    /**
     * Update a single badge
     */
    updateBadge(badgeId, count) {
        const badge = document.getElementById(badgeId);
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.textContent = '0';
                badge.classList.add('hidden');
            }
        }
    }

    /**
     * Setup active navigation highlighting
     */
    setupActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('text-gray-900', 'dark:text-white');
                link.classList.remove('text-gray-500', 'dark:text-gray-400');
            }
        });

        console.log('[HeaderManager] Active navigation highlighted');
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderManager;
}

// Make available globally
window.HeaderManager = HeaderManager;
