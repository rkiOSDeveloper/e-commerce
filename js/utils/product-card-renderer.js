/**
 * Product Card Renderer Utility
 * Generates consistent product card HTML from product data
 */
class ProductCardRenderer {
    /**
     * Create a new ProductCardRenderer
     * @param {Object} options - Configuration options
     * @param {boolean} options.showWishlist - Show wishlist button (default: true)
     */
    constructor(options = {}) {
        this.showWishlist = options.showWishlist !== false;
    }

    /**
     * Render a single product card
     * @param {Object} product - Product data
     * @param {string} product.id - Product ID
     * @param {string} product.name - Product name
     * @param {number} product.price - Current price
     * @param {number} product.originalPrice - Original price (optional)
     * @param {string} product.image - Image URL
     * @param {string} product.tag - Tag label (Hot/New/Sale) (optional)
     * @param {string} product.offer - Offer text (e.g., "55% OFF") (optional)
     * @param {boolean} product.isWishlisted - Whether product is in wishlist (optional)
     * @returns {string} HTML string for the product card
     */
    render(product) {
        const {
            id,
            name,
            price,
            originalPrice,
            images,
            tags,
            discount,
            isWishlisted = false
        } = product;

        // Get primary image (first image from array or fallback to image property)
        const image = Array.isArray(images) ? images[0] : (product.image || '');

        // Get primary tag (first tag from tags array or tag property)
        const tag = Array.isArray(tags) && tags.length > 0 ? tags[0] : product.tag;

        // Calculate discount text
        let discountText = '';
        if (discount && discount > 0) {
            discountText = `${discount}% OFF`;
        } else if (originalPrice && originalPrice > price) {
            const calculatedDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
            discountText = `${calculatedDiscount}% OFF`;
        }

        // Format prices
        const priceValue = typeof price === 'number' ? price : 0;
        const formattedPrice = `Rs. ${priceValue.toLocaleString('en-IN')}`;
        const formattedOriginalPrice = (originalPrice && typeof originalPrice === 'number') ? `Rs. ${originalPrice.toLocaleString('en-IN')}` : '';

        // Tag rendering
        const tagHTML = tag ? `
            <span class="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm z-10">
                ${tag}
            </span>
        ` : '';

        // Wishlist button icon (filled if wishlisted, outline if not)
        const wishlistIcon = isWishlisted ? 'favorite' : 'favorite_border';

        // Wishlist button rendering
        const wishlistHTML = this.showWishlist ? `
            <button 
                data-id="${id}" 
                data-name="${name}" 
                data-price="${price}"
                ${originalPrice ? `data-original-price="${originalPrice}"` : ''}
                ${discountText ? `data-offer="${discountText}"` : ''}
                ${tag ? `data-tag="${tag}"` : ''}
                data-image="${image}"
                class="wishlist-btn absolute top-2 right-2 z-10 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all duration-300 opacity-100 xl:opacity-0 xl:group-hover:opacity-100">
                <span class="material-icons text-lg">${wishlistIcon}</span>
            </button>
        ` : '';

        // Original price and discount rendering
        const pricingDetailsHTML = originalPrice ? `
            <span class="text-gray-400 line-through text-xs">${formattedOriginalPrice}</span>
            ${discountText ? `<span class="text-green-600 text-xs font-bold">${discountText}</span>` : ''}
        ` : '';

        return `
            <div class="group">
                <div class="relative bg-card-light dark:bg-card-dark rounded-lg overflow-hidden mb-4">
                    ${tagHTML}
                    <a href="product_detail.html?id=${id}" class="block">
                        <img 
                            alt="${name}" 
                            class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                            src="${image}" 
                            loading="lazy"
                        />
                    </a>
                    ${wishlistHTML}
                </div>
                <a href="product_detail.html?id=${id}" class="block group-hover:opacity-80 transition-opacity">
                    <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-1">
                        ${name}
                    </h3>
                    <div class="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm">
                        <span class="font-bold text-gray-900 dark:text-white">${formattedPrice}</span>
                        ${pricingDetailsHTML}
                    </div>
                </a>
            </div>
        `;
    }

    /**
     * Render multiple product cards
     * @param {Array} products - Array of product data objects
     * @returns {string} HTML string for all product cards
     */
    renderMultiple(products) {
        return products.map(product => this.render(product)).join('');
    }

    /**
     * Render products with wishlist state
     * Checks if each product is in the wishlist and sets isWishlisted accordingly
     * @param {Array} products - Array of product data objects
     * @returns {string} HTML string for all product cards with wishlist state
     */
    renderWithWishlistState(products) {
        // Get wishlist from service (fallback to StorageManager if service not available)
        let wishlistIds;

        if (typeof wishlistService !== 'undefined') {
            const wishlist = wishlistService.getWishlist();
            wishlistIds = new Set(wishlist.map(item => item.id));
        } else {
            // Fallback to StorageManager
            const wishlist = StorageManager.getWishlist();
            wishlistIds = new Set(wishlist.map(item => item.id));
        }

        // Map products with wishlist state
        const productsWithState = products.map(product => ({
            ...product,
            isWishlisted: wishlistIds.has(product.id)
        }));

        return this.renderMultiple(productsWithState);
    }
}
