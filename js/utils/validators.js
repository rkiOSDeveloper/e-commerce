/**
 * Validation Utilities
 * Centralized validation functions for forms and data
 */

import { PATTERNS, ERROR_MESSAGES } from '../config/constants.js';

export class Validator {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    static isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        return PATTERNS.EMAIL.test(email.trim());
    }

    /**
     * Validate OTP code
     * @param {string} otp - OTP to validate
     * @returns {boolean}
     */
    static isValidOTP(otp) {
        if (!otp || typeof otp !== 'string') return false;
        return PATTERNS.OTP.test(otp.trim());
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean}
     */
    static isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') return false;
        return PATTERNS.PHONE.test(phone.trim());
    }

    /**
     * Validate product object has required fields
     * @param {Object} product - Product object to validate
     * @returns {boolean}
     */
    static isValidProduct(product) {
        if (!product || typeof product !== 'object') return false;

        const required = ['id', 'name', 'price', 'image'];
        return required.every(field => {
            const value = product[field];
            return value !== undefined && value !== null && value !== '';
        });
    }

    /**
     * Validate user object has required fields
     * @param {Object} user - User object to validate
     * @returns {boolean}
     */
    static isValidUser(user) {
        if (!user || typeof user !== 'object') return false;

        const required = ['firstname', 'lastname', 'email'];
        return required.every(field => {
            const value = user[field];
            return value !== undefined && value !== null && value !== '';
        });
    }

    /**
     * Validate required field is not empty
     * @param {*} value - Value to check
     * @returns {boolean}
     */
    static isRequired(value) {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        return true;
    }

    /**
     * Validate string length is within range
     * @param {string} value - String to validate
     * @param {number} min - Minimum length
     * @param {number} max - Maximum length
     * @returns {boolean}
     */
    static isLengthValid(value, min, max) {
        if (!value || typeof value !== 'string') return false;
        const length = value.trim().length;
        return length >= min && length <= max;
    }

    /**
     * Validate number is within range
     * @param {number} value - Number to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean}
     */
    static isNumberInRange(value, min, max) {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    /**
     * Get error message for email validation
     * @param {string} email - Email to validate
     * @returns {string|null} Error message or null if valid
     */
    static getEmailError(email) {
        if (!this.isRequired(email)) {
            return ERROR_MESSAGES.REQUIRED_FIELD;
        }
        if (!this.isValidEmail(email)) {
            return ERROR_MESSAGES.INVALID_EMAIL;
        }
        return null;
    }

    /**
     * Get error message for OTP validation
     * @param {string} otp - OTP to validate
     * @returns {string|null} Error message or null if valid
     */
    static getOTPError(otp) {
        if (!this.isRequired(otp)) {
            return ERROR_MESSAGES.REQUIRED_FIELD;
        }
        if (!this.isValidOTP(otp)) {
            return ERROR_MESSAGES.INVALID_OTP;
        }
        return null;
    }

    /**
     * Validate form field and show/hide error
     * @param {HTMLInputElement} input - Input element
     * @param {HTMLElement} errorElement - Error message element
     * @param {Function} validator - Validation function
     * @returns {boolean} Is valid
     */
    static validateField(input, errorElement, validator) {
        const error = validator(input.value);

        if (error) {
            input.classList.add('border-red-600', 'focus:ring-red-600');
            input.classList.remove('focus:ring-black');
            if (errorElement) {
                errorElement.textContent = error;
                errorElement.classList.remove('hidden');
            }
            return false;
        } else {
            input.classList.remove('border-red-600', 'focus:ring-red-600');
            input.classList.add('focus:ring-black');
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
            return true;
        }
    }
}
