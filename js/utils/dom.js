/**
 * DOM Utilities
 * Helper functions for common DOM manipulation tasks
 */

import { CLASSES } from '../config/constants.js';

export class DOMUtils {
    /**
     * Get element by selector (string or element)
     * @param {string|Element} selector - CSS selector or DOM element
     * @returns {Element|null}
     */
    static getElement(selector) {
        if (typeof selector === 'string') {
            return document.querySelector(selector);
        }
        return selector instanceof Element ? selector : null;
    }

    /**
     * Show element (remove hidden classes, add visible classes)
     * @param {string|Element} selector - CSS selector or DOM element
     */
    static show(selector) {
        const el = this.getElement(selector);
        if (!el) return;

        el.classList.remove(CLASSES.HIDDEN, CLASSES.OPACITY_0, CLASSES.INVISIBLE);
        el.classList.add(CLASSES.VISIBLE, CLASSES.OPACITY_100);
    }

    /**
     * Hide element (add hidden classes, remove visible classes)
     * @param {string|Element} selector - CSS selector or DOM element
     */
    static hide(selector) {
        const el = this.getElement(selector);
        if (!el) return;

        el.classList.add(CLASSES.HIDDEN, CLASSES.OPACITY_0, CLASSES.INVISIBLE);
        el.classList.remove(CLASSES.VISIBLE, CLASSES.OPACITY_100);
    }

    /**
     * Toggle element visibility
     * @param {string|Element} selector - CSS selector or DOM element
     */
    static toggle(selector) {
        const el = this.getElement(selector);
        if (!el) return;

        if (el.classList.contains(CLASSES.HIDDEN)) {
            this.show(el);
        } else {
            this.hide(el);
        }
    }

    /**
     * Check if element is visible
     * @param {string|Element} selector - CSS selector or DOM element
     * @returns {boolean}
     */
    static isVisible(selector) {
        const el = this.getElement(selector);
        if (!el) return false;
        return !el.classList.contains(CLASSES.HIDDEN);
    }

    /**
     * Add class(es) to element
     * @param {string|Element} selector - CSS selector or DOM element
     * @param {...string} classes - Classes to add
     */
    static addClass(selector, ...classes) {
        const el = this.getElement(selector);
        if (!el) return;
        el.classList.add(...classes);
    }

    /**
     * Remove class(es) from element
     * @param {string|Element} selector - CSS selector or DOM element
     * @param {...string} classes - Classes to remove
     */
    static removeClass(selector, ...classes) {
        const el = this.getElement(selector);
        if (!el) return;
        el.classList.remove(...classes);
    }

    /**
     * Toggle class on element
     * @param {string|Element} selector - CSS selector or DOM element
     * @param {string} className - Class to toggle
     */
    static toggleClass(selector, className) {
        const el = this.getElement(selector);
        if (!el) return;
        el.classList.toggle(className);
    }

    /**
     * Set text content
     * @param {string|Element} selector - CSS selector or DOM element
     * @param {string} text - Text to set
     */
    static setText(selector, text) {
        const el = this.getElement(selector);
        if (!el) return;
        el.textContent = text;
    }

    /**
     * Set HTML content
     * @param {string|Element} selector - CSS selector or DOM element
     * @param {string} html - HTML to set
     */
    static setHTML(selector, html) {
        const el = this.getElement(selector);
        if (!el) return;
        el.innerHTML = html;
    }

    /**
     * Clear element content
     * @param {string|Element} selector - CSS selector or DOM element
     */
    static clear(selector) {
        const el = this.getElement(selector);
        if (!el) return;
        el.innerHTML = '';
    }

    /**
     * Get all elements matching selector
     * @param {string} selector - CSS selector
     * @returns {NodeList}
     */
    static getAll(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Add event listener with optional delegation
     * @param {string|Element} selector - CSS selector or DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {string} [delegateSelector] - Optional delegate selector
     */
    static on(selector, event, handler, delegateSelector = null) {
        const el = this.getElement(selector);
        if (!el) return;

        if (delegateSelector) {
            el.addEventListener(event, (e) => {
                if (e.target.matches(delegateSelector)) {
                    handler.call(e.target, e);
                }
            });
        } else {
            el.addEventListener(event, handler);
        }
    }

    /**
     * Disable body scroll (for modals)
     */
    static disableScroll() {
        document.body.classList.add(CLASSES.OVERFLOW_HIDDEN);
    }

    /**
     * Enable body scroll
     */
    static enableScroll() {
        document.body.classList.remove(CLASSES.OVERFLOW_HIDDEN);
    }

    /**
     * Create element from HTML string
     * @param {string} html - HTML string
     * @returns {Element}
     */
    static createFromHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstElementChild;
    }

    /**
     * Smooth scroll to element
     * @param {string|Element} selector - CSS selector or DOM element
     */
    static scrollTo(selector) {
        const el = this.getElement(selector);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Smooth scroll to top
     */
    static scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
