/**
 * Validator: Form validation and error handling utilities
 * Provides validation methods and UI feedback for forms
 */

export class Validator {
    /**
     * Email validation using standard regex
     */
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    }

    /**
     * Phone validation (Indian format: 10 digits starting with 6-9)
     */
    static isValidPhone(phone) {
        const cleaned = phone.replace(/\s+/g, '');
        const regex = /^[6-9]\d{9}$/;
        return regex.test(cleaned);
    }

    /**
     * OTP validation (6 digits)
     */
    static isValidOTP(otp) {
        const regex = /^\d{6}$/;
        return regex.test(otp.trim());
    }

    /**
     * Name validation (minimum 2 characters)
     */
    static isValidName(name) {
        return name.trim().length >= 2;
    }

    /**
     * Show error message on input field
     */
    static showError(input, message) {
        if (!input) return;

        // Add error styling
        input.classList.add('border-red-500', 'focus:ring-red-500');
        input.classList.remove('border-gray-300', 'focus:ring-black');

        // Create or update error message
        let errorEl = input.parentElement.querySelector('.validation-error');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.className = 'validation-error text-red-500 text-xs mt-1';
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    /**
     * Clear error message from input field
     */
    static clearError(input) {
        if (!input) return;

        // Remove error styling
        input.classList.remove('border-red-500', 'focus:ring-red-500');
        input.classList.add('border-gray-300', 'focus:ring-black');

        // Remove error message
        const errorEl = input.parentElement.querySelector('.validation-error');
        if (errorEl) errorEl.remove();
    }

    /**
     * Set loading state on button
     */
    static setLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Loading...';
            button.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
            button.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    /**
     * Auto-format phone number (digits only, max 10)
     */
    static formatPhone(input) {
        if (!input) return;
        input.value = input.value.replace(/\D/g, '').slice(0, 10);
    }

    /**
     * Auto-format OTP (digits only, max 6)
     */
    static formatOTP(input) {
        if (!input) return;
        input.value = input.value.replace(/\D/g, '').slice(0, 6);
    }
}
