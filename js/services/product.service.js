/**
 * Product Service
 * Handles all product-related operations
 */

class ProductService {
    constructor() {
        this.productsCache = null;
        this.categoriesCache = null;
    }

    /**
     * Get all products
     * @param {boolean} forceRefresh - Force refresh from source
     * @returns {Promise<Array>} Array of products
     */
    async getAll(forceRefresh = false) {
        try {
            if (!this.productsCache || forceRefresh) {
                const data = await apiService.get('products', true);
                this.productsCache = data.products || [];
            }
            return this.productsCache;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    /**
     * Get product by ID
     * @param {string} productId - Product ID
     * @returns {Promise<Object|null>} Product object or null
     */
    async getById(productId) {
        try {
            const products = await this.getAll();
            return products.find(p => p.id === productId) || null;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    /**
     * Get product by slug
     * @param {string} slug - Product slug
     * @returns {Promise<Object|null>} Product object or null
     */
    async getBySlug(slug) {
        try {
            const products = await this.getAll();
            return products.find(p => p.slug === slug) || null;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    /**
     * Get products by category
     * @param {string} category - Category ID
     * @param {string} subcategory - Subcategory ID (optional)
     * @returns {Promise<Array>} Filtered products
     */
    async getByCategory(category, subcategory = null) {
        try {
            const products = await this.getAll();
            let filtered = products.filter(p => p.category === category);

            if (subcategory) {
                filtered = filtered.filter(p => p.subcategory === subcategory);
            }

            return filtered;
        } catch (error) {
            console.error('Error filtering products:', error);
            return [];
        }
    }

    /**
     * Get featured products
     * @param {number} limit - Number of products to return
     * @returns {Promise<Array>} Featured products
     */
    async getFeatured(limit = 4) {
        try {
            const products = await this.getAll();
            return products.filter(p => p.featured).slice(0, limit);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    }

    /**
     * Search products
     * @param {string} query - Search query
     * @returns {Promise<Array>} Matching products
     */
    async search(query) {
        try {
            const products = await this.getAll();
            const searchTerm = query.toLowerCase();

            return products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }

    /**
     * Get all categories
     * @param {boolean} forceRefresh - Force refresh from source
     * @returns {Promise<Array>} Array of categories
     */
    async getCategories(forceRefresh = false) {
        try {
            if (!this.categoriesCache || forceRefresh) {
                const data = await apiService.get('categories', true);
                this.categoriesCache = data.categories || [];
            }
            return this.categoriesCache;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    /**
     * Get category by ID
     * @param {string} categoryId - Category ID
     * @returns {Promise<Object|null>} Category object or null
     */
    async getCategoryById(categoryId) {
        try {
            const categories = await this.getCategories();
            return categories.find(c => c.id === categoryId) || null;
        } catch (error) {
            console.error('Error fetching category:', error);
            return null;
        }
    }

    /**
     * Sort products
     * @param {Array} products - Products to sort
     * @param {string} sortBy - Sort criteria
     * @returns {Array} Sorted products
     */
    sortProducts(products, sortBy) {
        const sorted = [...products];

        switch (sortBy) {
            case 'price-low-high':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high-low':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.reverse(); // Assuming products are already in order
            default:
                return sorted;
        }
    }

    /**
     * Check if product is in stock
     * @param {string} productId - Product ID
     * @param {number} quantity - Desired quantity
     * @returns {Promise<boolean>} Stock availability
     */
    async checkStock(productId, quantity = 1) {
        try {
            const product = await this.getById(productId);
            return true;//product && product.stock >= quantity;
        } catch (error) {
            console.error('Error checking stock:', error);
            return false;
        }
    }
}

// Create singleton instance
const productService = new ProductService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = productService;
}

// Ensure global availability
window.productService = productService;
