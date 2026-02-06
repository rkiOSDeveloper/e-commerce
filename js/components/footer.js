/**
 * Footer Component Manager
 * Handles footer-specific functionality
 */

class FooterManager {
    constructor() {
        this.copyrightYearElement = null;
    }

    /**
     * Initialize footer functionality
     */
    init() {
        console.log('[FooterManager] Initializing footer...');

        // Update copyright year
        this.updateCopyrightYear();

        console.log('[FooterManager] ✓ Footer initialized');
    }

    /**
     * Update copyright year to current year
     */
    updateCopyrightYear() {
        this.copyrightYearElement = document.getElementById('copyright-year');

        if (this.copyrightYearElement) {
            const currentYear = new Date().getFullYear();
            this.copyrightYearElement.textContent = currentYear;
            console.log(`[FooterManager] Copyright year updated to ${currentYear}`);
        } else {
            console.warn('[FooterManager] Copyright year element not found');
        }
    }
}
