/**
 * DOMUtils: DOM manipulation utilities
 * Centralized methods for common DOM operations
 */

export class DOMUtils {
    /**
     * Get single element by selector
     */
    static get(selector) {
        return document.querySelector(selector);
    }

    /**
     * Get multiple elements by selector
     */
    static getAll(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Show element(s) by removing visibility classes
     */
    static show(selector) {
        if (typeof selector === 'string') {
            const el = this.get(selector);
            if (el) el.classList.remove('hidden', 'invisible', 'opacity-0');
        } else {
            if (selector) selector.classList.remove('hidden', 'invisible', 'opacity-0');
        }
    }

    /**
     * Hide element by adding hidden class
     */
    static hide(selector) {
        if (typeof selector === 'string') {
            const el = this.get(selector);
            if (el) el.classList.add('hidden');
        } else {
            if (selector) selector.classList.add('hidden');
        }
    }

    /**
     * Set text content of element
     */
    static setText(selector, text) {
        const el = typeof selector === 'string' ? this.get(selector) : selector;
        if (el) el.textContent = text;
    }

    /**
     * Add class(es) to element
     */
    static addClass(element, ...classes) {
        if (element) element.classList.add(...classes);
    }

    /**
     * Remove class(es) from element
     */
    static removeClass(element, ...classes) {
        if (element) element.classList.remove(...classes);
    }

    /**
     * Toggle class on element
     */
    static toggleClass(element, className) {
        if (element) element.classList.toggle(className);
    }

    /**
     * Check if element has class
     */
    static hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    }
}
