/**
 * Component Loader Utility
 * Loads and injects HTML components dynamically
 * Preserves existing functionality and event listeners
 */

class ComponentLoader {
    constructor() {
        this.cache = {};
        this.basePath = '/components/';
        this.loaded = new Set();
    }

    /**
     * Load and inject a component
     * @param {string} componentName - Name of component file (without .html)
     * @param {string} targetSelector - CSS selector for injection target
     * @param {string} method - 'replace' | 'prepend' | 'append' | 'innerHTML'
     * @returns {Promise<boolean>} Success status
     */
    async load(componentName, targetSelector, method = 'replace') {
        try {
            // Get HTML (from cache or fetch)
            const html = await this.getHTML(componentName);

            // Find target element
            const target = document.querySelector(targetSelector);
            if (!target) {
                console.error(`[ComponentLoader] Target not found: ${targetSelector}`);
                return false;
            }

            // Inject based on method
            switch (method) {
                case 'replace':
                    target.outerHTML = html;
                    break;
                case 'innerHTML':
                    target.innerHTML = html;
                    break;
                case 'prepend':
                    target.insertAdjacentHTML('afterbegin', html);
                    break;
                case 'append':
                    target.insertAdjacentHTML('beforeend', html);
                    break;
                default:
                    console.error(`[ComponentLoader] Invalid method: ${method}`);
                    return false;
            }

            // Mark as loaded
            this.loaded.add(componentName);
            console.log(`[ComponentLoader] ✓ Loaded: ${componentName}`);

            return true;
        } catch (error) {
            console.error(`[ComponentLoader] ✗ Failed to load: ${componentName}`, error);
            return false;
        }
    }

    /**
     * Get component HTML (with caching)
     * @param {string} componentName - Component name
     * @returns {Promise<string>} HTML content
     */
    async getHTML(componentName) {
        // Check cache
        if (this.cache[componentName]) {
            console.log(`[ComponentLoader] Using cached: ${componentName}`);
            return this.cache[componentName];
        }

        // Fetch from server
        const url = `${this.basePath}${componentName}.html`;
        console.log(`[ComponentLoader] Fetching: ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        // Cache for future use
        this.cache[componentName] = html;

        return html;
    }

    /**
     * Load multiple components in parallel
     * @param {Array<{name: string, target: string, method?: string}>} components - Component configs
     * @returns {Promise<boolean[]>} Array of success statuses
     */
    async loadMultiple(components) {
        console.log(`[ComponentLoader] Loading ${components.length} components...`);

        const promises = components.map(({ name, target, method }) =>
            this.load(name, target, method || 'replace')
        );

        const results = await Promise.all(promises);

        const successCount = results.filter(r => r).length;
        console.log(`[ComponentLoader] Loaded ${successCount}/${components.length} components`);

        return results;
    }

    /**
     * Check if a component is loaded
     * @param {string} componentName - Component name
     * @returns {boolean} Loaded status
     */
    isLoaded(componentName) {
        return this.loaded.has(componentName);
    }

    /**
     * Clear cache (useful for development)
     */
    clearCache() {
        this.cache = {};
        this.loaded.clear();
        console.log('[ComponentLoader] Cache cleared');
    }

    /**
     * Preload components without injecting
     * @param {string[]} componentNames - Array of component names
     */
    async preload(componentNames) {
        console.log(`[ComponentLoader] Preloading ${componentNames.length} components...`);

        const promises = componentNames.map(name => this.getHTML(name));
        await Promise.all(promises);

        console.log('[ComponentLoader] Preload complete');
    }
}

// Create singleton instance
const componentLoader = new ComponentLoader();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = componentLoader;
}
